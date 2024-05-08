import { Component, ViewChild } from '@angular/core';
import { StaffService } from '../service/staff.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-list-staff-n',
  templateUrl: './list-staff-n.component.html',
  styleUrls: ['./list-staff-n.component.scss'],
  
})
export class ListStaffNComponent {

  public usersList:any = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('closebutton') closebutton:any;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;
  public data:any;

  public role_generals:any = [];
  public staff_generals:any = [];
  public staff_selected:any;

  constructor(
    public staffService: StaffService,
    ){

  };
  ngOnInit() {
    this.getTableData();
  };

  private getTableData(): void {
    this.usersList = [];
    this.serialNumberArray = [];

    this.staffService.listUsers().subscribe((resp:any) => {
   
      this.totalData = resp.users.data.length;
 
      this.staff_generals = resp.users.data;
      this.getTableDataGeneral();
    })
  }

  getTableDataGeneral() {
    this.usersList = [];
    this.serialNumberArray = [];
    this.staff_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
       
        this.usersList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.usersList);
    this.calculateTotalPages(this.totalData, this.pageSize);
  }

  selectUser(rol:any){
    this.staff_selected = rol;
  }

  deleteUser(){
    this.staffService.deleteUser(this.staff_selected.id).subscribe((resp:any) => {
      console.log(resp);
      let INDEX = this.usersList.findIndex((item:any) => item.id == this.staff_selected.id);
      if(INDEX != -1){
        this.usersList.splice(INDEX,1);

        this.staff_selected = null;
        this.closebutton.nativeElement.click();
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.usersList = this.dataSource.filteredData;
  }

  public sortData(sort: any) {
    const data = this.usersList.slice();

    if (!sort.active || sort.direction === '') {
      this.usersList = data;
    } else {
      this.usersList = data.sort((a:any, b:any) => {
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
      this.getTableDataGeneral();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableDataGeneral();
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
    this.getTableDataGeneral();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.searchDataValue = '';
    this.getTableDataGeneral();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
}
