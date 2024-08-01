import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarpetaRoutingModule } from './carpeta-routing.module';
import { CarpetaComponent } from './carpeta.component';
import { AddCarpetaComponent } from './add-carpeta/add-carpeta.component';
import { ListCarpetaComponent } from './list-carpeta/list-carpeta.component';
import { EditCarpetaComponent } from './edit-carpeta/edit-carpeta.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MovimientosComponent } from './movimientos/movimientos.component';


@NgModule({
  declarations: [
    CarpetaComponent,
    AddCarpetaComponent,
    ListCarpetaComponent,
    EditCarpetaComponent,
    MovimientosComponent
  ],
  imports: [
    CommonModule,
    CarpetaRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ]
})
export class CarpetaModule { }
