export class Property {
  address!: string;
  size!: number;
  price!: number;
  photo!: string;
  ownerId!: string;

  constructor(property:{
    address: string;
    size: number;
    price: number;
    photo: string;
    ownerId: string;}
  ){
    this.address = property.address || '';
    this.size = property.size || 0;
    this.price = property.price || 0;
    this.photo = property.photo || '';
    this.ownerId = property.ownerId || '';
  }
}
