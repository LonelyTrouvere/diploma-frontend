import type { User } from "@/api/users/entity";
import { getUser } from "@/api/users/get";
import React from "react";

export const CurrentUserContext = React.createContext<{
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>,
  fetchCurrentUser: () => void;
}>({ currentUser: null, setCurrentUser: () => {}, fetchCurrentUser: () => {} });

export const CurrentUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  const fetchCurrentUser = async () => {
    let response = await getUser();
    if (response.success) {
      console.log(response.data)
      setCurrentUser(response.data);
    } else {
      setCurrentUser(null);
    }
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, fetchCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => React.useContext(CurrentUserContext);
