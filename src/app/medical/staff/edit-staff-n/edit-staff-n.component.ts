import { Component } from '@angular/core';
import { StaffService } from '../service/staff.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-staff-n',
  templateUrl: './edit-staff-n.component.html',
  styleUrls: ['./edit-staff-n.component.scss']
})
export class EditStaffNComponent {


  public selectedValue !: string  ;
  public name:string = '';
  public surname:string = '';
  public mobile:string = '';
  public email:string = '';
  public password:string = '';
  public password_confirmation:string = '';
  public birth_date:string = '';
  public gender:number = 0;
  public education:string = '';
  public designation:string = '';
  public address:string = '';

  public roles:any = [];
  public FILE_AVATAR:any;
  public IMAGE_PREVIZUALIZA:any = "assets/img/user-06.jpg";

  public  text_success:string = '';
  public  text_validation:string = '';

  public staff_id:any;
  public staff_selected:any;

  constructor (
    public staffService: StaffService,
    public activedRoute: ActivatedRoute,
  ){};

  ngOnInit(){
    this.activedRoute.params.subscribe((resp:any)=>{
      console.log(resp);
      this.staff_id = resp.id;
    });

    this.staffService.showUser(this.staff_id).subscribe((resp:any)=>{
      console.log(resp);
      this.staff_selected = resp.user;

      this.selectedValue = this.staff_selected.role.id ;
      this.name = this.staff_selected.name ;
      this.surname = this.staff_selected.surname ;
      this.mobile = this.staff_selected.mobile ;
      this.email = this.staff_selected.email ;
      this.birth_date = new Date(this.staff_selected.birth_date).toISOString() ;
      this.gender = this.staff_selected.gender ;
      this.education = this.staff_selected.education ;
      this.designation = this.staff_selected.designation ;
      this.address = this.staff_selected.address ;
      this.IMAGE_PREVIZUALIZA = this.staff_selected.avatar;

    });
  
   this.staffService.listConfig().subscribe((resp:any) => {
    console.log(resp);
    this.roles = resp.roles;
  });  
  }

  save(){
    this.text_validation = '';
    if(!this.name || !this.email || !this.surname){
      this.text_validation = "Los campos son necesarios";
      return;
    };

    if(this.password){
      if(this.password != this.password_confirmation){
            this.text_validation = "Las contraseñas deben ser las mismas";
            return;
          };
    };

    


    let formData = new FormData();
    formData.append("name",this.name)
    formData.append("surname",this.surname);
    formData.append("email",this.email);
    formData.append("mobile",this.mobile);
    formData.append("birth_date",this.birth_date);
    formData.append("gender",this.gender+"");
    if(this.education){
      formData.append("education",this.education);
    };
    if(this.designation){
      formData.append("designation",this.designation);
    };
    if(this.address){
      formData.append("address",this.address);
    };
      formData.append("role_id",this.selectedValue);
    if(this.password){
      formData.append("password",this.password);
    };
    if(this.FILE_AVATAR){
      formData.append("image",this.FILE_AVATAR);
    };
    

    this.staffService.updateUser(this.staff_id,formData).subscribe((resp:any)=>{
      console.log(resp);

    if(resp.message == 403){
      this.text_validation = resp.message_text;
    }else{
      this.text_success = "El usuario ha sido editado correctamente";

 

    };



    })
  }

  loadFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      // alert("SOLAMENTE PUEDEN SER ARCHIVOS DE IMAGEN");
      console.log($event.target.files[0]);
      this.text_validation = "SOLAMENTE PUEDEN SER ARCHIVOS DE IMAGEN";
      return;
    }
    this.text_validation = '';
    this.FILE_AVATAR = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_AVATAR);
    reader.onloadend = () => this.IMAGE_PREVIZUALIZA = reader.result;

  }
  
}
