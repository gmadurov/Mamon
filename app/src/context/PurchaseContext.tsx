import React, { createContext, useEffect, useState } from "react";

import ApiContext from "./ApiContext";
import Purchase from "../models/Purchase";
import { showMessage } from "react-native-flash-message";
import { useContext } from "react";

export type PurchaseContextType = {
  purchases: Array<Purchase>;
  GET: () => Promise<void>;
  POST: (purchase: Purchase) => Promise<void>;
  PUT: (purchase: Purchase) => Promise<void>;
  DELETE: (purchase: Purchase) => Promise<void>;
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
    const { data }: { data: Purchase[] } = await ApiRequest<Purchase[]>(
      "/api/purchase/"
    );
    setPurchases(data);
  }
  async function POST(purchase: Purchase) {
    const { res, data }: { res: Response; data: Purchase } =
      await ApiRequest<Purchase>("/api/purchase/", {
        method: "POST",
        body: JSON.stringify(purchase),
      });
    if (res?.status === 201 || res?.status === 200) {
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
    } else {
      showMessage({
        message: `Purchase was Unsuccessful`,
        description: ``,
        type: "danger",
        floating: true,
        hideStatusBar: true,
        autoHide: true,
        duration: 500,
        position: "bottom",
      });
    }
  }
  async function PUT(purchase: Purchase) {
    const { data } = await ApiRequest<Purchase>(
      `/api/purchase/${purchase.id}`,
      {
        method: "PUT",
        "Content-Type": "application/json",
        body: JSON.stringify(purchase),
      }
    );
    setPurchases(
      purchases.map((purchase_from_map) =>
        purchase.id === purchase_from_map.id ? data : purchase_from_map
      )
    );
  }
  async function DELETE(purchase: Purchase) {
    await ApiRequest<Purchase>(`/api/purchase/${purchase.id}`, {
      method: "DELETE",
    });
  }

  useEffect(() => {
    async function get() {
      await GET();
    }
    if (user?.token_type) {
      get();
    }

    // eslint-disable-next-line
  }, [user]);
  const data = {
    purchases,
    GET,
    POST,
    PUT,
    DELETE,
  };
  return (
    <PurchaseContext.Provider value={data}>{children}</PurchaseContext.Provider>
  );
};
