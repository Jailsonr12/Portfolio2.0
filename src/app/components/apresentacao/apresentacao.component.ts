import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { PortfolioProject } from '../../models/portfolio-data.model';

@Component({
  selector: 'app-apresentacao',
  templateUrl: './apresentacao.component.html',
  styleUrls: ['./apresentacao.component.scss'],
})
export class ApresentacaoComponent implements AfterViewInit, OnDestroy {
  @Input() title = 'Projetos';
  @Input() subtitle = 'Selecao dos trabalhos em destaque';
  @Input() projects: PortfolioProject[] = [];

  inView = false;

  private observer?: IntersectionObserver;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          this.inView = true;
          this.observer?.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
