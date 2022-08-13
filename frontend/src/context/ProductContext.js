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
const ProductContext = createContext();
export default ProductContext;

export const ProductProvider = ({ children }) => {
  const { ApiRequest } = useContext(ApiContext);
  const [products, setProducts] = useState([]);
  async function GET() {
    setProducts([]);
    const {res, data} = await ApiRequest("/api/product/");
    setProducts(data);
  }
  async function POST(product) {
    const {res, data} = await ApiRequest("/api/product/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(product),
    });
    setProducts([...products, data]);
  }
  async function PUT(product) {
    const {res, data} = await ApiRequest(`/api/product/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(product),
    });
    setProducts(
      products.map((product_from_map) =>
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
  }

  useEffect(() => {
    async function get() {
      await GET();
    }
    get();
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
