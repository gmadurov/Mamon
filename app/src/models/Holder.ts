import User from "./Users";

export default interface Holder {
  id: number;
  user: User;
  name: string;
  stand: number;
  ledenbase_id: number;
  image: string;
  image_ledenbase: string;
}
