import React, { createContext, useEffect, useState } from "react";

import ApiContext from "./ApiContext";
import Product from "../models/Product";
import SettingsContext from "./SettingsContext";
import { showMessage } from "react-native-flash-message";
import { useContext } from "react";

interface ProductContextType {
  selectedProducts: Product[];
  products: Product[];
  GET: () => Promise<void>;
  POST: (product: Product) => Promise<void>;
  PUT: (product: Product) => Promise<void>;
  DELETE: (product: Product) => Promise<void>;
}
const ProductContext = createContext({} as ProductContextType);
export default ProductContext;

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, ApiRequest } = useContext(ApiContext);
  const { categories, selectedCategory } = useContext(SettingsContext);
  const [products, setProducts] = useState<Product[]>([] as Product[]);

  async function GET() {
    setProducts([]);
    const { data } = await ApiRequest<Product[]>("/api/product/");
    setProducts(data);
  }
  async function POST(product: Product) {
    const { data } = await ApiRequest<Product>("/api/product/", {
      method: "POST",
      body: JSON.stringify(product),
    });
    setProducts(() => [...products, data]);
  }
  async function PUT(product: Product) {
    const { data } = await ApiRequest<Product>(`/api/product/${product.id}`, {
      method: "PUT",
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
  async function DELETE(product: Product) {
    await ApiRequest<Product>(`/api/product/${product.id}`, {
      method: "DELETE",
    });
    setProducts(() =>
      products?.filter(
        (product_from_map) =>
          product.id !== product_from_map.id && product_from_map
      )
    );
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
  let selectedProducts = products.filter((product) =>
    selectedCategory.some((category) => category.id === product.id)
  );
  // selectedCategory.length > 0
  //   ? categories
  //       .filter((cat) => selectedCategory.includes(cat.id))
  //       .map((cat) =>
  //         cat.products.map((product) =>
  //           products?.find((prod) => prod.id === product.id)
  //         )
  //       )
  //       .flat()
  // : products;
  // make selectedProducts a list of all the products  which are in the selected categories
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
