export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  billboard: Billboard;
}

export interface Product {
  id: string;
  name: string;
  colour: string;
  qty: string;
  unitPrice: number;
  totalPrice: number;

  // image: string
}

export interface Quote {
  id: string;
  Name: string;
  isPaid: boolean;
  phone: string;
  address: string;
  totalPrice: number;
}

export interface Image {
  id: string;
  url: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface Colour {
  id: string;
  name: string;
  value: string;
}
