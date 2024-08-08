import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { CarpetaService } from '../medical/carpeta/service/carpeta.service';
import { DoctorService } from '../medical/doctors/service/doctor.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  sideBarActivePath: boolean = true;
  headerActivePath: boolean = true;

  reports: any[] = [];
  filters: any = {
    estado: null,
    abogado_id: null,
    cliente_id: null,
    tag_id: null,
    fecha_inicio: null,
    fecha_fin: null
  };
  abogados: any[] = [];
  clientes: any[] = [];
  tags: any[] = [];
  reportData: any[] = [];

  constructor(
    private carpetaService: CarpetaService,
    private doctorService: DoctorService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadAbogados();
    this.loadClientes();
    this.loadTags();
  }

  loadAbogados(): void {
    this.doctorService.listDoctors().subscribe((resp: any) => {
      this.abogados = resp.users.data;
    });
  }

  loadClientes(): void {
    this.carpetaService.getAllPatients().subscribe((resp: any) => {
      this.clientes = resp.patients;
    });
  }

  loadTags(): void {
    this.carpetaService.getAllTags().subscribe((resp: any) => {
      this.tags = resp.tags;
    });
  }

  generateReport(): void {
    this.carpetaService.filterCarpetas(this.filters).subscribe((resp: any) => {
      this.reportData = resp.carpetas;
    });
  }

  getAbogadoNombre(abogado_id: number): string {
    const abogado = this.abogados.find(abogado => abogado.id === abogado_id);
    return abogado ? abogado.full_name : 'Desconocido';
  }

  getClienteNombre(cliente_id: number): string {
    const cliente = this.clientes.find(cliente => cliente.id === cliente_id);
    return cliente ? `${cliente.name} ${cliente.surname}` : 'Desconocido';
  }

  applyFilters(filters: any): void {
    this.reportService.filterReports(filters).subscribe(
      (resp: any) => {
        this.reports = resp.carpetas;
      },
      (error) => {
        console.error('Error fetching reports: ', error);
      }
    );
  }
}
