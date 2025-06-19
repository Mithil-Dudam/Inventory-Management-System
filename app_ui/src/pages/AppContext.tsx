import { createContext, useContext, useState } from "react";

interface CategoryType {
  name: string;
  parent: string;
  id: number;
}

interface ProductType {
  name: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
  id: number;
  category_id: number;
}

interface AppContextType {
  error: string | null;
  setError: (error: string | null) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  role: string;
  setRole: (role: string) => void;
  userId: number;
  setUserId: (id: number) => void;
  userChoice: string;
  setUserChoice: (choice: string) => void;
  isLoggedIn: Boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  flag: number;
  setFlag: (flag: number) => void;
  categories: CategoryType[] | null;
  setCategories: (categories: CategoryType[] | null) => void;
  products: ProductType[] | null;
  setProducts: (products: ProductType[] | null) => void;
  editFlag: number;
  setEditFlag: (flag: number) => void;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  categoryID: number;
  setCategoryID: (categoryID: number) => void;
  price: number;
  setPrice: (price: number) => void;
  imageURL: string;
  setImageURL: (imageURL: string) => void;
  search: string;
  setSearch: (search: string) => void;
  id: number;
  setId: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState(0);
  const [userChoice, setUserChoice] = useState("");
  const [categories, setCategories] = useState<CategoryType[] | null>(null);
  const [products, setProducts] = useState<ProductType[] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [flag, setFlag] = useState(0);
  const [editFlag, setEditFlag] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("--PARENT--");
  const [categoryID, setCategoryID] = useState(0);
  const [price, setPrice] = useState(0);
  const [imageURL, setImageURL] = useState("");
  const [search, setSearch] = useState("");
  const [id, setId] = useState(0);

  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        isLoggedIn,
        setIsLoggedIn,
        name,
        setName,
        description,
        setDescription,
        category,
        setCategory,
        categoryID,
        setCategoryID,
        price,
        setPrice,
        imageURL,
        setImageURL,
        search,
        setSearch,
        flag,
        setFlag,
        categories,
        setCategories,
        products,
        setProducts,
        userChoice,
        setUserChoice,
        error,
        setError,
        editFlag,
        setEditFlag,
        email,
        setEmail,
        password,
        setPassword,
        role,
        setRole,
        id,
        setId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
