import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-img',
  templateUrl: './modal-img.component.html',
  styleUrls: ['./modal-img.component.scss']
})
export class ModalImgComponent {
  @Input() fullimag: boolean = false;
  @Input() fullscreenImageUrl: string = '';
  @Output() closeModal = new EventEmitter<void>();


  
}
