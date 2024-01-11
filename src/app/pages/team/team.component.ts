import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Person } from '../../models/person.model';
import { AuthService } from '../../services/auth/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
declare var observer: any;

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, ReactiveFormsModule, NavbarComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {

  team: any[] = [];

  constructor(private authService: AuthService) {
    this.authService = authService;
  }

  ngOnInit() {
    new observer();
    this.team = this.authService.getTeam();
  }
}
