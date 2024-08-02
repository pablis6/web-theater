import { CommonModule } from '@angular/common';
import { Component, TrackByFunction } from '@angular/core';
import { Router } from '@angular/router';
import { GruposService } from '@api/services/grupos.service';
import { ObrasService } from '@api/services/obras.service';
import { PlanosService } from '@api/services/planos.service';
import { RepresentacionesService } from '@api/services/representaciones.service';
import { Grupo } from '@api/types/grupo';
import { Obra } from '@api/types/obra';
import { Representacion } from '@api/types/representacion';
import {
  IconComponent,
  Types,
} from '@components/icons/theater-icons.component';
import { ModalRepresentacionComponent } from './modal-representacion/modal-representacion.component';

@Component({
  selector: 'theater-representaciones',
  standalone: true,
  imports: [CommonModule, IconComponent, ModalRepresentacionComponent],
  providers: [RepresentacionesService],
  templateUrl: './representaciones.component.html',
})
export class RepresentacionesComponent {
  public representaciones: Representacion[] = [];
  public Types = Types;
  public showModal = false;
  public obras: Obra[] = [];
  public grupos: Grupo[] = [];
  public representacionSeleccionada: Representacion | null = null;

  trackByFn: TrackByFunction<Representacion> = (index, item) => item.id;

  constructor(
    private readonly router: Router,
    private readonly representacionesService: RepresentacionesService,
    private readonly planosService: PlanosService,
    private readonly obrasService: ObrasService,
    private readonly gruposService: GruposService
  ) {}

  ngOnInit() {
    this.obrasService.getAllObra().subscribe((obras) => (this.obras = obras));

    this.gruposService
      .getAllGrupos()
      .subscribe((grupos) => (this.grupos = grupos));

    this.representacionesService
      .getAllRepresentaciones()
      .subscribe((representaciones) => {
        this.representaciones = representaciones;
      });
  }

  openModal(repre: Representacion | null = null) {
    this.representacionSeleccionada = repre;
    this.showModal = true;
  }

  descargar(repre: Representacion) {}

  /**
   * Edita una representacion
   * @param repre la representacion a editar
   */
  editar(repre: Representacion) {
    this.representacionesService
      .updateRepresentacion(repre.id, repre)
      .subscribe((representacionUpdate: Representacion) => {
        const index = this.representaciones.findIndex(
          (representacion) => representacion.id === repre.id
        );
        this.representaciones[index] = representacionUpdate;
      });
  }

  /**
   * Elimina una representacion
   * @param repre la representacion a eliminar
   */
  eliminar(repre: Representacion) {
    this.representacionesService
      .deleteRepresentacion(repre.id)
      .subscribe(() => {
        this.representaciones = this.representaciones.filter(
          (representacion) => representacion.id !== repre.id
        );
      });
  }

  save({ representacion, updateMode }: any) {
    if (updateMode) {
      this.representacionesService
        .updateRepresentacion(representacion.id, representacion)
        .subscribe((representacionActualizada) => {
          let index = this.representaciones.findIndex(
            (repre) => repre.id === representacionActualizada.id
          );
          this.representaciones[index] = representacionActualizada;
          this.showModal = false;
        });
    } else {
      this.representacionesService
        .createRepresentacion(representacion)
        .subscribe((representacionCreada) => {
          this.representaciones.push(representacionCreada);
          this.showModal = false;
        });
    }
  }

  verPlano(representacion: Representacion) {
    this.router.navigate(['representaciones', representacion.id]);
  }

  cancel() {
    this.showModal = false;
  }
}
