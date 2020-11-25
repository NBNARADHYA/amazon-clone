import React, { createContext, useState } from "react";

interface SearchInCategoryCtxType {
  searchInCatString: string;
  setSearchInCatString: React.Dispatch<React.SetStateAction<string>>;
}

const SearchInCategoryContext = createContext<SearchInCategoryCtxType | null>(
  null
);

const SearchInCategoryProvider: React.FC = ({ children }) => {
  const [searchInCatString, setSearchInCatString] = useState("");
  return (
    <SearchInCategoryContext.Provider
      value={{ searchInCatString, setSearchInCatString }}
    >
      {children}
    </SearchInCategoryContext.Provider>
  );
};

export { SearchInCategoryContext as default, SearchInCategoryProvider };
