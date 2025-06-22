// screens/matrix/calculadora.js
document.addEventListener('DOMContentLoaded', function() { // Ensure DOM is fully loaded
    const calculadoraBasicaContainer = document.getElementById("calculadora-basica");

    if (calculadoraBasicaContainer) {
        calculadoraBasicaContainer.innerHTML = ""; // Clear existing content

        const contenedorPrincipal = document.createElement("div");
        contenedorPrincipal.classList.add("calculadora-basica-content");

        // Title
        const title = document.createElement("h2");
        title.textContent = "Matrices y Álgebra Lineal";
        contenedorPrincipal.appendChild(title);

        // Operation Buttons Container
        const operationButtonsContainer = document.createElement("div");
        operationButtonsContainer.classList.add("operation-buttons-container");

        const sumRestaBtn = document.createElement("button");
        sumRestaBtn.textContent = "Suma/Resta";
        sumRestaBtn.classList.add("calculator-button", "active-operation"); // Add active class initially
        operationButtonsContainer.appendChild(sumRestaBtn);

        const mostrarBtn = document.createElement("button");
        mostrarBtn.textContent = "Mostrar";
        mostrarBtn.classList.add("calculator-button");
        operationButtonsContainer.appendChild(mostrarBtn);

        const teoriaBtn = document.createElement("button");
        teoriaBtn.textContent = "Teoría?";
        teoriaBtn.classList.add("calculator-button");
        operationButtonsContainer.appendChild(teoriaBtn);

        contenedorPrincipal.appendChild(operationButtonsContainer);

        // Matrix Input Section (for Suma/Resta initially)
        const matrixInputSection = document.createElement("div");
        matrixInputSection.classList.add("matrix-input-section");
        matrixInputSection.id = "sum-resta-inputs"; // ID for specific operation inputs

        // Matrix A Inputs
        const matrixA = document.createElement("div");
        matrixA.classList.add("matrix-input-group");
        const labelA = document.createElement("label");
        labelA.textContent = "A";
        matrixA.appendChild(labelA);
        const filasA = document.createElement("span");
        filasA.textContent = "filas:";
        matrixA.appendChild(filasA);
        const inputFilasA = document.createElement("input");
        inputFilasA.type = "number";
        inputFilasA.min = "1";
        inputFilasA.placeholder = "0";
        inputFilasA.classList.add("matrix-dimension-input");
        matrixA.appendChild(inputFilasA);
        const columnasA = document.createElement("span");
        columnasA.textContent = "Columnas:";
        matrixA.appendChild(columnasA);
        const inputColumnasA = document.createElement("input");
        inputColumnasA.type = "number";
        inputColumnasA.min = "1";
        inputColumnasA.placeholder = "0";
        inputColumnasA.classList.add("matrix-dimension-input");
        matrixA.appendChild(inputColumnasA);
        const hacerBtnA = document.createElement("button");
        hacerBtnA.textContent = "Hacer";
        hacerBtnA.classList.add("action-button");
        matrixA.appendChild(hacerBtnA);
        matrixInputSection.appendChild(matrixA);

        // Matrix B Inputs
        const matrixB = document.createElement("div");
        matrixB.classList.add("matrix-input-group");
        const labelB = document.createElement("label");
        labelB.textContent = "B";
        matrixB.appendChild(labelB);
        const filasB = document.createElement("span");
        filasB.textContent = "Filas:";
        matrixB.appendChild(filasB);
        const inputFilasB = document.createElement("input");
        inputFilasB.type = "number";
        inputFilasB.min = "1";
        inputFilasB.placeholder = "0";
        inputFilasB.classList.add("matrix-dimension-input");
        matrixB.appendChild(inputFilasB);
        const columnasB = document.createElement("span");
        columnasB.textContent = "Columnas:";
        matrixB.appendChild(columnasB);
        const inputColumnasB = document.createElement("input");
        inputColumnasB.type = "number";
        inputColumnasB.min = "1";
        inputColumnasB.placeholder = "0";
        inputColumnasB.classList.add("matrix-dimension-input");
        matrixB.appendChild(inputColumnasB);
        const hacerBtnB = document.createElement("button");
        hacerBtnB.textContent = "Hacer";
        hacerBtnB.classList.add("action-button");
        matrixB.appendChild(hacerBtnB);
        matrixInputSection.appendChild(matrixB);

        contenedorPrincipal.appendChild(matrixInputSection);

        // Lightbulb icon (bottom right)
        const lightbulbIcon = document.createElement("div");
        lightbulbIcon.classList.add("lightbulb-icon");
        lightbulbIcon.innerHTML = '&#128161;'; // Unicode for lightbulb
        contenedorPrincipal.appendChild(lightbulbIcon);

        calculadoraBasicaContainer.appendChild(contenedorPrincipal);

        // Event Listeners for operation buttons
        const operationButtons = operationButtonsContainer.querySelectorAll('.calculator-button');
        operationButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                operationButtons.forEach(btn => btn.classList.remove('active-operation'));
                // Add active class to the clicked button
                this.classList.add('active-operation');

                // Here you would change the content of matrixInputSection
                // based on the selected operation (Suma/Resta, Producto, Transpuesta, Inversa, Determinante)
                // For now, it only shows Suma/Resta inputs.
                // You'll need to implement logic to dynamically change matrixInputSection content
                // or show/hide different input sections for each operation.
                console.log(`Selected operation: ${this.textContent}`);
            });
        });

        // Function to dynamically generate different input sections based on operation
        function updateMatrixInputSection(operation) {
            matrixInputSection.innerHTML = ''; // Clear current inputs

            if (operation === 'Suma/Resta') {
                matrixInputSection.appendChild(matrixA.cloneNode(true)); // Re-add Matrix A inputs
                matrixInputSection.appendChild(matrixB.cloneNode(true)); // Re-add Matrix B inputs
            } else if (operation === 'Producto') {
                const productMatrixA = matrixA.cloneNode(true);
                const productMatrixB = matrixB.cloneNode(true);
                productMatrixA.querySelector('label').textContent = 'A';
                productMatrixB.querySelector('label').textContent = 'B';
                matrixInputSection.appendChild(productMatrixA);
                matrixInputSection.appendChild(productMatrixB);
                // You might need to add specific constraints or input fields for product
            } else if (operation === 'Transpuesta' || operation === 'Inversa' || operation === 'Determinante') {
                const singleMatrixA = matrixA.cloneNode(true);
                singleMatrixA.querySelector('label').textContent = 'Matriz:';
                matrixInputSection.appendChild(singleMatrixA);
            }
            // Add event listeners back to the newly cloned "Hacer" buttons if needed
        }

        // Initially set up Suma/Resta inputs
        updateMatrixInputSection('Suma/Resta');

        // Modify the click event listener for operation buttons to use the new function
        operationButtons.forEach(button => {
            button.addEventListener('click', function() {
                operationButtons.forEach(btn => btn.classList.remove('active-operation'));
                this.classList.add('active-operation');
                updateMatrixInputSection(this.textContent);
            });
        });

        // When "Calculadora Basica" is clicked from sidebar, ensure "Suma/Resta" is active
        // and its content is displayed.
        // This part might need to be in main.js or a separate initialization function.
        // For now, let's assume Suma/Resta is the default view.
    }
});