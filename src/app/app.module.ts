import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
// import { AppRoutingModule } from './app-routing.module';
import { SaperComponent } from './components/saper/saper.component';
import { SnakeComponent } from './components/snake/snake.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    SaperComponent,
    SnakeComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
