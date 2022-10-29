import { User } from "./Users";

export interface AuthToken {
  non_field_errors?: string;
  message?: string;
  refresh?: string | User;
  access?: string;
}
