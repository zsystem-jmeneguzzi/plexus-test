import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarpetaComponent } from './carpeta.component';
import { AddCarpetaComponent } from './add-carpeta/add-carpeta.component';
import { EditCarpetaComponent } from './edit-carpeta/edit-carpeta.component';
import { ListCarpetaComponent } from './list-carpeta/list-carpeta.component';
import { MovimientosComponent } from './movimientos/movimientos.component';


const routes: Routes = [{
  path:'',
  component: CarpetaComponent,
  children: [
    {
      path: 'register',
      component: AddCarpetaComponent,
    },
    {
      path: 'list',
      component: ListCarpetaComponent,
    },
    {
      path: 'list/edit/:id',
      component: EditCarpetaComponent,
    },
    {
      path: 'carpeta/movimientos/:id',
      component: MovimientosComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarpetaRoutingModule { }
