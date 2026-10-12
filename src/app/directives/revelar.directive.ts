import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

/** Adiciona a classe "visivel" quando o elemento entra na tela. Estilos em styles.scss (.revelar). */
@Directive({
  selector: '[appRevelar]'
})
export class RevelarDirective implements OnInit, OnDestroy {
  @Input() atraso = 0;
  private observador?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) {}

  ngOnInit(): void {
    const n = this.el.nativeElement;
    this.r.addClass(n, 'revelar');
    if (this.atraso) { this.r.setStyle(n, 'transition-delay', `${this.atraso}ms`); }
    if (!('IntersectionObserver' in window)) { this.r.addClass(n, 'visivel'); return; }
    this.observador = new IntersectionObserver(entradas => {
      for (const e of entradas) {
        if (e.isIntersecting) { this.r.addClass(n, 'visivel'); this.observador?.unobserve(n); }
      }
    }, { threshold: 0.12 });
    this.observador.observe(n);
  }

  ngOnDestroy(): void { this.observador?.disconnect(); }
}
