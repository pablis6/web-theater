export type Estado =
  | 'Pasillo'
  | 'Vacia'
  | 'Libre'
  | 'Ocupada'
  | 'Reservada'
  | 'Seleccionada'
  | 'Rota';

export type Zona = 'patio' | 'entresuelo';
export const Zona_patio = 'patio';
export const Zona_entresuelo = 'entresuelo';

export interface Butaca {
  /**
   * La fila de la butaca
   */
  fila: number;

  /**
   * El numero de la butaca
   */
  num_butaca: number;

  /**
   * El estado de la butaca
   */
  estado: Estado;

  /**
   * La zona de la butaca
   */
  zona: Zona;

  /**
   * El id del usuario al que esta asignado
   */
  asignadoA?: string;
}
