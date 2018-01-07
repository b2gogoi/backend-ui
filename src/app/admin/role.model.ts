export class Role {
  id: number;
  role: string;
  description: string;
  createdTime: number;
  updatedTime: number;

  constructor(id: number, role: string, description: string,
              createdTime: number, updatedTime: number) {

    this.id = id;
    this.role = role;
    this.description = description;
    this.createdTime = createdTime;
    this.updatedTime = updatedTime;

  }
}
