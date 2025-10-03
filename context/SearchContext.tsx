import React, { createContext, useState, useContext, useMemo } from 'react';

type SearchContextType = {
  searchValue: string;
  setSearchValue: (value: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchValue, setSearchValue] = useState('');

  const value = useMemo(() => ({ searchValue, setSearchValue }), [searchValue]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}