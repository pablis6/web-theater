import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Obra } from '@api/types/obra';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ObrasService {
  private baseUrl = 'http://localhost:1993/api/v1/obras'; // Ajusta esta URL a tu entorno de desarrollo

  constructor(private http: HttpClient) {}

  getAllObra(): Observable<Obra[]> {
    return this.http.get<Obra[]>(`${this.baseUrl}/`);
  }

  getObraById(id: string): Observable<Obra> {
    return this.http.get<Obra>(`${this.baseUrl}/${id}`);
  }

  createObra(obra: Obra): Observable<Obra> {
    return this.http.post<Obra>(`${this.baseUrl}/`, obra);
  }

  updateObra(id: string, obra: Obra): Observable<Obra> {
    return this.http.patch<Obra>(`${this.baseUrl}/${id}`, obra);
  }

  deleteObra(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
