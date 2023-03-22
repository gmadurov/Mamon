import Holder from "./Holder";
import User from "./Users";

export interface Card {
    id:        number;
    user:    User;
    card_id?:   string;
    card_name?: string;
}
