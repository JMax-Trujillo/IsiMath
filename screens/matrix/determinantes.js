document.addEventListener('DOMContentLoaded', function() {
    const determinantesContainer = document.getElementById("determinantes");
    let currentMatrix = null;
    let selectedMethod = 'sarrus'; // Método por defecto
    let calculationSteps = []; // Para almacenar los pasos de la resolución

    if (determinantesContainer) {
        determinantesContainer.innerHTML = ""; // Limpiar el contenido del placeholder

        const contenedorPrincipal = document.createElement("div");
        contenedorPrincipal.classList.add("determinantes-content");

        const title = document.createElement("h2");
        title.textContent = "Cálculo de Determinantes";
        contenedorPrincipal.appendChild(title);

        // Botones de selección de método
        const methodButtonsContainer = document.createElement("div");
        methodButtonsContainer.classList.add("method-buttons-container");

        const sarrusBtn = createMethodButton("Sarrus (2x2 y 3x3)", "sarrus");
        const cofactorsBtn = createMethodButton("Expansión por Cofactores (Laplace)", "cofactores");
        const gaussBtn = createMethodButton("Reducción por Filas (Gauss)", "gauss");

        methodButtonsContainer.appendChild(sarrusBtn);
        methodButtonsContainer.appendChild(cofactorsBtn);
        methodButtonsContainer.appendChild(gaussBtn);
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
        const determinantActionButtons = document.createElement("div");
        determinantActionButtons.classList.add("determinant-action-buttons");

        const solveBtn = document.createElement("button");
        solveBtn.textContent = "Resolver Determinante";
        solveBtn.classList.add("main-action-button", "solve");
        solveBtn.style.display = 'none';
        determinantActionButtons.appendChild(solveBtn);

        const viewStepsBtn = document.createElement("button");
        viewStepsBtn.textContent = "Ver Pasos / Teoría";
        viewStepsBtn.classList.add("main-action-button", "steps");
        viewStepsBtn.style.display = 'none';
        determinantActionButtons.appendChild(viewStepsBtn);
        contenedorPrincipal.appendChild(determinantActionButtons);

        // Sección de resultado
        const determinantResultSection = document.createElement("div");
        determinantResultSection.classList.add("determinant-result-container");
        determinantResultSection.style.display = 'none';
        contenedorPrincipal.appendChild(determinantResultSection);

        determinantesContainer.appendChild(contenedorPrincipal);

        // Modal para Pasos y Teoría
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
                determinantResultSection.style.display = 'none';
                determinantResultSection.innerHTML = '';
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
                    errorMessageDiv.textContent = "Una matriz para calcular el determinante debe ser cuadrada (mismo número de filas y columnas).";
                    return;
                }
                
                if (selectedMethod === 'sarrus' && (rows > 3 || cols > 3)) {
                    errorMessageDiv.textContent = "El método de Sarrus solo es aplicable para matrices 2x2 o 3x3.";
                    return;
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
            determinantResultSection.style.display = 'none';
            determinantResultSection.innerHTML = '';
        }

        function displayDeterminantResult(result, method) {
            determinantResultSection.innerHTML = '';
            determinantResultSection.style.display = 'block';

            const title = document.createElement("h4");
            title.textContent = `Determinante por ${method}:`;
            determinantResultSection.appendChild(title);

            const value = document.createElement("div");
            value.classList.add("determinant-value");
            value.textContent = result.toFixed(4); // Mostrar con 4 decimales
            determinantResultSection.appendChild(value);
        }

        // --- Lógica de cálculo de Determinantes ---

        function getMinor(matrix, row, col) {
            return matrix.filter((_, i) => i !== row).map(r => r.filter((_, j) => j !== col));
        }

        // Sarrus (2x2 y 3x3)
        function calculateDeterminantSarrus(matrix, steps) {
            const rows = matrix.length;
            const cols = matrix[0].length;
            
            steps.push({ title: "Verificación de Dimensiones", description: `Matriz de ${rows}x${cols}. El método de Sarrus aplica para matrices 2x2 y 3x3.` });

            if (rows === 2 && cols === 2) {
                const a = matrix[0][0];
                const b = matrix[0][1];
                const c = matrix[1][0];
                const d = matrix[1][1];

                steps.push({ title: "Fórmula para 2x2", description: `Para una matriz $$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$, el determinante es $$ad - bc$$.` });
                steps.push({ title: "Sustitución de Valores", description: `Sustituyendo: $$(${a} \\times ${d}) - (${b} \\times ${c})$$`, matrix: matrix });
                steps.push({ title: "Cálculo", description: `$$${a * d} - ${b * c} = ${a * d - b * c}$$` });
                return a * d - b * c;
            } else if (rows === 3 && cols === 3) {
                steps.push({ title: "Regla de Sarrus para 3x3", description: "Se suman los productos de las diagonales principales y se restan los productos de las diagonales secundarias. Una forma de visualizarlo es duplicar las dos primeras columnas al lado de la matriz." });
                
                let val1 = matrix[0][0] * matrix[1][1] * matrix[2][2];
                let val2 = matrix[0][1] * matrix[1][2] * matrix[2][0];
                let val3 = matrix[0][2] * matrix[1][0] * matrix[2][1];
                
                let val4 = matrix[0][2] * matrix[1][1] * matrix[2][0];
                let val5 = matrix[0][0] * matrix[1][2] * matrix[2][1];
                let val6 = matrix[0][1] * matrix[1][0] * matrix[2][2];

                steps.push({ title: "Productos de Diagonales Principales (positivos)", description: `
                    $$(${matrix[0][0]} \\times ${matrix[1][1]} \\times ${matrix[2][2]}) + (${matrix[0][1]} \\times ${matrix[1][2]} \\times ${matrix[2][0]}) + (${matrix[0][2]} \\times ${matrix[1][0]} \\times ${matrix[2][1]}) $$
                    $$= (${val1}) + (${val2}) + (${val3}) = ${val1 + val2 + val3}$$
                `, matrix: matrix });

                steps.push({ title: "Productos de Diagonales Secundarias (negativos)", description: `
                    $$- ((${matrix[0][2]} \\times ${matrix[1][1]} \\times ${matrix[2][0]}) + (${matrix[0][0]} \\times ${matrix[1][2]} \\times ${matrix[2][1]}) + (${matrix[0][1]} \\times ${matrix[1][0]} \\times ${matrix[2][2]})) $$
                    $$= - (${val4} + ${val5} + ${val6}) = - (${val4 + val5 + val6})$$
                `, matrix: matrix });

                const det = (val1 + val2 + val3) - (val4 + val5 + val6);
                steps.push({ title: "Resultado Final", description: `Determinante = $$( ${val1 + val2 + val3} ) - ( ${val4 + val5 + val6} ) = ${det}$$` });
                return det;

            } else {
                throw new Error("El método de Sarrus solo aplica para matrices 2x2 y 3x3.");
            }
        }

        // Expansión por Cofactores (Laplace)
        function calculateDeterminantCofactors(matrix, steps, level = 0) {
            const rows = matrix.length;
            const cols = matrix[0].length;
            const indent = "&nbsp;&nbsp;".repeat(level * 4); // Indentación para pasos anidados

            if (rows !== cols) {
                throw new Error("La matriz debe ser cuadrada para calcular el determinante.");
            }

            if (rows === 1) {
                steps.push({ title: `${indent}Caso Base: Matriz 1x1`, description: `${indent}El determinante de una matriz 1x1 es el valor de su único elemento: $$${matrix[0][0]}$$`, matrix: matrix });
                return matrix[0][0];
            }

            if (rows === 2) {
                const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
                steps.push({ title: `${indent}Determinante 2x2`, description: `${indent}Aplicando la fórmula $$ad - bc$$: $$(${matrix[0][0]} \\times ${matrix[1][1]}) - (${matrix[0][1]} \\times ${matrix[1][0]}) = ${det}$$`, matrix: matrix });
                return det;
            }

            let determinant = 0;
            const sign = (i, j) => (i + j) % 2 === 0 ? 1 : -1;

            steps.push({ title: `${indent}Expansión por Cofactores`, description: `${indent}Vamos a expandir el determinante a lo largo de la primera fila. La fórmula es:
                $$det(A) = \\sum_{j=0}^{n-1} a_{0j} \\cdot C_{0j}$$
                donde $$C_{0j} = (-1)^{0+j} \\cdot det(M_{0j})$$ es el cofactor del elemento $$a_{0j}$$, y $$M_{0j}$$ es la submatriz obtenida eliminando la fila 0 y la columna j.`, matrix: matrix });

            for (let j = 0; j < cols; j++) {
                const element = matrix[0][j];
                const minorMatrix = getMinor(matrix, 0, j);
                const currentSign = sign(0, j);

                steps.push({ title: `${indent}Cálculo del Término para $$a_{0${j}}$$`, description: `${indent}Elemento: $$a_{0${j}} = ${element}$$. Signo: $$(-1)^{0+${j}} = ${currentSign}$$. Submatriz $$M_{0${j}}$$:`, matrix: minorMatrix });

                const minorDeterminant = calculateDeterminantCofactors(minorMatrix, steps, level + 1); // Llamada recursiva

                const term = currentSign * element * minorDeterminant;
                steps.push({ title: `${indent}Término Resultante`, description: `${indent} $$${currentSign} \\times ${element} \\times ${minorDeterminant} = ${term}$$` });
                determinant += term;
            }
            steps.push({ title: `${indent}Suma de Términos`, description: `${indent}La suma total de los términos es: ${determinant}` });
            return determinant;
        }

        // Reducción por Filas (Gauss)
        function calculateDeterminantGauss(matrix, steps) {
            let mat = matrix.map(row => [...row]); // Clonar la matriz para no modificar la original
            const n = mat.length;
            let det = 1;
            let swaps = 0;

            if (n !== mat[0].length) {
                throw new Error("La matriz debe ser cuadrada para calcular el determinante.");
            }

            steps.push({ title: "Inicio de Reducción por Filas", description: `Transformaremos la matriz en una matriz triangular superior utilizando operaciones elementales de fila. El determinante de una matriz triangular es el producto de los elementos de su diagonal principal.` });
            steps.push({ title: "Matriz Inicial", matrix: mat });

            for (let k = 0; k < n; k++) {
                // Encontrar pivote (elemento no cero en la columna actual)
                let pivotRow = k;
                while (pivotRow < n && mat[pivotRow][k] === 0) {
                    pivotRow++;
                }

                if (pivotRow === n) {
                    steps.push({ title: `Columna ${k + 1} Cero`, description: `Todos los elementos en la columna ${k + 1} desde la fila ${k + 1} hacia abajo son cero. El determinante es 0.` });
                    return 0; // Columna con todos ceros, determinante es 0
                }

                if (pivotRow !== k) {
                    // Intercambiar filas
                    [mat[k], mat[pivotRow]] = [mat[pivotRow], mat[k]];
                    det *= -1; // Cada intercambio de filas cambia el signo del determinante
                    swaps++;
                    steps.push({ title: `Intercambio de Filas (F${k + 1} <-> F${pivotRow + 1})`, description: `Se intercambió la fila ${k + 1} con la fila ${pivotRow + 1}. El signo del determinante se invierte.`, matrix: mat });
                }

                // Hacer ceros debajo del pivote
                const pivot = mat[k][k];
                steps.push({ title: `Pivote en (${k+1},${k+1})`, description: `El pivote actual es ${pivot}. Convertiremos a cero los elementos debajo de este pivote en la columna ${k+1}.`, matrix: mat });

                for (let i = k + 1; i < n; i++) {
                    const factor = mat[i][k] / pivot;
                    if (factor !== 0) {
                        steps.push({ title: `Operación de Fila (F${i + 1} -> F${i + 1} - ${factor.toFixed(4)} * F${k + 1})`, description: `Restamos ${factor.toFixed(4)} veces la fila ${k + 1} a la fila ${i + 1}.` });
                        for (let j = k; j < n; j++) {
                            mat[i][j] -= factor * mat[k][j];
                        }
                        steps.push({ title: `Matriz Actualizada`, matrix: mat });
                    }
                }
            }

            // Multiplicar los elementos de la diagonal principal
            let productOfDiagonal = 1;
            for (let i = 0; i < n; i++) {
                productOfDiagonal *= mat[i][i];
            }

            steps.push({ title: "Matriz Triangular Superior Obtenida", description: `La matriz ha sido reducida a su forma triangular superior.`, matrix: mat });
            steps.push({ title: "Producto de la Diagonal Principal", description: `El determinante es el producto de los elementos de la diagonal principal de la matriz triangular, multiplicado por el factor de signo:
                $$${productOfDiagonal} \\times ${det} = ${productOfDiagonal * det}$$` });

            return productOfDiagonal * det;
        }

        // Helper para mostrar matrices en los pasos
        function formatMatrixForSteps(matrix) {
            if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
                return '<div class="inline-matrix-display"></div>';
            }
            let html = '<div class="inline-matrix-display">';
            const rows = matrix.length;
            const cols = matrix[0].length;
            html += `<div style="grid-template-columns: repeat(${cols}, auto);">`;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    html += `<div>${matrix[i][j].toFixed(2)}</div>`;
                }
            }
            html += '</div></div>';
            return html;
        }

        // --- Event Listeners ---
        solveBtn.addEventListener('click', () => {
            if (!currentMatrix || currentMatrix.rows === 0) {
                errorMessageDiv.textContent = "Por favor, crea y llena una matriz para calcular su determinante.";
                return;
            }

            calculationSteps = []; // Reiniciar pasos
            let determinantResult;
            try {
                if (selectedMethod === 'sarrus') {
                    determinantResult = calculateDeterminantSarrus(currentMatrix.data, calculationSteps);
                    displayDeterminantResult(determinantResult, "Sarrus");
                } else if (selectedMethod === 'cofactores') {
                    determinantResult = calculateDeterminantCofactors(currentMatrix.data, calculationSteps);
                    displayDeterminantResult(determinantResult, "Expansión por Cofactores");
                } else if (selectedMethod === 'gauss') {
                    determinantResult = calculateDeterminantGauss(currentMatrix.data, calculationSteps);
                    displayDeterminantResult(determinantResult, "Reducción por Filas (Gauss)");
                }
                errorMessageDiv.textContent = '';
            } catch (error) {
                errorMessageDiv.textContent = error.message;
                determinantResultSection.style.display = 'none';
            }
        });

        viewStepsBtn.addEventListener('click', () => {
            if (!currentMatrix || currentMatrix.rows === 0) {
                errorMessageDiv.textContent = "Por favor, crea y llena una matriz para ver los pasos/teoría.";
                return;
            }

            const modalTitle = modalOverlay.querySelector("#modal-title");
            modalTitle.textContent = `Detalles de la Determinante (Matriz ${currentMatrix.rows}x${currentMatrix.cols})`;

            // Mostrar pasos
            const stepsList = modalOverlay.querySelector("#steps-list");
            stepsList.innerHTML = '';
            if (calculationSteps.length === 0) {
                 // Si no se ha calculado antes, forzar el cálculo para obtener los pasos
                try {
                    let tempSteps = [];
                    if (selectedMethod === 'sarrus') {
                        calculateDeterminantSarrus(currentMatrix.data, tempSteps);
                    } else if (selectedMethod === 'cofactores') {
                        calculateDeterminantCofactors(currentMatrix.data, tempSteps);
                    } else if (selectedMethod === 'gauss') {
                        calculateDeterminantGauss(currentMatrix.data, tempSteps);
                    }
                    calculationSteps = tempSteps; // Guardar los pasos generados
                } catch (error) {
                    stepsList.innerHTML = `<p style="color:red;">Error al generar los pasos: ${error.message}</p>`;
                    // No abrir el modal si hay un error fatal antes de generar pasos
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
                stepsList.innerHTML = "<p>No se generaron pasos para esta operación o método. Intenta resolver primero.</p>";
            }

            // Mostrar teoría
            const teoriaMethodName = modalOverlay.querySelector("#teoria-method-name");
            const teoriaText = modalOverlay.querySelector("#teoria-text");
            teoriaMethodName.textContent = selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1);
            teoriaText.innerHTML = getMethodTheory(selectedMethod);

            modalOverlay.classList.add('active');
            // Asegurarse de que la pestaña de pasos esté activa por defecto
            modalOverlay.querySelector('[data-tab="pasos"]').click();
            
            // Renderizar ecuaciones LaTeX
            MathJax.typesetPromise();
        });

        function getMethodTheory(method) {
            let theory = "";
            switch (method) {
                case 'sarrus':
                    theory = `
                        <p>La <strong>Regla de Sarrus</strong> es un método mnemotécnico para calcular el determinante de una matriz cuadrada de orden 2x2 o 3x3. No es aplicable para matrices de orden superior.</p>
                        <h5>Para una matriz 2x2:</h5>
                        <p>Dada una matriz $$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$, su determinante se calcula como:</p>
                        <p class="math-formula">$$det(A) = ad - bc$$</p>
                        <h5>Para una matriz 3x3:</h5>
                        <p>Dada una matriz $$A = \\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}$$, su determinante se calcula sumando los productos de las diagonales principales y restando los productos de las diagonales secundarias.</p>
                        <p>Una forma de visualizar esto es duplicar las dos primeras columnas al lado de la matriz:</p>
                        <pre>
a b c | a b
d e f | d e
g h i | g h
                        </pre>
                        <p>Luego, se suman los productos de las diagonales que bajan de izquierda a derecha y se restan los productos de las diagonales que suben de izquierda a derecha:</p>
                        <p class="math-formula">$$det(A) = (aei + bfg + cdh) - (ceg + afh + bdi)$$</p>
                    `;
                    break;
                case 'cofactores':
                    theory = `
                        <p>El <strong>Método de Expansión por Cofactores</strong> (también conocido como Método de Laplace) es una técnica general para calcular el determinante de cualquier matriz cuadrada. Consiste en expandir el determinante a lo largo de una fila o columna.</p>
                        <h5>Definiciones:</h5>
                        <ul>
                            <li><strong>Menor ($$M_{ij}$$):</strong> Es el determinante de la submatriz obtenida al eliminar la fila $$i$$ y la columna $$j$$ de la matriz original.</li>
                            <li><strong>Cofactor ($$C_{ij}$$):</strong> Es el menor multiplicado por $$(-1)^{i+j}$$. Es decir, $$C_{ij} = (-1)^{i+j} \\cdot M_{ij}$$.</li>
                        </ul>
                        <h5>Fórmula de Expansión:</h5>
                        <p>El determinante de una matriz $$A$$ de orden $$n \times n$$ se puede calcular expandiendo a lo largo de la fila $$i$$:</p>
                        <p class="math-formula">$$det(A) = a_{i1}C_{i1} + a_{i2}C_{i2} + \\dots + a_{in}C_{in} = \\sum_{j=1}^{n} a_{ij}C_{ij}$$</p>
                        <p>O a lo largo de la columna $$j$$:</p>
                        <p class="math-formula">$$det(A) = a_{1j}C_{1j} + a_{2j}C_{2j} + \\dots + a_{nj}C_{nj} = \\sum_{i=1}^{n} a_{ij}C_{ij}$$</p>
                        <p>Este método es recursivo, ya que el cálculo de cofactores de una matriz $$n \times n$$ requiere el cálculo de determinantes de matrices $$(n-1) \times (n-1)$$ (los menores).</p>
                    `;
                    break;
                case 'gauss':
                    theory = `
                        <p>El <strong>Método de Reducción por Filas (Gauss)</strong> para calcular determinantes se basa en la propiedad de que el determinante de una matriz triangular (superior o inferior) es el producto de los elementos de su diagonal principal.</p>
                        <p>El proceso implica transformar la matriz original en una matriz triangular utilizando operaciones elementales de fila. Se deben tener en cuenta las siguientes propiedades:</p>
                        <ul>
                            <li><strong>Intercambio de dos filas:</strong> Multiplica el determinante por -1.</li>
                            <li><strong>Multiplicación de una fila por un escalar $$k$$:</strong> Multiplica el determinante por $$k$$.</li>
                            <li><strong>Suma de un múltiplo de una fila a otra fila:</strong> No cambia el valor del determinante.</li>
                        </ul>
                        <h5>Proceso:</h5>
                        <ol>
                            <li>Transformar la matriz en una matriz triangular superior (o inferior) utilizando operaciones elementales de fila.</li>
                            <li>Registrar cualquier cambio en el determinante debido a las operaciones (principalmente intercambios de fila).</li>
                            <li>Multiplicar los elementos de la diagonal principal de la matriz triangular resultante.</li>
                            <li>Multiplicar este producto por los factores acumulados de las operaciones (por ejemplo, $$(-1)^k$$ si hubo $$k$$ intercambios de fila).</li>
                        </ol>
                        <p>Si durante el proceso de reducción una fila o columna se convierte completamente en ceros, el determinante es cero.</p>
                    `;
                    break;
                default:
                    theory = "<p>Selecciona un método para ver su teoría.</p>";
            }
            return theory;
        }

        // Inicialización
        sarrusBtn.classList.add('active-method'); // Seleccionar Sarrus por defecto
        renderMatrixDimensionInput(); // Mostrar los inputs de dimensión al cargar
        updateActionButtonsVisibility(); // Ocultar botones de acción hasta que haya matriz
    }
});