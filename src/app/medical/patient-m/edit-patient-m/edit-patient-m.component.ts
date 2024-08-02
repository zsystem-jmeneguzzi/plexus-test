import { Component } from '@angular/core';
import { PatientMService } from '../service/patient-m.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-patient-m',
  templateUrl: './edit-patient-m.component.html',
  styleUrls: ['./edit-patient-m.component.scss']
})
export class EditPatientMComponent {
  public selectedValue !: string  ;
  public name:string = '';
  public surname:string = '';
  public mobile:string = '';
  public email:string = '';

  public birth_date:string = '';
  public gender:number = 1;
  public address:string = '';

  
  public n_tramite: any = null;  // Ya está presente, pero asegúrate de que esté correctamente inicializada

  public n_document:any = null;
  public roles:any = [];
  public text_success:string = '';
  public text_validation:string = '';
  public cuil: string = '';
  public clave_seguridad_social: string = '';
  public clave_fiscal: string = '';
  public patient_id:any;
  public observations: string = '';  // Agregar esta línea


  constructor(
    public patientService: PatientMService,
    public activedRoute: ActivatedRoute,
  ) {
    
  }
  ngOnInit(): void {
    this.activedRoute.params.subscribe((resp: any) => {
        this.patient_id = resp.id;
    });

    this.patientService.showPatient(this.patient_id).subscribe((resp: any) => {
        console.log(resp);

        this.name = resp.patient.name;
        this.surname = resp.patient.surname;
        this.email = resp.patient.email;
        this.mobile = resp.patient.mobile;
        this.n_tramite = resp.patient.n_tramite;
        this.n_document = resp.patient.n_document;
        this.birth_date = resp.patient.birth_date ? new Date(resp.patient.birth_date).toISOString() : '';
        this.gender = resp.patient.gender;
        this.address = resp.patient.address;
        this.observations = resp.patient.observations;  // Asegúrate de que esta línea esté presente

        // Asignar nuevos campos
        this.cuil = resp.patient.cuil;
        this.clave_seguridad_social = resp.patient.clave_seguridad_social;
        this.clave_fiscal = resp.patient.clave_fiscal;
    });
}

save() {
  this.text_validation = '';
  if (!this.name || !this.n_document || !this.surname || !this.mobile || !this.cuil || !this.clave_seguridad_social || !this.clave_fiscal) {
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Nombre, Apellido, N° Documento, Teléfono, Cuil, Clave Seguridad Social, Clave Fiscal)";
      return;
  }

  let patientData = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      mobile: this.mobile.toString(),
      n_tramite: this.n_tramite,
      n_document: this.n_document.toString(),
      birth_date: this.birth_date,
      gender: this.gender + "",
      address: this.address,
      observations: this.observations,
      cuil: this.cuil,
      clave_seguridad_social: this.clave_seguridad_social,
      clave_fiscal: this.clave_fiscal
  };

  console.log(patientData); // Verificar los datos antes de enviar

  this.patientService.updatePatient(this.patient_id, patientData).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 403) {
          this.text_validation = resp.message_text;
      } else {
          this.text_success = 'El paciente ha sido editado correctamente';
      }
  });
}
}
  

