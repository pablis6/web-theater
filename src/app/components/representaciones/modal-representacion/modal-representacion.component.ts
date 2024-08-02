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
import { Grupo } from '@api/types/grupo';
import { Obra } from '@api/types/obra';
import { Representacion } from '@api/types/representacion';
import { IconComponent, Types } from '../../icons/theater-icons.component';
import { SelectComponent } from '../../shared/select/select.component';

@Component({
  selector: 'theater-modal-representacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectComponent, IconComponent],
  templateUrl: './modal-representacion.component.html',
})
export class ModalRepresentacionComponent implements OnChanges {
  @Input() showModal = false;

  @Input() representacion: Representacion | null = null;

  @Input() obras: Obra[] = [];
  @Input() grupos: Grupo[] = [];

  @Output() save: EventEmitter<{
    representacion: Representacion;
    updateMode: Boolean;
  }> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  public Types = Types;

  representacionForm = new FormGroup({
    obra: new FormControl({} as Obra, Validators.required),
    fecha: new FormControl('', Validators.required),
    sesion: new FormControl('' as 'Mañana' | 'Tarde', [Validators.required]),
    grupo: new FormControl({} as Grupo, Validators.required),
  });

  sesiones = [
    { value: 'mañana', label: 'Mañana' },
    { value: 'tarde', label: 'Tarde' },
  ];
  public sesionSeleccionada: { value: string; label: string } | undefined;

  public obraSeleccionada: Obra | undefined;

  public grupoSeleccionado: Grupo | undefined;

  constructor() {}

  ngOnChanges() {
    if (this.representacion) {
      console.log(this.representacion);
      this.obraSeleccionada = this.obras.find(
        (obra) => obra.id === this.representacion?.obra?.id
      );
      this.sesionSeleccionada = this.sesiones.find(
        (sesion) => sesion.label === this.representacion?.sesion
      );
      this.grupoSeleccionado = this.grupos.find(
        (grupo) => grupo.id === this.representacion?.grupo?.id
      );
      this.representacionForm.patchValue({
        obra: this.representacion.obra,
        fecha: this.representacion.fecha,
        sesion: this.representacion.sesion,
        grupo: this.representacion.grupo,
      });
    } else {
      this.representacionForm.reset();

      this.sesionSeleccionada = undefined;
      this.obraSeleccionada = undefined;
      this.grupoSeleccionado = undefined;
    }
  }

  setObra(obra: Obra) {
    this.obraSeleccionada = obra;
    this.representacionForm.patchValue({
      obra: this.obraSeleccionada,
    });
  }

  setSesion(sesion: { value: string; label: string }) {
    this.sesionSeleccionada = sesion;
    this.representacionForm.patchValue({
      sesion: this.sesionSeleccionada?.label as 'Mañana' | 'Tarde',
    });
  }

  setGrupo(grupo: Grupo) {
    this.grupoSeleccionado = grupo;
    this.representacionForm.patchValue({
      grupo: this.grupoSeleccionado,
    });
  }

  onSave() {
    if (this.representacionForm.valid) {
      this.save.emit({
        representacion: {
          id: this.representacion?.id,
          ...this.representacionForm.value,
        } as Representacion,
        updateMode: Boolean(this.representacion),
      });
    }
  }
}
