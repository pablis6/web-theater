import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AsignacionesWordService } from '@api/services/asignaciones-word.service';
import { PlanoWordService } from '@api/services/plano-word.service';
import { PlanosService } from '@api/services/planos.service';
import { RepresentacionesService } from '@api/services/representaciones.service';
import { Butaca, Zona, Zona_entresuelo, Zona_patio } from '@api/types/butacas';
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

  // Recuento de butacas ocupadas
  public recuentoOcupadas = 0;
  public recuentoLibres = 0;

  // Contadores de butacas seleccionadas
  public seleccionadas = 0;
  public ocupadasSeleccionadas = 0;
  public rotasSeleccionadas = 0;

  planoForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
  });

  constructor(
    private readonly planosService: PlanosService,
    private readonly representacionesService: RepresentacionesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly asignacionesWordService: AsignacionesWordService,
    private readonly planoWordService: PlanoWordService
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
        // Recuento de butacas ocupadas y libres
        this.recuentoButacas(this.plano?.butacas || []);
      });
    });
  }

  changeMini() {
    this.miniaturaPatio = !this.miniaturaPatio;
  }

  selectButaca(butaca: Butaca) {
    if (butaca.estado === 'Libre') {
      butaca.estado = 'Seleccionada';
      this.seleccionadas++;
    } else if (butaca.estado === 'Seleccionada') {
      butaca.estado = 'Libre';
      this.seleccionadas--;
    } else if (butaca.estado === 'Ocupada') {
      butaca.estado = 'Ocupada seleccionada';
      this.ocupadasSeleccionadas++;
    } else if (butaca.estado === 'Ocupada seleccionada') {
      butaca.estado = 'Ocupada';
      this.ocupadasSeleccionadas--;
    } else if (butaca.estado === 'Rota') {
      butaca.estado = 'Rota seleccionada';
      this.rotasSeleccionadas++;
    } else if (butaca.estado === 'Rota seleccionada') {
      butaca.estado = 'Rota';
      this.rotasSeleccionadas--;
    }
  }

  /**
   * Indica si hay alguna butaca rota seleccionada o alguna butaca seleccionada para marcar como rota
   * @returns true si hay alguna butaca que marcar como rota o como arreglada
   */
  getMarcarDesmarcarRotaDisabled() {
    return (
      this.ocupadasSeleccionadas !== 0 ||
      (this.seleccionadas === 0 && this.rotasSeleccionadas === 0) ||
      (this.rotasSeleccionadas !== 0 && this.seleccionadas !== 0)
    );
  }

  /**
   * Marca las butacas libre seleccionadas como ocupadas y asigna el nombre de la persona
   */
  asignarButacas() {
    this.plano?.butacas.forEach((fila) => {
      fila.forEach((butaca) => {
        if (butaca.estado === 'Seleccionada') {
          butaca.asignadoA = this.planoForm.get('nombre')?.value as string;
          butaca.estado = 'Ocupada';
        }
      });
    });
    this.guardarPlano();
  }

  /**
   * Marca las butacas seleccionadas ocupadas como libres y quita el nombre de la persona a la que estaban asignadas
   */
  desasignarButacas() {
    this.plano?.butacas.forEach((fila) => {
      fila.forEach((butaca) => {
        if (butaca.estado === 'Ocupada seleccionada') {
          butaca.asignadoA = undefined;
          butaca.estado = 'Libre';
        }
      });
    });
    this.guardarPlano();
  }

  /**
   * Marca las butacas seleccionadas como rotas o las rotas como arregladas
   */
  marcarDesmarcarRota() {
    this.plano?.butacas.forEach((fila) => {
      fila.forEach((butaca) => {
        if (butaca.estado === 'Seleccionada') {
          butaca.estado = 'Rota';
        } else if (butaca.estado === 'Rota seleccionada') {
          butaca.estado = 'Libre';
        }
      });
    });
    this.guardarPlano();
  }

  /**
   * Guarda el plano en la base de datos
   */
  guardarPlano() {
    this.planoForm.reset();
    this.seleccionadas = 0;
    this.ocupadasSeleccionadas = 0;
    this.rotasSeleccionadas = 0;
    this.planosService
      .updateSeat(this.representacionId, this.plano?.butacas || [])
      .subscribe((planoActualizado: Plano) => {
        this.plano = planoActualizado;
        this.recuentoButacas(this.plano?.butacas || []);
      });
  }

  private recuentoButacas(butacas: Butaca[][]) {
    console.time('recuentoButacas');
    const recuento = butacas.reduce(
      (acc, fila) => {
        fila.forEach((butaca) => {
          if (butaca.estado === 'Ocupada') {
            acc.ocupadas++;
          } else if (butaca.estado === 'Libre') {
            acc.libres++;
          }
        });
        return acc;
      },
      { ocupadas: 0, libres: 0 }
    ) || { ocupadas: 0, libres: 0 };

    this.recuentoOcupadas = recuento.ocupadas;
    this.recuentoLibres = recuento.libres;
    console.timeEnd('recuentoButacas');
  }

  /**
   * Descarga el word con el listado de asignaciones de las butacas
   */
  descargarButacas() {
    console.time('descargarButacas');
    if (!this.representacion) {
      console.timeEnd('descargarButacas');
      return;
    }
    combineLatest([
      this.planosService.getNameSeats(this.representacion.id),
      this.planosService.getOccupiedSeats(this.representacion.id),
    ]).subscribe(([nombres, ocupadas]) => {
      let personas: {
        asignadoA: string;
        butacas: number[];
        fila: number;
        zona: Zona;
      }[] = [];
      nombres.forEach((nombre) => {
        const ocupadasPersona = ocupadas.filter(
          (butaca) => butaca.asignadoA === nombre
        );
        const agrupadasPorFila = ocupadasPersona.reduce((acc, butaca) => {
          let { fila, num_butaca, zona } = butaca;
          if (zona === Zona_entresuelo) {
            //si es el entresuelo se le suma 50 a la fila para diferenciarla de la planta baja
            fila = fila + 50;
          }
          if (!acc[fila]) {
            acc[fila] = [];
          }
          acc[fila].push(num_butaca);
          return acc;
        }, {} as { [key: number]: number[] });

        const butacasAgrupadas = Object.keys(agrupadasPorFila).map((fila) => ({
          zona: (Number(fila) > 50 ? Zona_entresuelo : Zona_patio) as Zona,
          fila: Number(fila) > 50 ? Number(fila) - 50 : Number(fila),
          butacas: agrupadasPorFila[Number(fila)],
        }));
        butacasAgrupadas.forEach((butacasPorFila) => {
          personas.push({
            asignadoA: nombre,
            ...butacasPorFila,
          });
        });
      });
      console.timeEnd('descargarButacas');
      if (this.representacion) {
        this.asignacionesWordService.generateDocument(
          this.representacion,
          personas
        );
      }
    });
  }

  /**
   * Descarga el word con el plano de butacas
   */
  descargarPlano() {
    console.time('descargarPlano');
    if (!this.plano) {
      console.timeEnd('descargarPlano');
      return;
    }
    if (this.representacion && this.plano) {
      this.planoWordService.generateDocument(this.representacion, this.plano);
    }
    console.timeEnd('descargarPlano');
  }
}
