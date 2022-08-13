import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import ApiContext from "../context/ApiContext";
/**purchases: purchases,
 * 
    GET: GET,

    POST: POST,

    PUT: PUT,

    DELETE: DELETE */
const PurchaseContext = createContext({
  purchases: [],
  GET: async (purchase) => {},
  POST: async (purchase) => {},
  PUT: async (purchase) => {},
  DELETE: async (purchase) => {},
});
export default PurchaseContext;

export const PurchaseProvider = ({ children }) => {
  const { ApiRequest } = useContext(ApiContext);
  const [purchases, setPurchases] = useState([]);
  async function GET() {
    setPurchases([]);
    const { data } = await ApiRequest("/api/purchase/");
    setPurchases(data);
  }
  async function POST(purchase) {
    const { res, data } = await ApiRequest("/api/purchase/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(purchase),
    });
    setPurchases([...purchases, data]);
  }
  async function PUT(purchase) {
    const { data } = await ApiRequest(`/api/purchase/${purchase.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(purchase),
    });
    setPurchases(
      purchases.map((purchase_from_map) =>
        purchase.id === purchase_from_map.id ? data : purchase_from_map
      )
    );
  }
  async function DELETE(purchase) {
    await ApiRequest(`/api/purchase/${purchase.id}`, {
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
  }, []);
  const data = {
    purchases: purchases,
    GET: GET,
    POST: POST,
    PUT: PUT,
    DELETE: DELETE,
  };
  return (
    <PurchaseContext.Provider value={data}>{children}</PurchaseContext.Provider>
  );
};
