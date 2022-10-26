import { UserToken } from "./Users";

export interface AuthToken {
  refresh: string | UserToken;
  access: string;
}
