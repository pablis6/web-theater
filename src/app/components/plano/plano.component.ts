import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlanosService } from '@api/services/planos.service';
import { Butaca } from '@api/types/butacas';
import { Plano } from '@api/types/plano';
import { IconComponent, Types } from '../icons/theater-icons.component';

@Component({
  selector: 'app-plano',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule],
  templateUrl: './plano.component.html',
})
export class PlanoComponent implements OnInit {
  public plano: Plano | null = null;
  public Types = Types;
  representacionId: string = '';

  planoForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
  });
  showContextMenu: boolean = false;

  constructor(
    private readonly planosService: PlanosService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.representacionId = params?.['representacionId'];
      this.planosService
        .getPlanoByRepresentacionId(this.representacionId)
        .subscribe((plano) => {
          this.plano = plano;
        });
    });
  }
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.showContextMenu = !this.showContextMenu;
  }

  selectButaca(butaca: Butaca) {
    if (butaca.estado === 'Libre') {
      butaca.estado = 'Seleccionada';
    } else if (butaca.estado === 'Seleccionada') {
      butaca.estado = 'Libre';
    }
  }

  getEnabled() {
    return (
      this.planoForm.valid &&
      this.plano?.butacas.some((fila) =>
        fila.some((butaca) => butaca.estado === 'Seleccionada')
      )
    );
  }

  guardarButacas() {
    this.plano?.butacas.forEach((fila) => {
      fila.forEach((butaca) => {
        if (butaca.estado === 'Seleccionada') {
          butaca.asignadoA = this.planoForm.get('nombre')?.value as string;
          butaca.estado = 'Ocupada';
        }
      });
    });
    this.planosService
      .updateSeat(this.representacionId, this.plano?.butacas || [])
      .subscribe((planoActualizado: Plano) => {
        this.plano = planoActualizado;
        this.planoForm.reset();
      });
  }
}
