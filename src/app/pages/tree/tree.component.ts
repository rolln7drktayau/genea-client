import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { PersonService } from '../../services/person/person.service';
import { UserService } from '../../services/user/user.service';
// import { Person } from './models/person.model';
import { User } from '../../models/user.model';
import FamilyTree from '@balkangraph/familytree.js';
import { HomeComponent } from '../../pages/home/home.component';
import { AuthService } from '../../services/auth/auth.service';
import { Person } from '../../models/person.model';

declare var observer: any;

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, ReactiveFormsModule, NavbarComponent],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent implements OnInit {

  title = 'Genea';
  persons: any[] = [];
  users: User[] = [];

  person: Person = new Person();

  counter = 0;
  root = '';
  check = true;

  familyData: any[] = [];

  constructor(private authService: AuthService, private userService: UserService) {
    this.authService = authService;
    this.userService = userService;
  }

  ngOnInit() {
    new observer();
    let id = sessionStorage.getItem('UserId');
    if (id != null) {
      this.authService.getFamily(id).subscribe(persons => {
        console.log('Family: ', persons);
        this.familyData = persons;
        const transformedPersons = this.transformPersonsData(persons);
        console.log('Transform : ', transformedPersons);
        this.persons = transformedPersons;

        const tree = document.getElementById('tree');
        if (tree) {
          FamilyTree.SEARCH_PLACEHOLDER = "Find a person..."; // the default value is "Search"
          var family = new FamilyTree(tree, {
            tags: {
              filter: {
                template: 'dot'
              }
            },
            // siblingSeparation: 120,
            // mode: 'dark',
            enableSearch: true,
            // mouseScrool: FamilyTree.action.none,
            nodeMenu: {
              edit: { text: 'Edit' },
              details: { text: 'Details' },
              remove: { text: "Remove" }
            },
            editForm: {
              addMore: '',
              generateElementsFromFields: false,
              // titleBinding: "name",
              // photoBinding: "photo",
              // buttons: {
              //   add: null
              // },
              elements: [
                [
                  { type: 'textbox', label: 'First Name', binding: 'firstname' },
                  { type: 'textbox', label: 'Last Name', binding: 'lastname' }
                ],
                [
                  { type: 'textbox', label: 'Email', binding: 'email', vlidators: { required: 'Is required', email: 'Invalid email' } },
                  { type: 'date', label: 'Birthday Date', binding: 'bdate' }
                ],
                [
                  { type: 'textbox', label: 'Photo Url', binding: 'ImgUrl', btn: 'Upload' }
                ]
              ]
            },
            nodeTreeMenu: true,
            //   nodeBinding: {
            //     cc: 'cc',
            //     address: 'address',
            //     desc: 'desc',
            //     birthDate: 'birthDate',
            //     photo: 'photo',
            //     name: 'name',
            //     img_0: 'photo'
            // },
            // searchFields: ["name", "city", "country"],
            nodeBinding: {
              field_0: "name",
              field_1: "email",
              // field_2: "id",
              img_0: "img",
            }
          });


          family.editUI.on('save', (sender, args) => {
            this.authService.checkPerson(args.data).subscribe(result => {
              let initiator = new Person();
              let user = sessionStorage.getItem('User');
              if (user != null) {
                initiator = JSON.parse(user);
                // console.log(initiator);
                // console.log(args.data);
                this.authService.sendEmail(initiator, args.data).subscribe(response => {
                  console.log(response);
                });
              } else {
                console.log("No user in session storage");
              }
            });
            this.updateData(args.data);
          });

          family.onUpdateNode((args) => {
            console.log(args);
            // this.updateData(args.addNodesData[0]);
            for (let updateNodes of args.updateNodesData) {
              this.updateData(updateNodes);
            }
          });

          family.load(this.familyData);
        }
      });
    }
  }

  transformPersonsData(persons: any[]): any[] {
    try {
      return persons.map((person) => {
        let transformedPerson: { id: number; pids?: number[]; name: string; gender: string; email: string; img: string; mid?: number; fid?: number } = {
          id: person.id,
          name: `${person.firstname} ${person.lastname}`,
          gender: person.gender,
          email: person.email,
          img: 'https://cdn.balkan.app/shared/2.jpg', // Replace with the actual image URL
        };

        // if (person.fid == null) {
        //   // console.log(person.fid);
        //   transformedPerson.fid = person.fid;
        // }
        // if (person.mid == null) {
        //   // console.log(person.fid);
        //   transformedPerson.mid = person.mid;
        // }

        // if (!person.pids == null) {
        //   transformedPerson.pids = person.pids;
        // }

        return transformedPerson;
      });
    } catch (error) {
      console.error('An error occurred:', error);
      return [];
    }
  }


  updateData(personToUpdate: any) {
    this.authService.updateDb(personToUpdate).subscribe(person => {
      console.log('Updated Person:', person);
      console.log('#Done');
    });
  }


  getPersons(): void {
    this.authService.getAllPersons().subscribe(persons => {
      this.persons = persons;
      console.log('Persons:', this.persons);
    });
  }

  getUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      console.log('Users:', this.users);
    });
  }
}
