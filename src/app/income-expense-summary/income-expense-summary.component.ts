import { Component, OnInit } from '@angular/core';
import { IncomeExpenseSummaryService } from '../income-expense-summary.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment'; // Importar moment.js para manejar fechas en el frontend

interface IngresoEgresoDeuda {
  id: any;
  monto: number;
  tipo: string;
  fecha: Date;
  autos: string;
  concepto: string;
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

  ingresosEgresosDeudas: IngresoEgresoDeuda[] = [];
  ingresosEgresosDeudasFiltrados: IngresoEgresoDeuda[] = [];

  subtotalIngresos: number = 0;
  subtotalEgresos: number = 0;
  subtotalDeudas: number = 0;
  carpeta_id: any = 0;

  public concepto: string = '';
  public monto: number = 0;
  public tipo: string = 'ingreso';
  public user: any;

  constructor(
    private incomeExpenseSummaryService: IncomeExpenseSummaryService,
    private activedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!this.user || !this.user.id) {
      console.error('Usuario no autenticado o ID de usuario no disponible');
      return;
    }
    this.loadIngresosEgresosDeudas();
    this.activedRoute.params.subscribe((resp: any) => {
      this.carpeta_id = resp.id;
    });
  }

  loadIngresosEgresosDeudas() {
    this.incomeExpenseSummaryService.getAllIngresosEgresos().subscribe((data: any) => {
      this.ingresosEgresosDeudas = data.map((item: any) => {
        const fechaLocal = moment(item.fecha).toDate(); // Usar moment.js para manejar la fecha
        return {
          ...item,
          monto: parseFloat(item.monto),
          fecha: fechaLocal,
          autos: item.autos || 'N/A'
        };
      });
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    this.ingresosEgresosDeudasFiltrados = this.ingresosEgresosDeudas.filter(item => {
      const cumpleCarpeta = this.filtroCarpeta ? item.autos?.includes(this.filtroCarpeta) : true;
      const cumpleFechaInicio = this.filtroFechaInicio ? moment(item.fecha).isSameOrAfter(this.filtroFechaInicio) : true;
      const cumpleFechaFin = this.filtroFechaFin ? moment(item.fecha).isSameOrBefore(this.filtroFechaFin) : true;
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
    this.subtotalIngresos = this.ingresosEgresosDeudasFiltrados
      .filter(item => item.tipo === 'ingreso')
      .reduce((sum, item) => sum + item.monto, 0);

    this.subtotalEgresos = this.ingresosEgresosDeudasFiltrados
      .filter(item => item.tipo === 'egreso')
      .reduce((sum, item) => sum + item.monto, 0);

    this.subtotalDeudas = this.ingresosEgresosDeudasFiltrados
      .filter(item => item.tipo === 'deuda')
      .reduce((sum, item) => sum + item.monto, 0);
  }

  eliminarIngresoEgresoDeuda(index: number): void {
    const id = this.ingresosEgresosDeudasFiltrados[index].id;
    this.incomeExpenseSummaryService.deleteIngresoEgreso(id).subscribe(() => {
      this.ingresosEgresosDeudasFiltrados.splice(index, 1);
      this.calcularSubtotales();
    });
  }

  agregarIngresoEgresoDeuda(): void {
    if (!this.user || !this.user.id) {
      console.error('Usuario no autenticado o ID de usuario no disponible');
      return;
    }

    const data = {
      carpeta_id: this.carpeta_id || null,
      user_id: this.user.id,
      concepto: this.concepto,
      monto: this.monto,
      tipo: this.tipo,
      fecha: moment().format('YYYY-MM-DD') // Usar moment.js para obtener la fecha actual
    };

    this.incomeExpenseSummaryService.addIngresoEgreso(data).subscribe((resp: any) => {
      const nuevoItem = {
        ...resp,
        fecha: moment(resp.fecha).toDate(),
        autos: resp.autos || 'N/A'
      };
      this.ingresosEgresosDeudas.push(nuevoItem);
      this.aplicarFiltros();
      this.calcularSubtotales();
      this.concepto = '';
      this.monto = 0;
      this.tipo = 'ingreso';
    }, (error) => {
      console.error('Error agregando:', error);
    });
  }
}
