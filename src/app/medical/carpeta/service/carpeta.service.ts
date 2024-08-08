import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { Observable } from 'rxjs';
import { Tag } from '../edit-carpeta/edit-carpeta.component'; // Importa la interfaz Tag
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarpetaService {

  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) { }

  listCarpeta(page:number=1,search:string=''){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/carpetas?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers});
  }

  listConfig(){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/carpeta/config";
    return this.http.get(URL,{headers:headers})
  }

  registerCarpeta(data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/carpetas";
    return this.http.post(URL,data,{headers: headers});
  }

  profileCarpeta(staff_id:string){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/carpetas/profile/"+staff_id;
    return this.http.get(URL,{headers: headers});
  }

  showCarpeta(carpeta_id:string){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/carpetas/"+carpeta_id;
    return this.http.get(URL,{headers: headers});
  }

  updateCarpeta(staff_id:string,data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/carpetas/"+staff_id;
    return this.http.post(URL,data,{headers: headers});
  }

  deleteCarpeta(staff_id:string){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/carpetas/"+staff_id;
    return this.http.delete(URL,{headers: headers});
  }

  registerMovimiento(data: FormData) {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.token
    });
    return this.http.post(`${URL_SERVICIOS}/movimiento-carpetas`, data, { headers: headers });
  }

  showMovimientos(carpeta_id:string){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/movimiento-carpetas/"+carpeta_id;
    return this.http.get(URL,{headers: headers});
  }

  deleteMovimiento(id: number) {
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = `${URL_SERVICIOS}/movimiento-carpetas/${id}`;
    return this.http.delete(URL, {headers: headers});
  }

  getArchivosAdjuntos(carpeta_id: string) {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    let URL = `${URL_SERVICIOS}/carpetas/${carpeta_id}/archivos`;
    return this.http.get(URL, { headers: headers });
  }

  getIngresosEgresos(carpeta_id: string){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    return this.http.get(`${URL_SERVICIOS}/carpetas/${carpeta_id}/ingresos_egresos`, { headers });
  }

  addIngresoEgreso(data: any) {
    let headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.token
    });
    return this.http.post(`${URL_SERVICIOS}/ingresos_egresos`, data, { headers: headers });
  }

  updateEstado(data: any) {
  let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
  let URL = `${URL_SERVICIOS}/carpeta/${data.carpeta_id}/estado`;
  return this.http.put(URL, data, { headers: headers });
  }

  deleteIngresoEgreso(id: number): Observable<any> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const URL = `${URL_SERVICIOS}/ingresos_egresos/${id}`;
    return this.http.delete(URL, {  headers: headers  });
  }

  // TAGS

  getAllTags(): Observable<Tag[]> {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token });
    const url = `${URL_SERVICIOS}/tags`;
    return this.http.get<Tag[]>(url, { headers: headers });
  }

  filterCarpetas(filters: any): Observable<any> {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token });
    const url = `${URL_SERVICIOS}/carpetas/filter`;
    return this.http.post(url, filters, { headers: headers });
  }

  getTags(carpetaId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.authService.token}` });
    const url = `${URL_SERVICIOS}/carpetas/${carpetaId}/tags`;
    return this.http.get(url, { headers });
  }


  addTag(tag: { name: string }): Observable<Tag> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url = `${URL_SERVICIOS}/tags`;
    return this.http.post<Tag>(url, tag, {  headers: headers  });
  }

  updateCarpetaTags(carpetaId: string, tagIds: number[]): Observable<void> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url = `${URL_SERVICIOS}/carpetas/${carpetaId}/tags`;
    return this.http.put<void>(url, { tag_ids: tagIds }, { headers });
  }

   getDocumentSuggestions(n_document: string): Observable<any> {
     let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token });
     let URL = URL_SERVICIOS + `/patients/document-suggestions?n_document=${n_document}`;
     return this.http.get(URL, { headers: headers });
   }
   listPatient(n_document:string = ''){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/appointment/patient?n_document="+n_document;
    return this.http.get(URL,{headers: headers});
  }
  getAllPatients(): Observable<any> {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token });
    let URL = URL_SERVICIOS + "/patients";
    return this.http.get(URL, { headers: headers });
  }

 
  
}

