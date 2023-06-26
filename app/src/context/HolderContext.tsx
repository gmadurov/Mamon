import React, {
  FunctionComponent,
  createContext,
  useContext,
  useState,
} from "react";

import ApiContext from "./ApiContext";
import Holder from "../models/Holder";

export type HolderContextType = {
  holders: Holder[];
  searchHolders: Holder[];
  GET(): Promise<void>;
  POST(holder: Holder): Promise<void>;
  PUT(holder: Holder): Promise<void>;
  DELETE(holder: Holder): Promise<void>;
  SEARCH(search: string): Promise<Holder[]>;
};

const HolderContext = createContext({} as HolderContextType);
export default HolderContext;

type Props = {
  children?: React.ReactNode;
};

export const HolderProvider: FunctionComponent<Props> = ({ children }) => {
  const { ApiRequest } = useContext(ApiContext);
  const [holders, setHolders] = useState<Holder[]>([] as Holder[]);
  const [searchHolders, setSearchHolders] = useState<Holder[]>([] as Holder[]);
  async function GET() {
    setHolders([] as Holder[]);
    const { data } = await ApiRequest<Holder[]>("/api/holders/");
    setHolders(data);
  }
  async function POST(holder: Holder) {
    const { data } = await ApiRequest<Holder>("/api/holders/", {
      method: "POST",
      body: JSON.stringify(holder),
    });
    setHolders(() => [...holders, data]);
  }
  async function SEARCH(search: string) {
    const { data } = await ApiRequest<Holder[]>("/api/holders/", {
      method: "POST", // GET in react.js but not in Native
      body: JSON.stringify(search),
    });
    setSearchHolders(() => data);
    return data;
  }
  async function PUT(holder: Holder) {
    const { data } = await ApiRequest<Holder>(`/api/holders/${holder.id}`, {
      method: "PUT",
      body: JSON.stringify(holder),
    });
    setHolders(() =>
      holders?.map((holder_from_map) =>
        holder.id === holder_from_map.id ? data : holder_from_map
      )
    );
  }
  async function DELETE(holder: Holder) {
    await ApiRequest<Holder>(`/api/holders/${holder.id}`, {
      method: "DELETE",
    });
  }

  const data = {
    holders: holders,
    searchHolders: searchHolders,
    GET: GET,
    POST: POST,
    PUT: PUT,
    DELETE: DELETE,
    SEARCH: SEARCH,
  };
  return (
    <HolderContext.Provider value={data}>{children}</HolderContext.Provider>
  );
};
