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
import { RepresentacionesService } from '@api/services/representaciones.service';
import { Butaca, Estado } from '@api/types/butacas';
import { Plano } from '@api/types/plano';
import { Representacion } from '@api/types/representacion';
import { combineLatest } from 'rxjs';
import { IconComponent, Types } from '../icons/theater-icons.component';

export interface PlanoButacasContext {
  butacas: Butaca[][];
}

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
  representacion: Representacion | null = null;
  miniaturaPatio: boolean = false;

  planoForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
  });
  showContextMenu: boolean = false;

  constructor(
    private readonly planosService: PlanosService,
    private readonly representacionesService: RepresentacionesService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.representacionId = params?.['representacionId'];
      combineLatest([
        this.planosService.getPlanoByRepresentacionId(this.representacionId),
        this.representacionesService.getRepresentacionById(
          this.representacionId
        ),
      ]).subscribe(([plano, representacion]) => {
        this.plano = plano;
        this.representacion = representacion;
      });
    });
  }

  changeMini() {
    this.miniaturaPatio = !this.miniaturaPatio;
  }

  onRightClick(event: MouseEvent, butaca: Butaca) {
    if (butaca.estado !== 'Pasillo' && butaca.estado !== 'Vacia') {
      event.preventDefault();
      this.showContextMenu = !this.showContextMenu;
    }
  }

  selectButaca(butaca: Butaca) {
    if (butaca.estado === 'Libre') {
      butaca.estado = 'Seleccionada';
    } else if (butaca.estado === 'Seleccionada') {
      butaca.estado = 'Libre';
    }
  }

  cambioEstado(event: Event, butaca: Butaca, nuevo_estado: Estado) {
    event.stopPropagation();
    butaca.estado = nuevo_estado;
    this.planosService
      .updateSeat(this.representacionId, this.plano?.butacas || [])
      .subscribe((planoActualizado: Plano) => {
        this.plano = planoActualizado;
      });
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
