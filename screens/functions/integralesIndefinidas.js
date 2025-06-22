const metodoDeSimpsonContainer = document.getElementById("integrales-indefinidas");

metodoDeSimpsonContainer.innerHTML = "";

const contenedorLogicaSimpson = document.createElement("div");
contenedorLogicaSimpson.classList.add("contenedor-graficadora"); // Agregando una clase para posteriormente darle estilos

/**
 * Aquí añadir toda la lógica del método de Simpson. Luego se agregará al proyecto.
 */
// Código de prueba
const titulo = document.createElement("h1");
titulo.textContent = "Hola Método de Simpson";
contenedorLogicaSimpson.appendChild(titulo);

metodoDeSimpsonContainer.appendChild(contenedorLogicaSimpson);
