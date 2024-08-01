import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicalComponent } from './medical.component';
import { AuthGuard } from '../shared/gaurd/auth.guard';
import { IncomeExpenseSummaryComponent } from '../income-expense-summary/income-expense-summary.component';


// http://localhost:4200/roles/register
const routes: Routes = [
  {
    path:'',
    component: MedicalComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'roles',
        loadChildren: () =>
          import('./roles/roles.module').then((m) => m.RolesModule),
      },
      {
        path: 'staffs',
        loadChildren: () =>
          import('./staff/staff.module').then((m) => m.StaffModule),
      },
      {
        path: 'specialities',
        loadChildren: () =>
          import('./specialitie/specialitie.module').then((m) => m.SpecialitieModule),
      },
      {
        path: 'doctors',
        loadChildren: () =>
          import('./doctors/doctors.module').then((m) => m.DoctorsModule),
      },
      {
        path: 'patient-m',
        loadChildren: () =>
          import('./patient-m/patient-m.module').then((m) => m.PatientMModule),
      },
      {
        path: 'carpeta',
        loadChildren: () =>
          import('./carpeta/carpeta.module').then((m) => m.CarpetaModule),
      },
      {
        path: 'appointment-m',
        loadChildren: () =>
          import('./appointment/appointment.module').then((m) => m.AppointmentModule),
      },
      {
        path: 'appointment-pay',
        loadChildren: () =>
          import('./appointment-pay/appointment-pay.module').then((m) => m.AppointmentPayModule),
      },

      {
        path: 'appointment-calendar',
        loadChildren: () =>
          import('./calendar-appointment/calendar-appointment.module').then((m) => m.CalendarAppointmentModule),
      },
      

      { path: 'income-expense-summary',
        component: IncomeExpenseSummaryComponent },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalRoutingModule { }
