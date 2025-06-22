document.addEventListener('DOMContentLoaded', function() {
    const iterativosContainer = document.getElementById("iterativos");
    let currentMatrixA = null;
    let currentVectorB = null;
    let currentVectorX0 = null; // Vector de aproximación inicial
    let selectedMethod = 'jacobi'; // Método por defecto
    let calculationSteps = []; // Para almacenar los pasos de la resolución

    if (iterativosContainer) {
        iterativosContainer.innerHTML = ""; // Limpiar el contenido del placeholder

        const contenedorPrincipal = document.createElement("div");
        contenedorPrincipal.classList.add("iterativos-content");

        const title = document.createElement("h2");
        title.textContent = "Resolución de Sistemas de Ecuaciones Lineales (Métodos Iterativos)";
        contenedorPrincipal.appendChild(title);

        // Botones de selección de método
        const methodButtonsContainer = document.createElement("div");
        methodButtonsContainer.classList.add("method-buttons-container");

        const jacobiBtn = createMethodButton("Método de Jacobi", "jacobi");
        const gaussSeidelBtn = createMethodButton("Método de Gauss-Seidel", "gauss-seidel");
        const sorBtn = createMethodButton("Método SOR", "sor");

        methodButtonsContainer.appendChild(jacobiBtn);
        methodButtonsContainer.appendChild(gaussSeidelBtn);
        methodButtonsContainer.appendChild(sorBtn);
        contenedorPrincipal.appendChild(methodButtonsContainer);

        // Sección de entrada de la matriz A y vector b
        const systemInputSection = document.createElement("div");
        systemInputSection.classList.add("system-input-section");
        contenedorPrincipal.appendChild(systemInputSection);

        const matricesAndVectorDisplaySection = document.createElement("div");
        matricesAndVectorDisplaySection.classList.add("matrices-and-vector-display-section");
        contenedorPrincipal.appendChild(matricesAndVectorDisplaySection);

        // Sección para parámetros adicionales (X0, Tolerancia, Max Iteraciones, Omega para SOR)
        const parametersSection = document.createElement("div");
        parametersSection.classList.add("parameters-section");
        contenedorPrincipal.appendChild(parametersSection);

        const errorMessageDiv = document.createElement("div");
        errorMessageDiv.classList.add("error-message");
        contenedorPrincipal.appendChild(errorMessageDiv);

        // Botones de acción (Resolver y Ver Pasos)
        const iterativosActionButtons = document.createElement("div");
        iterativosActionButtons.classList.add("iterativos-action-buttons");

        const solveBtn = document.createElement("button");
        solveBtn.textContent = "Resolver Sistema";
        solveBtn.classList.add("main-action-button", "solve");
        solveBtn.style.display = 'none';
        iterativosActionButtons.appendChild(solveBtn);

        const viewStepsBtn = document.createElement("button");
        viewStepsBtn.textContent = "Ver Pasos / Teoría";
        viewStepsBtn.classList.add("main-action-button", "steps");
        viewStepsBtn.style.display = 'none';
        iterativosActionButtons.appendChild(viewStepsBtn);
        contenedorPrincipal.appendChild(iterativosActionButtons);

        // Sección de resultado
        const iterativosResultSection = document.createElement("div");
        iterativosResultSection.classList.add("iterativos-result-container");
        iterativosResultSection.style.display = 'none';
        contenedorPrincipal.appendChild(iterativosResultSection);

        iterativosContainer.appendChild(contenedorPrincipal);

        // Modal para Pasos y Teoría (reutilizado de otros módulos)
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

        // --- Funciones de Utilidad y UI ---
        function createMethodButton(text, id) {
            const button = document.createElement("button");
            button.textContent = text;
            button.classList.add("calculator-button");
            button.dataset.method = id;
            button.addEventListener('click', () => {
                methodButtonsContainer.querySelectorAll('.calculator-button').forEach(btn => btn.classList.remove('active-method'));
                button.classList.add('active-method');
                selectedMethod = id;
                clearInputsAndResults();
                renderSystemDimensionInput();
                renderParametersSection(); // Volver a renderizar para ocultar/mostrar omega
                updateActionButtonsVisibility();
                errorMessageDiv.textContent = '';
            });
            return button;
        }

        function createSystemDimensionInput() {
            const systemInputGroup = document.createElement("div");
            systemInputGroup.classList.add("system-input-group");

            const label = document.createElement("label");
            label.textContent = "Dimensión (n):";
            systemInputGroup.appendChild(label);

            const inputDimension = document.createElement("input");
            inputDimension.type = "number";
            inputDimension.min = "1";
            inputDimension.placeholder = "0";
            inputDimension.classList.add("system-dimension-input", "dimension-input");
            systemInputGroup.appendChild(inputDimension);

            const systemActionButtons = document.createElement("div");
            systemActionButtons.classList.add("system-action-buttons");

            const hacerBtn = document.createElement("button");
            hacerBtn.textContent = "Hacer";
            hacerBtn.classList.add("action-button", "hacer");
            hacerBtn.addEventListener('click', () => {
                const n = parseInt(inputDimension.value);

                if (isNaN(n) || n <= 0) {
                    errorMessageDiv.textContent = "Por favor, ingresa una dimensión válida (número mayor a 0).";
                    return;
                }

                errorMessageDiv.textContent = '';
                generateMatrixAndVectorEditors(n);
                hacerBtn.style.display = 'none';
                updateActionButtonsVisibility();
            });
            systemActionButtons.appendChild(hacerBtn);

            systemInputGroup.appendChild(systemActionButtons);
            return systemInputGroup;
        }

        function generateMatrixAndVectorEditors(n) {
            let matrixData = currentMatrixA && currentMatrixA.rows === n ? currentMatrixA.data : Array(n).fill(0).map(() => Array(n).fill(0));
            let vectorBData = currentVectorB && currentVectorB.length === n ? currentVectorB.data : Array(n).fill(0);
            let vectorX0Data = currentVectorX0 && currentVectorX0.length === n ? currentVectorX0.data : Array(n).fill(0);

            matricesAndVectorDisplaySection.innerHTML = ''; // Limpiar contenedores existentes

            // Generar editor para Matriz A
            let matrixAContainer = document.createElement("div");
            matrixAContainer.classList.add("matrix-container");
            matrixAContainer.id = "editor-container-matrix-a";
            matricesAndVectorDisplaySection.appendChild(matrixAContainer);

            const titleA = document.createElement("h4");
            titleA.classList.add("matrix-title");
            titleA.textContent = `Matriz A (${n}x${n}):`;
            matrixAContainer.appendChild(titleA);

            const matrixAEditorDiv = document.createElement("div");
            matrixAEditorDiv.classList.add("matrix-editor");
            matrixAEditorDiv.style.gridTemplateColumns = `repeat(${n}, minmax(40px, 1fr))`;

            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const input = document.createElement("input");
                    input.type = "number";
                    input.value = (matrixData[i] && typeof matrixData[i][j] === 'number') ? matrixData[i][j] : 0;
                    input.dataset.row = i;
                    input.dataset.col = j;
                    input.addEventListener('change', (e) => {
                        const val = parseFloat(e.target.value);
                        currentMatrixA.data[parseInt(e.target.dataset.row)][parseInt(e.target.dataset.col)] = isNaN(val) ? 0 : val;
                    });
                    input.addEventListener('focus', (e) => e.target.select());
                    matrixAEditorDiv.appendChild(input);
                }
            }
            matrixAContainer.appendChild(matrixAEditorDiv);
            currentMatrixA = { id: "matrix-a", label: "A", rows: n, cols: n, data: matrixData };

            // Generar editor para Vector b
            let vectorBContainer = document.createElement("div");
            vectorBContainer.classList.add("vector-container");
            vectorBContainer.id = "editor-container-vector-b";
            matricesAndVectorDisplaySection.appendChild(vectorBContainer);

            const titleB = document.createElement("h4");
            titleB.classList.add("vector-title");
            titleB.textContent = `Vector b (${n}x1):`;
            vectorBContainer.appendChild(titleB);

            const vectorBEditorDiv = document.createElement("div");
            vectorBEditorDiv.classList.add("vector-editor");
            vectorBEditorDiv.style.gridTemplateColumns = `1fr`; // Un column para vector vertical

            for (let i = 0; i < n; i++) {
                const input = document.createElement("input");
                input.type = "number";
                input.value = typeof vectorBData[i] === 'number' ? vectorBData[i] : 0;
                input.dataset.row = i;
                input.addEventListener('change', (e) => {
                    const val = parseFloat(e.target.value);
                    currentVectorB.data[parseInt(e.target.dataset.row)] = isNaN(val) ? 0 : val;
                });
                input.addEventListener('focus', (e) => e.target.select());
                vectorBEditorDiv.appendChild(input);
            }
            vectorBContainer.appendChild(vectorBEditorDiv);
            currentVectorB = { id: "vector-b", label: "b", length: n, data: vectorBData };

            // Generar editor para Vector X0 (aproximación inicial)
            let vectorX0Container = document.createElement("div");
            vectorX0Container.classList.add("vector-container");
            vectorX0Container.id = "editor-container-vector-x0";
            matricesAndVectorDisplaySection.appendChild(vectorX0Container);

            const titleX0 = document.createElement("h4");
            titleX0.classList.add("vector-title");
            titleX0.textContent = `Vector X₀ (${n}x1):`;
            vectorX0Container.appendChild(titleX0);

            const vectorX0EditorDiv = document.createElement("div");
            vectorX0EditorDiv.classList.add("vector-editor");
            vectorX0EditorDiv.style.gridTemplateColumns = `1fr`;

            for (let i = 0; i < n; i++) {
                const input = document.createElement("input");
                input.type = "number";
                input.value = typeof vectorX0Data[i] === 'number' ? vectorX0Data[i] : 0;
                input.dataset.row = i;
                input.addEventListener('change', (e) => {
                    const val = parseFloat(e.target.value);
                    currentVectorX0.data[parseInt(e.target.dataset.row)] = isNaN(val) ? 0 : val;
                });
                input.addEventListener('focus', (e) => e.target.select());
                vectorX0EditorDiv.appendChild(input);
            }
            vectorX0Container.appendChild(vectorX0EditorDiv);
            currentVectorX0 = { id: "vector-x0", label: "X0", length: n, data: vectorX0Data };

            updateActionButtonsVisibility();
            renderParametersSection(); // Asegurarse de que los parámetros se muestren/actualicen
        }

        function renderSystemDimensionInput() {
            systemInputSection.innerHTML = '';
            matricesAndVectorDisplaySection.innerHTML = '';
            parametersSection.innerHTML = ''; // Limpiar también los parámetros
            currentMatrixA = null;
            currentVectorB = null;
            currentVectorX0 = null;
            systemInputSection.appendChild(createSystemDimensionInput());
        }

        function renderParametersSection() {
            parametersSection.innerHTML = '';

            const tolInputGroup = document.createElement("div");
            tolInputGroup.classList.add("parameter-input-group");
            tolInputGroup.innerHTML = `<label for="tolerance">Tolerancia (ε):</label><input type="number" id="tolerance" value="0.0001" step="0.00001">`;
            parametersSection.appendChild(tolInputGroup);

            const maxIterInputGroup = document.createElement("div");
            maxIterInputGroup.classList.add("parameter-input-group");
            maxIterInputGroup.innerHTML = `<label for="max-iterations">Máx. Iteraciones:</label><input type="number" id="max-iterations" value="100" min="1">`;
            parametersSection.appendChild(maxIterInputGroup);

            const omegaInputGroup = document.createElement("div");
            omegaInputGroup.classList.add("parameter-input-group");
            omegaInputGroup.id = "omega-input-group";
            omegaInputGroup.innerHTML = `<label for="omega">Factor de Relajación (ω):</label><input type="number" id="omega" value="1.2" step="0.1" min="0.1" max="1.9">`;
            parametersSection.appendChild(omegaInputGroup);

            // Ocultar omega si el método no es SOR
            if (selectedMethod !== 'sor') {
                omegaInputGroup.style.display = 'none';
            } else {
                omegaInputGroup.style.display = 'flex';
            }
        }


        function updateActionButtonsVisibility() {
            const hasSystem = currentMatrixA && currentVectorB && currentMatrixA.rows > 0 && currentVectorB.length === currentMatrixA.rows;
            solveBtn.style.display = hasSystem ? 'block' : 'none';
            viewStepsBtn.style.display = hasSystem ? 'block' : 'none';
        }

        function clearInputsAndResults() {
            systemInputSection.innerHTML = '';
            matricesAndVectorDisplaySection.innerHTML = '';
            parametersSection.innerHTML = '';
            currentMatrixA = null;
            currentVectorB = null;
            currentVectorX0 = null;
            errorMessageDiv.textContent = '';
            iterativosResultSection.style.display = 'none';
            iterativosResultSection.innerHTML = '';
            calculationSteps = [];
        }

        function displayResultVector(resultVector, titleText, iterations = null) {
            iterativosResultSection.innerHTML = '';
            iterativosResultSection.style.display = 'block';

            const title = document.createElement("h4");
            title.textContent = titleText;
            iterativosResultSection.appendChild(title);

            if (iterations !== null) {
                const iterInfo = document.createElement("p");
                iterInfo.textContent = `Convergencia en ${iterations} iteraciones.`;
                iterInfo.style.marginBottom = '1rem';
                iterativosResultSection.appendChild(iterInfo);
            }


            const resultEditorDiv = document.createElement("div");
            resultEditorDiv.classList.add("iterativos-result-vector-editor");
            resultEditorDiv.style.gridTemplateColumns = `1fr`;

            for (let i = 0; i < resultVector.length; i++) {
                const cell = document.createElement("div");
                cell.textContent = resultVector[i].toFixed(6); // Mostrar con 6 decimales
                resultEditorDiv.appendChild(cell);
            }
            iterativosResultSection.appendChild(resultEditorDiv);
        }

        // --- Funciones de Álgebra Lineal y Métodos Iterativos ---

        // Función para multiplicar matriz por vector
        function multiplyMatrixVector(matrix, vector) {
            const n = matrix.length;
            const result = Array(n).fill(0);
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    result[i] += matrix[i][j] * vector[j];
                }
            }
            return result;
        }

        // Función para calcular la norma de un vector (Euclídea)
        function norm(vector) {
            let sumSq = 0;
            for (let i = 0; i < vector.length; i++) {
                sumSq += vector[i] * vector[i];
            }
            return Math.sqrt(sumSq);
        }

        // Función para verificar dominancia diagonal estricta
        function isDiagonallyDominant(matrix) {
            const n = matrix.length;
            for (let i = 0; i < n; i++) {
                let sumOffDiagonal = 0;
                for (let j = 0; j < n; j++) {
                    if (i !== j) {
                        sumOffDiagonal += Math.abs(matrix[i][j]);
                    }
                }
                if (Math.abs(matrix[i][i]) <= sumOffDiagonal) {
                    return false;
                }
            }
            return true;
        }

        // Helper para mostrar matrices/vectores en los pasos
        function formatMatrixForSteps(matrix) {
            if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
                return '<div class="inline-matrix-display"></div>';
            }
            let html = '<div class="inline-matrix-display" style="grid-template-columns: repeat(' + matrix[0].length + ', auto);">';
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[0].length; j++) {
                    html += `<div>${matrix[i][j].toFixed(6)}</div>`;
                }
            }
            html += '</div>';
            return html;
        }

        function formatVectorForSteps(vector) {
            if (!vector || vector.length === 0) {
                return '<div class="inline-vector-display"></div>';
            }
            let html = '<div class="inline-vector-display">';
            for (let i = 0; i < vector.length; i++) {
                html += `<div>${vector[i].toFixed(6)}</div>`;
            }
            html += '</div>';
            return html;
        }

        // --- Implementación de Métodos Iterativos ---

        function jacobiMethod(A, b, x0, tol, maxIter, steps) {
            const n = A.length;
            let x = [...x0]; // x^(k)
            let xNew = Array(n).fill(0); // x^(k+1)

            steps.push({ title: "Inicio del Método de Jacobi", description: `Sistema: A = ${formatMatrixForSteps(A)}, b = ${formatVectorForSteps(b)}. Aproximación inicial x₀ = ${formatVectorForSteps(x0)}. Tolerancia = ${tol}, Máx. Iteraciones = ${maxIter}.` });
            if (!isDiagonallyDominant(A)) {
                steps.push({ title: "Advertencia de Convergencia", description: "La matriz A no es estrictamente diagonalmente dominante. El método de Jacobi podría no converger o converger lentamente." });
            }

            for (let k = 0; k < maxIter; k++) {
                let currentIterationSteps = [];
                currentIterationSteps.push(`Iteración ${k + 1}: x(${k}) = ${formatVectorForSteps(x)}`);

                for (let i = 0; i < n; i++) {
                    if (A[i][i] === 0) {
                        throw new Error(`Elemento diagonal a[${i}][${i}] es cero. El método de Jacobi no se puede aplicar.`);
                    }
                    let sum = 0;
                    for (let j = 0; j < n; j++) {
                        if (i !== j) {
                            sum += A[i][j] * x[j];
                        }
                    }
                    xNew[i] = (b[i] - sum) / A[i][i];
                }

                const residual = Array(n).fill(0);
                for(let i=0; i<n; i++) {
                    let Ax_i = 0;
                    for(let j=0; j<n; j++) {
                        Ax_i += A[i][j] * xNew[j];
                    }
                    residual[i] = b[i] - Ax_i;
                }
                const residualNorm = norm(residual);

                currentIterationSteps.push(`x(${k+1}) = ${formatVectorForSteps(xNew)}`);
                currentIterationSteps.push(`Residual: ||Ax - b|| = ${residualNorm.toFixed(8)}`);


                steps.push({
                    title: `Iteración ${k + 1}`,
                    description: currentIterationSteps.join('<br>'),
                    matrix: A, // Opcional, para referencia
                    vectorB: b,
                    vectorX: xNew,
                    residual: residualNorm
                });

                if (residualNorm < tol) {
                    steps.push({ title: "Convergencia", description: `El método de Jacobi ha convergido en ${k + 1} iteraciones con una norma residual de ${residualNorm.toFixed(8)} (menor que la tolerancia ${tol}).` });
                    return { solution: xNew, iterations: k + 1 };
                }

                x = [...xNew]; // Actualizar x para la próxima iteración
            }

            steps.push({ title: "No Convergencia", description: `El método de Jacobi no convergió después de ${maxIter} iteraciones. La norma residual final fue ${norm(multiplyMatrixVector(A, x).map((val, i) => b[i] - val)).toFixed(8)}.` });
            return { solution: x, iterations: maxIter }; // Devolver la última aproximación
        }

        function gaussSeidelMethod(A, b, x0, tol, maxIter, steps) {
            const n = A.length;
            let x = [...x0];

            steps.push({ title: "Inicio del Método de Gauss-Seidel", description: `Sistema: A = ${formatMatrixForSteps(A)}, b = ${formatVectorForSteps(b)}. Aproximación inicial x₀ = ${formatVectorForSteps(x0)}. Tolerancia = ${tol}, Máx. Iteraciones = ${maxIter}.` });
            if (!isDiagonallyDominant(A)) {
                steps.push({ title: "Advertencia de Convergencia", description: "La matriz A no es estrictamente diagonalmente dominante. El método de Gauss-Seidel podría no converger o converger lentamente." });
            }

            for (let k = 0; k < maxIter; k++) {
                let xOld = [...x]; // Para calcular el residuo o cambio
                let currentIterationSteps = [];
                currentIterationSteps.push(`Iteración ${k + 1}: x(${k}) = ${formatVectorForSteps(xOld)}`);

                for (let i = 0; i < n; i++) {
                    if (A[i][i] === 0) {
                        throw new Error(`Elemento diagonal a[${i}][${i}] es cero. El método de Gauss-Seidel no se puede aplicar.`);
                    }
                    let sum = 0;
                    for (let j = 0; j < n; j++) {
                        if (i !== j) {
                            // Usar el valor más reciente de x_j
                            sum += A[i][j] * x[j];
                        }
                    }
                    x[i] = (b[i] - sum) / A[i][i];
                }

                const residual = Array(n).fill(0);
                for(let i=0; i<n; i++) {
                    let Ax_i = 0;
                    for(let j=0; j<n; j++) {
                        Ax_i += A[i][j] * x[j];
                    }
                    residual[i] = b[i] - Ax_i;
                }
                const residualNorm = norm(residual);

                currentIterationSteps.push(`x(${k+1}) = ${formatVectorForSteps(x)}`);
                currentIterationSteps.push(`Residual: ||Ax - b|| = ${residualNorm.toFixed(8)}`);


                steps.push({
                    title: `Iteración ${k + 1}`,
                    description: currentIterationSteps.join('<br>'),
                    matrix: A,
                    vectorB: b,
                    vectorX: x,
                    residual: residualNorm
                });

                if (residualNorm < tol) {
                    steps.push({ title: "Convergencia", description: `El método de Gauss-Seidel ha convergido en ${k + 1} iteraciones con una norma residual de ${residualNorm.toFixed(8)} (menor que la tolerancia ${tol}).` });
                    return { solution: x, iterations: k + 1 };
                }
            }

            steps.push({ title: "No Convergencia", description: `El método de Gauss-Seidel no convergió después de ${maxIter} iteraciones. La norma residual final fue ${norm(multiplyMatrixVector(A, x).map((val, i) => b[i] - val)).toFixed(8)}.` });
            return { solution: x, iterations: maxIter };
        }

        function sorMethod(A, b, x0, tol, maxIter, omega, steps) {
            const n = A.length;
            let x = [...x0];

            steps.push({ title: "Inicio del Método SOR", description: `Sistema: A = ${formatMatrixForSteps(A)}, b = ${formatVectorForSteps(b)}. Aproximación inicial x₀ = ${formatVectorForSteps(x0)}. Tolerancia = ${tol}, Máx. Iteraciones = ${maxIter}. Factor de Relajación (ω) = ${omega}.` });
            if (omega <= 0 || omega >= 2) {
                steps.push({ title: "Advertencia de Convergencia (ω)", description: "El factor de relajación (ω) para SOR debe estar entre 0 y 2 para posible convergencia. Un ω fuera de este rango puede causar divergencia." });
            }

            for (let k = 0; k < maxIter; k++) {
                let xOld = [...x];
                let currentIterationSteps = [];
                currentIterationSteps.push(`Iteración ${k + 1}: x(${k}) = ${formatVectorForSteps(xOld)}`);

                for (let i = 0; i < n; i++) {
                    if (A[i][i] === 0) {
                        throw new Error(`Elemento diagonal a[${i}][${i}] es cero. El método SOR no se puede aplicar.`);
                    }
                    let sum1 = 0; // Suma de a_ij * x_j para j < i (usando valores actualizados)
                    let sum2 = 0; // Suma de a_ij * x_j para j > i (usando valores de la iteración anterior)

                    for (let j = 0; j < n; j++) {
                        if (i === j) continue;
                        if (j < i) {
                            sum1 += A[i][j] * x[j]; // Usar x[j] (ya actualizado en esta iteración)
                        } else {
                            sum2 += A[i][j] * xOld[j]; // Usar xOld[j] (de la iteración anterior)
                        }
                    }

                    // Calculo del valor de Gauss-Seidel para este componente
                    let x_gauss_seidel = (b[i] - sum1 - sum2) / A[i][i];

                    // Aplicar la relajación
                    x[i] = (1 - omega) * xOld[i] + omega * x_gauss_seidel;
                }

                const residual = Array(n).fill(0);
                for(let i=0; i<n; i++) {
                    let Ax_i = 0;
                    for(let j=0; j<n; j++) {
                        Ax_i += A[i][j] * x[j];
                    }
                    residual[i] = b[i] - Ax_i;
                }
                const residualNorm = norm(residual);

                currentIterationSteps.push(`x(${k+1}) = ${formatVectorForSteps(x)}`);
                currentIterationSteps.push(`Residual: ||Ax - b|| = ${residualNorm.toFixed(8)}`);

                steps.push({
                    title: `Iteración ${k + 1}`,
                    description: currentIterationSteps.join('<br>'),
                    matrix: A,
                    vectorB: b,
                    vectorX: x,
                    residual: residualNorm
                });

                if (residualNorm < tol) {
                    steps.push({ title: "Convergencia", description: `El método SOR ha convergido en ${k + 1} iteraciones con una norma residual de ${residualNorm.toFixed(8)} (menor que la tolerancia ${tol}).` });
                    return { solution: x, iterations: k + 1 };
                }
            }

            steps.push({ title: "No Convergencia", description: `El método SOR no convergió después de ${maxIter} iteraciones. La norma residual final fue ${norm(multiplyMatrixVector(A, x).map((val, i) => b[i] - val)).toFixed(8)}.` });
            return { solution: x, iterations: maxIter };
        }


        // --- Event Listeners ---
        solveBtn.addEventListener('click', () => {
            if (!currentMatrixA || !currentVectorB || !currentVectorX0 || currentMatrixA.rows === 0) {
                errorMessageDiv.textContent = "Por favor, crea y llena la matriz A, el vector b y la aproximación inicial x₀.";
                return;
            }

            const tol = parseFloat(document.getElementById('tolerance').value);
            const maxIter = parseInt(document.getElementById('max-iterations').value);
            let omega = 1; // Por defecto para Jacobi/Gauss-Seidel

            if (selectedMethod === 'sor') {
                omega = parseFloat(document.getElementById('omega').value);
                if (isNaN(omega) || omega <= 0 || omega >= 2) {
                    errorMessageDiv.textContent = "Para el método SOR, el factor de relajación (ω) debe estar entre 0 y 2 (exclusivo).";
                    return;
                }
            }

            if (isNaN(tol) || tol <= 0) {
                errorMessageDiv.textContent = "Por favor, ingresa una tolerancia válida (número positivo).";
                return;
            }
            if (isNaN(maxIter) || maxIter <= 0) {
                errorMessageDiv.textContent = "Por favor, ingresa un número máximo de iteraciones válido (entero positivo).";
                return;
            }

            calculationSteps = []; // Reiniciar pasos
            let result;
            try {
                if (selectedMethod === 'jacobi') {
                    result = jacobiMethod(currentMatrixA.data, currentVectorB.data, currentVectorX0.data, tol, maxIter, calculationSteps);
                } else if (selectedMethod === 'gauss-seidel') {
                    result = gaussSeidelMethod(currentMatrixA.data, currentVectorB.data, currentVectorX0.data, tol, maxIter, calculationSteps);
                } else if (selectedMethod === 'sor') {
                    result = sorMethod(currentMatrixA.data, currentVectorB.data, currentVectorX0.data, tol, maxIter, omega, calculationSteps);
                }
                displayResultVector(result.solution, "Vector Solución X", result.iterations);
                errorMessageDiv.textContent = '';
            } catch (error) {
                errorMessageDiv.textContent = error.message;
                iterativosResultSection.style.display = 'none';
            }
        });

        viewStepsBtn.addEventListener('click', () => {
            if (!currentMatrixA || !currentVectorB || !currentVectorX0 || currentMatrixA.rows === 0) {
                errorMessageDiv.textContent = "Por favor, crea y llena la matriz A, el vector b y la aproximación inicial x₀ para ver los pasos/teoría.";
                return;
            }

            const modalTitle = modalOverlay.querySelector("#modal-title");
            modalTitle.textContent = `Detalles del Método Iterativo (Sistema ${currentMatrixA.rows}x${currentMatrixA.rows})`;

            // Mostrar pasos
            const stepsList = modalOverlay.querySelector("#steps-list");
            stepsList.innerHTML = '';

            // Si los pasos no se han generado, intenta generarlos
            if (calculationSteps.length === 0) {
                try {
                    const tol = parseFloat(document.getElementById('tolerance').value);
                    const maxIter = parseInt(document.getElementById('max-iterations').value);
                    let omega = 1;
                    if (selectedMethod === 'sor') {
                        omega = parseFloat(document.getElementById('omega').value);
                    }
                    let tempSteps = [];
                    if (selectedMethod === 'jacobi') {
                        jacobiMethod(currentMatrixA.data, currentVectorB.data, currentVectorX0.data, tol, maxIter, tempSteps);
                    } else if (selectedMethod === 'gauss-seidel') {
                        gaussSeidelMethod(currentMatrixA.data, currentVectorB.data, currentVectorX0.data, tol, maxIter, tempSteps);
                    } else if (selectedMethod === 'sor') {
                        sorMethod(currentMatrixA.data, currentVectorB.data, currentVectorX0.data, tol, maxIter, omega, tempSteps);
                    }
                    calculationSteps = tempSteps; // Guardar los pasos generados
                } catch (error) {
                    stepsList.innerHTML = `<p style="color:red;">Error al generar los pasos: ${error.message}</p>`;
                    // No abrir el modal si hay un error crítico que impide generar pasos
                    return;
                }
            }

            if (calculationSteps.length > 0) {
                calculationSteps.forEach((step, index) => {
                    const stepItem = document.createElement("div");
                    stepItem.classList.add("step-item");
                    // Asegúrate de que las matrices/vectores se formateen correctamente
                    let descriptionHtml = step.description;
                    if (step.matrix) {
                        // descriptionHtml += `<br>Matriz A: ${formatMatrixForSteps(step.matrix)}`;
                    }
                    if (step.vectorX) {
                        // descriptionHtml += `<br>Aproximación x(${index}): ${formatVectorForSteps(step.vectorX)}`;
                    }
                    if (step.residual !== undefined) {
                        // descriptionHtml += `<br>Residual: ${step.residual.toFixed(8)}`;
                    }

                    stepItem.innerHTML = `<h6>${step.title}</h6><p>${descriptionHtml}</p>`;
                    stepsList.appendChild(stepItem);
                });
            } else {
                stepsList.innerHTML = "<p>No se generaron pasos para esta operación o método. Intenta resolver el sistema primero.</p>";
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
                case 'jacobi':
                    theory = `
                        <p>El <strong>Método de Jacobi</strong> es un método iterativo para resolver sistemas de ecuaciones lineales de la forma $$Ax = b$$. Se basa en descomponer la matriz $$A$$ en una parte diagonal ($$D$$), una parte triangular inferior ($$L$$) y una parte triangular superior ($$U$$), de tal forma que $$A = L + D + U$$.</p>
                        <p>La fórmula de iteración es:</p>
                        <p class="math-formula">$$x^{(k+1)} = D^{-1}(b - (L+U)x^{(k)})$$</p>
                        <p>En forma componente, para cada $$x_i$$:</p>
                        <p class="math-formula">$$x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j \\neq i} a_{ij} x_j^{(k)} \\right)$$.</p>
                        <p>Es importante destacar que todos los valores de $$x_j^{(k)}$$ del lado derecho corresponden a la iteración anterior $$k$$. La actualización es **simultánea**.</p>
                        <h5>Condición de Convergencia Suficiente:</h5>
                        <p>El método de Jacobi converge si la matriz $$A$$ es **estrictamente diagonalmente dominante por filas**, es decir, para cada fila $$i$$:</p>
                        <p class="math-formula">$$|a_{ii}| > \\sum_{j \\neq i} |a_{ij}|$$</p>
                        <p>Aunque esta es una condición suficiente, no es necesaria para la convergencia.</p>
                    `;
                    break;
                case 'gauss-seidel':
                    theory = `
                        <p>El <strong>Método de Gauss-Seidel</strong> es una mejora del método de Jacobi. También resuelve sistemas $$Ax = b$$ de forma iterativa. La diferencia clave radica en que utiliza los valores actualizados de las incógnitas tan pronto como están disponibles en la misma iteración.</p>
                        <p>La fórmula de iteración es:</p>
                        <p class="math-formula">$$x^{(k+1)} = (D+L)^{-1}(b - U x^{(k)})$$</p>
                        <p>En forma componente:</p>
                        <p class="math-formula">$$x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j < i} a_{ij} x_j^{(k+1)} - \\sum_{j > i} a_{ij} x_j^{(k)} \\right)$$</p>
                        <p>Observe que los términos con $$j < i$$ (elementos ya calculados en la iteración actual) utilizan el superíndice $$(k+1)$$, mientras que los términos con $$j > i$$ (elementos aún no calculados) utilizan el superíndice $$(k)$$.</p>
                        <h5>Condición de Convergencia Suficiente:</h5>
                        <p>Similar a Jacobi, Gauss-Seidel converge si la matriz $$A$$ es estrictamente diagonalmente dominante por filas. También converge si $$A$$ es simétrica y definida positiva.</p>
                        <p>Generalmente, Gauss-Seidel converge más rápido que Jacobi, si converge.</p>
                    `;
                    break;
                case 'sor':
                    theory = `
                        <p>El <strong>Método de Sobrerrelajación Sucesiva (SOR)</strong> es una generalización del método de Gauss-Seidel que introduce un factor de relajación $$\omega$$ (omega) para acelerar o estabilizar la convergencia.</p>
                        <p>La actualización de SOR se basa en una combinación lineal de la aproximación anterior y la aproximación que daría Gauss-Seidel para el mismo componente:</p>
                        <p class="math-formula">$$x_i^{(k+1)} = (1-\\omega)x_i^{(k)} + \\omega \\cdot \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j < i} a_{ij} x_j^{(k+1)} - \\sum_{j > i} a_{ij} x_j^{(k)} \\right)$$</p>
                        <p>Donde:</p>
                        <ul>
                            <li>Si $$\\omega = 1$$, SOR se reduce exactamente al método de Gauss-Seidel.</li>
                            <li>Si $$0 < \\omega < 1$$, se llama <strong>subrelajación</strong> y se usa para estabilizar la convergencia.</li>
                            <li>Si $$1 < \\omega < 2$$, se llama <strong>sobrerrelajación</strong> y se usa para acelerar la convergencia.</li>
                        </ul>
                        <h5>Condición de Convergencia:</h5>
                        <p>El método SOR converge si la matriz $$A$$ es simétrica y definida positiva, y si el factor de relajación $$\omega$$ está en el rango $$0 < \\omega < 2$$.</p>
                        <p>La elección del $$\omega$$ óptimo es crítica para el rendimiento del método y a menudo se determina experimentalmente o mediante técnicas más avanzadas.</p>
                    `;
                    break;
                default:
                    theory = "<p>Selecciona un método para ver su teoría.</p>";
            }
            return theory;
        }

        // Inicialización
        jacobiBtn.classList.add('active-method'); // Seleccionar Jacobi por defecto
        renderSystemDimensionInput(); // Mostrar los inputs de dimensión al cargar
        updateActionButtonsVisibility(); // Ocultar botones de acción hasta que haya matriz
    }
});