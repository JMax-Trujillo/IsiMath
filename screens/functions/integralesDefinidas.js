// screens/functions/integrales.js
const integralesIndefinidasContainer = document.getElementById("integrales-indefinidas");

if (integralesIndefinidasContainer) {
    integralesIndefinidasContainer.innerHTML = "";

    const contenedorLogicaIntegralesIndefinidas = document.createElement("div");
    contenedorLogicaIntegralesIndefinidas.classList.add("contenedor-integrales-indefinidas");

    const titulo = document.createElement("h1");
    titulo.textContent = "Integrales Indefinidas";
    contenedorLogicaIntegralesIndefinidas.appendChild(titulo);

    integralesIndefinidasContainer.appendChild(contenedorLogicaIntegralesIndefinidas);
}