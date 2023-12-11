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

export interface Question {
  id: string;
  question: string;
  answer: string;
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

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  emailAddress: string;
  phone: string;
  personalAddressLine1: string;
  personalAddressLine2: string;
  personalAddressCity: string;
  personalAddressSuburb: string;
}

export interface Quote {
  id: string;
  isPaid: boolean;
  eventDate: Date;
  customer: Customer;
  totalPrice: number;
  deliveryAddressLine1: string;
  deliveryAddressLine2: string;
  deliveryAddressCity: string;
  deliveryAddressSuburb: string;
  deliveryPhoneNumber: string;
  thirdPartyAddressLine1: string;
  thirdPartyAddressLine2: string;
  thirdPartyAddressCity: string;
  thirdPartyAddressSuburb: string;
  thirdPartyContactPerson: string;
  thirdPartyPhoneNumber: string;
  confirmationPayment: boolean;
  confirmationTerms: boolean;
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
