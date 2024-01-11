import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stats } from '../../models/stats.model';
import { Observable } from 'rxjs';

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

  setStats() {
    this.getStats().subscribe(stats => {
      stats.forEach(element => {
        sessionStorage.setItem('Stats', JSON.stringify(element));
        if (stats != null) {
          this.stats = stats;
          let toLog = sessionStorage.getItem('Stats');
          if (toLog != null)
            console.log(JSON.parse(toLog));
        }
      });
    });


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