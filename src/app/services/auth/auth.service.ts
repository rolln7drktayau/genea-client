import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Person } from '../../models/person.model';
import { PersonService } from '../person/person.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/persons';
  isAValidUser: boolean = false
  family: any[] = [];

  constructor(private http: HttpClient) { }

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
  }

  deleteSession() {
    sessionStorage.clear();
  }

  checkPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}/check`, person);
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

  updateDb(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/updatedb`, person);
  }

  sendEmail(initiator: Person, person: Person): Observable<Map<Person, Person>> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify({ initiator, person });
    return this.http.post<Map<Person, Person>>(`${this.apiUrl}/sendEmail`, body, { 'headers': headers });
  }

  updatePerson(id: string, personDetails: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${id}`, personDetails);
  }

  deletePerson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  init(): Observable<Person[] | string> {
    return this.http.get<Person[] | string>(`${this.apiUrl}/init`);
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
