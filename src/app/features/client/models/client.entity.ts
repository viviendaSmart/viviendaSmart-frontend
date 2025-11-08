export class Client{
  dni!: string;

  monthlyIncome!: number;

  address!: string;

  maritalStatus!: string;

  phoneNumber!: string;

  userId!: string;

  constructor(client:{
    dni: string;
    monthlyIncome: number;
    address: string;
    maritalStatus: string;
    phoneNumber: string;
    userId: string;
  }
  ) {
    this.dni = client.dni;
    this.monthlyIncome = client.monthlyIncome;
    this.address = client.address;
    this.maritalStatus = client.maritalStatus;
    this.phoneNumber = client.phoneNumber;
    this.userId = client.userId;
  }


}
