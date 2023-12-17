import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetoEsquerdaComponent } from './projeto-esquerda.component';

describe('ProjetoEsquerdaComponent', () => {
  let component: ProjetoEsquerdaComponent;
  let fixture: ComponentFixture<ProjetoEsquerdaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjetoEsquerdaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetoEsquerdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
