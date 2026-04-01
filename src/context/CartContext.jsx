import { createContext, useContext, useEffect, useState } from "react";
import { roundCurrency } from "../utils/formatCurrency";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("dessert_bowl_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedTable, setSelectedTable] = useState(() => {
    return localStorage.getItem("dessert_bowl_table") || "";
  });

  const [customerWhatsApp, setCustomerWhatsApp] = useState(() => {
    return localStorage.getItem("dessert_bowl_whatsapp") || "";
  });

  const [orderId, setOrderId] = useState(() => {
    return localStorage.getItem("dessert_bowl_orderid") || "";
  });

  useEffect(() => {
    localStorage.setItem("dessert_bowl_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("dessert_bowl_table", selectedTable);
  }, [selectedTable]);

  useEffect(() => {
    localStorage.setItem("dessert_bowl_whatsapp", customerWhatsApp);
  }, [customerWhatsApp]);

  useEffect(() => {
    localStorage.setItem("dessert_bowl_orderid", orderId);
  }, [orderId]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("dessert_bowl_cart");
  };

  const getCartTotal = () => {
    return roundCurrency(
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedTable,
        customerWhatsApp,
        orderId,
        setSelectedTable,
        setCustomerWhatsApp,
        setOrderId,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);