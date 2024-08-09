import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IncomeExpenseSummaryService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getAllIngresosEgresos(): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token });
    return this.http.get(`${URL_SERVICIOS}/in_out`, { headers });
  }

  addIngresoEgreso(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token });
    return this.http.post(`${URL_SERVICIOS}/ingresos_egresos`, data, { headers });
  }

  deleteIngresoEgreso(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token });
    return this.http.delete(`${URL_SERVICIOS}/ingresos_egresos/${id}`, { headers });
  }

  getCarpetaDetails(carpeta_id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token });
    return this.http.get(`${URL_SERVICIOS}/carpetas/${carpeta_id}`, { headers });
  }
}
