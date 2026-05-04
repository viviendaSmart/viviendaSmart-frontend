export class Client{
  id?:number;
  dni!: string;
  monthlyIncome!: number;
  ocupation!: string;
  name!: string;
  surname!: string;
  business!: boolean;
  earningtype!: string;
  credithistory!: boolean;
  support!: boolean;
  address!: string;
  maritalStatus!: string;
  phoneNumber!: string;
  userId!: string;

  constructor(client:{
    id?:number;
    dni: string;
    monthlyIncome: number;
    ocupation: string;
    name: string;
    surname: string;
    business: boolean;
    earningtype: string;
    credithistory: boolean;
    support: boolean;
    address: string;
    maritalStatus: string;
    phoneNumber: string;
    userId: string;
  }
  ) {
    this.id = client.id;
    this.dni = client.dni;
    this.monthlyIncome = client.monthlyIncome;
    this.ocupation = client.ocupation;
    this.name = client.name;
    this.surname = client.surname;
    this.business = client.business;
    this.earningtype = client.earningtype;
    this.credithistory = client.credithistory;
    this.support = client.support;
    this.address = client.address;
    this.maritalStatus = client.maritalStatus;
    this.phoneNumber = client.phoneNumber;
    this.userId = client.userId;
  }


}
