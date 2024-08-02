import { Component, ViewChild } from '@angular/core';
import { PatientMService } from '../service/patient-m.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-patient-m',
  templateUrl: './list-patient-m.component.html',
  styleUrls: ['./list-patient-m.component.scss']
})
export class ListPatientMComponent {

  public patientsList: any = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('closebutton') closebutton: any;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 20;
  public totalData = 0;
  public skip = 0; // MIN
  public limit: number = this.pageSize; // MAX
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;

  public patient_generals: any = [];
  public patient_selected: any;

  constructor(public patientService: PatientMService) {}

  ngOnInit() {
    this.getTableData();
  }

  private getTableData(page = 1): void {
    this.patientsList = [];
    this.serialNumberArray = [];

    this.patientService.listPatients(page, this.searchDataValue).subscribe((resp: any) => {
      console.log(resp); // Añadir este log para verificar la respuesta
      this.totalData = resp.total;
      this.patientsList = resp.patients;
      this.dataSource = new MatTableDataSource<any>(this.patientsList);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  selectUser(rol: any) {
    this.patient_selected = rol;
  }

  deletePatient() {
    this.patientService.deletePatient(this.patient_selected.id).subscribe((resp: any) => {
      const INDEX = this.patientsList.findIndex((item: any) => item.id == this.patient_selected.id);
      if (INDEX != -1) {
        this.patientsList.splice(INDEX, 1);
        this.patient_selected = null;
        this.closebutton.nativeElement.click();
      }
    });
  }

  public searchData() {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  public sortData(sort: any) {
    const data = this.patientsList.slice();
    if (!sort.active || sort.direction === '') {
      this.patientsList = data;
    } else {
      this.patientsList = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData(this.currentPage);
    } else if (event === 'previous') {
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
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
}
