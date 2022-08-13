import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import ApiContext from "../context/ApiContext";

const HolderContext = createContext({
  holders: [],
  searchHolders: [],
  GET: async () => {},
  POST: async (holder) => {},
  PUT: async (holder) => {},
  DELETE: async (holder) => {},
  SEARCH: async (holder) => {},
});
export default HolderContext;

export const HolderProvider = ({ children }) => {
  const { ApiRequest } = useContext(ApiContext);
  const [holders, setHolders] = useState([]);
  const [searchHolders, setSearchHolders] = useState([]);
  async function GET() {
    setHolders([]);
    const { data } = await ApiRequest("/api/holder/");
    setHolders(() => data);
  }
  async function POST(holder) {
    const { data } = await ApiRequest("/api/holder/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(holder),
    });

    setHolders(() => [...holders, data]);
  }
  async function SEARCH(holder) {
    const { data } = await ApiRequest("/api/holder/", {
      method: "POST", // GET in react.js but not in Native
      // TypeError: Body not allowed for GET or HEAD requests]
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(holder),
    });

    setSearchHolders(() => data);
    return data;
  }
  async function PUT(holder) {
    const { data } = await ApiRequest(`/api/holder/${holder.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(holder),
    });

    setHolders(() =>
      holders.map((holder_from_map) =>
        holder.id === holder_from_map.id ? data : holder_from_map
      )
    );
  }
  async function DELETE(holder) {
    await ApiRequest(`/api/holder/${holder.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
  }

  useEffect(() => {
    async function get() {
      await GET();
    }
    get();
    // eslint-disable-next-line
  }, []);

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
