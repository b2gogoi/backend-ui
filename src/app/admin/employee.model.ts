export class Employee {
  id: number;
  username: string;
  role: string;
  roleId: number;
  password: string;

  constructor(id: number, username: string, role: string) {
    this.id = id;
    this.username = username;
    this.role = role;
  }

}
