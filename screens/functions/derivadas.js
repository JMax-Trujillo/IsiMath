const derivadasContainer = document.getElementById("derivadas");

derivadasContainer.innerHTML = "";

const contenedorLogicaDerivadas = document.createElement("div");
contenedorLogicaDerivadas.classList.add("contenedor-derivada"); //Agregando una clase para posteriormente darle estilos

/**
 * Aqui añadir toda la logica de la derivada. luego se agregara al prouecto 
 */
//Codigo de prueba
const titulo = document.createElement("h1")
titulo.textContent="Hola Derivada"
contenedorLogicaDerivadas.appendChild(titulo)

derivadasContainer.appendChild(contenedorLogicaDerivadas);
