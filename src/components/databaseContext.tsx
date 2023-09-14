"use client";
import { MutableRefObject, createContext, useRef } from "react";
import { Database } from "./database";

export const DatabaseContext = createContext<MutableRefObject<Database | null>>(
  {
    current: null,
  }
);

interface DatabaseContextProviderProps {
  children: React.ReactNode;
}

export const DatabaseContextProvider: React.FunctionComponent<
  DatabaseContextProviderProps
> = ({ children }) => {
  const db = new Database();
  const instance = useRef<Database>(db);
  instance.current = db;

  return (
    <DatabaseContext.Provider value={instance}>
      {children}
    </DatabaseContext.Provider>
  );
};
