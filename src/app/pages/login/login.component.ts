import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../../models/person.model';
import { RouterOutlet, RouterLink, Router, CanActivateFn } from '@angular/router';
import { StatsService } from '../../services/stats/stats.service';
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

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private statsService: StatsService) {
  }

  ngOnInit(): void {
    new observer();
    // this.observer();
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
          this.statsService.saveStats();
          this.router.navigate(['/home']);
        } else {
          // if (this.authService.isAdmin(result)) {
          //   this.authService.setAdminRights();
          //   this.router.navigate(['/home']);
          // } else {
          // this.router.navigate(['/login']);
          // window.location.reload();
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
    this.person.firstname = this.signUpForm.get('name')?.value || '';
    this.person.email = this.signUpForm.get('email')?.value || '';
    this.person.password = this.signUpForm.get('password')?.value || '';

    this.authService.checkPerson(this.person).subscribe(result => {
      console.log(result);
      if (result) {
        alert('The User already exists !\nUse your credentials to get logged !!!');
        // this.router.navigate(['/']);
      } else {
        this.authService.createPerson(this.person).subscribe(result => {
          if (result) {
            alert('User created successfully !!!\nYou can sing in !!!');
            // https://codepen.io/nishanc/pen/NWWPdZE
            console.log(result);
            // this.router.navigate(['/login']);
            // window.location.reload();
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

  /*
    Designed by: SELECTO
    Original image: https://dribbble.com/shots/5311359-Diprella-Login
*/

  observer() {
    let switchCtn = document.querySelector('#switch-cnt');
    let switchC1 = document.querySelector('#switch-c1');
    let switchC2 = document.querySelector('#switch-c2');
    let switchCircle = document.querySelectorAll('.switch__circle');
    let switchBtn = document.querySelectorAll('.switch-btn');
    let aContainer = document.querySelector('#a-container');
    let bContainer = document.querySelector('#b-container');
    let allButtons = document.querySelectorAll('.submit');

    let getButtons = (e: { preventDefault: () => any; }) => e.preventDefault();

    let changeForm = (e: any) => {
      switchCtn?.classList.add('is-gx');
      setTimeout(function () {
        switchCtn?.classList.remove('is-gx');
      }, 1500);

      switchCtn?.classList.toggle('is-txr');
      switchCircle[0].classList.toggle('is-txr');
      switchCircle[1].classList.toggle('is-txr');

      switchC1?.classList.toggle('is-hidden');
      switchC2?.classList.toggle('is-hidden');
      aContainer?.classList.toggle('is-txl');
      bContainer?.classList.toggle('is-txl');
      bContainer?.classList.toggle('is-z200');
    };

    let mainF = (e: any) => {
      for (var i = 0; i < allButtons.length; i++) allButtons[i].addEventListener('click', getButtons);
      for (var i = 0; i < switchBtn.length; i++) switchBtn[i].addEventListener('click', changeForm);
    };

    window.addEventListener('load', mainF);
  }
}