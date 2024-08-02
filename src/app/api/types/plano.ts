import { Butaca } from './butacas';

export interface Plano {
  /**
   * El id del plano
   */
  id: string;

  /**
   * La representacion asociada al plano
   */
  representacion: string;

  /**
   * Las butacas del plano
   */
  butacas: Butaca[][];
}
