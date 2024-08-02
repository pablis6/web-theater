import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Representacion } from '../types/representacion';

@Injectable({
  providedIn: 'root',
})
export class RepresentacionesService {
  private apiUrl = 'http://localhost:1993/api/v1/representaciones'; // Ajusta esto a la URL base de tu API

  constructor(private http: HttpClient) {}

  getAllRepresentaciones(): Observable<Representacion[]> {
    return this.http.get<Representacion[]>(this.apiUrl);
  }

  createRepresentacion(
    representacion: Representacion
  ): Observable<Representacion> {
    return this.http.post<Representacion>(this.apiUrl, representacion);
  }

  getRepresentacionById(id: string): Observable<Representacion> {
    return this.http.get<Representacion>(`${this.apiUrl}/${id}`);
  }

  updateRepresentacion(
    id: string,
    representacionUpdate: Representacion
  ): Observable<Representacion> {
    return this.http.patch<Representacion>(
      `${this.apiUrl}/${id}`,
      representacionUpdate
    );
  }

  deleteRepresentacion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
