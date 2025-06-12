const graficadoraContainer = document.getElementById("graficadora");

graficadoraContainer.innerHTML = "";

const contenedorLogicaGraficadora = document.createElement("div");
contenedorLogicaGraficadora.classList.add("contenedor-graficadora"); //Agregando una clase para posteriormente darle estilos

/**
 * Aqui añadir toda la logica de la graficadora. luego se agregara al prouecto 
 */
//Codigo de prueba
const titulo = document.createElement("h1")
titulo.textContent="Hola Graficadora"
contenedorLogicaGraficadora.appendChild(titulo)

graficadoraContainer.appendChild(contenedorLogicaGraficadora);
