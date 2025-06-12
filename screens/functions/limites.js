const limitesContainer = document.getElementById("limites");

limitesContainer.innerHTML = "";

const contenedorLogicaLimites = document.createElement("div");
contenedorLogicaLimites.classList.add("contenedor-graficadora"); // Agregando una clase para posteriormente darle estilos

/**
 * Aquí añadir toda la lógica de límites. Luego se agregará al proyecto.
 */
// Código de prueba
const titulo = document.createElement("h1");
titulo.textContent = "Hola Límites";
contenedorLogicaLimites.appendChild(titulo);

limitesContainer.appendChild(contenedorLogicaLimites);
