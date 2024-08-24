import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IconComponent, Types } from '../../icons/theater-icons.component';
import { SelectComponent } from '../../shared/select/select.component';

@Component({
  selector: 'theater-modal-obra',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectComponent, IconComponent],
  templateUrl: './modal-obra.component.html',
})
export class ModalObraComponent implements OnChanges {
  @Input() showModal = false;

  @Output() save: EventEmitter<{ obra: string }> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  public Types = Types;

  obraForm = new FormGroup({
    obra: new FormControl('', Validators.required),
  });

  constructor() {}

  ngOnChanges() {}

  setObra(obra: string) {
    this.obraForm.patchValue({ obra });
  }

  onSave() {
    if (this.obraForm.valid && this.obraForm?.value?.obra) {
      this.save.emit({ obra: this.obraForm?.value?.obra });
    }
  }
}
