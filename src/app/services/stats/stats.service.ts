import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stats } from '../../models/stats.model';
import { Observable } from 'rxjs';
import { Person } from '../../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = 'http://localhost:8080/api/stats';
  stats: any = {};

  constructor(private http: HttpClient) { }

  getStats(): Observable<Stats[]> {
    return this.http.get<Stats[]>(`${this.apiUrl}/`);
  }

  updateStats(stats: Stats): Observable<Stats> {
    return this.http.post<Stats>(`${this.apiUrl}/update`, stats);
  }

  saveStats(): void {
    let stats = sessionStorage.getItem('Stats');
    if (stats != null) {
      let toSave = JSON.parse(stats);
      this.updateStats(toSave).subscribe((result: any) => {
        console.log(result);
      });
    }
  }
}