import { Component, OnInit } from '@angular/core';
import { CarpetaService } from '../service/carpeta.service';
import { AppointmentService } from '../../appointment/service/appointment.service';
import { DoctorService } from '../../doctors/service/doctor.service';
import { PatientMService } from '../../patient-m/service/patient-m.service';

@Component({
  selector: 'app-add-carpeta',
  templateUrl: './add-carpeta.component.html',
  styleUrls: ['./add-carpeta.component.scss']
})
export class AddCarpetaComponent implements OnInit {
  public selectedValue!: string;
  public autos: string = '';
  public nro_carpeta: string = '';
  public fecha_inicio: string = '';
  public tipo_proceso_id: string = '';
  public estado: string = '';
  public descripcion: string = '';
  public abogado_id: any = [];
  public abogados: any = [];
  public contrarios_id: any = [];
  public tercero_id: any = [];
  public cliente_id: any = [];
  public roles: any = [];
  public clients: any = [];
  public selectedClient: any = null;
  public n_document: number = 0;
  public name: string = '';
  public surname: string = '';
  public documentSuggestions: any[] = [];

  public text_success: string = '';
  public text_validation: string = '';

  mobile: string = '';
  id: string = '';


  constructor(
    public carpetaService: CarpetaService,
    public doctorService: DoctorService,
    public appointmentService: AppointmentService,
    public patientService: PatientMService
  ) { };

  ngOnInit() {
    this.doctorService.listDoctors().subscribe((resp: any) => {
      this.abogados = resp.users.data;
    });

    this.carpetaService.getAllPatients().subscribe((resp: any) => {
      this.clients = resp.patients;
    });
  }

  save() {
    this.text_validation = '';
    if (!this.autos || !this.nro_carpeta || !this.fecha_inicio) {
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Autos, Nro Carpeta, Fecha Inicio)";
      return;
    }

    let formData = new FormData();
    formData.append("autos", this.autos);
    formData.append("nro_carpeta", this.nro_carpeta);
    if (this.fecha_inicio) {
      formData.append("fecha_inicio", this.fecha_inicio);
    }
    if (this.tipo_proceso_id) {
      formData.append("tipo_proceso_id", this.tipo_proceso_id);
    }

    formData.append("estado", this.estado + "1");

    if (this.descripcion) {
      formData.append("descripcion", this.descripcion);
    }
    if (this.selectedValue) {
      formData.append("abogado_id", this.selectedValue);
    }
    if (this.contrarios_id) {
      formData.append("contrarios_id", this.contrarios_id);
    }

    formData.append("tercero_id", this.tercero_id);
    formData.append("cliente_id", this.selectedClient);

    this.carpetaService.registerCarpeta(formData).subscribe((resp: any) => {
      if (resp.message == 403) {
        this.text_validation = resp.message_text;
      } else {
        this.text_success = 'La carpeta fue registrada';
        this.resetForm();
      }
    });
  }

  resetForm() {
    this.autos = '';
    this.nro_carpeta = '';
    this.fecha_inicio = '';
    this.tipo_proceso_id = '';
    this.estado = '';
    this.descripcion = '';
    this.selectedClient = null;
    this.n_document = 0;
    this.name = '';
    this.surname = '';
  }

  onClientSelect(event: any) {
    const clientId = event.target.value;
    const selectedClient = this.clients.find((client: any) => client.id == clientId);
    if (selectedClient) {
      this.n_document = selectedClient.n_document;
      this.name = selectedClient.name;
    }
  }

  onDocumentInput(event: any) {
    const n_document = event.target.value;
    if (n_document.length > 2) {
      this.carpetaService.getDocumentSuggestions(n_document).subscribe(
        (data: any) => {
          this.documentSuggestions = data.documents;
          if (this.documentSuggestions.length === 1) {
            this.name = this.documentSuggestions[0].name;
            this.surname = this.documentSuggestions[0].surname;
            this.selectedClient = this.clients.find((client: { n_document: number; }) => client.n_document == this.n_document)?.id || null;
          }
        },
        (error: any) => {
          console.error('Error fetching document suggestions:', error);
        }
      );
    } else {
      this.documentSuggestions = [];
    }
  }

  filterPatient() {
    this.appointmentService.listPatient(this.n_document + "").subscribe((resp: any) => {
      if (resp.message == 403) {
        this.resetPatientForm();
      } else {
        this.id = resp.id;
        this.name = resp.name;
        this.surname = resp.surname;
        this.mobile = resp.mobile;
        this.n_document = resp.n_document;
        this.selectedClient = this.clients.find((client: { n_document: number; }) => client.n_document == this.n_document)?.id || null;
      }
    });
  }

  resetPatientForm() {
    this.id = '';
    this.name = '';
    this.surname = '';
    this.mobile = '';
    this.n_document = 0;
  }
}
