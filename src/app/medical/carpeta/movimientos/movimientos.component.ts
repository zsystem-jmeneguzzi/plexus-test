import { Component } from '@angular/core';
import { CarpetaService } from '../service/carpeta.service';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../doctors/service/doctor.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})
export class MovimientosComponent {

  constructor(
    public carpetaService: CarpetaService,
  ) {
    
  }


}
