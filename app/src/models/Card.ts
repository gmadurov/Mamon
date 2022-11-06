import Holder from "./Holder";

export interface Card {
    id:        number;
    holder:    Holder;
    card_id?:   string;
    card_name?: string;
}
