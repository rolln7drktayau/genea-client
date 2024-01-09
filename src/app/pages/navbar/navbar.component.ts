import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../theme/theme.service';
import { AuthService } from '../../services/auth/auth.service';

declare var observer: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isAuthenticated = true

  constructor(private router: Router, public themeService: ThemeService, private authService: AuthService) { }

  navigate(path: string) {
    if (this.authService.isAValidUser) {
      this.router.navigate([path]);
    } else {
      // this.router.navigate(['/login']);
      // window.location.reload();
      this.refreshPage();
      window.location.reload();
      this.router.navigate(['/login']);
    }
    // this.authService.isAValidUser = true;
  }

  toggleTheme() {
    // Implement your theme toggle logic here
    console.log("Theme changed");
    this.themeService.setDarkTheme(false);
  }

  signOut() {
    // Implement your sign out logic here
    console.log("Signed Out !!!");
    this.authService.deleteSession();
    
    this.refreshPage();
    window.location.reload();
    this.router.navigate(['/login']);
    // this.refreshPage();
    new observer();
  }

  refreshPage() {
    this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
      this.router.navigate([decodeURI(this.router.url)]);
    });
  }
}