const determinantesContainer = document.getElementById("determinantes");

determinantesContainer.innerHTML = "";

const contenedorLogicaDeterminantes = document.createElement("div");
contenedorLogicaDeterminantes.classList.add("contenedor-graficadora"); // Agregando una clase para posteriormente darle estilos

/**
 * Aquí añadir toda la lógica de determinantes. Luego se agregará al proyecto.
 */
// Código de prueba
const titulo = document.createElement("h1");
titulo.textContent = "Hola Determinantes";
contenedorLogicaDeterminantes.appendChild(titulo);

determinantesContainer.appendChild(contenedorLogicaDeterminantes);
