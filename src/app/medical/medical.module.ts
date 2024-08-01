import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalRoutingModule } from './medical-routing.module';
import { MedicalComponent } from './medical.component';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './carpeta/edit-carpeta/edit-carpeta.component';
// import { HeaderComponent } from '../common-component/header/header.component';
// import { SidebarComponent } from '../common-component/sidebar/sidebar.component';


@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  declarations: [
    MedicalComponent,
  //  HeaderComponent,
  //  SidebarComponent,
  ],
  imports: [
    CommonModule,
    MedicalRoutingModule,
    SharedModule,
  ]
})
export class MedicalModule { }
