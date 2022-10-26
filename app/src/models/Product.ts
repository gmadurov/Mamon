export default interface Product {
  id: number;
  name: string;
  price: number;
  color: Color;
  image: null | string;
}

export enum Color {
  Ca9Aff = "#CA9AFF",
  Ff621B = "#FF621B",
  Ff9137 = "#FF9137",
  Ffffff = "#FFFFFF",
}
