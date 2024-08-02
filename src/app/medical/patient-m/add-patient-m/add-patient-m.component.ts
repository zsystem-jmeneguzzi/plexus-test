import { Component } from '@angular/core';
import { PatientMService } from '../service/patient-m.service';

@Component({
  selector: 'app-add-patient-m',
  templateUrl: './add-patient-m.component.html',
  styleUrls: ['./add-patient-m.component.scss']
})
export class AddPatientMComponent {
  public name: string = '';
  public surname: string = '';
  public mobile: number | null = null;
  public email: string = '';
  public birth_date: string = '';
  public gender: number = 1;
  public n_tramite: number | null = null;
  public n_document: number | null = null;
  public address: string = '';
  public observations: string = '';

  public text_success: string = '';
  public text_validation: string = '';
  public cuil: string = '';
  public clave_seguridad_social: string = '';
  public clave_fiscal: string = '';


  constructor(public patientService: PatientMService) {}

  save() {
    this.text_validation = '';
    if (!this.name || !this.surname || !this.mobile || !this.n_document) {
        this.text_validation = 'Todos los campos son necesarios (Nombre, Apellido, N° Documento, Teléfono)';
        return;
    }

    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("surname", this.surname);
    formData.append("email", this.email);
    formData.append("mobile", this.mobile!.toString());
    formData.append("n_tramite", this.n_document!.toString());
    formData.append("n_document", this.n_document!.toString());
    formData.append("birth_date", this.birth_date);
    formData.append("gender", this.gender.toString());
    formData.append("address", this.address);
    formData.append("observations", this.observations);
    formData.append("cuil", this.cuil);
    formData.append("clave_seguridad_social", this.clave_seguridad_social);
    formData.append("clave_fiscal", this.clave_fiscal);

    this.patientService.registerPatient(formData).subscribe((resp: any) => {
        if (resp.message == 403) {
            this.text_validation = resp.message_text;
        } else {
            this.text_success = 'El cliente ha sido registrado correctamente';
            this.resetForm();
        }
    });
}

resetForm() {
    this.name = '';
    this.surname = '';
    this.email = '';
    this.mobile = null;
    this.birth_date = '';
    this.gender = 1;
    this.n_document = null;
    this.n_tramite = null;
    this.address = '';
    this.observations = '';
    this.cuil = '';
    this.clave_seguridad_social = '';
    this.clave_fiscal = '';
}
}
