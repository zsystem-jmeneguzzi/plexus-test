import { Component, OnInit } from '@angular/core';
import { IncomeExpenseSummaryService } from '../income-expense-summary.service';
import { ActivatedRoute } from '@angular/router';

interface IngresoEgreso {
  id: any;
  monto: number;
  tipo: string;
  fecha: Date;
  autos: string;
  concepto: string;
  abogado: string;
}

@Component({
  selector: 'app-income-expense-summary',
  templateUrl: './income-expense-summary.component.html',
  styleUrls: ['./income-expense-summary.component.scss']
})
export class IncomeExpenseSummaryComponent implements OnInit {
  sideBarActivePath: boolean = true;
  headerActivePath: boolean = true;

  filtroCarpeta: string = '';
  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosFiltrados: IngresoEgreso[] = [];

  subtotalIngresos: number = 0;
  subtotalEgresos: number = 0;
  carpeta_id: any = 0;

  public text_success: string = '';
  public text_validation: string = '';
  public tipo_evento: string = '';
  public hora_vencimiento: string = '08:00';
  public created_at: any = '';
  public user: any = {};

  public concepto: string = '';
  public monto: number = 0;
  public tipo: string = 'Ingreso';

  constructor(
    private incomeExpenseSummaryService: IncomeExpenseSummaryService,
    private activedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadIngresosEgresos();
    this.activedRoute.params.subscribe((resp: any) => {
      this.carpeta_id = resp.id;
    });
  }

  loadIngresosEgresos() {
    this.incomeExpenseSummaryService.getAllIngresosEgresos().subscribe((data: any) => {
      this.ingresosEgresos = data.map((item: any) => {
        const fechaLocal = new Date(item.fecha); // Asume que las fechas ya están en la zona horaria correcta
        return {
          ...item,
          monto: parseFloat(item.monto),
          fecha: fechaLocal
        };
      });
      this.aplicarFiltros();
    });
  }
  

  aplicarFiltros(): void {
    this.ingresosEgresosFiltrados = this.ingresosEgresos.filter(item => {
      const cumpleCarpeta = this.filtroCarpeta ? item.autos?.includes(this.filtroCarpeta) : true;
      const cumpleFechaInicio = this.filtroFechaInicio ? new Date(item.fecha) >= new Date(this.filtroFechaInicio) : true;
      const cumpleFechaFin = this.filtroFechaFin ? new Date(item.fecha) <= new Date(this.filtroFechaFin) : true;
      return cumpleCarpeta && cumpleFechaInicio && cumpleFechaFin;
    });
    this.calcularSubtotales();
  }

  limpiarFiltros(): void {
    this.filtroCarpeta = '';
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.aplicarFiltros();
  }

  calcularSubtotales() {
    this.subtotalIngresos = this.ingresosEgresosFiltrados
      .filter(item => item.tipo === 'ingreso')
      .reduce((sum, item) => sum + item.monto, 0);

    this.subtotalEgresos = this.ingresosEgresosFiltrados
      .filter(item => item.tipo === 'egreso')
      .reduce((sum, item) => sum + item.monto, 0);
  }

  eliminarIngresoEgreso(index: number): void {
    const id = this.ingresosEgresosFiltrados[index].id;
    this.incomeExpenseSummaryService.deleteIngresoEgreso(id).subscribe(() => {
      this.ingresosEgresosFiltrados.splice(index, 1);
      this.calcularSubtotales();
    });
  }

  agregarIngreso(): void {
    if (!this.user || !this.user.id) {
      console.error('Usuario no autenticado o ID de usuario no disponible');
      return;
    }

    const data = {
      carpeta_id: this.carpeta_id || null,
      user_id: this.user.id,
      concepto: this.concepto,
      monto: this.monto,
      tipo: 'ingreso',
      fecha: new Date().toISOString().split('T')[0]
    };

    this.incomeExpenseSummaryService.addIngresoEgreso(data).subscribe((resp: any) => {
      this.ingresosEgresos.push(resp);
      this.concepto = '';
      this.monto = 0;
      this.calcularSubtotales();
    }, (error) => {
      console.error('Error agregando Ingreso:', error);
    });
  }

  agregarEgreso(): void {
    if (!this.user || !this.user.id) {
      console.error('Usuario no autenticado o ID de usuario no disponible');
      return;
    }

    const data = {
      carpeta_id: this.carpeta_id || null,
      user_id: this.user.id,
      concepto: this.concepto,
      monto: this.monto,
      tipo: 'egreso',
      fecha: new Date().toISOString().split('T')[0]
    };

    this.incomeExpenseSummaryService.addIngresoEgreso(data).subscribe((resp: any) => {
      this.ingresosEgresos.push(resp);
      this.concepto = '';
      this.monto = 0;
      this.calcularSubtotales();
    }, (error) => {
      console.error('Error agregando Egreso:', error);
    });
  }
}
