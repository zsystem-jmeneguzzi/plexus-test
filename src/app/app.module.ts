// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { CarpetaArchivosComponent } from './medical/carpeta/carpeta-archivos-borrar/carpeta-archivos.component';
import { IncomeExpenseSummaryComponent } from './income-expense-summary/income-expense-summary.component';
import { IncomeExpenseSummaryService } from './income-expense-summary.service';


@NgModule({
  declarations: [
    AppComponent,
    CarpetaArchivosComponent,
    IncomeExpenseSummaryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [IncomeExpenseSummaryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
