document.addEventListener('DOMContentLoaded', function() {
    const inversaContainer = document.getElementById("inversa");
    let currentMatrix = null;
    let selectedMethod = 'adjunta'; // Método por defecto
    let calculationSteps = []; // Para almacenar los pasos de la resolución

    if (inversaContainer) {
        inversaContainer.innerHTML = ""; // Limpiar el contenido del placeholder

        const contenedorPrincipal = document.createElement("div");
        contenedorPrincipal.classList.add("inversa-content");

        const title = document.createElement("h2");
        title.textContent = "Cálculo de Matriz Inversa";
        contenedorPrincipal.appendChild(title);

        // Botones de selección de método
        const methodButtonsContainer = document.createElement("div");
        methodButtonsContainer.classList.add("method-buttons-container");

        const adjuntaBtn = createMethodButton("Método de la Adjunta", "adjunta");
        const gaussJordanBtn = createMethodButton("Método de Gauss-Jordan", "gauss-jordan");

        methodButtonsContainer.appendChild(adjuntaBtn);
        methodButtonsContainer.appendChild(gaussJordanBtn);
        contenedorPrincipal.appendChild(methodButtonsContainer);

        // Sección de entrada de la matriz
        const matrixDimensionSection = document.createElement("div");
        matrixDimensionSection.classList.add("matrix-dimension-section");
        contenedorPrincipal.appendChild(matrixDimensionSection);

        const matricesDisplaySection = document.createElement("div");
        matricesDisplaySection.classList.add("matrices-display-section");
        contenedorPrincipal.appendChild(matricesDisplaySection);

        const errorMessageDiv = document.createElement("div");
        errorMessageDiv.classList.add("error-message");
        contenedorPrincipal.appendChild(errorMessageDiv);

        // Botones de acción (Resolver y Ver Pasos)
        const inversaActionButtons = document.createElement("div");
        inversaActionButtons.classList.add("inversa-action-buttons");

        const solveBtn = document.createElement("button");
        solveBtn.textContent = "Calcular Inversa";
        solveBtn.classList.add("main-action-button", "solve");
        solveBtn.style.display = 'none';
        inversaActionButtons.appendChild(solveBtn);

        const viewStepsBtn = document.createElement("button");
        viewStepsBtn.textContent = "Ver Pasos / Teoría";
        viewStepsBtn.classList.add("main-action-button", "steps");
        viewStepsBtn.style.display = 'none';
        inversaActionButtons.appendChild(viewStepsBtn);
        contenedorPrincipal.appendChild(inversaActionButtons);

        // Sección de resultado
        const inversaResultSection = document.createElement("div");
        inversaResultSection.classList.add("inversa-result-container");
        inversaResultSection.style.display = 'none';
        contenedorPrincipal.appendChild(inversaResultSection);

        inversaContainer.appendChild(contenedorPrincipal);

        // Modal para Pasos y Teoría (copia de determinantes.js)
        const modalOverlay = document.createElement("div");
        modalOverlay.classList.add("modal-overlay");
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modal-title"></h3>
                    <button class="close-button">&times;</button>
                </div>
                <div class="modal-tabs">
                    <button class="modal-tab-button active-tab" data-tab="pasos">Pasos de Resolución</button>
                    <button class="modal-tab-button" data-tab="teoria">Teoría del Método</button>
                </div>
                <div class="modal-body">
                    <div class="tab-content active-content" id="pasos-content">
                        <h5>Pasos Detallados:</h5>
                        <div id="steps-list"></div>
                    </div>
                    <div class="tab-content" id="teoria-content">
                        <h5>Teoría del Método: <span id="teoria-method-name"></span></h5>
                        <div id="teoria-text"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        const closeButton = modalOverlay.querySelector(".close-button");
        closeButton.addEventListener('click', () => modalOverlay.classList.remove('active'));
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });

        modalOverlay.querySelectorAll('.modal-tab-button').forEach(button => {
            button.addEventListener('click', function() {
                modalOverlay.querySelectorAll('.modal-tab-button').forEach(btn => btn.classList.remove('active-tab'));
                this.classList.add('active-tab');

                modalOverlay.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active-content'));
                document.getElementById(`${this.dataset.tab}-content`).classList.add('active-content');
            });
        });

        // --- Funciones de Utilidad ---
        function createMethodButton(text, id) {
            const button = document.createElement("button");
            button.textContent = text;
            button.classList.add("calculator-button");
            button.dataset.method = id;
            button.addEventListener('click', () => {
                methodButtonsContainer.querySelectorAll('.calculator-button').forEach(btn => btn.classList.remove('active-method'));
                button.classList.add('active-method');
                selectedMethod = id;
                clearMatrixInputs();
                renderMatrixDimensionInput();
                updateActionButtonsVisibility();
                errorMessageDiv.textContent = '';
                inversaResultSection.style.display = 'none';
                inversaResultSection.innerHTML = '';
            });
            return button;
        }

        function createMatrixDimensionInput() {
            const matrixInputGroup = document.createElement("div");
            matrixInputGroup.classList.add("matrix-input-group");
            matrixInputGroup.dataset.matrixId = "main-matrix";

            const label = document.createElement("label");
            label.textContent = "Matriz A:";
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
            columnasSpan.classList.add("columnas-label"); // Añadir clase para posible ocultamiento si no es necesario
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

                if (rows !== cols) {
                    errorMessageDiv.textContent = "La matriz debe ser cuadrada para calcular su inversa.";
                    return;
                }
                
                // Restricción para Adjunta (2x2 y 3x3 para evitar complejidad de menores grandes)
                if (selectedMethod === 'adjunta' && rows > 3) {
                     errorMessageDiv.textContent = "El método de la Adjunta es más práctico para matrices 2x2 y 3x3. Para órdenes mayores, considera Gauss-Jordan.";
                     // Permitir continuar pero con advertencia
                     // return;
                }


                errorMessageDiv.textContent = '';
                generateMatrixEditor(rows, cols);
                hacerBtn.style.display = 'none';
                updateActionButtonsVisibility();
            });
            matrixActionButtons.appendChild(hacerBtn);

            matrixInputGroup.appendChild(matrixActionButtons);
            return matrixInputGroup;
        }

        function generateMatrixEditor(rows, cols) {
            let matrixData;
            if (currentMatrix && currentMatrix.rows === rows && currentMatrix.cols === cols) {
                matrixData = currentMatrix.data;
            } else {
                matrixData = Array(rows).fill(0).map(() => Array(cols).fill(0));
            }

            let matrixContainer = document.getElementById(`editor-container-main-matrix`);
            if (!matrixContainer) {
                matrixContainer = document.createElement("div");
                matrixContainer.classList.add("matrix-container");
                matrixContainer.id = `editor-container-main-matrix`;
                matricesDisplaySection.appendChild(matrixContainer);
            } else {
                matrixContainer.innerHTML = '';
            }

            const title = document.createElement("h4");
            title.classList.add("matrix-title");
            title.textContent = `Matriz A (${rows}x${cols}):`;
            matrixContainer.appendChild(title);

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
                        currentMatrix.data[parseInt(e.target.dataset.row)][parseInt(e.target.dataset.col)] = isNaN(val) ? 0 : val;
                    });
                    input.addEventListener('focus', (e) => {
                        e.target.select();
                    });
                    matrixEditorDiv.appendChild(input);
                }
            }
            matrixContainer.appendChild(matrixEditorDiv);

            currentMatrix = { id: "main-matrix", label: "A", rows, cols, data: matrixData };
            updateActionButtonsVisibility();
        }

        function renderMatrixDimensionInput() {
            matrixDimensionSection.innerHTML = '';
            matricesDisplaySection.innerHTML = '';
            currentMatrix = null;
            matrixDimensionSection.appendChild(createMatrixDimensionInput());
        }

        function updateActionButtonsVisibility() {
            const hasMatrix = currentMatrix && currentMatrix.data && currentMatrix.rows > 0;
            solveBtn.style.display = hasMatrix ? 'block' : 'none';
            viewStepsBtn.style.display = hasMatrix ? 'block' : 'none';
        }

        function clearMatrixInputs() {
            matrixDimensionSection.innerHTML = '';
            matricesDisplaySection.innerHTML = '';
            currentMatrix = null;
            errorMessageDiv.textContent = '';
            inversaResultSection.style.display = 'none';
            inversaResultSection.innerHTML = '';
        }

        function displayResultMatrix(resultMatrix, titleText) {
            inversaResultSection.innerHTML = '';
            inversaResultSection.style.display = 'block';

            const title = document.createElement("h4");
            title.textContent = titleText;
            inversaResultSection.appendChild(title);

            const resultEditorDiv = document.createElement("div");
            resultEditorDiv.classList.add("inversa-result-matrix-editor");
            if (resultMatrix.length > 0) {
                resultEditorDiv.style.gridTemplateColumns = `repeat(${resultMatrix[0].length}, minmax(60px, 1fr))`;
            }

            for (let i = 0; i < resultMatrix.length; i++) {
                for (let j = 0; j < resultMatrix[0].length; j++) {
                    const cell = document.createElement("div");
                    cell.textContent = resultMatrix[i][j].toFixed(4); // Mostrar con 4 decimales
                    resultEditorDiv.appendChild(cell);
                }
            }
            inversaResultSection.appendChild(resultEditorDiv);
        }

        // --- Lógica de Cálculo de Inversas ---

        // Helper para obtener el menor (necesario para Cofactores y Adjunta)
        function getMinor(matrix, row, col) {
            return matrix.filter((_, i) => i !== row).map(r => r.filter((_, j) => j !== col));
        }

        // Helper para calcular el determinante (usado por el método de la Adjunta)
        // Reutilizamos la lógica de determinantes, simplificada para no generar pasos detallados aquí
        function calculateDeterminant(matrix) {
            const n = matrix.length;
            if (n === 1) return matrix[0][0];
            if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

            let det = 0;
            for (let j = 0; j < n; j++) {
                const element = matrix[0][j];
                const minor = getMinor(matrix, 0, j);
                const sign = (j % 2 === 0) ? 1 : -1;
                det += sign * element * calculateDeterminant(minor);
            }
            return det;
        }

        // Método de la Matriz Adjunta
        function calculateInverseAdjunta(matrix, steps) {
            const n = matrix.length;
            if (n !== matrix[0].length) {
                throw new Error("La matriz debe ser cuadrada.");
            }

            steps.push({ title: "Verificación Inicial", description: `Calculando la inversa para una matriz ${n}x${n} utilizando el método de la Adjunta.` });

            // Paso 1: Calcular el Determinante
            steps.push({ title: "Paso 1: Calcular el Determinante de A", description: `Primero, calculamos el determinante de la matriz A. Usaremos expansión por cofactores (o Sarrus para 2x2/3x3).` });
            const detA = calculateDeterminant(matrix);
            steps.push({ title: "Resultado del Determinante", description: `$$det(A) = ${detA.toFixed(4)}$$` });

            if (Math.abs(detA) < 1e-9) { // Usar una pequeña tolerancia para flotantes
                throw new Error("El determinante es cero (o muy cercano a cero). La matriz no tiene inversa.");
            }

            // Paso 2: Calcular la Matriz de Cofactores
            steps.push({ title: "Paso 2: Calcular la Matriz de Cofactores (C)", description: `Cada elemento $$C_{ij}$$ de la matriz de cofactores se obtiene como $$C_{ij} = (-1)^{i+j} \\cdot det(M_{ij})$$, donde $$M_{ij}$$ es el menor correspondiente.` });
            const cofactorMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const minorMatrix = getMinor(matrix, i, j);
                    const minorDet = calculateDeterminant(minorMatrix);
                    const sign = ((i + j) % 2 === 0) ? 1 : -1;
                    cofactorMatrix[i][j] = sign * minorDet;
                }
            }
            steps.push({ title: "Matriz de Cofactores (C)", matrix: cofactorMatrix });

            // Paso 3: Calcular la Matriz Adjunta (Adj(A) = C^T)
            steps.push({ title: "Paso 3: Calcular la Matriz Adjunta (Adj(A))", description: `La matriz adjunta es la transpuesta de la matriz de cofactores. $$Adj(A) = C^T$$` });
            const adjugateMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    adjugateMatrix[j][i] = cofactorMatrix[i][j]; // Transponer
                }
            }
            steps.push({ title: "Matriz Adjunta (Adj(A))", matrix: adjugateMatrix });

            // Paso 4: Calcular la Inversa (A^-1 = (1/det(A)) * Adj(A))
            steps.push({ title: "Paso 4: Calcular la Inversa", description: `La matriz inversa se calcula como $$A^{-1} = \\frac{1}{det(A)} \\cdot Adj(A)$$ ` });
            const inverseMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    inverseMatrix[i][j] = adjugateMatrix[i][j] / detA;
                }
            }
            steps.push({ title: "Resultado de la Inversa (A⁻¹)", matrix: inverseMatrix });

            return inverseMatrix;
        }

        // Método de Gauss-Jordan
        function calculateInverseGaussJordan(matrix, steps) {
            const n = matrix.length;
            if (n !== matrix[0].length) {
                throw new Error("La matriz debe ser cuadrada.");
            }

            // Crear matriz aumentada [A | I]
            let augmentedMatrix = Array(n).fill(0).map((_, i) =>
                Array(2 * n).fill(0).map((_, j) => {
                    if (j < n) return matrix[i][j];
                    return (j - n === i) ? 1 : 0;
                })
            );

            steps.push({ title: "Inicio de Gauss-Jordan", description: `Se construye una matriz aumentada $$[A | I]$$, donde $$I$$ es la matriz identidad. Aplicaremos operaciones elementales de fila para transformar el lado izquierdo (A) en la matriz identidad. Lo que le suceda al lado izquierdo, le sucederá al lado derecho (I), y al final, el lado derecho será la inversa $$A^{-1}$$.` });
            steps.push({ title: "Matriz Aumentada Inicial $$[A | I]$$", matrix: augmentedMatrix });

            for (let i = 0; i < n; i++) { // Iterar sobre cada fila para hacer pivotes
                // Encontrar el pivote: buscar el elemento no-cero más grande en la columna i (desde la fila i hacia abajo)
                let pivotRow = i;
                for (let k = i + 1; k < n; k++) {
                    if (Math.abs(augmentedMatrix[k][i]) > Math.abs(augmentedMatrix[pivotRow][i])) {
                        pivotRow = k;
                    }
                }

                if (augmentedMatrix[pivotRow][i] === 0) {
                    throw new Error("La matriz es singular (determinante cero) y no tiene inversa.");
                }

                // Intercambiar filas si el pivote no está en la fila actual
                if (pivotRow !== i) {
                    [augmentedMatrix[i], augmentedMatrix[pivotRow]] = [augmentedMatrix[pivotRow], augmentedMatrix[i]];
                    steps.push({ title: `Intercambio de Filas (F${i + 1} <-> F${pivotRow + 1})`, description: `Se intercambió la fila ${i + 1} con la fila ${pivotRow + 1} para obtener un pivote adecuado.`, matrix: augmentedMatrix });
                }

                // Normalizar la fila del pivote (hacer que el pivote sea 1)
                let pivotValue = augmentedMatrix[i][i];
                if (pivotValue !== 1) { // Evitar división por 1 si ya es 1
                    steps.push({ title: `Normalización del Pivote (F${i + 1} -> F${i + 1} / ${pivotValue.toFixed(4)})`, description: `Se divide la fila ${i + 1} por el valor del pivote (${pivotValue.toFixed(4)}) para que el elemento diagonal sea 1.`, matrix: augmentedMatrix });
                    for (let j = 0; j < 2 * n; j++) {
                        augmentedMatrix[i][j] /= pivotValue;
                    }
                }
                steps.push({ title: `Matriz Aumentada (Pivote F${i + 1} normalizado)`, matrix: augmentedMatrix });


                // Hacer ceros en las otras filas de la columna actual
                for (let row = 0; row < n; row++) {
                    if (row !== i) {
                        let factor = augmentedMatrix[row][i];
                        if (factor !== 0) { // Solo si el elemento no es ya cero
                            steps.push({ title: `Operación de Fila (F${row + 1} -> F${row + 1} - ${factor.toFixed(4)} * F${i + 1})`, description: `Se resta ${factor.toFixed(4)} veces la fila ${i + 1} (fila del pivote) de la fila ${row + 1} para hacer cero el elemento en la columna ${i + 1}.`, matrix: augmentedMatrix });
                            for (let col = 0; col < 2 * n; col++) {
                                augmentedMatrix[row][col] -= factor * augmentedMatrix[i][col];
                            }
                            steps.push({ title: `Matriz Aumentada (F${row + 1} actualizada)`, matrix: augmentedMatrix });
                        }
                    }
                }
            }

            steps.push({ title: "Matriz Reducida por Filas", description: `El lado izquierdo de la matriz aumentada se ha transformado en la matriz identidad. El lado derecho es ahora la matriz inversa.`, matrix: augmentedMatrix });

            // Extraer la matriz inversa del lado derecho de la matriz aumentada
            const inverseMatrix = Array(n).fill(0).map((_, i) =>
                Array(n).fill(0).map((_, j) => augmentedMatrix[i][j + n])
            );

            steps.push({ title: "Resultado Final: Matriz Inversa (A⁻¹)", matrix: inverseMatrix });
            return inverseMatrix;
        }

        // Helper para mostrar matrices en los pasos
        function formatMatrixForSteps(matrix) {
            if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
                return '<div class="inline-matrix-display"></div>';
            }
            let html = '<div class="inline-matrix-display" style="grid-template-columns: repeat(' + matrix[0].length + ', auto);">';
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[0].length; j++) {
                    html += `<div>${matrix[i][j].toFixed(4)}</div>`;
                }
            }
            html += '</div>';
            return html;
        }

        // --- Event Listeners ---
        solveBtn.addEventListener('click', () => {
            if (!currentMatrix || currentMatrix.rows === 0) {
                errorMessageDiv.textContent = "Por favor, crea y llena una matriz para calcular su inversa.";
                return;
            }

            calculationSteps = []; // Reiniciar pasos
            let inverseResultMatrix;
            try {
                if (selectedMethod === 'adjunta') {
                    inverseResultMatrix = calculateInverseAdjunta(currentMatrix.data, calculationSteps);
                    displayResultMatrix(inverseResultMatrix, "Matriz Inversa (Método de la Adjunta)");
                } else if (selectedMethod === 'gauss-jordan') {
                    inverseResultMatrix = calculateInverseGaussJordan(currentMatrix.data, calculationSteps);
                    displayResultMatrix(inverseResultMatrix, "Matriz Inversa (Método de Gauss-Jordan)");
                }
                errorMessageDiv.textContent = '';
            } catch (error) {
                errorMessageDiv.textContent = error.message;
                inversaResultSection.style.display = 'none';
            }
        });

        viewStepsBtn.addEventListener('click', () => {
            if (!currentMatrix || currentMatrix.rows === 0) {
                errorMessageDiv.textContent = "Por favor, crea y llena una matriz para ver los pasos/teoría.";
                return;
            }

            const modalTitle = modalOverlay.querySelector("#modal-title");
            modalTitle.textContent = `Detalles de la Inversa (Matriz ${currentMatrix.rows}x${currentMatrix.cols})`;

            // Mostrar pasos
            const stepsList = modalOverlay.querySelector("#steps-list");
            stepsList.innerHTML = '';
            if (calculationSteps.length === 0) {
                try {
                    let tempSteps = [];
                    if (selectedMethod === 'adjunta') {
                        calculateInverseAdjunta(currentMatrix.data, tempSteps);
                    } else if (selectedMethod === 'gauss-jordan') {
                        calculateInverseGaussJordan(currentMatrix.data, tempSteps);
                    }
                    calculationSteps = tempSteps; // Guardar los pasos generados
                } catch (error) {
                    stepsList.innerHTML = `<p style="color:red;">Error al generar los pasos: ${error.message}</p>`;
                    return;
                }
            }

            if (calculationSteps.length > 0) {
                calculationSteps.forEach((step, index) => {
                    const stepItem = document.createElement("div");
                    stepItem.classList.add("step-item");
                    let descriptionHtml = step.description;
                    if (step.matrix) {
                        descriptionHtml += `<br>${formatMatrixForSteps(step.matrix)}`;
                    }
                    stepItem.innerHTML = `<h6>Paso ${index + 1}: ${step.title}</h6><p>${descriptionHtml}</p>`;
                    stepsList.appendChild(stepItem);
                });
            } else {
                stepsList.innerHTML = "<p>No se generaron pasos para esta operación o método. Intenta calcular la inversa primero.</p>";
            }

            // Mostrar teoría
            const teoriaMethodName = modalOverlay.querySelector("#teoria-method-name");
            const teoriaText = modalOverlay.querySelector("#teoria-text");
            teoriaMethodName.textContent = selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1).replace('-', ' ');
            teoriaText.innerHTML = getMethodTheory(selectedMethod);

            modalOverlay.classList.add('active');
            modalOverlay.querySelector('[data-tab="pasos"]').click(); // Asegurarse de que la pestaña de pasos esté activa por defecto

            MathJax.typesetPromise(); // Renderizar ecuaciones LaTeX
        });

        function getMethodTheory(method) {
            let theory = "";
            switch (method) {
                case 'adjunta':
                    theory = `
                        <p>El <strong>Método de la Matriz Adjunta</strong> para calcular la inversa de una matriz cuadrada $$A$$ (si existe) se basa en la siguiente fórmula:</p>
                        <p class="math-formula">$$A^{-1} = \\frac{1}{det(A)} \\cdot Adj(A)$$</p>
                        <p>Donde:</p>
                        <ul>
                            <li>$$det(A)$$ es el determinante de la matriz $$A$$.</li>
                            <li>$$Adj(A)$$ es la matriz adjunta de $$A$$, que es la transpuesta de la matriz de cofactores de $$A$$.</li>
                        </ul>
                        <h5>Pasos principales:</h5>
                        <ol>
                            <li><strong>Calcular el determinante ($$det(A)$$):</strong> Si $$det(A) = 0$$, la matriz es singular y no tiene inversa.</li>
                            <li><strong>Calcular la Matriz de Cofactores ($$C$$):</strong> Cada elemento $$C_{ij}$$ se obtiene como $$C_{ij} = (-1)^{i+j} \\cdot det(M_{ij})$$, donde $$M_{ij}$$ es la submatriz (menor) de $$A$$ eliminando la fila $$i$$ y la columna $$j$$.</li>
                            <li><strong>Calcular la Matriz Adjunta ($$Adj(A)$$):</strong> Se obtiene transponiendo la matriz de cofactores, es decir, $$Adj(A) = C^T$$.</li>
                            <li><strong>Multiplicar por el inverso del determinante:</strong> Finalmente, la inversa se obtiene multiplicando la matriz adjunta por $$1/det(A)$$.</li>
                        </ol>
                        <p>Este método es computacionalmente intensivo para matrices grandes, ya que requiere el cálculo de $$n^2$$ determinantes de orden $$(n-1)$$.</p>
                    `;
                    break;
                case 'gauss-jordan':
                    theory = `
                        <p>El <strong>Método de Gauss-Jordan</strong> es una forma eficiente de calcular la inversa de una matriz cuadrada $$A$$ (si existe) utilizando operaciones elementales de fila.</p>
                        <h5>Proceso:</h5>
                        <ol>
                            <li><strong>Formar la matriz aumentada:</strong> Se crea una matriz aumentada adjuntando la matriz identidad ($$I$$) de las mismas dimensiones a la matriz original $$A$$. Esto se representa como $$[A | I]$$.</li>
                            <li><strong>Aplicar operaciones elementales de fila:</strong> El objetivo es transformar el lado izquierdo (matriz $$A$$) en la matriz identidad ($$I$$) mediante una serie de operaciones elementales de fila. Las operaciones permitidas son:
                                <ul>
                                    <li>Intercambiar dos filas.</li>
                                    <li>Multiplicar una fila por un escalar no nulo.</li>
                                    <li>Sumar un múltiplo de una fila a otra fila.</li>
                                </ul>
                            </li>
                            <li><strong>Resultado:</strong> Si el lado izquierdo se convierte en la matriz identidad ($$I$$), entonces el lado derecho será la matriz inversa de $$A$$ ($$A^{-1}$$). La matriz aumentada final será $$[I | A^{-1}]$$.</li>
                        </ol>
                        <p>Si en algún punto del proceso no se puede obtener una matriz identidad en el lado izquierdo (por ejemplo, si se obtiene una fila de ceros en el lado izquierdo), significa que la matriz original es singular y no tiene inversa.</p>
                    `;
                    break;
                default:
                    theory = "<p>Selecciona un método para ver su teoría.</p>";
            }
            return theory;
        }

        // Inicialización
        adjuntaBtn.classList.add('active-method'); // Seleccionar Adjunta por defecto
        renderMatrixDimensionInput(); // Mostrar los inputs de dimensión al cargar
        updateActionButtonsVisibility(); // Ocultar botones de acción hasta que haya matriz
    }
});