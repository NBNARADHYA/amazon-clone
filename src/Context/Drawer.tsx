import React, { createContext, useState } from "react";

interface DrawerCtxType {
  drawerState: number | null;
  setDrawerState: React.Dispatch<React.SetStateAction<number | null>>;
}

const DrawerContext = createContext<DrawerCtxType | null>(null);

const DrawerProvider: React.FC = ({ children }) => {
  const [drawerState, setDrawerState] = useState<number | null>(null);
  return (
    <DrawerContext.Provider value={{ drawerState, setDrawerState }}>
      {children}
    </DrawerContext.Provider>
  );
};

export { DrawerContext as default, DrawerProvider };
