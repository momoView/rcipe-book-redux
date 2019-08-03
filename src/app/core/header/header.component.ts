import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import * as fromRecipes from '../../recipes/store/recipes.reducers';
import * as fromAuth from '../../auth/store/auth.reducers';
import * as authActions from '../../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  authState$: Observable<fromAuth.State>;

  constructor(private store: Store<fromRecipes.FeatureState>,
    private router: Router) { }

  ngOnInit() {
    this.authState$ = this.store.select('auth');
  }

  onLogout() {
    this.store.dispatch(new authActions.Logout());
    this.router.navigate(['/'])
  }
}
