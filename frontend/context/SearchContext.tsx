"use client";

import { createContext, useContext, useState } from "react";

type SearchContextType = {
  keyword: string;
  location: string;
  setKeyword: (v: string) => void;
  setLocation: (v: string) => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  return (
    <SearchContext.Provider
      value={{ keyword, location, setKeyword, setLocation }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be inside SearchProvider");
  return ctx;
};
