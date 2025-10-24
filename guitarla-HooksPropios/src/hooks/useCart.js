import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db.js";

export const useCart = () => {
  // Función para inicializar el carrito desde localStorage

  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };
  const [data, setData] = useState(db);
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item) {
    // Busca si el ítem ya existe en el carrito, comparando por ID
    const itemExist = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExist >= 0) {
      if (cart[itemExist].quantity >= 5) return;
      // Si ya existe, se crea una copia superficial del carrito
      const updatedcart = [...cart];
      // ❌ Aquí se modifica directamente el objeto dentro del array (violación de inmutabilidad)
      updatedcart[itemExist].quantity++;
      // Se actualiza el estado con el nuevo array
      setCart(updatedcart);
    } else {
      // Si no existe, se le agrega una propiedad quantity = 1
      item.quantity = 1; // ❌ También modifica directamente el objeto original
      // Se agrega el nuevo ítem al carrito
      setCart((prevCart) => [...cart, item]);
    }
  }

  // Define una función llamada removeFromCart que elimina un producto del carrito según su ID.
  function removeFromCart(id) {
    // Actualiza el estado del carrito usando setCart.
    // Toma el estado anterior (prevCart) y filtra los productos.
    // Solo conserva aquellos cuya propiedad 'id' sea diferente al 'id' recibido como parámetro.
    // Esto elimina el producto con el ID especificado del arreglo.
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  // Define una función llamada increaseQuantity que incrementa la cantidad de un producto en el carrito según su ID.
  function increaseQuantity(id) {
    console.log("incrementando"); // Mensaje de depuración para indicar que se está ejecutando la función

    // Actualiza el estado del carrito usando setCart.
    // Utiliza el estado anterior (prevCart) y lo transforma con map.
    setCart((prevCart) =>
      prevCart.map(
        (guitar) =>
          // Si el ID del producto coincide con el ID recibido, crea un nuevo objeto con la cantidad incrementada
          guitar.id === id && guitar.quantity < 5
            ? { ...guitar, quantity: guitar.quantity + 1 } // Crea una copia del objeto y aumenta la cantidad en 1
            : guitar // Si no coincide, devuelve el objeto sin cambios
      )
    );
  }

  // Define una función que disminuye la cantidad de un producto en el carrito según su ID
  function decreaseQuantity(id) {
    console.log("disminuyendo"); // Mensaje de depuración

    // Actualiza el estado del carrito
    setCart((prevCart) =>
      prevCart.map(
        (guitar) =>
          guitar.id === id && guitar.quantity > 1
            ? { ...guitar, quantity: guitar.quantity - 1 } // Resta 1 a la cantidad del producto
            : guitar // Deja los demás productos sin cambios
      )
    );
  }

  // Define una función que limpia el carrito, eliminando todos los productos
  function cleanCart() {
    setCart([]);
  }

  // Memoriza si el carrito está vacío.
  // Solo recalcula cuando cambia el arreglo 'cart'.
  // Retorna 'true' si el carrito no tiene elementos, 'false' en caso contrario.
  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  // Esta función calcula el total del carrito sumando el precio total de cada producto (cantidad * precio).
  // Utiliza el método reduce para recorrer el arreglo 'cart' y acumular el valor total, comenzando desde 0.
  const cartToltal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cleanCart,
    isEmpty,
    cartToltal,
  };
};
