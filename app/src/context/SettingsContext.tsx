import React, { createContext, useContext, useEffect, useState } from "react";

import ApiContext from "./ApiContext";
import Category from "../models/Category";

/** provides Settings */
interface SettingsContextType {
  categories: Category[];
  GET_categories: () => Promise<void>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category[]>>;
  selectedCategory: Category[];
}
const SettingsContext = createContext({} as SettingsContextType);
export default SettingsContext;

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { users, ApiRequest } = useContext(ApiContext);

  const [categories, setCategories] = useState<Category[]>([] as Category[]);
  const [selectedCategory, setSelectedCategory] = useState([] as Category[]);
  async function GET_categories() {
    setCategories([]);
    const { data } = await ApiRequest<Category[]>("/api/category/");
    setCategories(() => data);
  }
  useEffect(() => {
    async function get() {
      await GET_categories();
    }
    if (users.length > 0) {
      get();
    }
    // eslint-disable-next-line
  }, [users]);

  const data = {
    categories: categories,
    GET_categories: GET_categories,
    setSelectedCategory: setSelectedCategory,
    selectedCategory: selectedCategory,
  };
  return (
    <SettingsContext.Provider value={data}>{children}</SettingsContext.Provider>
  );
};
