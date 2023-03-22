import React, { createContext, useState } from "react";

import { ApiProvider } from "./ApiContext";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { HolderProvider } from "./HolderContext";
import { NFCProvider } from "./NFCContext";
import { ProductProvider } from "./ProductContext";
import { PurchaseProvider } from "./PurchaseContext";
import { SettingsProvider } from "./SettingsContext";

// create type context

type FullContextType = {
  BottomSearch: boolean;
  setBottomSearch: React.Dispatch<React.SetStateAction<boolean>>;
  enableBottomSearch: boolean;
  setEnableBottomSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cashBottomSheet: boolean;
  setCashBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
  choosePage: boolean;
};

/** provides Settings */
const FullContext = createContext<FullContextType>({} as FullContextType);
export default FullContext;
export const FullProvider = ({ children }: { children: React.ReactNode }) => {
  const [BottomSearch, setBottomSearch] = useState<boolean>(false);
  const [cashBottomSheet, setCashBottomSheet] = useState<boolean>(false);
  const [enableBottomSearch, setEnableBottomSearch] = useState<boolean>(false);
  const [choosePage, setChoosePage] = useState(false);
  const data = {
    BottomSearch,
    setBottomSearch,
    enableBottomSearch,
    setEnableBottomSearch,
    choosePage,
    cashBottomSheet, setCashBottomSheet
  };
  return (
    <FullContext.Provider value={data}>
      <AuthProvider>
        <ApiProvider>
          <SettingsProvider>
            <NFCProvider>
              <HolderProvider>
                <ProductProvider>
                  <PurchaseProvider>
                    <CartProvider>{children}</CartProvider>
                  </PurchaseProvider>
                </ProductProvider>
              </HolderProvider>
            </NFCProvider>
          </SettingsProvider>
        </ApiProvider>
      </AuthProvider>
    </FullContext.Provider>
  );
};
