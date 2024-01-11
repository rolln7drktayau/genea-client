import { Person } from "./person.model";

export class Stats {
  connections: number;
  male: number;
  female: number;
  memories: number;

  constructor(connections: number, male: number, female: number, memories: number) {
    this.connections = connections;
    this.male = male;
    this.female = female;
    this.memories = memories;
  }
}