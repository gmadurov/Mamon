import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import ApiContext from "./ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Category from "../models/Category";

/** provides Settings */
interface SettingsContextType {
  categories: Category[];
  GET_categories: () => Promise<void>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category[]>>;
  selectedCategory: Category[];
  sideBySide: boolean;
  setSideBySide: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [selectedCategory, setSelectedCategory] = useState<Category[]>(
    [] as Category[]
  );
  const [sideBySide, setSideBySide] = useState<boolean>(true);

  async function GET_categories() {
    setCategories([] as Category[]);
    const { data } = await ApiRequest<Category[]>("/api/category/");
    setCategories(data as Category[]);
    // update selected categories
    setSelectedCategory(
      selectedCategory.map(
        (category) => data.find((c) => c.id === category.id) || ({} as Category)
      )
    );
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
  useLayoutEffect(() => {
    async function get() {
      const sideBySideLocal = await AsyncStorage.getItem("sideBySide");
      if (sideBySideLocal) {
        setSideBySide(sideBySideLocal === "true");
      } else {
        setSideBySide(true);
      }
    }
    get();
  }, []);
  useEffect(() => {
    async function set() {
      await AsyncStorage.setItem("sideBySide", sideBySide.toString());
    }
    set();
  }, [sideBySide]);
  const data = {
    categories: categories,
    GET_categories: GET_categories,
    setSelectedCategory: setSelectedCategory,
    selectedCategory: selectedCategory,
    sideBySide: sideBySide,
    setSideBySide: setSideBySide,
  };
  return (
    <SettingsContext.Provider value={data}>{children}</SettingsContext.Provider>
  );
};
