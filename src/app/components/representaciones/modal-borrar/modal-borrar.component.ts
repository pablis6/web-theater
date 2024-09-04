import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Representacion } from '@api/types/representacion';

@Component({
  selector: 'theater-modal-borrar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-borrar.component.html',
})
export class ModalBorrarComponent {
  @Input() public showModal = false;
  @Input() public representacion: Representacion | null = null;

  @Output() delete: EventEmitter<Representacion> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();
}
