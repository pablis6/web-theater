export type Estado =
  | 'Pasillo'
  | 'Vacia'
  | 'Libre'
  | 'Ocupada'
  | 'Reservada'
  | 'Seleccionada'
  | 'Rota';
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
   * El id del usuario al que esta asignado
   */
  asignadoA?: string;
}
