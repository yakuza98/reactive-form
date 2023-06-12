import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from "./app.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from "./material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {ApiService} from "./core/services/api.service";
import {DatePipe} from "@angular/common";
import { LetterCasePipe } from './core/pipes/letter-case.pipe';



@NgModule({
  declarations: [
    AppComponent,
    LetterCasePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DatePipe
  ],
  providers: [
    ApiService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
