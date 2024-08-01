import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpetaArchivosComponent } from './carpeta-archivos.component';

describe('CarpetaArchivosComponent', () => {
  let component: CarpetaArchivosComponent;
  let fixture: ComponentFixture<CarpetaArchivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarpetaArchivosComponent]
    });
    fixture = TestBed.createComponent(CarpetaArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
