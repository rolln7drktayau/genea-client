import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from "../../services/auth/auth.service";
declare var observer: any;

@Component({
  selector: 'app-memories',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, ReactiveFormsModule, NavbarComponent],
  templateUrl: './memories.component.html',
  styleUrl: './memories.component.css'
})
export class memoriesComponent implements OnInit {

  persons: any[] = [];

  constructor(private authService: AuthService) {
    this.authService = authService;
  }

  ngOnInit() {
    new observer();
    let id = sessionStorage.getItem('UserId');
    if (id != null) {
      this.authService.getFamily(id).subscribe(persons => {
        this.persons = persons;
        console.log(persons);
      });
    }
  }
}
