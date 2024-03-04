import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImgComponent } from './modal-img.component';

describe('ModalImgComponent', () => {
  let component: ModalImgComponent;
  let fixture: ComponentFixture<ModalImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
