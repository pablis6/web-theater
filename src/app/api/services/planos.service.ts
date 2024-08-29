import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Butaca } from '@api/types/butacas';
import { Plano } from '@api/types/plano';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanosService {
  private apiUrl = 'http://localhost:1993/api/v1/planos';

  constructor(private http: HttpClient) {}

  getAllPlanos(): Observable<Plano[]> {
    return this.http.get<Plano[]>(`${this.apiUrl}/`);
  }

  createPlano(plano: Plano): Observable<Plano> {
    return this.http.post<Plano>(`${this.apiUrl}/`, plano);
  }

  getPlanoByRepresentacionId(id: string): Observable<Plano> {
    return this.http.get<Plano>(`${this.apiUrl}/${id}`);
  }

  getOccupiedSeats(id: string): Observable<Butaca[]> {
    return this.http.get<Butaca[]>(`${this.apiUrl}/${id}/butacasOcupadas`);
  }

  getNameSeats(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${id}/nombresButacas`);
  }

  updateSeat(id: string, butacas: Butaca[][]): Observable<Plano> {
    return this.http.patch<Plano>(`${this.apiUrl}/${id}`, butacas);
  }

  updatePlano(id: string, planoUpdate: Plano): Observable<Plano> {
    return this.http.put<Plano>(`${this.apiUrl}/${id}`, planoUpdate);
  }

  deletePlano(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
