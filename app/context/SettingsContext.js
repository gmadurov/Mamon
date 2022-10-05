import { createContext, useContext, useEffect, useState } from "react";
import ApiContext from "./ApiContext";
/** provides Settings */
const SettingsContext = createContext({
  categories: [
    {
      id: 0,
      name: "",
      description: "",
      products: [0],
    },
  ],
  GET_categories: async () => {},
  selectedCategory: [0],
  setSelectedCategory: () => {},
});
export default SettingsContext;

export const SettingsProvider = ({ children }) => {
  const { user, ApiRequest } = useContext(ApiContext);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  async function GET_categories() {
    setCategories([]);
    const { data } = await ApiRequest("/api/category/");
    setCategories(() => data);
  }
  useEffect(() => {
    async function get() {
      await GET_categories();
    }
    if (user) {
      get();
    }
    // eslint-disable-next-line
  }, [user]);
  
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
