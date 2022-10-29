import React, { createContext, useState } from "react";

import { ApiProvider } from "./ApiContext";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { HolderProvider } from "./HolderContext";
import { ProductProvider } from "./ProductContext";
import { PurchaseProvider } from "./PurchaseContext";
import { SettingsProvider } from "./SettingsContext";

// create type context

type FullContextType = {
  BottomSearch: boolean;
  setBottomSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

/** provides Settings */
const FullContext = createContext<FullContextType>({} as FullContextType);
export default FullContext;
export const FullProvider = ({ children }: { children: React.ReactNode }) => {
  const [BottomSearch, setBottomSearch] = useState<boolean>(false);

  const data = {
    BottomSearch,
    setBottomSearch,
  };
  return (
    <FullContext.Provider value={data}>
      <AuthProvider>
        <ApiProvider>
          <SettingsProvider>
            <HolderProvider>
              <ProductProvider>
                <PurchaseProvider>
                  <CartProvider>{children}</CartProvider>
                </PurchaseProvider>
              </ProductProvider>
            </HolderProvider>
          </SettingsProvider>
        </ApiProvider>
        {/* ApiRequest: ApiRequest,
            ApiFileRequest: ApiFileRequest, */}
      </AuthProvider>
      {/* loginFunc: loginFunc,
          logoutFunc: logOutUser,
          setAuthTokens: setAuthTokens,
          setUser: setUser,
          user: user,
          authTokens: authTokens, */}
    </FullContext.Provider>
  );
};
