export class User {
  id: number;
  firstName: string;
  password: string;
  lastName: string;
  email: string;

  constructor(user: {
    id?: number;
    firstName?: string;
    password?: string;
    lastName?: string;
    email?: string;
  }) {
    this.id = user.id || 0;
    this.firstName = user.firstName || '';
    this.password = user.password  ||'';
    this.lastName = user.lastName || '';
    this.email = user.email || '';
  }
}
