import User from "./Users";

export default interface Holder {
  id: number;
  user: User;
  name: string;
  image: string;
  stand: number;
  ledenbase_id: number;
}
