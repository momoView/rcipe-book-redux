import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyDGUgTT55_uNum8whfjfeeJyovp8zN_ltU",
      authDomain: "recipe-book-redux.firebaseapp.com",
    });
  }
}
