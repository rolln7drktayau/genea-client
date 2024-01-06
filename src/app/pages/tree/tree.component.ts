import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../../services/user/user.service';
// import { Person } from './models/person.model';
import { User } from '../../models/user.model';
import FamilyTree from '@balkangraph/familytree.js';
import { AuthService } from '../../services/auth/auth.service';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person/person.service';

declare var observer: any;

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, ReactiveFormsModule, NavbarComponent],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent implements OnInit {

  person: Person = new Person();
  persons: any[] = [];
  familyData: any[] = [];

  constructor(private authService: AuthService, private personService: PersonService) {
    this.authService = authService;
    this.personService = personService;
  }

  ngOnInit() {
    new observer();
    let id = sessionStorage.getItem('UserId');
    if (id != null) {
      this.authService.getFamily(id).subscribe(persons => {
        console.log('Your Family', persons);
        this.familyData = persons;
        const transformedPersons = this.transformPersonsData(persons);
        console.log('Transformed Data', transformedPersons);
        this.persons = transformedPersons;

        const tree = document.getElementById('tree');
        if (tree) {
          FamilyTree.SEARCH_PLACEHOLDER = "Get focused on a person..."; // the default value is "Search"
          var family = new FamilyTree(tree, {
            // template : 'hugo',
            enableSearch: true,
            nodeMenu: {
              edit: { text: 'Edit' },
              details: { text: 'Details' },
              remove: { text: 'Delete' }
            },
            editForm: {
              addMore: '',
              generateElementsFromFields: false,
              // titleBinding: "name",
              photoBinding: "photo",
              buttons: {
                remove: {
                  icon: FamilyTree.icon.remove(24, 24, '#fff'),
                  text: 'Delete',
                  hideIfEditMode: true,
                  hideIfDetailsMode: false
                }
              },
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
                  { type: 'textbox', label: 'Gender', binding: 'gender'},
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
              // field_2: "father",
              // field_3: "mid",
              img_0: "img",
            },
            menu: {
              pdf: { text: "Export PDF" },
              png: { text: "Export PNG" },
              svg: { text: "Export SVG" },
              csv: { text: "Export CSV" }
            },
          });

          family.editUI.on('save', (sender, args) => {
            this.authService.getPersonByEmail(args.data).subscribe(isPresent => {
              if (isPresent) {
                console.warn('Founded person :', isPresent);
                let toUpdate = this.updatePerson(isPresent, args.data);
                this.updateData(toUpdate);
              } else {
                this.mailHandler(args.data);
              }
            });
          });

          family.on('update', (sender, args) => {
            if (!(args.removeNodeId == null) && !(args.removeNodeId == undefined)) {
              // let toRemove: string = `"${args.removeNodeId}"`;
              // console.log(toRemove);
              this.authService.getPersonById(args.removeNodeId).subscribe(result => {
                if (result) {
                  if (result.email !== null && result.email !== undefined) {
                    console.log('Person To Remove : ', result);
                    let toUpdate = this.removePersonFromTree(result, args.removeNodeId);
                    this.updateData(toUpdate);
                  }
                  else {
                    this.authService.deletePerson(result.id).subscribe(isDeleted => {
                      console.log('Person Deleted : ', isDeleted);
                    });
                  }
                }
              });
            }
          });

          family.load(this.persons);
          // family.load(this.familyData);
        }
      });
    }
  }

  transformPersonsData(persons: any[]): any[] {
    try {
      return persons.map((person) => {
        let transformedPerson: { id: number; pids?: number[]; firstname: string; lastname: string; name: string; gender: string; email: string; img: string; mid?: number; fid?: number, password?: string } = {
          id: person.id,
          firstname: person.firstname,
          lastname: person.lastname,
          name: `${person.firstname} ${person.lastname}`,
          mid: person.mid,
          fid: person.fid,
          pids: person.pids,
          gender: person.gender,
          email: person.email,
          img: person.img, // Replace with the actual image URL
          password: person.password
        };
        return transformedPerson;
      });
    } catch (error) {
      console.error('An error occurred:', error);
      return [];
    }
  }

  mailHandler (recipient: Person) {
    let initiator = new Person();
    let user = sessionStorage.getItem('User');
    if (user != null) {
      initiator = JSON.parse(user);
      // console.log(initiator);
      // console.log(args.data);
      this.authService.sendEmail(initiator, recipient).subscribe(response => {
        console.log('Mail : ', response);
      });
    } else {
      console.log("No user in session storage");
    }
    this.authService.createPerson(recipient).subscribe(response => { });
  }

  updateData(personToUpdate: any) {
    this.authService.updateDb(personToUpdate).subscribe(person => {
      console.log('Updated Person:', person);
      console.log('The person was updated');
    });
  }

  updatePerson(existingPerson: any, newPerson: any): any {
    let idtodelete = existingPerson.id;

    existingPerson.id = newPerson.id;
    existingPerson.name = newPerson.name;
    newPerson.pids.forEach((element: any) => {
      existingPerson.pids.push(element);
    });
    existingPerson.mid = newPerson.mid;
    existingPerson.fid = newPerson.fid;
    existingPerson.bdate = newPerson.bdate;

    this.authService.deletePerson(idtodelete).subscribe(isDeleted => {
      if (isDeleted) {
        console.log('User deleted !');
      }
    });

    return existingPerson;
  }

  removePersonFromTree(person : any, nodeId : string) : any {
    person.mid = '';
    person.fid = '';
    this.persons.forEach(person => {
      if (person.pid)
        person.pid = person.pid.filter((id: string) => id !== nodeId);
    });
  }

  getPersons(): void {
    this.authService.getAllPersons().subscribe(persons => {
      this.persons = persons;
      console.log('Persons:', this.persons);
    });
  }
}
