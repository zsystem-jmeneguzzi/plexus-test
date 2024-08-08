import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CarpetaService } from '../service/carpeta.service';
import { DoctorService } from '../../doctors/service/doctor.service';
import { Tag } from '../edit-carpeta/edit-carpeta.component';

interface Abogado {
  id: number;
  full_name: string;
}

@Component({
  selector: 'app-list-carpeta',
  templateUrl: './list-carpeta.component.html',
  styleUrls: ['./list-carpeta.component.scss']
})
export class ListCarpetaComponent implements OnInit {

  public carpetasList: any = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('closebutton') closebutton: any;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;  
  public totalData = 0;
  public skip = 0; // MIN
  public limit: number = this.pageSize; // MAX
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;
  public abogado_id: any = [];
  abogados: Abogado[] = [];
  public data: any = [];
  tags: Tag[] = [];
  public filters: any = { tag_id: '', estado: '' };
  public estados = [
    { value: 1, label: 'En trámite' },
    { value: 2, label: 'Finalizado' }
  ];
  
  public carpeta_generals: any = [];
  public carpeta_selected: any;
  constructor(
    public carpetaService: CarpetaService,
    public doctorService: DoctorService,
  ){}

  ngOnInit() {
    this.getTableData();
    this.doctorService.listDoctors().subscribe((resp: any) => {
      this.abogados = resp.users.data.map((abogado: any): Abogado => {
        return { full_name: abogado.full_name, id: abogado.id };
      });
    });

    this.carpetaService.getAllTags().subscribe((tags: Tag[]) => {
      this.tags = tags;
    });
  }

  getAbogadoNombre(abogado_id: number): string {
    const abogado = this.abogados.find(abogado => abogado.id === abogado_id);
    return abogado ? abogado.full_name : 'Desconocido';
  }

  private getTableData(page=1): void {
    this.carpetasList = [];
    this.serialNumberArray = [];

    const params = {
      page: page,
      limit: this.pageSize,
      skip: (page - 1) * this.pageSize,
      search: this.searchDataValue,
      tag_id: this.filters.tag_id,
      estado: this.filters.estado
    };

    this.carpetaService.filterCarpetas(params).subscribe((resp: any) => {
      this.totalData = resp.total;
      this.carpetasList = resp.carpetas.data;
      this.dataSource = new MatTableDataSource<any>(this.carpetasList);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
}


  public searchData() {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  selectUser(rol:any){
    this.carpeta_selected = rol;
  }

  deletePatient(){
    this.carpetaService.deleteCarpeta(this.carpeta_selected.id).subscribe((resp:any) => {
      console.log(resp);
      let INDEX = this.carpetasList.findIndex((item:any) => item.id == this.carpeta_selected.id);
      if(INDEX != -1){
        this.carpetasList.splice(INDEX,1);
        this.carpeta_selected = null;
        this.closebutton.nativeElement.click();
      }
    })
  }

  public sortData(sort: any) {
    const data = this.carpetasList.slice();

    if (!sort.active || sort.direction === '') {
      this.carpetasList = data;
    } else {
      this.carpetasList = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
      this.skip = (this.currentPage - 1) * this.pageSize;
      console.log('Next Page:', this.currentPage, 'Skip:', this.skip); // Log para depuración
      this.getTableData(this.currentPage);
    } else if (event === 'previous' && this.currentPage > 1) {
      this.currentPage--;
      this.skip = (this.currentPage - 1) * this.pageSize;
      console.log('Previous Page:', this.currentPage, 'Skip:', this.skip); // Log para depuración
      this.getTableData(this.currentPage);
    }
  }

  public moveToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.skip = (this.currentPage - 1) * this.pageSize;
      console.log('Move to Page:', pageNumber, 'Skip:', this.skip); // Log para depuración
      this.getTableData(this.currentPage);
    }
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.searchDataValue = '';
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.pageSelection = [];
    this.totalPages = Math.ceil(totalData / pageSize);
    console.log('Total Pages:', this.totalPages); // Log para depuración

    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize;
      const skip = (i - 1) * pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
}
