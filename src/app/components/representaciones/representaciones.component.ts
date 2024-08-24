import { CommonModule, DatePipe } from '@angular/common';
import { Component, TrackByFunction } from '@angular/core';
import { Router } from '@angular/router';
import { GruposService } from '@api/services/grupos.service';
import { ObrasService } from '@api/services/obras.service';
import { PlanosService } from '@api/services/planos.service';
import { RepresentacionesService } from '@api/services/representaciones.service';
import { WordService } from '@api/services/word.service';
import { Grupo } from '@api/types/grupo';
import { Obra } from '@api/types/obra';
import { Representacion } from '@api/types/representacion';
import {
  IconComponent,
  Types,
} from '@components/icons/theater-icons.component';
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
  ],
  providers: [RepresentacionesService, DatePipe],
  templateUrl: './representaciones.component.html',
})
export class RepresentacionesComponent {
  public representaciones: Representacion[] = [];
  public Types = Types;
  public showModalRepresentacion = false;
  public showModalObra = false;
  public obras: Obra[] = [];
  public grupos: Grupo[] = [];
  public representacionSeleccionada: Representacion | null = null;

  trackByFn: TrackByFunction<Representacion> = (index, item) => item.id;

  constructor(
    private readonly router: Router,
    private readonly representacionesService: RepresentacionesService,
    private readonly planosService: PlanosService,
    private readonly obrasService: ObrasService,
    private readonly gruposService: GruposService,
    private wordService: WordService
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

  // descargar(repre: Representacion) {
  //   let modo = 2;
  //   console.time('descargar');
  //   //Modo 1
  //   if (modo === 1) {
  //     let personas: { asignadoA: string; butacas: Butaca[] }[] = [];
  //     this.planosService
  //       .getPlanoByRepresentacionId(repre.id)
  //       .subscribe((repre) => {
  //         // Recorrer todas las butacas para obtener las ocupadas y sus nombres
  //         repre.butacas.forEach((fila) => {
  //           fila.forEach((butaca) => {
  //             if (butaca.estado === 'Ocupada') {
  //               const index = personas.findIndex(
  //                 (persona) => persona.asignadoA === butaca?.asignadoA
  //               );
  //               if (index !== -1) {
  //                 personas[index].butacas.push(butaca);
  //               } else {
  //                 personas.push({
  //                   asignadoA: butaca.asignadoA || '',
  //                   butacas: [butaca],
  //                 });
  //               }
  //             }
  //           });
  //         });

  //         // Ordenar por nombre
  //         personas.sort((a, b) => {
  //           if (a.asignadoA < b.asignadoA) {
  //             return -1;
  //           }
  //           if (a.asignadoA > b.asignadoA) {
  //             return 1;
  //           }
  //           return 0;
  //         });

  //         console.log(personas);
  //         // Mostrar por consola
  //         personas.forEach((persona) => {
  //           console.log(persona.asignadoA, '(' + persona.butacas.length + ')');
  //           persona.butacas.forEach((butaca) => {
  //             console.log('Fila:', butaca.fila, ' Butaca:', butaca.num_butaca);
  //           });
  //         });
  //         console.timeEnd('descargar');
  //       });
  //   }
  //   //Modo 2
  //   else {
  //     combineLatest([
  //       this.planosService.getNameSeats(repre.id),
  //       this.planosService.getOccupiedSeats(repre.id),
  //     ]).subscribe(([nombres, ocupadas]) => {
  //       let personas: {
  //         asignadoA: string;
  //         butacas: number[];
  //         fila: number;
  //       }[] = [];
  //       nombres.forEach((nombre) => {
  //         const ocupadasPersona = ocupadas.filter(
  //           (ocupada: { butaca: Butaca }) => ocupada.butaca.asignadoA === nombre
  //         );
  //         const agrupadasPorFila = ocupadasPersona.reduce((acc, { butaca }) => {
  //           const { fila, num_butaca } = butaca;
  //           if (!acc[fila]) {
  //             acc[fila] = [];
  //           }
  //           acc[fila].push(num_butaca);
  //           return acc;
  //         }, {} as { [key: number]: number[] });

  //         const butacasAgrupadas = Object.keys(agrupadasPorFila).map(
  //           (fila) => ({
  //             fila: Number(fila),
  //             butacas: agrupadasPorFila[Number(fila)],
  //           })
  //         );
  //         butacasAgrupadas.forEach((butacasPorFila) => {
  //           personas.push({
  //             asignadoA: nombre,
  //             ...butacasPorFila,
  //           });
  //         });
  //       });
  //       console.log(personas);
  //       console.timeEnd('descargar');
  //       this.wordService.generateDocument(repre, personas);
  //     });
  //   }
  // }

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
