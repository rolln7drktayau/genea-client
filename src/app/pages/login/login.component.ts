import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../../models/person.model';
import { RouterOutlet, RouterLink, Router, CanActivateFn } from '@angular/router';
import { PersonService } from '../../services/person/person.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { authGuard } from '../../shield/auth.guard';
import { AuthService } from '../../services/auth/auth.service';

declare var observer: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  person: Person = new Person();
  isValidFormSubmitted: boolean | undefined;

  signInForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  signUpForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    new observer();
  }

  // Get Connected
  onSignIn(): void {
    this.isValidFormSubmitted = false;
    if (this.signInForm.invalid) {
      return;
    } else {
      this.isValidFormSubmitted = true;
      console.warn('Your data', this.signInForm.value);
      this.person.email = this.signInForm.get('email')?.value || '';
      this.person.password = this.signInForm.get('password')?.value || '';
  
      this.authService.checkPerson(this.person).subscribe(result => {
        // console.log(result);
        if (result) {
          this.authService.isAValidUser = true;
          this.authService.setSession(result);
          this.router.navigate(['/home']);
        } else {
          // if (this.authService.isAdmin(result)) {
          //   this.authService.setAdminRights();
          //   this.router.navigate(['/home']);
          // } else {
          // this.router.navigate(['/login']);
          window.location.reload();
          alert('Invalid email or password !');
        }
        // }
      });
    }
  }

  // Get Registered
  onSignUp(): void {
    this.isValidFormSubmitted = false;
    if (this.signUpForm.invalid) {
      return;
    } else {
      this.isValidFormSubmitted = true;
    }

    console.warn('Your data', this.signUpForm.value);
    this.person.name = this.signUpForm.get('name')?.value || '';
    this.person.email = this.signUpForm.get('email')?.value || '';
    this.person.password = this.signUpForm.get('password')?.value || '';

    this.authService.checkPerson(this.person).subscribe(result => {
      console.log(result);
      if (result) {
        alert('The User already exists');
        // this.router.navigate(['/']);
      } else {
        this.authService.createPerson(this.person).subscribe(result => {
          if (result) {
            // https://codepen.io/nishanc/pen/NWWPdZE
            console.log(result);
            this.router.navigate(['/login']);
            window.location.reload();
            alert('User created successfully\nNow you can login');
          }
        });
        this.router.navigate(['/login']);
        window.location.reload();
      }
    });
  }

  get signUpName() {
    return this.signUpForm.get('name');
  }

  get signUpEmail() {
    return this.signUpForm.get('email');
  }

  get signUpPassword() {
    return this.signUpForm.get('password');
  }

  get signInEmail() {
    return this.signInForm.get('email');
  }

  get sigInPassword() {
    return this.signInForm.get('password');
  }
}