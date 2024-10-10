import { CommonModule, DatePipe } from '@angular/common';
import { Component, TrackByFunction } from '@angular/core';
import { Router } from '@angular/router';
import { GruposService } from '@api/services/grupos.service';
import { ObrasService } from '@api/services/obras.service';
import { RepresentacionesService } from '@api/services/representaciones.service';
import { Grupo } from '@api/types/grupo';
import { Obra } from '@api/types/obra';
import { Representacion } from '@api/types/representacion';
import {
  IconComponent,
  Types,
} from '@components/icons/theater-icons.component';
import packageJson from '../../../../package.json';
import { ModalBorrarComponent } from './modal-borrar/modal-borrar.component';
import { ModalObraComponent } from './modal-obra/modal-obra.component';
import { ModalRepresentacionComponent } from './modal-representacion/modal-representacion.component';

@Component({
  selector: 'theater-representaciones',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    ModalRepresentacionComponent,
    ModalObraComponent,
    ModalBorrarComponent,
  ],
  providers: [RepresentacionesService, DatePipe],
  templateUrl: './representaciones.component.html',
})
export class RepresentacionesComponent {
  public version = packageJson.version;
  public representaciones: Representacion[] = [];
  public Types = Types;
  public showModalRepresentacion = false;
  public showModalObra = false;
  public showModalBorrar = false;
  public obras: Obra[] = [];
  public grupos: Grupo[] = [];
  public representacionSeleccionada: Representacion | null = null;

  trackByFn: TrackByFunction<Representacion> = (index, item) => item.id;

  constructor(
    private readonly router: Router,
    private readonly representacionesService: RepresentacionesService,
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

  openModalRepresentacion(repre: Representacion | null = null) {
    this.representacionSeleccionada = repre;
    this.showModalRepresentacion = true;
  }

  openModalObra() {
    this.showModalObra = true;
  }

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

  openModalBorar(repre: Representacion) {
    this.representacionSeleccionada = repre;
    this.showModalBorrar = true;
  }

  cancelBorrar() {
    this.showModalBorrar = false;
    this.representacionSeleccionada = null;
  }

  /**
   * Elimina una representacion
   * @param repre la representacion a eliminar
   */
  deleteRepresentacion(repre: Representacion) {
    this.showModalBorrar = false;
    this.representacionSeleccionada = null;
    this.representacionesService
      .deleteRepresentacion(repre.id)
      .subscribe(() => {
        this.representaciones = this.representaciones.filter(
          (representacion) => representacion.id !== repre.id
        );
      });
  }

  saveRepresentacion({ representacion, updateMode }: any) {
    if (updateMode) {
      this.representacionesService
        .updateRepresentacion(representacion.id, representacion)
        .subscribe((representacionActualizada) => {
          let index = this.representaciones.findIndex(
            (repre) => repre.id === representacionActualizada.id
          );
          this.representaciones[index] = representacionActualizada;
          this.showModalRepresentacion = false;
        });
    } else {
      this.representacionesService
        .createRepresentacion(representacion)
        .subscribe((representacionCreada) => {
          this.representaciones.push(representacionCreada);
          this.showModalRepresentacion = false;
        });
    }
  }

  verPlano(representacion: Representacion) {
    this.router.navigate(['representaciones', representacion.id]);
  }

  cancelRepresentacion() {
    this.showModalRepresentacion = false;
    this.representacionSeleccionada = null;
  }

  saveObra({ obra }: { obra: string }) {
    this.obrasService
      .createObra({ name: obra } as Obra)
      .subscribe((obraCreada) => {
        this.obras.push(obraCreada);
        this.showModalObra = false;
      });
  }

  cancelObra() {
    this.showModalObra = false;
  }
}
