import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetoDireitaComponent } from './projeto-direita.component';

describe('ProjetoDireitaComponent', () => {
  let component: ProjetoDireitaComponent;
  let fixture: ComponentFixture<ProjetoDireitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjetoDireitaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetoDireitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
