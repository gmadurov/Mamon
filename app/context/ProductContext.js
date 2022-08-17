import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import ApiContext from "../context/ApiContext";

/**
 *     products: products,
 * 
    GET: GET,

    POST: POST,

    PUT: PUT,
    
    DELETE: DELETE,
 */
const ProductContext = createContext({
  products: [],
  GET: async (product) => {},
  POST: async (product) => {},
  PUT: async (product) => {},
  DELETE: async (product) => {},
});
export default ProductContext;

export const ProductProvider = ({ children }) => {
  const { ApiRequest } = useContext(ApiContext);
  const [products, setProducts] = useState([]);
  async function GET() {
    setProducts([]);
    ApiRequest("/api/product/")
      .then(({ data }) => setProducts(data))
      .catch(({ res }) => console.warn('Error with the Product request', res));
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

  useEffect(() => {
    async function get() {
      await GET();
    }
    get();
    // eslint-disable-next-line
  }, []);
  const data = {
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
