import { createContext, useEffect, useState } from "react";

import ApiContext from "./ApiContext";
import SettingsContext from "./SettingsContext";
import { showMessage } from "react-native-flash-message";
import { useContext } from "react";

/**
 *     products: products,
 * 
    GET: GET, 

    POST: POST,

    PUT: PUT,
    
    DELETE: DELETE,
 */
const ProductContext = createContext({
  products: [{ id: 0, name: "", price: "", color: "", image_url: "" }],
  selectedProducts: [{ id: 0, name: "", price: "", color: "", image_url: "" }],
  GET: async () => {},
  POST: async (product) => {},
  PUT: async (product) => {},
  DELETE: async (product) => {},
});
export default ProductContext;

export const ProductProvider = ({ children }) => {
  const { user, ApiRequest } = useContext(ApiContext);
  const { categories, selectedCategory } = useContext(SettingsContext);
  const [products, setProducts] = useState([]);

  async function GET() {
    setProducts([]);
    const { res, data } = await ApiRequest("/api/product/");
    setProducts(() => data);
  }
  async function POST(product) {
    const { data } = await ApiRequest("/api/product/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(product),
    });
    setProducts(() => [...products, data]);
  }
  async function PUT(product) {
    const { data } = await ApiRequest(`/api/product/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(product),
    });
    setProducts(() =>
      products?.map((product_from_map) =>
        product.id === product_from_map.id ? data : product_from_map
      )
    );
    showMessage({
      message: `Product aangepast`,
      description: `naar ${data.name} €${data.price}`,
      type: "info",
      floating: true,
      hideStatusBar: true,
      autoHide: true,
      duration: 1500,
    });
  }
  async function DELETE(product) {
    await ApiRequest(`/api/product/${product.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
    setProducts(() =>
      products?.map(
        (product_from_map) =>
          product.id !== product_from_map.id && product_from_map
      )
    );
  }
  // console.log(products);
  useEffect(() => {
    async function get() {
      await GET();
    }
    if (user) {
      get();
    }

    // eslint-disable-next-line
  }, [user]);
  let selectedProducts =
    selectedCategory.length > 0
      ? categories
          .filter((cat) => selectedCategory.includes(cat.id))
          .map((cat) =>
            cat.products.map((product) =>
              products?.find((prod) => prod.id === product)
            )
          )
          .flat()
      : products;

  const data = {
    selectedProducts: selectedProducts,
    products: products,
    GET: GET,
    POST: POST,
    PUT: PUT,
    DELETE: DELETE,
  };
  return (
    <ProductContext.Provider value={data}>{children}</ProductContext.Provider>
  );
};
