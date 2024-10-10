import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Representacion } from '../types/representacion';

@Injectable({
  providedIn: 'root',
})
export class RepresentacionesService {
  private apiUrl = environment.api + '/api/v1/representaciones';

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
