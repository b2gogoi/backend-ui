export class User {
  id: number;
  firstName: string;
  mobileNumber: string;
  city: string;
  lang: string;
  created: number;

  constructor(id: number, firstName: string, mobileNumber: string,
              city: string, lang: string, created: number) {
    this.id = id;
    this.firstName = firstName;
    this.mobileNumber = mobileNumber;
    this.city = city;
    this.lang = lang;
    this.created = created;
  }

}
