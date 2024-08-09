import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeExpenseSummaryComponent } from './income-expense-summary/income-expense-summary.component';
import { ReportComponent } from './report/report.component';
import { CarpetaComponent } from './medical/carpeta/carpeta.component';

// import { AuthGuard } from './shared/gaurd/auth.guard';

const routes: Routes = [
  { 
    path: 'income-expense-summary',
    component: IncomeExpenseSummaryComponent
  },
  { 
    path: 'reports',
    component: ReportComponent
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },

  {
    path: '',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
  },
  {
    path: '',
    loadChildren: () => import('./medical/medical.module').then((m) => m.MedicalModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: '**',
    redirectTo: 'error/error404',
    pathMatch: 'full',
  },
  { path: 'carpeta/list/edit/:id',
    component: CarpetaComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
