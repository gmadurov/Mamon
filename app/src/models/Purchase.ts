export interface Purchase {
  id: number;
  orders: Order[];
  payed: boolean;
  created: Date;
  remaining_after_purchase: number;
  buyer: number;
}

export interface Order {
  id: number;
  quantity: number;
  product: number;
}
