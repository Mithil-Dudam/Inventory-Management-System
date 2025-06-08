import { createContext, useContext, useState } from "react";

interface ProfileType {
  username: string;
  password: string;
  bio: string;
  email: string;
  total_posts: number;
  follows_count: number;
}

interface CategoryType {
  name: string;
  parent: string;
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
  profile: ProfileType | null;
  setProfile: (profile: ProfileType | null) => void;
  broadcasts: {
    text: string;
    sent_by: number;
    username: string;
    image_url: string;
  }[];
  setBroadcasts: React.Dispatch<
    React.SetStateAction<
      { text: string; sent_by: number; username: string; image_url: string }[]
    >
  >;
  messages: {
    text: string;
    sent_by: number;
    image_url: string;
    chat_id: number;
  }[];
  setMessages: React.Dispatch<
    React.SetStateAction<
      { text: string; sent_by: number; image_url: string; chat_id: number }[]
    >
  >;
  editFlag: number;
  setEditFlag: (flag: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState(0);
  const [userChoice, setUserChoice] = useState("");
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [categories, setCategories] = useState<CategoryType[] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [flag, setFlag] = useState(0);
  const [broadcasts, setBroadcasts] = useState<
    { text: string; sent_by: number; username: string; image_url: string }[]
  >([]);
  const [messages, setMessages] = useState<
    { text: string; sent_by: number; image_url: string; chat_id: number }[]
  >([]);
  const [editFlag, setEditFlag] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        isLoggedIn,
        setIsLoggedIn,
        flag,
        setFlag,
        categories,
        setCategories,
        profile,
        setProfile,
        userChoice,
        setUserChoice,
        error,
        setError,
        broadcasts,
        setBroadcasts,
        editFlag,
        setEditFlag,
        email,
        setEmail,
        password,
        setPassword,
        role,
        setRole,
        messages,
        setMessages,
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
