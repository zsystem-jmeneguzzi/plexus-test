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
  filtroAbogado: string = '';
  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosFiltrados: IngresoEgreso[] = [];

  subtotalIngresos: number = 0;
  subtotalEgresos: number = 0;
  totalIngresos: number = 0;
  totalEgresos: number = 0;
  carpeta_id: any =0;

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
      console.log(resp);
    });
  }

  loadIngresosEgresos() {
    this.incomeExpenseSummaryService.getAllIngresosEgresos().subscribe((data: any) => {
      this.ingresosEgresos = data.map((item: any) => {
        const fechaUTC = new Date(item.fecha);
        const fechaLocal = new Date(fechaUTC.getTime() + fechaUTC.getTimezoneOffset() * 60000 - 3 * 3600000); // Convertir a Buenos Aires
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
    const cumpleAbogado = this.filtroAbogado ? item.autos?.includes(this.filtroAbogado) : true;
    const cumpleFechaInicio = this.filtroFechaInicio ? new Date(item.fecha) >= new Date(this.filtroFechaInicio) : true;
    const cumpleFechaFin = this.filtroFechaFin ? new Date(item.fecha) <= new Date(this.filtroFechaFin) : true;
    return cumpleCarpeta && cumpleAbogado && cumpleFechaInicio && cumpleFechaFin;
  });
  this.calcularSubtotales();
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
    const id = this.ingresosEgresos[index].id;
    this.incomeExpenseSummaryService.deleteIngresoEgreso(id).subscribe(() => {
      this.ingresosEgresos.splice(index, 1);
      this.calcularSubtotal();
    });
  }

  calcularSubtotal(): void {
    this.subtotalIngresos = this.ingresosEgresos
      .filter((item: any) => item.tipo === 'ingreso')
      .reduce((acc: number, item: any) => acc + Number(item.monto), 0);
    this.subtotalEgresos = this.ingresosEgresos
      .filter((item: any) => item.tipo === 'egreso')
      .reduce((acc: number, item: any) => acc + Number(item.monto), 0);
  }

  agregarIngreso(): void {
    if (!this.user || !this.user.id) {
      console.error('Usuario no autenticado o ID de usuario no disponible');
      return;
    }
  
    const data = {
      carpeta_id: this.carpeta_id || null, // Permitir null
      user_id: this.user.id,
      concepto: this.concepto,
      monto: this.monto,
      tipo: 'ingreso', // Enviar en minúsculas
      fecha: new Date().toISOString().split('T')[0]
    };
  
    this.incomeExpenseSummaryService.addIngresoEgreso(data).subscribe((resp: any) => {
      this.ingresosEgresos.push(resp);
      this.concepto = '';
      this.monto = 0;
      this.calcularSubtotal();
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
      carpeta_id: this.carpeta_id || null, // Permitir null
      user_id: this.user.id,
      concepto: this.concepto,
      monto: this.monto,
      tipo: 'egreso', // Enviar en minúsculas
      fecha: new Date().toISOString().split('T')[0]
    };
  
    this.incomeExpenseSummaryService.addIngresoEgreso(data).subscribe((resp: any) => {
      this.ingresosEgresos.push(resp);
      this.concepto = '';
      this.monto = 0;
      this.calcularSubtotal();
    }, (error) => {
      console.error('Error agregando Egreso:', error);
    });
  }
  
  

}
