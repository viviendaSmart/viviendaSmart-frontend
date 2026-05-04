export class Property {
  id?: number;
  address!: string;
  size!: number;
  price!: number;
  photo!: string;
  ownerId!: string;

  constructor(property:{
    id?: number;
    address: string;
    size: number;
    price: number;
    photo: string;
    ownerId: string;}
  ){
    this.id = property.id;
    this.address = property.address || '';
    this.size = property.size || 0;
    this.price = property.price || 0;
    this.photo = property.photo || '';
    this.ownerId = property.ownerId || '';
  }
}
