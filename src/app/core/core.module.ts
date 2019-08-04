import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http'

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AuthInterceptor } from '../shared/auth.interceptor'
import { LoggingInterceptor } from '../shared/logging.interceptor'

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent
  ],
  imports: [
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor, multi: true }
  ],
  exports: [
    HeaderComponent,
    AppRoutingModule
  ]
})
export class CoreModule {}
