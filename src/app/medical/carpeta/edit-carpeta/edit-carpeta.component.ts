import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { CarpetaService } from '../service/carpeta.service';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../doctors/service/doctor.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}

interface Abogado {
  id: number;
  full_name: string;
  education: string;
}

export interface Tag {
  id: number;
  name: string;
}

@Component({
  selector: 'app-edit-carpeta',
  templateUrl: './edit-carpeta.component.html',
  styleUrls: ['./edit-carpeta.component.scss']
})
export class EditCarpetaComponent implements OnInit {
  public selectedValue!: string;
  public carpeta_id: any;
  public autos: string = '';
  public nro_carpeta: string = '';
  public fecha_inicio: string = '';
  public tipo_proceso_id: string = '';
  public estado: number = 0;
  public descripcion: string = '';
  public abogado_id: any = [];
  public contrarios_id: any = [];
  public tercero_id: any = [];
  public cliente_id: any = '';
  public carpeta_selected: any;

  abogados: Abogado[] = [];
  public data: any = [];
  public specialitie: any;
  public movimientos: any = [];
  public archivos: any = [];
  public movimiento_carpeta_selected: any;
  public text_success: string = '';
  public text_validation: string = '';
  public tipo_evento: string = '';
  public hora_vencimiento: string = '08:00';
  public created_at: any = '';
  public user: any;
  public ingresosEgresos: any = [];
  public concepto: string = '';
  public monto: number = 0;
  public tipo: string = 'Ingreso';
  public subtotalIngresos: number = 0;
  public subtotalEgresos: number = 0;
  public movimientosFiltrados: any[] = [];

  public tags: Tag[] = []; 
  public selectedTags: Tag[] = [];
  public allTags: Tag[] = [];
  public newTagName: string = '';
  public clientes: any[] = [];

  nombre_abogado: any;
  comentario: any;
  archivo: File | null = null;
  archivoNombre: string = '';
  vencimiento: string = '';
  today: string = '';

  constructor(
    public carpetaService: CarpetaService,
    public activedRoute: ActivatedRoute,
    public doctorService: DoctorService,
  ) {
    this.tags = [];
    this.selectedTags = [];
    this.allTags = [];
    this.movimientos = [];
    this.movimientosFiltrados = [];
    this.archivos = [];
    this.ingresosEgresos = [];
  }

  @NgModule({
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
  })

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    const todayDate = new Date();
    this.today = todayDate.toISOString().split('T')[0];

    this.activedRoute.params.subscribe((resp: any) => {
      this.carpeta_id = resp.id;

      this.doctorService.listDoctors().subscribe((resp: any) => {
        this.abogados = resp.users.data.map((abogado: any): Abogado => {
          return { full_name: abogado.full_name, id: abogado.id, education: abogado.education };
        });
      });

      this.carpetaService.showCarpeta(this.carpeta_id).subscribe((resp: any) => {
        console.log(resp);
        this.carpeta_selected = resp.carpetas;
        this.autos = this.carpeta_selected.autos;
        this.cliente_id = this.carpeta_selected.cliente_id;
        this.nro_carpeta = this.carpeta_selected.nro_carpeta;
        this.fecha_inicio = new Date(this.carpeta_selected.fecha_inicio).toLocaleDateString();
        this.tipo_proceso_id = this.carpeta_selected.tipo_proceso_id;
        this.estado = this.carpeta_selected.estado;
        this.descripcion = this.carpeta_selected.descripcion;
        this.abogado_id = this.carpeta_selected.abogado_id;
        this.contrarios_id = this.carpeta_selected.contrarios_id;
        this.tercero_id = this.carpeta_selected.tercero_id;
        this.tags = this.carpeta_selected.tags || [];

        this.carpetaService.getAllPatients().subscribe((resp: any) => {
          this.clientes = resp.patients;
        });
      });

      this.cargarMovimientos();
      this.cargarArchivosAdjuntos();
    });

    const id: any = this.activedRoute.snapshot.paramMap.get('id');
    this.carpeta_id = +id;
    this.cargarIngresosEgresos();
    this.loadTags();
    this.loadSelectedTags();
  }

  getClientName(cliente_id: number): string {
    const cliente = this.clientes.find(cliente => cliente.id === cliente_id);
    return cliente ? `${cliente.name} ${cliente.surname}` : 'Desconocido';
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (file && allowedTypes.includes(file.type)) {
      this.archivo = file;
      this.archivoNombre = file.name;
    } else {
      alert('Por favor seleccione un archivo PDF o Word.');
      this.archivo = null;
      this.archivoNombre = '';
    }
  }

  onSubmit(): void {
    if (new Date(this.vencimiento) < new Date(this.today)) {
      this.text_validation = "La fecha de vencimiento no puede ser anterior a hoy.";
      return;
    }

    const formData = new FormData();
    formData.append('carpeta_id', this.carpeta_id);
    formData.append('comentario', this.comentario);
    formData.append('abogado_id', this.abogado_id);
    formData.append('fecha_vencimiento', this.vencimiento);
    formData.append('tipo_evento', this.tipo_evento);
    formData.append('hora_vencimiento', this.hora_vencimiento);

    if (this.archivo) {
      formData.append('archivo', this.archivo);
    }

    this.carpetaService.registerMovimiento(formData).subscribe((resp: any) => {
      this.text_success = "Registrado";
      this.cargarMovimientos();
      this.cargarArchivosAdjuntos();
    });
  }

  cargarMovimientos(): void {
    this.carpetaService.showMovimientos(this.carpeta_id).subscribe((resp: any) => {
      this.movimientos = resp.movimientos_carpetas
        .filter((movimiento: any) => !movimiento.deleted_at)
        .map((movimiento: any) => {
          return {
            ...movimiento,
            abogado_nombre: this.getAbogadoNombre(movimiento.abogado_id),
            archivo_url: movimiento.archivo ? movimiento.archivo : null,
            archivo_nombre: movimiento.archivo_nombre ? movimiento.archivo_nombre : null,
            fecha_vencimiento: movimiento.fecha_vencimiento ? new Date(movimiento.fecha_vencimiento).toLocaleDateString() : null,
            tipo_evento: movimiento.tipo_evento ? movimiento.tipo_evento : null,
            hora_vencimiento: movimiento.hora_vencimiento ? movimiento.hora_vencimiento : null
          };
        });
      this.movimientosFiltrados = this.movimientos;
    });
  }

  cargarArchivosAdjuntos() {
    this.carpetaService.getArchivosAdjuntos(this.carpeta_id).subscribe(
      (resp: any) => {
        this.archivos = resp.archivos;
      },
      error => {
        console.error('Error cargando archivos adjuntos:', error);
      }
    );
  }

  getAbogadoNombre(abogado_id: number): string {
    const abogado = this.abogados.find(abogado => abogado.id === abogado_id);
    return abogado ? abogado.full_name : 'Desconocido';
  }

  isPdf(url: string): boolean {
    return url.toLowerCase().endsWith('.pdf') || url.toLowerCase().endsWith('.pdf');
  }

  isWord(url: string): boolean {
    return url.toLowerCase().endsWith('.doc') || url.toLowerCase().endsWith('.docx');
  }

  deleteMovimiento(index: number): void {
    const movimientoId = this.movimientos[index].id;
    this.carpetaService.deleteMovimiento(movimientoId).subscribe((resp: any) => {
      this.text_success = "Eliminado correctamente";
      this.movimientos.splice(index, 1);
      this.cargarArchivosAdjuntos();
    }, (error) => {
      console.error('Error eliminando el movimiento:', error);
    });
  }

  getEventoClass(tipo_evento: string): string {
    switch (tipo_evento) {
      case 'Tareas':
        return 'alert alert-primary';
      case 'Vencimientos':
        return 'alert alert-warning';
      case 'Compromisos':
        return 'alert alert-success';
      case 'Audiencias':
        return 'alert alert-danger';
      default:
        return 'alert alert-secondary';
    }
  }

  cargarIngresosEgresos(): void {
    this.carpetaService.getIngresosEgresos(this.carpeta_id).subscribe(
      (resp: any) => {
        this.ingresosEgresos = resp || [];
        this.calcularSubtotal();
      },
      (error) => {
        console.error('Error cargando ingresos y egresos: ', error);
      }
    );
  }

  agregarIngreso(): void {
    if (!this.user || !this.user.id) {
      console.error('Usuario no autenticado o ID de usuario no disponible');
      return;
    }

    const data = {
      carpeta_id: this.carpeta_id,
      user_id: this.user.id,
      concepto: this.concepto,
      monto: this.monto,
      tipo: 'ingreso',
      fecha: new Date().toISOString().split('T')[0]
    };

    console.log('Datos enviados:', data);

    this.carpetaService.addIngresoEgreso(data).subscribe((resp: any) => {
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
      carpeta_id: this.carpeta_id,
      user_id: this.user.id,
      concepto: this.concepto,
      monto: this.monto,
      tipo: 'egreso',
      fecha: new Date().toISOString().split('T')[0]
    };

    console.log('Datos enviados:', data);

    this.carpetaService.addIngresoEgreso(data).subscribe((resp: any) => {
      this.ingresosEgresos.push(resp);
      this.concepto = '';
      this.monto = 0;
      this.calcularSubtotal();
    }, (error) => {
      console.error('Error agregando Egreso:', error);
    });
  }

  eliminarIngresoEgreso(index: number): void {
    const id = this.ingresosEgresos[index].id;
    this.carpetaService.deleteIngresoEgreso(id).subscribe(() => {
      this.ingresosEgresos.splice(index, 1);
      this.calcularSubtotal(); // Recalcular el subtotal después de eliminar el ingreso/egreso
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

  cambiarEstado(): void {
    this.estado = this.estado === 1 ? 2 : 1;

    const data = {
      carpeta_id: this.carpeta_id,
      estado: this.estado
    };

    this.carpetaService.updateEstado(data).subscribe((resp: any) => {
      console.log('Estado actualizado:', resp);
    }, (error) => {
      console.error('Error actualizando estado:', error);
    });
  }

  filtrarMovimientos(tipoEvento: string): void {
    if (tipoEvento) {
      this.movimientosFiltrados = this.movimientos.filter((movimiento: { tipo_evento: string; }) => movimiento.tipo_evento === tipoEvento);
    } else {
      this.movimientosFiltrados = this.movimientos;
    }
  }

  loadTags() {
    this.carpetaService.getAllTags().subscribe(
      (tags: Tag[]) => {
        this.allTags = tags;
      },
      error => {
        console.error('Error cargando tags: ', error);
      }
    );
  }

  loadSelectedTags() {
    this.carpetaService.getTags(+this.carpeta_id).subscribe(
      (response: any) => {
        if (response.tags && Array.isArray(response.tags)) {
          this.selectedTags = response.tags;
        } else if (Array.isArray(response)) {
          this.selectedTags = response;
        } else {
          console.error('Error: la respuesta no es un arreglo ni contiene una propiedad tags con un arreglo', response);
          this.selectedTags = []; // Asegurarse de que selectedTags sea un arreglo
        }
      },
      error => {
        console.error('Error cargando tags seleccionados: ', error);
        this.selectedTags = []; // Asegurarse de que selectedTags sea un arreglo
      }
    );
  }

  addTag() {
    if (this.newTagName.trim() === '') {
      return;
    }
    this.carpetaService.addTag({ name: this.newTagName }).subscribe(
      (tag: Tag) => {
        this.allTags.push(tag);
        this.newTagName = '';
      },
      error => {
        console.error('Error agregando tag: ', error);
      }
    );
  }

  saveTags() {
    // Obtener los IDs de los tags seleccionados
    const tagIds = this.selectedTags.map(tag => tag.id);

    // Enviar una solicitud a la API de Laravel para actualizar los tags de la carpeta
    this.carpetaService.updateCarpetaTags(this.carpeta_id, tagIds).subscribe(
      () => {
        console.log('Tags guardados correctamente');
      },
      error => {
        console.error('Error guardando tags: ', error);
      }
    );
  }

  toggleTag(tag: Tag) {
    const index = this.selectedTags.findIndex(t => t.id === tag.id);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }
    // Guardar el estado actualizado de los tags
    this.saveTags();
  }

  isSelected(tag: Tag): boolean {
    return this.selectedTags.some(t => t.id === tag.id);
  }
}
