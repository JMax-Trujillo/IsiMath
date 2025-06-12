const integralesContainer = document.getElementById("integrales");

integralesContainer.innerHTML = "";

const contenedorLogicaIntegrales = document.createElement("div");
contenedorLogicaIntegrales.classList.add("contenedor-graficadora"); //Agregando una clase para posteriormente darle estilos

/**
 * Aqui añadir toda la logica de la integrales. luego se agregara al prouecto 
 */
//Codigo de prueba
const titulo = document.createElement("h1")
titulo.textContent="Hola Integrales"
contenedorLogicaIntegrales.appendChild(titulo)

integralesContainer.appendChild(contenedorLogicaIntegrales);
