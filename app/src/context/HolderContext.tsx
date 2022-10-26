import React, {
  createContext,
  useContext,
  useState,
  FunctionComponent,
} from "react";

import ApiContext from "./ApiContext";
import Holder from "../models/Holder";

export type HolderContextType = {
  holders: Array<Holder>;
  holder: Holder;
  searchHolders: Array<Holder>;
  GET: () => Promise<void>;
  POST: (holder: Holder) => Promise<void>;
  PUT: (holder: Holder) => Promise<void>;
  DELETE: (holder: Holder) => Promise<void>;
  SEARCH: (holder: Holder) => Promise<void>;
};

const HolderContext = createContext({
  holders: [] as Holder[],
  holder: {} as Holder,
  searchHolders: Array<Holder>,
  GET: async () => {},
  POST: async (_holder: Holder) => {},
  PUT: async (_holder: Holder) => {},
  DELETE: async (_holder: Holder) => {},
  SEARCH: async (_holder: Holder) => {},
});
export default HolderContext;

type Props = {
  children?: React.ReactNode;
};

export const HolderProvider: FunctionComponent<Props> = ({ children }) => {
  const { user, ApiRequest } = useContext(ApiContext);
  const [holders, setHolders] = useState<Holder[]>([] as Holder[]);
  const [searchHolders, setSearchHolders] = useState<Holder[]>([] as Holder[]);
  async function GET() {
    setHolders([]);
    const { data } = await ApiRequest("/api/holder/");
    setHolders(() => data);
  }
  async function POST(holder: Holder) {
    const { data }: { data: Holder } = await ApiRequest("/api/holder/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(holder),
    });

    setHolders(() => [...holders, data]);
  }
  async function SEARCH(holder: Holder) {
    const { data } = await ApiRequest("/api/holder/", {
      method: "POST", // GET in react.js but not in Native
      // TypeError: Body not allowed for GET or HEAD requests]
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(holder),
    });

    setSearchHolders(() => data);
    return data;
  }
  async function PUT(holder: Holder) {
    const { data }: { data: Holder } = await ApiRequest(
      `/api/holder/${holder.id}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(holder),
      }
    );

    setHolders(() =>
      holders?.map((holder_from_map) =>
        holder.id === holder_from_map.id ? data : holder_from_map
      )
    );
  }
  async function DELETE(holder: Holder) {
    await ApiRequest(`/api/holder/${holder.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
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
