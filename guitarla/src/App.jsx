import Header from "./Components/Header"
import Guitar from "./Components/Guitar"
import { db } from "./data/db.js"
import { useState } from "react"


function App() {
  const [data, setData] = useState(db);
  const [cart, setCart] = useState([]);


  function addToCart(item) {
  // Busca si el ítem ya existe en el carrito, comparando por ID
  const itemExist = cart.findIndex((guitar) => guitar.id === item.id);
  if (itemExist >= 0) {
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
    setCart(prevCart => [...cart, item]);
  }
}


  return (
    <>
    
    <Header cart={cart}/>

    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              setCart={setCart}
              cart={cart}
              addToCart={addToCart}
            />
          ))}
            
        </div>
    </main>


    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
    </footer>
    </>
  )
}

export default App
