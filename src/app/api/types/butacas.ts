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
  estado:
    | 'Pasillo'
    | 'Vacia'
    | 'Libre'
    | 'Ocupada'
    | 'Reservada'
    | 'Seleccionada'
    | 'Rota';

  /**
   * El id del usuario al que esta asignado
   */
  asignadoA?: string;
}
