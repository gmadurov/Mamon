import Product from "./Product";

export default interface Category {
  id: number;
  name: string;
  description: string;
  products: Product[];
}
