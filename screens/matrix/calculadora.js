const calculadoraContainer = document.getElementById("calculadora");

calculadoraContainer.innerHTML = "";

const contenedorLogicaCalculadora = document.createElement("div");
contenedorLogicaCalculadora.classList.add("contenedor-graficadora"); // Agregando una clase para posteriormente darle estilos

/**
 * Aquí añadir toda la lógica de la calculadora. Luego se agregará al proyecto.
 */
// Código de prueba
const titulo = document.createElement("h1");
titulo.textContent = "Hola Calculadora";
contenedorLogicaCalculadora.appendChild(titulo);

calculadoraContainer.appendChild(contenedorLogicaCalculadora);
