import { Grupo } from './grupo';
import { Obra } from './obra';

export interface Representacion {
  /**
   * El id de la representación
   */
  id: string;

  /**
   * La fecha de la representación
   */
  fecha: string;

  /**
   * La sesión de la representación
   */
  sesion: 'Mañana' | 'Tarde';

  /**
   * La obra
   */
  obra?: Obra;

  /**
   * El grupo
   */
  grupo?: Grupo;
}
