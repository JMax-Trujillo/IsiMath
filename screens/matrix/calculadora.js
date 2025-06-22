// screens/matrix/calculadora.js
document.addEventListener('DOMContentLoaded', function() {
    const calculadoraBasicaContainer = document.getElementById("calculadora-basica"); 
    let currentMatrices = {}; 
    let matrixCounter = 0; 
    let currentOperation = 'sum'; 

    if (calculadoraBasicaContainer) {
        calculadoraBasicaContainer.innerHTML = ""; 

        const contenedorPrincipal = document.createElement("div");
        contenedorPrincipal.classList.add("calculadora-basica-content");

        const title = document.createElement("h2");
        title.textContent = "Matrices y Álgebra Lineal";
        contenedorPrincipal.appendChild(title);

        const matrixOperationSubButtonsContainer = document.createElement("div");
        matrixOperationSubButtonsContainer.classList.add("operation-buttons-container");

        const sumBtn = createOperationSubButton("Suma", "sum");
        const restBtn = createOperationSubButton("Resta", "resta");
        const prodBtn = createOperationSubButton("Producto", "producto");
        const transBtn = createOperationSubButton("Transpuesta", "transpuesta");

        matrixOperationSubButtonsContainer.appendChild(sumBtn);
        matrixOperationSubButtonsContainer.appendChild(restBtn);
        matrixOperationSubButtonsContainer.appendChild(prodBtn);
        matrixOperationSubButtonsContainer.appendChild(transBtn);

        contenedorPrincipal.appendChild(matrixOperationSubButtonsContainer);

        const matrixDimensionSection = document.createElement("div");
        matrixDimensionSection.classList.add("matrix-dimension-section");
        contenedorPrincipal.appendChild(matrixDimensionSection);

        const matricesDisplaySection = document.createElement("div");
        matricesDisplaySection.classList.add("matrices-display-section");
        contenedorPrincipal.appendChild(matricesDisplaySection);

        const errorMessageDiv = document.createElement("div");
        errorMessageDiv.classList.add("error-message");
        contenedorPrincipal.appendChild(errorMessageDiv);

        const addMatrixButton = document.createElement("button");
        addMatrixButton.textContent = "Añadir otra matriz";
        addMatrixButton.classList.add("add-matrix-button");
        addMatrixButton.style.display = 'none'; 
        contenedorPrincipal.appendChild(addMatrixButton);

        const performOperationButton = document.createElement("button");
        performOperationButton.textContent = "Resolver";
        performOperationButton.classList.add("perform-operation-button");
        performOperationButton.style.display = 'none'; 
        contenedorPrincipal.appendChild(performOperationButton);

        const matrixResultSection = document.createElement("div");
        matrixResultSection.classList.add("matrix-result-container");
        matrixResultSection.style.display = 'none';
        contenedorPrincipal.appendChild(matrixResultSection);

        const lightbulbIcon = document.createElement("div");
        lightbulbIcon.classList.add("lightbulb-icon");
        lightbulbIcon.innerHTML = '&#128161;'; 
        contenedorPrincipal.appendChild(lightbulbIcon);

        calculadoraBasicaContainer.appendChild(contenedorPrincipal);

        function createOperationSubButton(text, id) {
            const button = document.createElement("button");
            button.textContent = text;
            button.classList.add("calculator-button");
            button.dataset.operation = id;
            button.addEventListener('click', () => {
                matrixOperationSubButtonsContainer.querySelectorAll('.calculator-button').forEach(btn => btn.classList.remove('active-operation'));
                button.classList.add('active-operation');
                currentOperation = id; 
                clearAllMatrices(); 
                renderMatrixInputs(); 
                updateButtonVisibility();
                errorMessageDiv.textContent = ''; 
                matrixResultSection.style.display = 'none'; 
                matrixResultSection.innerHTML = ''; 
            });
            return button;
        }

        function createMatrixDimensionInputs(matrixLabel, matrixId) {
            const matrixInputGroup = document.createElement("div");
            matrixInputGroup.classList.add("matrix-input-group");
            matrixInputGroup.dataset.matrixId = matrixId; 

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

            const matrixActionButtons = document.createElement("div");
            matrixActionButtons.classList.add("matrix-action-buttons");

            const hacerBtn = document.createElement("button");
            hacerBtn.textContent = "Hacer";
            hacerBtn.classList.add("action-button", "hacer");
            hacerBtn.addEventListener('click', () => {
                const rows = parseInt(inputFilas.value);
                const cols = parseInt(inputColumnas.value);
                if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
                    errorMessageDiv.textContent = "Por favor, ingresa dimensiones válidas (números mayores a 0).";
                    return;
                }
                errorMessageDiv.textContent = ''; 
                generateMatrixEditor(matrixId, matrixLabel, rows, cols); 

                hacerBtn.style.display = 'none';
                mostrarBtn.style.display = 'none'; 
                ocultarBtn.style.display = 'inline-block';
                updateButtonVisibility();
            });
            matrixActionButtons.appendChild(hacerBtn);

            const mostrarBtn = document.createElement("button");
            mostrarBtn.textContent = "Mostrar";
            mostrarBtn.classList.add("action-button", "show");
            mostrarBtn.style.display = 'none'; 
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
            ocultarBtn.classList.add("action-button", "hide");
            ocultarBtn.style.display = 'none'; 
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

        function generateMatrixEditor(matrixId, matrixLabel, rows, cols) {
            let matrixData;
            if (currentMatrices[matrixId] && currentMatrices[matrixId].rows === rows && currentMatrices[matrixId].cols === cols) {
                matrixData = currentMatrices[matrixId].data; 
            } else {
                matrixData = Array(rows).fill(0).map(() => Array(cols).fill(0));
            }

            let matrixContainer = document.getElementById(`editor-container-${matrixId}`);
            if (!matrixContainer) {
                matrixContainer = document.createElement("div");
                matrixContainer.classList.add("matrix-container");
                matrixContainer.id = `editor-container-${matrixId}`;
                matricesDisplaySection.appendChild(matrixContainer);
            } else {
                matrixContainer.innerHTML = ''; 
            }

            const title = document.createElement("h4");
            title.classList.add("matrix-title");
            title.textContent = `Matriz ${matrixLabel} (${rows}x${cols}):`;
            matrixContainer.appendChild(title);

            const matrixEditorActions = document.createElement("div");
            matrixEditorActions.classList.add("matrix-editor-actions");

            const minimizeBtn = document.createElement("button");
            minimizeBtn.textContent = "Minimizar";
            minimizeBtn.classList.add("action-button", "hide"); 
            minimizeBtn.addEventListener('click', () => {
                matrixContainer.classList.add('hidden');
                const matrixInputGroup = document.querySelector(`[data-matrix-id="${matrixId}"]`);
                if (matrixInputGroup) {
                    matrixInputGroup.querySelector('.action-button.hide').style.display = 'none';
                    matrixInputGroup.querySelector('.action-button.show').style.display = 'inline-block';
                    matrixInputGroup.querySelector('.action-button.hacer').style.display = 'none'; 
                }
            });
            matrixEditorActions.appendChild(minimizeBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.classList.add("action-button", "delete");
            deleteBtn.addEventListener('click', () => {
                matrixContainer.remove();
                const inputGroupToRemove = document.querySelector(`[data-matrix-id="${matrixId}"]`);
                if (inputGroupToRemove) {
                    inputGroupToRemove.remove();
                }
                delete currentMatrices[matrixId]; 
                updateButtonVisibility();
                errorMessageDiv.textContent = ''; 
                matrixResultSection.style.display = 'none'; 
                matrixResultSection.innerHTML = ''; 
            });
            matrixEditorActions.appendChild(deleteBtn);

            matrixContainer.appendChild(matrixEditorActions);

            const matrixEditorDiv = document.createElement("div");
            matrixEditorDiv.classList.add("matrix-editor");
            matrixEditorDiv.style.gridTemplateColumns = `repeat(${cols}, minmax(40px, 1fr))`; 

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const input = document.createElement("input");
                    input.type = "number";
                    input.value = (matrixData[i] && typeof matrixData[i][j] === 'number') ? matrixData[i][j] : 0;
                    input.dataset.row = i;
                    input.dataset.col = j;
                    input.addEventListener('change', (e) => {
                        const val = parseFloat(e.target.value);
                        currentMatrices[matrixId].data[parseInt(e.target.dataset.row)][parseInt(e.target.dataset.col)] = isNaN(val) ? 0 : val;
                    });
                    
                    // --- MODIFICACIÓN AQUÍ ---
                    input.addEventListener('focus', (e) => {
                        e.target.select(); // Selecciona todo el texto al enfocar
                    });
                    // --- FIN MODIFICACIÓN ---

                    matrixEditorDiv.appendChild(input);
                }
            }
            matrixContainer.appendChild(matrixEditorDiv);

            currentMatrices[matrixId] = { id: matrixId, label: matrixLabel, rows, cols, data: matrixData };

            matrixContainer.classList.remove('hidden'); 
        }

        function renderMatrixInputs() {
            clearAllMatrices(); 

            if (currentOperation === 'sum' || currentOperation === 'resta' || currentOperation === 'producto') {
                matrixCounter = 0; 
                const matrixA = createMatrixDimensionInputs("A", `matrix-${matrixCounter++}`);
                const matrixB = createMatrixDimensionInputs("B", `matrix-${matrixCounter++}`);
                matrixDimensionSection.appendChild(matrixA);
                matrixDimensionSection.appendChild(matrixB);
            } else if (currentOperation === 'transpuesta') {
                matrixCounter = 0; 
                const singleMatrix = createMatrixDimensionInputs("A", `matrix-${matrixCounter++}`);
                matrixDimensionSection.appendChild(singleMatrix);
            }
            updateButtonVisibility();
        }

        function updateButtonVisibility() {
            const numMatricesMade = Object.keys(currentMatrices).length;
            const matrixLabelsInUse = Object.values(currentMatrices).map(m => m.label);

            if ((currentOperation === 'sum' || currentOperation === 'resta' || currentOperation === 'producto')) {
                let nextCharCode = 'A'.charCodeAt(0);
                while (matrixLabelsInUse.includes(String.fromCharCode(nextCharCode)) && nextCharCode <= 'Z'.charCodeAt(0)) {
                    nextCharCode++;
                }

                if (nextCharCode > 'Z'.charCodeAt(0)) {
                    addMatrixButton.style.display = 'block';
                    addMatrixButton.disabled = true;
                } else if (currentOperation === 'resta' || currentOperation === 'producto') {
                    addMatrixButton.style.display = 'block';
                    addMatrixButton.disabled = (numMatricesMade >= 2);
                } else { 
                    addMatrixButton.style.display = 'block';
                    addMatrixButton.disabled = false;
                }
            } else {
                addMatrixButton.style.display = 'none';
            }
            
            let showPerformButton = false;
            if (currentOperation === 'sum' && numMatricesMade >= 2) {
                const allMatricesAreMade = Object.values(currentMatrices).every(m => m.data && m.data.length > 0 && m.data[0].length > 0);
                showPerformButton = allMatricesAreMade;
            } else if ((currentOperation === 'resta' || currentOperation === 'producto') && numMatricesMade === 2) {
                const allMatricesAreMade = Object.values(currentMatrices).every(m => m.data && m.data.length > 0 && m.data[0].length > 0);
                showPerformButton = allMatricesAreMade;
            } else if (currentOperation === 'transpuesta' && numMatricesMade === 1) {
                const allMatricesAreMade = Object.values(currentMatrices).every(m => m.data && m.data.length > 0 && m.data[0].length > 0);
                showPerformButton = allMatricesAreMade;
            }
            performOperationButton.style.display = showPerformButton ? 'block' : 'none';

            Object.keys(currentMatrices).forEach(matrixId => {
                const matrixInputGroup = document.querySelector(`[data-matrix-id="${matrixId}"]`);
                if (matrixInputGroup) {
                    const hacerBtn = matrixInputGroup.querySelector('.action-button.hacer');
                    if (currentMatrices[matrixId].data) {
                        hacerBtn.style.display = 'none';
                        const mostrarBtn = matrixInputGroup.querySelector('.action-button.show');
                        const ocultarBtn = matrixInputGroup.querySelector('.action-button.hide');
                        if (document.getElementById(`editor-container-${matrixId}`).classList.contains('hidden')) {
                            mostrarBtn.style.display = 'inline-block';
                            ocultarBtn.style.display = 'none';
                        } else {
                            mostrarBtn.style.display = 'none';
                            ocultarBtn.style.display = 'inline-block';
                        }
                    } else {
                        hacerBtn.style.display = 'inline-block';
                        matrixInputGroup.querySelector('.action-button.show').style.display = 'none';
                        matrixInputGroup.querySelector('.action-button.hide').style.display = 'none';
                    }
                }
            });
        }

        function clearAllMatrices() {
            currentMatrices = {};
            matrixCounter = 0;
            matricesDisplaySection.innerHTML = '';
            matrixDimensionSection.innerHTML = ''; 
            errorMessageDiv.textContent = '';
            matrixResultSection.style.display = 'none';
            matrixResultSection.innerHTML = ''; 
            addMatrixButton.style.display = 'none';
            performOperationButton.style.display = 'none';
        }

        function displayResultMatrix(resultMatrix, titleText) {
            matrixResultSection.innerHTML = '';
            matrixResultSection.style.display = 'block';

            const title = document.createElement("h4");
            title.textContent = titleText;
            matrixResultSection.appendChild(title);

            const resultEditorDiv = document.createElement("div");
            resultEditorDiv.classList.add("result-matrix-editor");
            if (resultMatrix.length > 0) {
                resultEditorDiv.style.gridTemplateColumns = `repeat(${resultMatrix[0].length}, auto)`;
            }

            for (let i = 0; i < resultMatrix.length; i++) {
                for (let j = 0; j < resultMatrix[0].length; j++) {
                    const cell = document.createElement("div");
                    cell.textContent = resultMatrix[i][j].toFixed(2); 
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
                return null; 
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

        matrixOperationSubButtonsContainer.querySelector(`[data-operation="sum"]`).classList.add('active-operation'); 
        renderMatrixInputs(); 

        addMatrixButton.addEventListener('click', () => {
            if (currentOperation === 'sum' || currentOperation === 'resta' || currentOperation === 'producto') {
                const existingLabels = Object.values(currentMatrices).map(m => m.label.charCodeAt(0));
                let nextCharCode = 'A'.charCodeAt(0);

                while (existingLabels.includes(nextCharCode) && nextCharCode <= 'Z'.charCodeAt(0)) {
                    nextCharCode++;
                }

                if (nextCharCode > 'Z'.charCodeAt(0)) {
                    errorMessageDiv.textContent = "Has alcanzado el número máximo de matrices (A-Z).";
                    addMatrixButton.disabled = true;
                    return;
                }
                
                if ((currentOperation === 'resta' || currentOperation === 'producto') && Object.keys(currentMatrices).length >= 2) {
                    errorMessageDiv.textContent = "Para Resta o Producto solo se permiten dos matrices.";
                    addMatrixButton.disabled = true;
                    return;
                }

                const newMatrixLabel = String.fromCharCode(nextCharCode);
                matrixCounter++; 
                const newMatrixInputs = createMatrixDimensionInputs(newMatrixLabel, `matrix-${matrixCounter}`);
                matrixDimensionSection.appendChild(newMatrixInputs);
                updateButtonVisibility(); 
            }
        });

        performOperationButton.addEventListener('click', () => {
            errorMessageDiv.textContent = ''; 
            matrixResultSection.style.display = 'none'; 
            matrixResultSection.innerHTML = ''; 

            const validMatricesArray = Object.values(currentMatrices)
                .filter(m => m.data && m.data.length > 0 && m.data[0].length > 0)
                .sort((a, b) => a.label.localeCompare(b.label)); 

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
                    errorMessageDiv.textContent = "La resta requiere exactamente dos matrices (A y B). Por favor, asegúrate de tener solo dos y con las dimensiones hechas.";
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
                    errorMessageDiv.textContent = "El producto requiere exactamente dos matrices (A y B). Por favor, asegúrate de tener solo dos y con las dimensiones hechas.";
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