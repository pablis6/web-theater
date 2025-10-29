import { CommonModule, DatePipe } from '@angular/common';
import { Component, TrackByFunction } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { LoadingComponent } from '@components/shared/loading/loading.component';
import { SelectComponent } from '@components/shared/select/select.component';
import packageJson from '../../../../package.json';
import { ModalBorrarComponent } from './modal-borrar/modal-borrar.component';
import { ModalObraComponent } from './modal-obra/modal-obra.component';
import { ModalRepresentacionComponent } from './modal-representacion/modal-representacion.component';

@Component({
  selector: 'theater-representaciones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    ModalRepresentacionComponent,
    ModalObraComponent,
    ModalBorrarComponent,
    LoadingComponent,
    SelectComponent,
  ],
  providers: [RepresentacionesService, DatePipe],
  templateUrl: './representaciones.component.html',
})
export class RepresentacionesComponent {
  public version = packageJson.version;
  public representacionesAll: Representacion[] = []; //copia de todas las representaciones para poder filtrar
  public representaciones: Representacion[] = [];
  public Types = Types;
  public showModalRepresentacion = false;
  public showModalObra = false;
  public showModalBorrar = false;
  public obras: Obra[] = [];
  public grupos: Grupo[] = [];
  public obraError = '';
  public representacionSeleccionada: Representacion | null = null;
  public isLoading = false;

  filtrosForm = new FormGroup({
    filtroObra: new FormControl(null as Obra | null),
    filtroGrupo: new FormControl(null as Grupo | null),
    filtroFechaDesde: new FormControl(null), //fecha de hoy new Date().toISOString().split('T')[0]
    filtroFechaHasta: new FormControl(null),
  });

  public filtroGrupoSeleccionado: Grupo | null = null;
  public filtroObraSeleccionada: Obra | null = null;
  public filtrosAbiertos = false; //solo para modo movil

  trackByFn: TrackByFunction<Representacion> = (index, item) => item.id;

  constructor(
    private readonly router: Router,
    private readonly representacionesService: RepresentacionesService,
    private readonly obrasService: ObrasService,
    private readonly gruposService: GruposService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.obrasService.getAllObra().subscribe((obras) => {
      this.obras = obras;
    });

    this.gruposService
      .getAllGrupos()
      .subscribe((grupos) => (this.grupos = grupos));

    this.representacionesService
      .getAllRepresentaciones()
      .subscribe((representaciones) => {
        representaciones.sort((a, b) => {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });
        this.representacionesAll = representaciones;
        this.representaciones = representaciones;
        this.aplicarFiltros();
        this.isLoading = false;
      });
  }

  openModalRepresentacion(repre: Representacion | null = null) {
    this.representacionSeleccionada = repre;
    this.showModalRepresentacion = true;
  }

  openModalObra() {
    this.showModalObra = true;
  }

  toggleFiltros() {
    this.filtrosAbiertos = !this.filtrosAbiertos;
  }

  /**
   * Establece el filtro de la obra seleccionada.
   *
   * @param {Obra} obra - La obra que se seleccionará como filtro.
   */
  setFiltroObra(obra: Obra) {
    this.filtroObraSeleccionada = obra;
    this.filtrosForm.patchValue({ filtroObra: obra });
    this.filtrosForm.markAsTouched();
    this.filtrosForm.markAsDirty();
    this.aplicarFiltros();
  }

  /**
   * Establece el grupo de filtro seleccionado y actualiza el formulario de filtros.
   *
   * @param grupo - El grupo que se seleccionará como filtro.
   */
  setFiltroGrupo(grupo: Grupo) {
    this.filtroGrupoSeleccionado = grupo;
    this.filtrosForm.patchValue({ filtroGrupo: grupo });
    this.filtrosForm.markAsTouched();
    this.filtrosForm.markAsDirty();
    this.aplicarFiltros();
  }

  /**
   * Restablece los filtros del formulario a sus valores predeterminados.
   */
  borrarFiltros() {
    this.filtrosForm.reset();
    this.filtroObraSeleccionada = null;
    this.filtroGrupoSeleccionado = null;
    this.representaciones = this.representacionesAll;
  }

  /**
   * Aplica los filtros seleccionados a la lista de representaciones.
   * Filtra las representaciones según los filtros seleccionados.
   */
  aplicarFiltros() {
    this.representaciones = this.representacionesAll.filter((repre) => {
      let result = true;
      if (this.filtroObraSeleccionada) {
        result = repre?.obra?.id === this.filtroObraSeleccionada.id;
      }
      if (this.filtroGrupoSeleccionado) {
        result = result && repre?.grupo?.id === this.filtroGrupoSeleccionado.id;
      }
      if (this.filtrosForm.value.filtroFechaDesde) {
        result =
          result &&
          new Date(repre.fecha) >=
            new Date(this.filtrosForm.value.filtroFechaDesde);
      }
      if (this.filtrosForm.value.filtroFechaHasta) {
        result =
          result &&
          new Date(repre.fecha) <=
            new Date(this.filtrosForm.value.filtroFechaHasta);
      }
      return result;
    });
  }

  /**
   * Edita una representacion
   * @param repre la representacion a editar
   */
  editar(repre: Representacion) {
    this.representacionesService
      .updateRepresentacion(repre.id, repre)
      .subscribe({
        next: (representacionUpdate: Representacion) => {
          const index = this.representaciones.findIndex(
            (representacion) => representacion.id === repre.id
          );
          this.representaciones[index] = representacionUpdate;
        },
        error: ({ status, error }) => {
          if (status === 400) {
            alert(error.message);
          } else {
            alert('Error desconocido');
          }
        },
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
    this.representacionesService.deleteRepresentacion(repre.id).subscribe({
      next: () => {
        this.representaciones = this.representaciones.filter(
          (representacion) => representacion.id !== repre.id
        );
      },
      error: ({ status, error }) => {
        if (status === 400) {
          alert(error.message);
        } else {
          alert('Error desconocido');
        }
      },
    });
  }

  /**
   * Guarda una representación, ya sea actualizando una existente o creando una nueva.
   *
   * @param {Object} param0 - Objeto que contiene la representación y el modo de actualización.
   * @param {any} param0.representacion - La representación a guardar.
   * @param {boolean} param0.updateMode - Indica si se debe actualizar una representación existente.
   *
   * Si `updateMode` es verdadero, se actualiza la representación existente llamando al servicio
   * `updateRepresentacion`. Si la actualización es exitosa, se actualiza la lista de representaciones
   * y se cierra el modal. Si ocurre un error, se muestra un mensaje de alerta.
   *
   * Si `updateMode` es falso, se crea una nueva representación llamando al servicio `createRepresentacion`.
   * Si la creación es exitosa, se agrega la nueva representación a la lista y se cierra el modal. Si ocurre
   * un error, se muestra un mensaje de alerta.
   */
  saveRepresentacion({ representacion, updateMode }: any) {
    if (updateMode) {
      this.representacionesService
        .updateRepresentacion(representacion.id, representacion)
        .subscribe({
          next: (representacionActualizada) => {
            let index = this.representaciones.findIndex(
              (repre) => repre.id === representacionActualizada.id
            );
            this.representaciones[index] = representacionActualizada;
            this.showModalRepresentacion = false;
          },
          error: ({ status, error }) => {
            if (status === 400) {
              alert(error.message);
            } else {
              alert('Error desconocido');
            }
          },
        });
    } else {
      this.representacionesService
        .createRepresentacion(representacion)
        .subscribe({
          next: (representacionCreada) => {
            this.representaciones.push(representacionCreada);
            this.representaciones.sort((a, b) => {
              return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
            });
            this.showModalRepresentacion = false;
          },
          error: ({ status, error }) => {
            if (status === 400) {
              alert(error.message);
            } else {
              alert('Error desconocido');
            }
          },
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
    this.obrasService.createObra({ name: obra } as Obra).subscribe({
      next: (obraCreada) => {
        this.obras.push(obraCreada);
        this.showModalObra = false;
      },
      error: ({ status, error }) => {
        if (status === 400) {
          this.obraError = error.message;
        } else {
          alert('Error desconocido');
        }
      },
    });
  }

  cancelObra() {
    this.showModalObra = false;
  }
}
