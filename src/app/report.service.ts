import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) {}

  filterReports(filters: any): Observable<any> {
    let params = new HttpParams();

    if (filters.estado) {
      params = params.append('estado', filters.estado);
    }
    if (filters.abogado_id) {
      params = params.append('abogado_id', filters.abogado_id);
    }
    if (filters.cliente_id) {
      params = params.append('cliente_id', filters.cliente_id);
    }
    if (filters.tag_id) {
      params = params.append('tag_id', filters.tag_id);
    }
    if (filters.fecha_inicio) {
      params = params.append('fecha_inicio', filters.fecha_inicio);
    }
    if (filters.fecha_fin) {
      params = params.append('fecha_fin', filters.fecha_fin);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.token}`
    });

    return this.http.post<any>(`${URL_SERVICIOS}/carpetas/filter`, { params }, { headers });
  }
}
