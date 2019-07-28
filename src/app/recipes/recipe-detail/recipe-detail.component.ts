import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators'

import { Recipe } from '../recipe.model';
import * as fromRecipes from '../store/recipes.reducers';
import * as recipesActions from '../store/recipes.actions';
import * as slActions from '../../shopping-list/store/shopping-list.actions'

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipesState$: Observable<{recipes: Recipe[]}>;
  id: number;

  constructor(private router: Router, private route: ActivatedRoute,
    private store: Store<fromRecipes.FeatureState>) { }

  ngOnInit() {
    this.recipesState$ = this.store.select('recipes');
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
      }
    );
  }

  onAddToShoppingList(){
    this.recipesState$.pipe(take(1)).subscribe((recipeState) => {
      const recipes = recipeState.recipes
      const ingredients = recipes[this.id].ingredients

      this.store.dispatch(new slActions.AddIngredients(ingredients));
    })
  }

  onEditRecipe() {
    this.router.navigate(['edit'],
      { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(new recipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
