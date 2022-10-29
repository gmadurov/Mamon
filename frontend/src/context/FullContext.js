import { ApiProvider } from "./ApiContext";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { HolderProvider } from "./HolderContext";
import { ProductProvider } from "./ProductContext";
import { PurchaseProvider } from "./PurchaseContext";
import { createContext }  from "react";

const FullContext = createContext();
export default FullContext;

export const FullProvider = ({ children }) => {
  const data = {};
  return (
    <FullContext.Provider value={data}>
      <AuthProvider>
        <ApiProvider>
          <HolderProvider>
            <ProductProvider>
              <PurchaseProvider>
                <CartProvider>{children}</CartProvider>
              </PurchaseProvider>
            </ProductProvider>
          </HolderProvider>
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
