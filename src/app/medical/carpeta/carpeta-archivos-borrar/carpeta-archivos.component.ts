import { Component, OnInit } from '@angular/core';
import { CarpetaService } from '../service/carpeta.service'; 
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-carpeta-archivos',
  templateUrl: './carpeta-archivos.component.html',
  styleUrls: ['./carpeta-archivos.component.scss']
})
export class CarpetaArchivosComponent implements OnInit {
  public carpeta_id: string;
  public archivos: any[] = [];

  constructor(
    private carpetaService: CarpetaService,
    private route: ActivatedRoute
  ) {
    this.carpeta_id = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.carpetaService.getArchivosAdjuntos(this.carpeta_id).subscribe((resp: any) => {
      this.archivos = resp.archivos;
    });
  }
}

