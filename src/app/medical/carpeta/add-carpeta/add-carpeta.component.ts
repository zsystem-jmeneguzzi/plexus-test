import { Component } from '@angular/core';
import { CarpetaService } from '../service/carpeta.service';
import { AppointmentService } from '../../appointment/service/appointment.service';
import { DoctorService } from '../../doctors/service/doctor.service';

@Component({
  selector: 'app-add-carpeta',
  templateUrl: './add-carpeta.component.html',
  styleUrls: ['./add-carpeta.component.scss']
})
export class AddCarpetaComponent {
  public selectedValue !: string  ;
  public autos:string = '';
  public nro_carpeta:string = '';
  public fecha_inicio:string = '';
  public tipo_proceso_id :string = '';
  public estado:string = '';
  public descripcion:string = '';
  public abogado_id:any = [];
  public abogados:any = [];
  public contrarios_id:any = [];
  public tercero_id:any = [];
  public cliente_id:any = [];
  public roles:any = [];

  // public FILE_AVATAR:any;
  // public IMAGEN_PREVIZUALIZA:any = 'assets/img/user-06.jpg';

  public text_success:string = '';
  public text_validation:string = '';


  name:string = '';
  surname:string = '';
  mobile:string = '';
  n_document:number = 0;
  name_companion:string = '';
  surname_companion:string = '';
  id:string = '';

  constructor (
    public carpetaService: CarpetaService,
    public doctorService: DoctorService,
    public appointmentService: AppointmentService,
  ){};

 
  ngOnInit(){
    this.doctorService.listDoctors().subscribe((resp:any) => {

      console.log(resp);
      this.abogados = resp.users.data;
      console.log(this.abogado_id);

    })
   }


  save(){
    
    this.text_validation = '';
    if(!this.autos || !this.nro_carpeta || !this.fecha_inicio ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Autos, Nro Carpeta, Fecha Inicio)";
      return;
    } 

    console.log(this.selectedValue);

    let formData = new FormData();
    formData.append("autos",this.autos);
    formData.append("nro_carpeta",this.nro_carpeta);
    if(this.fecha_inicio){
      formData.append("fecha_inicio",this.fecha_inicio);
    }
    if(this.tipo_proceso_id){
      formData.append("tipo_proceso_id",this.tipo_proceso_id);
    }
    
    formData.append("estado", this.estado + "1");

    if(this.descripcion){
      formData.append("descripcion",this.descripcion);
    }
    if(this.abogado_id){
      formData.append("abogado_id",this.selectedValue);
    }
    if(this.contrarios_id){
      formData.append("contrarios_id",this.contrarios_id);
    }

    formData.append("tercero_id",this.tercero_id);
    formData.append("cliente_id",this.cliente_id);
    
    this.carpetaService.registerCarpeta(formData).subscribe((resp:any) => {
      console.log(resp);

      if(resp.message == 403){
        this.text_validation = resp.message_text;
      }else{
        this.text_success = 'La carpeta fue registrada';

        this.autos = '';
        this.nro_carpeta = '';
        this.fecha_inicio  = '';
        this.tipo_proceso_id  = '';
        this.estado  = '';
        this.descripcion  = '';

        this.abogado_id  = '';
        this.contrarios_id  = '';
        this.tercero_id  = '';
        this.cliente_id  = '';
        
      }
    })
  }

  filterPatient(){
    this.appointmentService.listPatient(this.n_document+"").subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.id = '';
        this.name = '';
        this.surname = '';
        this.mobile = ''
        this.n_document = 0;
      }else{
        this.id = resp.id;
        this.name = resp.name;
        this.surname = resp.surname;
        this.mobile = resp.mobile;
        this.n_document = resp.n_document;
      }
    })
  }



  // loadFile($event:any){
  //   if($event.target.files[0].type.indexOf("image") < 0){
  //     // alert("SOLAMENTE PUEDEN SER ARCHIVOS DE TIPO IMAGEN");
  //     this.text_validation = "SOLAMENTE PUEDEN SER ARCHIVOS DE TIPO IMAGEN";
  //     return;
  //   }
  //   this.text_validation = '';
  //   this.FILE_AVATAR = $event.target.files[0];
  //   let reader = new FileReader();
  //   reader.readAsDataURL(this.FILE_AVATAR);
  //   reader.onloadend = () => this.IMAGEN_PREVIZUALIZA = reader.result;
  // }
}
