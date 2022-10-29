import Product from "./Product";

export default interface Category {
  id: number;
  products: Product[];
  name: string;
  description: string;
}
