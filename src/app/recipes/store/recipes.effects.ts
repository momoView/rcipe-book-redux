import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, withLatestFrom, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
import * as slActions from '../../shopping-list/store/shopping-list.actions';
import { Recipe } from '../recipe.model';
import * as recipesActions from './recipes.actions';
import * as fromRecipes from './recipes.reducers';

@Injectable()
export class RecipesEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<fromRecipes.FeatureState>
  ) {}

  @Effect()
  addToSL$ = this.actions$.pipe(ofType(recipesActions.DO_ADD_SHOPPING_LIST), withLatestFrom(
    this.store.select('recipes')
  ), map(
    ([action, recipesState]: [recipesActions.DoAddShoppingList,
      fromRecipes.State]) => {
      const recipes = recipesState.recipes;
      const ingredients = action && action.payload
        ? recipes[action.payload].ingredients : [] as Ingredient[];
      return new slActions.AddIngredients(ingredients);
    }
  ));

  @Effect({ dispatch: false })
  storeRecipes$ = this.actions$.pipe(ofType(recipesActions.DO_STORE_RECIPES), withLatestFrom(
    this.store.select('recipes')
  ), switchMap(
    ([action, recipesState]) => {
      return this.httpClient.put('https://recipe-book-redux.firebaseio.com/recipes.json',
        recipesState.recipes);
    }
  ));

  @Effect()
  getRecipes$ = this.actions$.pipe(ofType(recipesActions.DO_GET_RECIPES), switchMap(
    () => {
      return this.httpClient.get<Recipe[]>('https://recipe-book-redux.firebaseio.com/recipes.json');
    }
  ), map(
    (recipes) => {
      const recipesV = recipes;

      for (const recipe of recipesV) {
        if (recipe && !recipe.ingredients) {
          recipe.ingredients = null;
        }
      }

      return recipesV;
    }
  ), map(
    (recipes) => {
      return new recipesActions.SetRecipes(recipes);
    }
  ));
}
