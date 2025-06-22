// screens/matrix/calculadora.js
document.addEventListener('DOMContentLoaded', function() {
    const calculadoraBasicaContainer = document.getElementById("calculadora-basica");
    let currentMatrices = {}; // Use an object to store matrices by their unique ID for easier access
    let matrixCounter = 0; // To assign unique IDs to matrices
    let currentOperation = 'sum'; // Default operation

    if (calculadoraBasicaContainer) {
        calculadoraBasicaContainer.innerHTML = ""; // Clear existing content

        const contenedorPrincipal = document.createElement("div");
        contenedorPrincipal.classList.add("calculadora-basica-content");

        // Title
        const title = document.createElement("h2");
        title.textContent = "Matrices y Álgebra Lineal";
        contenedorPrincipal.appendChild(title);

        // Operation Sub-Buttons Container (Suma, Resta, Producto, Transpuesta)
        const matrixOperationSubButtonsContainer = document.createElement("div");
        matrixOperationSubButtonsContainer.classList.add("operation-buttons-container");

        // Create operation buttons
        const sumBtn = createOperationSubButton("Suma", "sum");
        const restBtn = createOperationSubButton("Resta", "resta");
        const prodBtn = createOperationSubButton("Producto", "producto");
        const transBtn = createOperationSubButton("Transpuesta", "transpuesta");

        matrixOperationSubButtonsContainer.appendChild(sumBtn);
        matrixOperationSubButtonsContainer.appendChild(restBtn);
        matrixOperationSubButtonsContainer.appendChild(prodBtn);
        matrixOperationSubButtonsContainer.appendChild(transBtn);

        contenedorPrincipal.appendChild(matrixOperationSubButtonsContainer);

        // Section for dimension inputs and "Hacer" buttons (now includes Mostrar/Ocultar)
        const matrixDimensionSection = document.createElement("div");
        matrixDimensionSection.classList.add("matrix-dimension-section");
        contenedorPrincipal.appendChild(matrixDimensionSection);

        // Section to display matrix inputs and editors
        const matricesDisplaySection = document.createElement("div");
        matricesDisplaySection.classList.add("matrices-display-section");
        contenedorPrincipal.appendChild(matricesDisplaySection);

        // Error message display
        const errorMessageDiv = document.createElement("div");
        errorMessageDiv.classList.add("error-message");
        contenedorPrincipal.appendChild(errorMessageDiv);

        // Add Matrix Button
        const addMatrixButton = document.createElement("button");
        addMatrixButton.textContent = "Añadir otra matriz";
        addMatrixButton.classList.add("add-matrix-button");
        addMatrixButton.style.display = 'none'; // Hidden by default
        contenedorPrincipal.appendChild(addMatrixButton);

        // Perform Operation Button (Resolver)
        const performOperationButton = document.createElement("button");
        performOperationButton.textContent = "Resolver";
        performOperationButton.classList.add("perform-operation-button");
        performOperationButton.style.display = 'none'; // Hidden by default
        contenedorPrincipal.appendChild(performOperationButton);

        // Section for displaying results
        const matrixResultSection = document.createElement("div");
        matrixResultSection.classList.add("matrix-result-container");
        matrixResultSection.style.display = 'none';
        contenedorPrincipal.appendChild(matrixResultSection);


        // Lightbulb icon (bottom right)
        const lightbulbIcon = document.createElement("div");
        lightbulbIcon.classList.add("lightbulb-icon");
        lightbulbIcon.innerHTML = '&#128161;';
        contenedorPrincipal.appendChild(lightbulbIcon);

        calculadoraBasicaContainer.appendChild(contenedorPrincipal);

        // --- Functions ---

        function createOperationSubButton(text, id) {
            const button = document.createElement("button");
            button.textContent = text;
            button.classList.add("calculator-button");
            button.dataset.operation = id;
            button.addEventListener('click', () => {
                // Set active class
                matrixOperationSubButtonsContainer.querySelectorAll('.calculator-button').forEach(btn => btn.classList.remove('active-operation'));
                button.classList.add('active-operation');
                currentOperation = id; // Update current operation
                clearAllMatrices(); // Clear all matrices when changing operation
                renderMatrixInputs(); // Re-render inputs based on new operation
                updateButtonVisibility();
                errorMessageDiv.textContent = ''; // Clear any previous error messages
                matrixResultSection.style.display = 'none'; // Hide results
            });
            return button;
        }

        // Helper function to create dimension input groups with Mostrar/Ocultar/Hacer
        function createMatrixDimensionInputs(matrixLabel, matrixId) {
            const matrixInputGroup = document.createElement("div");
            matrixInputGroup.classList.add("matrix-input-group");
            matrixInputGroup.dataset.matrixId = matrixId; // Set unique ID for the group

            const label = document.createElement("label");
            label.textContent = matrixLabel;
            matrixInputGroup.appendChild(label);

            const filasSpan = document.createElement("span");
            filasSpan.textContent = "filas:";
            matrixInputGroup.appendChild(filasSpan);
            const inputFilas = document.createElement("input");
            inputFilas.type = "number";
            inputFilas.min = "1";
            inputFilas.placeholder = "0";
            inputFilas.classList.add("matrix-dimension-input", "rows-input");
            matrixInputGroup.appendChild(inputFilas);

            const columnasSpan = document.createElement("span");
            columnasSpan.textContent = "Columnas:";
            matrixInputGroup.appendChild(columnasSpan);
            const inputColumnas = document.createElement("input");
            inputColumnas.type = "number";
            inputColumnas.min = "1";
            inputColumnas.placeholder = "0";
            inputColumnas.classList.add("matrix-dimension-input", "cols-input");
            matrixInputGroup.appendChild(inputColumnas);

            // Container for action buttons for this matrix
            const matrixActionButtons = document.createElement("div");
            matrixActionButtons.classList.add("matrix-action-buttons");

            const hacerBtn = document.createElement("button");
            hacerBtn.textContent = "Hacer";
            hacerBtn.classList.add("action-button");
            hacerBtn.addEventListener('click', () => {
                const rows = parseInt(inputFilas.value);
                const cols = parseInt(inputColumnas.value);
                if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
                    errorMessageDiv.textContent = "Por favor, ingresa dimensiones válidas (números mayores a 0).";
                    return;
                }
                errorMessageDiv.textContent = ''; // Clear error
                generateMatrixEditor(matrixId, matrixLabel, rows, cols); // Pass matrixId
                updateButtonVisibility();
            });
            matrixActionButtons.appendChild(hacerBtn);

            const mostrarBtn = document.createElement("button");
            mostrarBtn.textContent = "Mostrar";
            mostrarBtn.classList.add("show-hide-button");
            mostrarBtn.style.display = 'none'; // Hidden until matrix is made
            mostrarBtn.addEventListener('click', () => {
                const editorContainer = document.getElementById(`editor-container-${matrixId}`);
                if (editorContainer) {
                    editorContainer.classList.remove('hidden');
                    mostrarBtn.style.display = 'none';
                    ocultarBtn.style.display = 'inline-block';
                }
            });
            matrixActionButtons.appendChild(mostrarBtn);

            const ocultarBtn = document.createElement("button");
            ocultarBtn.textContent = "Ocultar";
            ocultarBtn.classList.add("show-hide-button");
            ocultarBtn.style.display = 'none'; // Hidden until matrix is made
            ocultarBtn.addEventListener('click', () => {
                const editorContainer = document.getElementById(`editor-container-${matrixId}`);
                if (editorContainer) {
                    editorContainer.classList.add('hidden');
                    ocultarBtn.style.display = 'none';
                    mostrarBtn.style.display = 'inline-block';
                }
            });
            matrixActionButtons.appendChild(ocultarBtn);

            matrixInputGroup.appendChild(matrixActionButtons);

            return matrixInputGroup;
        }

        // Generates/updates the matrix editor grid
        function generateMatrixEditor(matrixId, matrixLabel, rows, cols) {
            let matrixData;
            if (currentMatrices[matrixId] && currentMatrices[matrixId].rows === rows && currentMatrices[matrixId].cols === cols) {
                // Dimensions are the same, keep existing data
                matrixData = currentMatrices[matrixId].data;
            } else {
                // Dimensions changed or new matrix, initialize with zeros
                matrixData = Array(rows).fill(0).map(() => Array(cols).fill(0));
            }

            // Find or create the container for this specific matrix editor
            let matrixContainer = document.getElementById(`editor-container-${matrixId}`);
            if (!matrixContainer) {
                matrixContainer = document.createElement("div");
                matrixContainer.classList.add("matrix-container");
                matrixContainer.id = `editor-container-${matrixId}`;
                matricesDisplaySection.appendChild(matrixContainer);
            } else {
                matrixContainer.innerHTML = ''; // Clear existing content to redraw
            }

            const title = document.createElement("h4");
            title.classList.add("matrix-title");

            // Custom titles for Resta
            if (currentOperation === 'resta') {
                title.textContent = matrixLabel === 'A' ? "Minuendo:" : "Sustraendo:";
            } else {
                title.textContent = `Matriz ${matrixLabel} (${rows}x${cols}):`;
            }
            matrixContainer.appendChild(title);

            const matrixEditorDiv = document.createElement("div");
            matrixEditorDiv.classList.add("matrix-editor");
            matrixEditorDiv.style.gridTemplateColumns = `repeat(${cols}, minmax(40px, 1fr))`; // Responsive grid

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const input = document.createElement("input");
                    input.type = "number";
                    input.value = (matrixData[i] && typeof matrixData[i][j] === 'number') ? matrixData[i][j] : 0;
                    input.dataset.row = i;
                    input.dataset.col = j;
                    input.addEventListener('change', (e) => {
                        // Update matrixData when input changes
                        const val = parseFloat(e.target.value);
                        currentMatrices[matrixId].data[parseInt(e.target.dataset.row)][parseInt(e.target.dataset.col)] = isNaN(val) ? 0 : val;
                    });
                    matrixEditorDiv.appendChild(input);
                }
            }
            matrixContainer.appendChild(matrixEditorDiv);

            // Store/Update the matrix in currentMatrices object
            currentMatrices[matrixId] = { id: matrixId, label: matrixLabel, rows, cols, data: matrixData };

            // Update visibility of Show/Hide buttons for this matrix
            const matrixInputGroup = document.querySelector(`[data-matrix-id="${matrixId}"]`);
            if (matrixInputGroup) {
                const mostrarBtn = matrixInputGroup.querySelector('.show-hide-button:nth-of-type(1)'); // "Mostrar" button
                const ocultarBtn = matrixInputGroup.querySelector('.show-hide-button:nth-of-type(2)'); // "Ocultar" button
                mostrarBtn.style.display = 'none';
                ocultarBtn.style.display = 'inline-block';
                matrixContainer.classList.remove('hidden'); // Ensure it's visible after 'Hacer'
            }

            updateButtonVisibility(); // Update global button visibility
        }

        // Renders dimension input fields based on the current operation
        function renderMatrixInputs() {
            matrixDimensionSection.innerHTML = ''; // Clear previous dimension inputs
            matricesDisplaySection.innerHTML = ''; // Clear previous matrix editors
            errorMessageDiv.textContent = ''; // Clear error message
            matrixResultSection.style.display = 'none'; // Hide results
            matrixResultSection.innerHTML = ''; // Clear results content

            // Reset currentMatrices for new operation type
            currentMatrices = {};
            matrixCounter = 0;

            if (currentOperation === 'sum' || currentOperation === 'resta' || currentOperation === 'producto') {
                const matrixA = createMatrixDimensionInputs("A", `matrix-${matrixCounter++}`);
                const matrixB = createMatrixDimensionInputs("B", `matrix-${matrixCounter++}`);
                matrixDimensionSection.appendChild(matrixA);
                matrixDimensionSection.appendChild(matrixB);
            } else if (currentOperation === 'transpuesta') {
                const singleMatrix = createMatrixDimensionInputs("A", `matrix-${matrixCounter++}`);
                matrixDimensionSection.appendChild(singleMatrix);
            }
            updateButtonVisibility();
        }

        // Manages visibility of "Añadir otra matriz" and "Resolver" buttons
        function updateButtonVisibility() {
            const numMatricesMade = Object.keys(currentMatrices).length;

            // "Añadir otra matriz" button
            if (currentOperation === 'sum' && numMatricesMade >= 2) {
                addMatrixButton.style.display = 'block';
            } else {
                addMatrixButton.style.display = 'none';
            }

            // "Resolver" button
            let showPerformButton = false;
            if (currentOperation === 'sum' && numMatricesMade >= 2) {
                showPerformButton = true;
            } else if ((currentOperation === 'resta' || currentOperation === 'producto') && numMatricesMade === 2) {
                showPerformButton = true;
            } else if (currentOperation === 'transpuesta' && numMatricesMade === 1) {
                showPerformButton = true;
            }
            performOperationButton.style.display = showPerformButton ? 'block' : 'none';
        }

        // Clears all matrices from display and the currentMatrices object
        function clearAllMatrices() {
            currentMatrices = {};
            matrixCounter = 0;
            matricesDisplaySection.innerHTML = '';
            matrixDimensionSection.innerHTML = ''; // Clear dimension inputs as well
            errorMessageDiv.textContent = '';
            matrixResultSection.style.display = 'none';
            addMatrixButton.style.display = 'none';
            performOperationButton.style.display = 'none';
        }

        // --- Matrix Operations Logic (from previous response, ensure they are here) ---

        function displayResultMatrix(resultMatrix, titleText) {
            matrixResultSection.innerHTML = '';
            matrixResultSection.style.display = 'block';

            const title = document.createElement("h4");
            title.textContent = titleText;
            matrixResultSection.appendChild(title);

            const resultEditorDiv = document.createElement("div");
            resultEditorDiv.classList.add("result-matrix-editor");
            resultEditorDiv.style.gridTemplateColumns = `repeat(${resultMatrix[0].length}, auto)`;

            for (let i = 0; i < resultMatrix.length; i++) {
                for (let j = 0; j < resultMatrix[0].length; j++) {
                    const cell = document.createElement("div");
                    cell.textContent = resultMatrix[i][j].toFixed(2); // Format to 2 decimal places
                    resultEditorDiv.appendChild(cell);
                }
            }
            matrixResultSection.appendChild(resultEditorDiv);
        }

        function addMatrices(matrices) {
            if (matrices.length === 0) return [];
            const rows = matrices[0].length;
            const cols = matrices[0][0].length;
            let result = Array(rows).fill(0).map(() => Array(cols).fill(0));

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    for (let k = 0; k < matrices.length; k++) {
                        result[i][j] += matrices[k][i][j];
                    }
                }
            }
            return result;
        }

        function subtractMatrices(matrixA, matrixB) {
            const rows = matrixA.length;
            const cols = matrixA[0].length;
            let result = Array(rows).fill(0).map(() => Array(cols).fill(0));

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    result[i][j] = matrixA[i][j] - matrixB[i][j];
                }
            }
            return result;
        }

        function multiplyMatrices(matrixA, matrixB) {
            const rowsA = matrixA.length;
            const colsA = matrixA[0].length;
            const rowsB = matrixB.length;
            const colsB = matrixB[0].length;

            if (colsA !== rowsB) {
                return null; // Invalid dimensions for multiplication
            }

            let result = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));

            for (let i = 0; i < rowsA; i++) {
                for (let j = 0; j < colsB; j++) {
                    for (let k = 0; k < colsA; k++) {
                        result[i][j] += matrixA[i][k] * matrixB[k][j];
                    }
                }
            }
            return result;
        }

        function transposeMatrix(matrix) {
            const rows = matrix.length;
            const cols = matrix[0].length;
            let result = Array(cols).fill(0).map(() => Array(rows).fill(0));

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    result[j][i] = matrix[i][j];
                }
            }
            return result;
        }

        // --- Initial Setup ---
        matrixOperationSubButtonsContainer.querySelector(`[data-operation="sum"]`).classList.add('active-operation'); // Default active
        renderMatrixInputs(); // Initial render for Suma

        // --- Event Listeners for new buttons ---
        addMatrixButton.addEventListener('click', () => {
            if (currentOperation === 'sum') { // Only allow adding for sum
                matrixCounter++;
                // Find the highest existing matrix letter and add the next one.
                // This is a simple approach, for robustness you might check all currentMatrices keys.
                let lastChar = 'A';
                if (Object.keys(currentMatrices).length > 0) {
                    const lastMatrixId = `matrix-${matrixCounter - 1}`;
                    if (currentMatrices[lastMatrixId]) {
                         lastChar = currentMatrices[lastMatrixId].label;
                    }
                }
                const newMatrixLabel = String.fromCharCode(lastChar.charCodeAt(0) + 1);

                const newMatrixInputs = createMatrixDimensionInputs(newMatrixLabel, `matrix-${matrixCounter}`);
                matrixDimensionSection.appendChild(newMatrixInputs);
                updateButtonVisibility();
            }
        });

        performOperationButton.addEventListener('click', () => {
            errorMessageDiv.textContent = ''; // Clear previous errors
            matrixResultSection.style.display = 'none'; // Hide previous results

            // Get valid matrices from the currentMatrices object
            const validMatricesArray = Object.values(currentMatrices).filter(m => m.data && m.data.length > 0 && m.data[0].length > 0);
            const matricesData = validMatricesArray.map(m => m.data);

            if (currentOperation === 'sum') {
                if (matricesData.length < 2) {
                    errorMessageDiv.textContent = "Se necesitan al menos dos matrices para la suma.";
                    return;
                }
                const firstMatrixDims = { rows: matricesData[0].length, cols: matricesData[0][0].length };
                const allSameDimensions = matricesData.every(m => m.length === firstMatrixDims.rows && m[0].length === firstMatrixDims.cols);
                if (!allSameDimensions) {
                    errorMessageDiv.textContent = "Todas las matrices deben tener las mismas dimensiones para la suma.";
                    return;
                }
                const result = addMatrices(matricesData);
                displayResultMatrix(result, "Resultado de la Suma:");
            } else if (currentOperation === 'resta') {
                if (matricesData.length !== 2) {
                    errorMessageDiv.textContent = "La resta requiere exactamente dos matrices.";
                    return;
                }
                const matrixA = matricesData[0];
                const matrixB = matricesData[1];
                if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
                    errorMessageDiv.textContent = "Ambas matrices deben tener las mismas dimensiones para la resta.";
                    return;
                }
                const result = subtractMatrices(matrixA, matrixB);
                displayResultMatrix(result, "Resultado de la Resta:");
            } else if (currentOperation === 'producto') {
                if (matricesData.length !== 2) {
                    errorMessageDiv.textContent = "El producto requiere exactamente dos matrices.";
                    return;
                }
                const matrixA = matricesData[0];
                const matrixB = matricesData[1];
                if (matrixA[0].length !== matrixB.length) {
                    errorMessageDiv.textContent = "Para el producto A x B, el número de columnas de A debe ser igual al número de filas de B.";
                    return;
                }
                const result = multiplyMatrices(matrixA, matrixB);
                if (result) {
                    displayResultMatrix(result, "Resultado del Producto:");
                } else {
                    errorMessageDiv.textContent = "Error en el producto de matrices. Verifica las dimensiones.";
                }
            } else if (currentOperation === 'transpuesta') {
                if (matricesData.length !== 1) {
                    errorMessageDiv.textContent = "La transpuesta requiere exactamente una matriz.";
                    return;
                }
                const matrix = matricesData[0];
                const result = transposeMatrix(matrix);
                displayResultMatrix(result, "Resultado de la Transpuesta:");
            }
        });
    }
});