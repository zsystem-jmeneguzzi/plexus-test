import { Component, OnInit } from '@angular/core';
import { IncomeExpenseSummaryService } from '../income-expense-summary.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment'; // Importar moment.js para manejar fechas en el frontend

interface IngresoEgresoDeuda {
  id: any;
  monto: number;
  tipo: string;
  fecha: Date;
  autos: string;
  concepto: string;
  cliente: string;
  carpeta_id: number; // Agrega carpeta_id aquí
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
  filtroTipo: string = '';

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
  public total: number | undefined;

  constructor(
    private incomeExpenseSummaryService: IncomeExpenseSummaryService,
    private activedRoute: ActivatedRoute,
    private router: Router
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
            const fechaLocal = moment(item.fecha).toDate();
            return {
                ...item,
                monto: parseFloat(item.monto),
                fecha: fechaLocal,
                autos: item.autos || '',
                cliente: item.patient ? `${item.patient.name} ${item.patient.surname}` : '',
                carpeta_id: item.carpeta_id // Asegúrate de que el ID de la carpeta esté disponible
            };
        });
        this.aplicarFiltros();
    });
    }

    onAutosClick(carpeta_id: number) {
      this.incomeExpenseSummaryService.getCarpetaDetails(carpeta_id).subscribe((resp: any) => {
        if (resp.error) {
          alert(resp.error);
        } else {
          this.router.navigate(['/carpeta/list/edit', carpeta_id]); // Asegúrate de que esta línea está correctamente implementada
        }
      }, (error) => {
        if (error.status === 403) {
          alert('No es posible acceder porque esta carpeta está asignada a otro abogado.');
        } else {
          console.error('Error al acceder a la carpeta:', error);
        }
      });
    }

  aplicarFiltros(): void {
    this.ingresosEgresosDeudasFiltrados = this.ingresosEgresosDeudas.filter(item => {
      const cumpleCarpeta = this.filtroCarpeta ? item.autos?.includes(this.filtroCarpeta) : true;
      const cumpleFechaInicio = this.filtroFechaInicio ? moment(item.fecha).isSameOrAfter(this.filtroFechaInicio) : true;
      const cumpleFechaFin = this.filtroFechaFin ? moment(item.fecha).isSameOrBefore(this.filtroFechaFin) : true;
      const cumpleTipo = this.filtroTipo ? item.tipo === this.filtroTipo : true;
      return cumpleCarpeta && cumpleFechaInicio && cumpleFechaFin && cumpleTipo;
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
  
    // El total solo suma ingresos y egresos, excluyendo las deudas.
    this.total = this.subtotalIngresos - this.subtotalEgresos;
  }
  

  eliminarIngresoEgresoDeuda(index: number): void {
    const id = this.ingresosEgresosDeudasFiltrados[index].id;
    this.incomeExpenseSummaryService.deleteIngresoEgreso(id).subscribe(() => {
        this.ingresosEgresosDeudasFiltrados.splice(index, 1);
        this.calcularSubtotales();
    }, (error) => {
        if (error.status === 403) {
            // Muestra un mensaje de error cuando el abogado no tiene permiso para eliminar
            alert('No es posible eliminar este item porque la carpeta está asignada a otro abogado.');
        } else {
            console.error('Error eliminando el item:', error);
        }
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
        autos: resp.autos || ''
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
