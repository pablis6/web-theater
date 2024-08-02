import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Grupo } from '@api/types/grupo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GruposService {
  private baseUrl = 'http://localhost:1993/api/v1/grupos'; // Ajusta esta URL a tu entorno de desarrollo

  constructor(private http: HttpClient) {}

  getAllGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.baseUrl}/`);
  }

  getGrupoById(id: string): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.baseUrl}/${id}`);
  }

  createGrupo(grupo: Grupo): Observable<Grupo> {
    return this.http.post<Grupo>(`${this.baseUrl}/`, grupo);
  }

  updateGrupo(id: string, grupo: Grupo): Observable<Grupo> {
    return this.http.patch<Grupo>(`${this.baseUrl}/${id}`, grupo);
  }

  deleteGrupo(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
