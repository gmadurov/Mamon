import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import ApiContext from "../context/ApiContext";

const HolderContext = createContext();
export default HolderContext;

export const HolderProvider = ({ children }) => {
  const { ApiRequest } = useContext(ApiContext);
  const [holders, setHolders] = useState([]);
  const [searchHolders, setSearchHolders] = useState([]);
  async function GET() {
    setHolders([]);
    const {res,data} = await ApiRequest("/api/holder/");
    setHolders(data);
  }
  async function POST(holder) {
    const {res, data} = await ApiRequest("/api/holder/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(holder),
    });
    setHolders([...holders, data]);
  }
  async function SEARCH(holder) {
    const {res, data} = await ApiRequest("/api/holder/", {
      method: "GET",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(holder),
    });
    setSearchHolders(data);
  }
  async function PUT(holder) {
    const {res,data} = await ApiRequest(`/api/holder/${holder.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(holder),
    });
    setHolders(
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

    return () => {};
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
