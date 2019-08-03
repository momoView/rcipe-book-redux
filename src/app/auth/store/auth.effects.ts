import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, mergeMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { from } from 'rxjs';

import * as authActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions,
    private router: Router) {}

  @Effect()
  signup$ = this.actions$.pipe(ofType(authActions.DO_SIGNUP), map(
    (authAction: authActions.DoSignup) => {
      return authAction.payload;
    }
  ),switchMap(
    (actionData: { email: string, password: string }) => {
      return from(firebase.auth().createUserWithEmailAndPassword(
        actionData.email,
        actionData.password
      ));
    }
  ),switchMap(
    () => {
      return from(firebase.auth().currentUser.getIdToken());
    }
  ),mergeMap(
    (token:string) => {
      return[
        new authActions.Signup(),
        new authActions.SetToken(token)
      ];
    }
  ),tap(
    () => {
      this.router.navigate(['/']);
    }
  ));

  @Effect()
  signin$ = this.actions$.pipe(ofType(authActions.DO_SIGNIN), map(
    (authAction: authActions.DoSignin) => {
      return authAction.payload;
    }
  ),switchMap(
    (actionData: { email: string, password: string }) => {
      return from(firebase.auth().signInWithEmailAndPassword(
        actionData.email,
        actionData.password
      ));
    }
  ),switchMap(
    () => {
      return from(firebase.auth().currentUser.getIdToken());
    }
  ),mergeMap(
    (token: string) => {
      return[
        new authActions.Signin(),
        new authActions.SetToken(token)
      ];
    }
  ),tap(
    () => {
      this.router.navigate(['/']);
    }
  ));

  @Effect()
  logout$ = this.actions$.pipe(ofType(authActions.DO_LOGOUT), switchMap(
    () => {
      return from(firebase.auth().signOut());
    }
  ),map(
    () => {
      return new authActions.Logout();
    }
  ),tap(
    () => {
      this.router.navigate(['/signin']);
    }
  ));
}
