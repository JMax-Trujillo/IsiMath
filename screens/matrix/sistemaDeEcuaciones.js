const sistemaEcuacionesContainer = document.getElementById("sistemas");

sistemaEcuacionesContainer.innerHTML = "";

const contenedorLogicaSistema = document.createElement("div");
contenedorLogicaSistema.classList.add("contenedor-graficadora"); // Agregando una clase para posteriormente darle estilos

/**
 * Aquí añadir toda la lógica del sistema de ecuaciones. Luego se agregará al proyecto.
 */
// Código de prueba
const titulo = document.createElement("h1");
titulo.textContent = "Hola Sistema de Ecuaciones";
contenedorLogicaSistema.appendChild(titulo);

sistemaEcuacionesContainer.appendChild(contenedorLogicaSistema);
