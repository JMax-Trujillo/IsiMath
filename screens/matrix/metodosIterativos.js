const metodosIterativosContainer = document.getElementById("iterativos");

metodosIterativosContainer.innerHTML = "";

const contenedorLogicaIterativos = document.createElement("div");
contenedorLogicaIterativos.classList.add("contenedor-graficadora"); // Agregando una clase para posteriormente darle estilos

/**
 * Aquí añadir toda la lógica de métodos iterativos. Luego se agregará al proyecto.
 */
// Código de prueba
const titulo = document.createElement("h1");
titulo.textContent = "Hola Métodos Iterativos";
contenedorLogicaIterativos.appendChild(titulo);

metodosIterativosContainer.appendChild(contenedorLogicaIterativos);
