import { ActionReducerMap } from '@ngrx/store';

import * as fromSL from '../shopping-list/store/shopping-list.reducers';

export interface AppState {
  shoppingList: fromSL.State
}

export const reducers: ActionReducerMap<AppState> = {
  shoppingList: fromSL.shoppingListReducer
};
