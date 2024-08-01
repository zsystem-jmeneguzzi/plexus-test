import { Component, OnInit } from '@angular/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AppointmentPayService } from '../../appointment-pay/service/appointment-pay.service';
import { CalendarAppointmentService } from '../service/calendar-appointment.service';
import { Router } from '@angular/router';
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss']
})
export class AppointmentCalendarComponent implements OnInit {

  options: any;
  events: any[] = [];
  specialities: any[] = [];
  specialitie_id = '';
  search_doctor = '';
  search_patient = '';
  abogado = '';
  cliente = '';
  vencimiento: string = '';
  hora_vencimiento: string = '';
  public tipo_evento: string = '';
  public eventos: any[] = []; // Array original de eventos
  public eventosFiltrados: any[] = []; // Array de eventos filtrados
  public tiposEventos: string[] = ['Audiencias', 'Compromisos', 'Tareas', 'Vencimientos']; // Añadir los tipos de eventos disponibles
  

  constructor(
    private appointmentPayService: AppointmentPayService,
    private appointmentCalendarService: CalendarAppointmentService,
    private router: Router
  ) {
    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialDate: new Date(),
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      initialView: 'timeGridWeek',
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events: this.eventosFiltrados, // Usar eventos filtrados
      eventClick: this.handleEventClick.bind(this) // Bind the event click handler
    };
  }

  ngOnInit(): void {
    this.appointmentPayService.listConfig().subscribe((resp: any) => {
      this.specialities = resp.specialities;
    });
    this.loadMovimientos();
  }

  loadMovimientos(): void {
    this.appointmentCalendarService.getMovimientos().subscribe((resp: any) => {
        this.eventos = resp.movimientos_carpetas
            .filter((movimiento: any) => movimiento.fecha_vencimiento !== null)
            .map((movimiento: any) => ({
                title: `${movimiento.comentario} - Carpeta: ${movimiento.carpeta_id}`,
                start: `${movimiento.fecha_vencimiento}T${movimiento.hora_vencimiento}`,
                description: movimiento.comentario,
                url: `/carpeta/list/edit/${movimiento.carpeta_id}`,
                className: this.getEventClass(movimiento.tipo_evento),
                tipo_evento: movimiento.tipo_evento // Asegúrate de incluir el tipo de evento
            }));
        this.eventosFiltrados = this.eventos; // Inicialmente, mostrar todos los eventos
        this.actualizarCalendario(); // Actualizar el calendario con los eventos cargados
    });
  }

  getEventClass(tipo_evento: string): string {
    switch (tipo_evento) {
      case 'Tareas':
        return 'bg-primary'; // Color azul
      case 'Vencimientos':
        return 'bg-warning'; // Color amarillo
      case 'Compromisos':
        return 'bg-success'; // Color verde
      case 'Audiencias':
        return 'bg-danger'; // Color rojo
      default:
        return 'bg-secondary'; // Color gris por defecto
    }
  }

  searchData(): void {
    this.filtrarEventos();
  }

  filtrarEventos(): void {
      if (this.tipo_evento) {
          this.eventosFiltrados = this.eventos.filter(evento => evento.tipo_evento === this.tipo_evento);
      } else {
          this.eventosFiltrados = this.eventos;
      }
      this.actualizarCalendario();
  }

  actualizarCalendario(): void {
      this.options = { ...this.options, events: this.eventosFiltrados };
  }

  handleEventClick(info: any): void {
    info.jsEvent.preventDefault(); // Prevent the default browser behavior
    if (info.event.url) {
      this.router.navigateByUrl(info.event.url); // Navigate to the URL
    }
  }
}
