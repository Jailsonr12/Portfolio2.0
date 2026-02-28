import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-img',
  templateUrl: './modal-img.component.html',
  styleUrls: ['./modal-img.component.scss'],
})
export class ModalImgComponent implements OnInit, OnDestroy {
  @Input() fullimag = false;
  @Input() fullscreenImageUrl = '';
  @Output() closeModal = new EventEmitter<void>();

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  onBackdropClick(): void {
    this.closeModal.emit();
  }

  onCloseClick(event: MouseEvent): void {
    event.stopPropagation();
    this.closeModal.emit();
  }

  onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
