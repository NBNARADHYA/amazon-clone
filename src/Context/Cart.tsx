import React, { createContext, useState } from "react";

interface CartContextType {
  cart: Record<string, boolean>;
  setCart: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const CartContext = createContext<CartContextType | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [cart, setCart] = useState<Record<string, boolean>>({});

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext as default, CartProvider };
