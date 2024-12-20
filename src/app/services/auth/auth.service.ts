import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Person } from '../../models/person.model';
import { PersonService } from '../person/person.service';
import { Stats } from '../../models/stats.model'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/persons';
  private statsUrl = 'http://localhost:8080/api/stats';
  isAValidUser: boolean = false
  family: any[] = [];
  persons: Person[] = [];
  stats: Stats = new Stats(0, 0, 0, 0);

  constructor(private http: HttpClient) {
  }

  // Login 
  checkPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}/check`, person);
  }

  getPersonByEmail(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}/emailcheck`, person);
  }

  // Updates
  updateDb(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/updatedb`, person);
  }

  updatePerson(id: string, personDetails: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/update/${id}`, personDetails);
  }

  setSession(person: Person) {
    // this.isLoggedIn = true;
    this.family.push(person);
    sessionStorage.setItem('UserId', person.id);
    sessionStorage.setItem('UserFirstName', person.firstname);
    sessionStorage.setItem('UserLastName', person.lastname);
    sessionStorage.setItem('UserGender', person.gender);
    sessionStorage.setItem('UserPhoto', person.photo);
    sessionStorage.setItem('User', JSON.stringify(person));

    console.log(sessionStorage.getItem('UserFirstName'));
    this.setStats();
  }

  setStats() {
    let user = sessionStorage.getItem('User');
    if (user != null)
      console.log(JSON.parse(user));

    this.getAllPersons().subscribe(persons => {
      // this.persons = persons;
      persons.forEach(user => {
        if (user.mem.length > 0) {
          this.stats.memories = this.stats.memories + user.mem.length;
        }
        if (user.gender === 'male') {
          this.stats.male++;
        }
        if (user.gender === 'female') {
          this.stats.female++;
        }
      });
      this.stats.connections++;
      sessionStorage.setItem('Stats', JSON.stringify(this.stats));
    });

    this.saveStats();
  }

  getTeam(): any[] {
    let team: Person[] = [];
    this.getAllPersons().subscribe((persons) => {
      persons.forEach((person) => {
        if (person.status === 'Team') {
          team.push(person);
        }
      });
    });
    return team;
  }

  getStats(): Observable<Stats[]> {
    return this.http.get<Stats[]>(`${this.statsUrl}/`);
  }

  updateStats(stats: Stats): Observable<Stats> {
    return this.http.post<Stats>(`${this.statsUrl}/update`, stats);
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

  deleteSession() {
    sessionStorage.clear();
  }

  isAdmin(person: Person): boolean {
    return (person.email === 'rct' && person.password === 'rct');
  }

  setAdminRights() {
    sessionStorage.setItem('User', 'RCT');
  }

  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/`);
  }

  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}/create`, person);
  }

  getFamily(id: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/family/${id}`);
  }

  getPersonById(id: string): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  sendEmail(initiator: Person, person: Person): Observable<Map<Person, Person>> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify({ initiator, person });
    return this.http.post<Map<Person, Person>>(`${this.apiUrl}/sendEmail`, body, { 'headers': headers });
  }

  deletePerson(id: string): Observable<Person> {
    return this.http.delete<Person>(`${this.apiUrl}/delete/${id}`);
  }

  getChildrenByPersonId(id: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/${id}/children`);
  }

  getMotherByPersonId(id: string): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}/mother`);
  }

  getFatherByPersonId(id: string): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}/father`);
  }

  getSiblingsByPersonId(id: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/${id}/siblings`);
  }

}

