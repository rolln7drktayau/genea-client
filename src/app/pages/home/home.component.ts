import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink, RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterOutlet, ReactiveFormsModule, NavbarComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  userName: any
  title = 'GENEA';
  subTitle = 'Treez, le site qui fait pousser votre arbre généalogique, un site qui vous offre des outils et des conseils pour construire votre généalogie.';

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('UserFirstName');
    console.log(this.userName);
  }

}
