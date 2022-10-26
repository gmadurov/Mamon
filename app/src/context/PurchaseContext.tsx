import { createContext, useEffect, useState } from "react";

import ApiContext from "./ApiContext";
import { Purchase } from "../models/Purchase";
import { showMessage } from "react-native-flash-message";
import { useContext } from "react";

export type PurchaseContextType = {
  purchases: Array<Purchase>;
  purchase: Purchase;
  searchHolders: Array<Purchase>;
  GET: () => Promise<void>;
  POST: (purchase: Purchase) => Promise<void>;
  PUT: (purchase: Purchase) => Promise<void>;
  DELETE: (purchase: Purchase) => Promise<void>;
  SEARCH: (purchase: Purchase) => Promise<void>;
};

const PurchaseContext = createContext<PurchaseContextType>(
  {} as PurchaseContextType
);

export default PurchaseContext;

export const PurchaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, ApiRequest } = useContext(ApiContext);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  async function GET() {
    setPurchases([]);
    // ApiRequest("/api/purchase/")
    //   .then(({ data }) => setPurchases(data))
    //   .catch(({ res }) => console.warn("Error with the Purchase request", res));

    const { data }: { data: Purchase[] } = await ApiRequest("/api/purchase/");
    setPurchases(data);
  }
  async function POST(purchase: Purchase) {
    const { data }: { data: Purchase[] } = await ApiRequest("/api/purchase/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(purchase),
    });
    showMessage({
      message: `Purchase was successful`,
      description: ``,
      type: "success",
      floating: true,
      hideStatusBar: true,
      autoHide: true,
      duration: 500,
      position: "bottom",
    });
    setPurchases(() => [...purchases, data]);
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
    if (user) {
      get();
    }

    // eslint-disable-next-line
  }, [user]);
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
