import { createContext, useState } from "react";

import { ApiProvider } from "./ApiContext";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { HolderProvider } from "./HolderContext";
import { ProductProvider } from "./ProductContext";
import { PurchaseProvider } from "./PurchaseContext";
import { SettingsProvider } from "./SettingsContext";

/** provides Settings */
const FullContext = createContext({
  BottomSearch: false,
  setBottomSearch: (value = true) => {},
});
export default FullContext;
export const FullProvider = ({ children }) => {
  const [BottomSearch, setBottomSearch] = useState(false);

  const data = {
    BottomSearch: BottomSearch,
    setBottomSearch: setBottomSearch,
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
