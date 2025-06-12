const inversaContainer = document.getElementById("inversa");

inversaContainer.innerHTML = "";

const contenedorLogicaInversa = document.createElement("div");
contenedorLogicaInversa.classList.add("contenedor-graficadora"); // Agregando una clase para posteriormente darle estilos

/**
 * Aquí añadir toda la lógica de la matriz inversa. Luego se agregará al proyecto.
 */
// Código de prueba
const titulo = document.createElement("h1");
titulo.textContent = "Hola Inversa";
contenedorLogicaInversa.appendChild(titulo);

inversaContainer.appendChild(contenedorLogicaInversa);
