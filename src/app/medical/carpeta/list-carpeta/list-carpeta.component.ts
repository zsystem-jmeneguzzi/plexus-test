import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CarpetaService } from '../service/carpeta.service';
import { DoctorService } from '../../doctors/service/doctor.service';

interface Abogado {
  id: number;
  full_name: string;
}

@Component({
  selector: 'app-list-carpeta',
  templateUrl: './list-carpeta.component.html',
  styleUrls: ['./list-carpeta.component.scss']
})
export class ListCarpetaComponent {

  public carpetasList:any = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('closebutton') closebutton:any;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 20;
  public totalData = 0;
  public skip = 0;//MIN
  public limit: number = this.pageSize;//MAX
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;
  public abogado_id:any = [];
  abogados: Abogado[] = [];
  public data:any = [];
  

  public carpeta_generals:any = [];
  public carpeta_selected:any;
  constructor(
    public carpetaService: CarpetaService,
    public doctorService: DoctorService,
  ){

  }
  
  ngOnInit() {
    this.getTableData();
    this.doctorService.listDoctors().subscribe((resp: any) => {
      this.abogados = resp.users.data.map((abogado: any): Abogado => {
        return { full_name: abogado.full_name, id: abogado.id };
      });
    });
  }

  getAbogadoNombre(abogado_id: number): string {
    const abogado = this.abogados.find(abogado => abogado.id === abogado_id);
    return abogado ? abogado.full_name : 'Desconocido';
  }

  private getTableData(page=1): void {
    this.carpetasList = [];
    this.serialNumberArray = [];
    
    this.carpetaService.listCarpeta(page,this.searchDataValue).subscribe((resp:any) => {

      console.log(resp);

      this.totalData = resp.total;
      this.carpetasList = resp.carpetas.data;
      // this.getTableDataGeneral();
      this.dataSource = new MatTableDataSource<any>(this.carpetasList);
      this.calculateTotalPages(this.totalData, this.pageSize);
    })


  }

  getTableDataGeneral() {
    this.carpetasList = [];
    this.serialNumberArray = [];

    this.carpeta_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        
        this.carpetasList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.carpetasList);
    this.calculateTotalPages(this.totalData, this.pageSize);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData() {
    // this.dataSource.filter = value.trim().toLowerCase();
    // this.carpetasList = this.dataSource.filteredData;
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;

    this.getTableData();
  }

  public sortData(sort: any) {
    const data = this.carpetasList.slice();

    if (!sort.active || sort.direction === '') {
      this.carpetasList = data;
    } else {
      this.carpetasList = data.sort((a:any, b:any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData(this.currentPage);
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData(this.currentPage);
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableData(this.currentPage);
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
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);//10.6 o 10.9 11
    }
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
      // 1
      // 0 - 10
      // 2
      // 10 - 20
      // 3
      // 20 - 30
    }
  }
}