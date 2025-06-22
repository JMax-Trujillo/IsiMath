// screens/functions/integralesDefinidas.js
const integralesDefinidasContainer = document.getElementById("integrales-definidas");

console.log(integralesDefinidasContainer)

if (integralesDefinidasContainer) {
    integralesDefinidasContainer.innerHTML = "";

    const contenedorLogicaIntegralesDefinidas = document.createElement("div");
    contenedorLogicaIntegralesDefinidas.classList.add("contenedor-integrales-definidas");

    console.log(contenedorLogicaIntegralesDefinidas)

    const titulo = document.createElement("h1");
    titulo.textContent = "Integrales Definidas (Método de Simpson)";
    contenedorLogicaIntegralesDefinidas.appendChild(titulo);

    console.log(`Contenedor Logica Integrales Definidas ${contenedorLogicaIntegralesDefinidas}, title ${titulo}`)


    // Equation Editor Container
    const equationEditorContainer = document.createElement("div");
    equationEditorContainer.classList.add("equation-editor-container");

    console.log(`EquationEditorContainer ${equationEditorContainer}`)

    const editorTitle = document.createElement("h2");
    editorTitle.textContent = "Editor de Ecuaciones";
    equationEditorContainer.appendChild(editorTitle);

    console.log(`EquationEditorContainer ${equationEditorContainer}, label ${editorTitle}`)


    const label = document.createElement("label");
    label.setAttribute("for", "mathFieldIntegralDefinida");
    label.textContent = "Ingrese su función f(x):";
    equationEditorContainer.appendChild(label);

    console.log(`EquationEditorContainer ${equationEditorContainer}, label ${label}`)


    const mathField = document.createElement("math-field");
    mathField.id = "mathFieldIntegralDefinida";
    mathField.setAttribute("virtual-keyboard-mode", "manual");
    mathField.setAttribute("placeholder", "Ej. x^2, sin(x), e^{-x^2}");
    equationEditorContainer.appendChild(mathField);

    console.log(`MathField ${mathField} y equationEditorContainer ${equationEditorContainer}`)
    console.log(mathField)
    console.log(equationEditorContainer)

    contenedorLogicaIntegralesDefinidas.appendChild(equationEditorContainer);
    integralesDefinidasContainer.appendChild(contenedorLogicaIntegralesDefinidas);

    // Ensure MathLive and Math.js are loaded
    // These scripts are already in index.html, but if this were a standalone page, they would be needed here.
    // For this integration, since index.html already loads them, we just need to ensure the mathfield element is properly initialized.

    // Optional: Add an event listener to the math-field if you need to capture input changes
    mathField.addEventListener('input', (event) => {
        console.log("Current LaTeX for integral definida:", mathField.value);
        // You can add logic here to process the input, e.g., display the rendered math.
    });
}