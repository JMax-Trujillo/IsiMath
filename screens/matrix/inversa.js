document.addEventListener('DOMContentLoaded', function() {
    // Limpiar el contenedor
    const inversaContainer = document.getElementById("inversa");
    inversaContainer.innerHTML = "";

    // Crear estructura principal
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        display: flex;
        width: 100%;
        height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #f8f9fa;
    `;

    // Panel izquierdo - Métodos
    const leftPanel = document.createElement('div');
    leftPanel.style.cssText = `
        width: 280px;
        background: white;
        border-right: 1px solid #e9ecef;
        padding: 20px;
        box-shadow: 2px 0 10px rgba(0,0,0,0.05);
    `;

    // Título
    const title = document.createElement('h2');
    title.textContent = 'Cálculo de Matriz Inversa';
    title.style.cssText = `
        color: #2c3e50;
        margin-bottom: 30px;
        font-size: 24px;
        font-weight: 600;
    `;

    // Botones de métodos
    const methods = ['Método de Adjunta', 'Método de Gauss-Jordan'];
    const methodButtons = {};

    methods.forEach((method, index) => {
        const btn = document.createElement('button');
        btn.textContent = method;
        btn.style.cssText = `
            width: 100%;
            padding: 15px 20px;
            margin-bottom: 15px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            background: ${index === 0 ? '#4285f4' : '#e8f0fe'};
            color: ${index === 0 ? 'white' : '#5f6368'};
        `;
        
        btn.addEventListener('mouseenter', () => {
            if (btn.dataset.active !== 'true') {
                btn.style.background = '#e8f0fe';
                btn.style.color = '#4285f4';
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (btn.dataset.active !== 'true') {
                btn.style.background = '#e8f0fe';
                btn.style.color = '#5f6368';
            }
        });
        
        methodButtons[method] = btn;
        leftPanel.appendChild(btn);
    });

    // Panel derecho - Contenido
    const rightPanel = document.createElement('div');
    rightPanel.style.cssText = `
        flex: 1;
        padding: 30px;
        overflow-y: auto;
        background: #f8f9fa;
    `;

    // Área de contenido
    const contentArea = document.createElement('div');
    contentArea.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 2px 20px rgba(0,0,0,0.08);
        min-height: 400px;
    `;

    // Variables globales
    let currentMethod = 'Método de Adjunta';
    let matrixSize = 2;
    let matrixInputs = [];

    // Función para crear selector de tamaño
    function createSizeSelector() {
        const selectorContainer = document.createElement('div');
        selectorContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
        `;
        
        const label = document.createElement('label');
        label.textContent = 'Tamaño de la matriz:';
        label.style.cssText = `
            color: #5f6368;
            font-weight: 500;
            font-size: 16px;
        `;
        
        const select = document.createElement('select');
        select.style.cssText = `
            padding: 10px 15px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 16px;
            background: white;
            cursor: pointer;
            transition: border-color 0.2s;
        `;
        
        // Agregar opciones de tamaño (2x2 a 5x5)
        for (let i = 2; i <= 5; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}x${i}`;
            if (i === matrixSize) option.selected = true;
            select.appendChild(option);
        }
        
        select.addEventListener('focus', () => select.style.borderColor = '#4285f4');
        select.addEventListener('blur', () => select.style.borderColor = '#e9ecef');
        select.addEventListener('change', () => {
            matrixSize = parseInt(select.value);
            renderMatrix();
        });
        
        selectorContainer.appendChild(label);
        selectorContainer.appendChild(select);
        
        return selectorContainer;
    }

    // Función para crear matriz
    function renderMatrix() {
        const existingMatrix = document.getElementById('matrix-container');
        if (existingMatrix) {
            existingMatrix.remove();
        }
        
        const matrixContainer = document.createElement('div');
        matrixContainer.id = 'matrix-container';
        matrixContainer.style.cssText = `
            margin-bottom: 30px;
        `;
        
        const matrixTitle = document.createElement('h3');
        matrixTitle.textContent = 'Matriz A';
        matrixTitle.style.cssText = `
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 600;
        `;
        
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${matrixSize}, 1fr);
            gap: 12px;
            max-width: 500px;
            margin: 0 auto;
            padding: 25px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        `;
        
        matrixInputs = [];
        for (let i = 0; i < matrixSize; i++) {
            matrixInputs[i] = [];
            for (let j = 0; j < matrixSize; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.value = i === j ? '1' : '0'; // Matriz identidad por defecto
                input.style.cssText = `
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 500;
                    background: rgba(255, 255, 255, 0.9);
                    transition: all 0.2s;
                    backdrop-filter: blur(10px);
                `;
                input.addEventListener('focus', () => {
                    input.style.background = 'white';
                    input.style.boxShadow = '0 0 0 3px rgba(66, 133, 244, 0.3)';
                });
                input.addEventListener('blur', () => {
                    input.style.background = 'rgba(255, 255, 255, 0.9)';
                    input.style.boxShadow = 'none';
                });
                matrixInputs[i][j] = input;
                grid.appendChild(input);
            }
        }
        
        matrixContainer.appendChild(matrixTitle);
        matrixContainer.appendChild(grid);
        
        // Insertar antes de los botones
        const buttonContainer = document.getElementById('button-container');
        contentArea.insertBefore(matrixContainer, buttonContainer);
    }

    // Función para crear botones de acción
    function createActionButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'button-container';
        buttonContainer.style.cssText = `
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 30px;
        `;
        
        const calculateBtn = document.createElement('button');
        calculateBtn.textContent = 'Calcular Inversa';
        calculateBtn.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 18px;
            font-weight: 600;
            transition: transform 0.2s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        `;
        calculateBtn.addEventListener('mouseenter', () => calculateBtn.style.transform = 'translateY(-2px)');
        calculateBtn.addEventListener('mouseleave', () => calculateBtn.style.transform = 'translateY(0)');
        calculateBtn.addEventListener('click', calculateInverse);
        
        const stepsBtn = document.createElement('button');
        stepsBtn.textContent = 'Ver Pasos';
        stepsBtn.style.cssText = `
            background: #34a853;
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 18px;
            font-weight: 600;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(52, 168, 83, 0.4);
        `;
        stepsBtn.addEventListener('mouseenter', () => {
            stepsBtn.style.transform = 'translateY(-2px)';
            stepsBtn.style.background = '#2d8c47';
        });
        stepsBtn.addEventListener('mouseleave', () => {
            stepsBtn.style.transform = 'translateY(0)';
            stepsBtn.style.background = '#34a853';
        });
        stepsBtn.addEventListener('click', showSteps);
        
        buttonContainer.appendChild(calculateBtn);
        buttonContainer.appendChild(stepsBtn);
        
        return buttonContainer;
    }

    // Función para obtener valores de la matriz
    function getMatrixValues() {
        const values = [];
        for (let i = 0; i < matrixSize; i++) {
            values[i] = [];
            for (let j = 0; j < matrixSize; j++) {
                values[i][j] = parseFloat(matrixInputs[i][j].value) || 0;
            }
        }
        return values;
    }

    // Función para calcular determinante (necesario para verificar inversibilidad)
    function calculateDeterminant(matrix) {
        const n = matrix.length;
        
        if (n === 1) return matrix[0][0];
        if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        
        let det = 0;
        for (let j = 0; j < n; j++) {
            const minor = getMinor(matrix, 0, j);
            const cofactor = Math.pow(-1, j) * calculateDeterminant(minor);
            det += matrix[0][j] * cofactor;
        }
        
        return det;
    }

    // Obtener menor de una matriz
    function getMinor(matrix, row, col) {
        const n = matrix.length;
        const minor = [];
        
        for (let i = 0; i < n; i++) {
            if (i === row) continue;
            const newRow = [];
            for (let j = 0; j < n; j++) {
                if (j === col) continue;
                newRow.push(matrix[i][j]);
            }
            minor.push(newRow);
        }
        
        return minor;
    }

    // Función para calcular matriz inversa
    function calculateInverse() {
        const matrix = getMatrixValues();
        
        try {
            // Verificar que la matriz sea invertible
            const det = calculateDeterminant(matrix);
            if (Math.abs(det) < 1e-10) {
                throw new Error('La matriz no es invertible (determinante = 0)');
            }
            
            let result;
            switch (currentMethod) {
                case 'Método de Adjunta':
                    result = calculateAdjugateMethod(matrix);
                    break;
                case 'Método de Gauss-Jordan':
                    result = calculateGaussJordanMethod(matrix);
                    break;
            }
            
            showResult(result, det);
        } catch (error) {
            showError(error.message);
        }
    }

    // Método de la Adjunta
    function calculateAdjugateMethod(matrix) {
        const n = matrix.length;
        const det = calculateDeterminant(matrix);
        
        // Calcular matriz de cofactores
        const cofactorMatrix = [];
        for (let i = 0; i < n; i++) {
            cofactorMatrix[i] = [];
            for (let j = 0; j < n; j++) {
                const minor = getMinor(matrix, i, j);
                const minorDet = calculateDeterminant(minor);
                cofactorMatrix[i][j] = Math.pow(-1, i + j) * minorDet;
            }
        }
        
        // Transponer la matriz de cofactores para obtener la adjunta
        const adjugate = [];
        for (let i = 0; i < n; i++) {
            adjugate[i] = [];
            for (let j = 0; j < n; j++) {
                adjugate[i][j] = cofactorMatrix[j][i];
            }
        }
        
        // Dividir cada elemento por el determinante
        const inverse = [];
        for (let i = 0; i < n; i++) {
            inverse[i] = [];
            for (let j = 0; j < n; j++) {
                inverse[i][j] = adjugate[i][j] / det;
            }
        }
        
        return inverse;
    }

    // Método de Gauss-Jordan
    function calculateGaussJordanMethod(matrix) {
        const n = matrix.length;
        
        // Crear matriz aumentada [A|I]
        const augmented = [];
        for (let i = 0; i < n; i++) {
            augmented[i] = [];
            for (let j = 0; j < n; j++) {
                augmented[i][j] = matrix[i][j];
            }
            // Agregar matriz identidad
            for (let j = 0; j < n; j++) {
                augmented[i][n + j] = i === j ? 1 : 0;
            }
        }
        
        // Eliminación de Gauss-Jordan
        for (let i = 0; i < n; i++) {
            // Buscar el pivote máximo
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }
            
            // Intercambiar filas si es necesario
            if (maxRow !== i) {
                [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
            }
            
            // Verificar que el pivote no sea cero
            if (Math.abs(augmented[i][i]) < 1e-10) {
                throw new Error('La matriz no es invertible');
            }
            
            // Hacer el pivote igual a 1
            const pivot = augmented[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= pivot;
            }
            
            // Eliminar la columna
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = augmented[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                }
            }
        }
        
        // Extraer la matriz inversa (parte derecha de la matriz aumentada)
        const inverse = [];
        for (let i = 0; i < n; i++) {
            inverse[i] = [];
            for (let j = 0; j < n; j++) {
                inverse[i][j] = augmented[i][n + j];
            }
        }
        
        return inverse;
    }

    // Función para mostrar resultado
    function showResult(inverse, det) {
        const existingResult = document.getElementById('result-display');
        if (existingResult) {
            existingResult.remove();
        }
        
        const resultContainer = document.createElement('div');
        resultContainer.id = 'result-display';
        resultContainer.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 16px;
            margin-top: 30px;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        `;
        
        const title = document.createElement('h3');
        title.textContent = `Matriz Inversa (${currentMethod})`;
        title.style.cssText = `
            margin: 0 0 15px 0;
            font-size: 20px;
            font-weight: 600;
            text-align: center;
        `;
        
        const detInfo = document.createElement('div');
        detInfo.textContent = `Determinante: ${det.toFixed(6)}`;
        detInfo.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.2);
            padding: 10px;
            border-radius: 8px;
        `;
        
        // Crear grid para mostrar la matriz inversa
        const matrixGrid = document.createElement('div');
        matrixGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${matrixSize}, 1fr);
            gap: 8px;
            max-width: 500px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
        `;
        
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                const cell = document.createElement('div');
                cell.textContent = inverse[i][j].toFixed(4);
                cell.style.cssText = `
                    background: rgba(255, 255, 255, 0.9);
                    color: #333;
                    padding: 12px;
                    border-radius: 6px;
                    text-align: center;
                    font-weight: 500;
                    font-family: monospace;
                `;
                matrixGrid.appendChild(cell);
            }
        }
        
        resultContainer.appendChild(title);
        resultContainer.appendChild(detInfo);
        resultContainer.appendChild(matrixGrid);
        contentArea.appendChild(resultContainer);
    }

    // Función para mostrar error
    function showError(message) {
        const existingError = document.getElementById('error-display');
        if (existingError) {
            existingError.remove();
        }
        
        const errorContainer = document.createElement('div');
        errorContainer.id = 'error-display';
        errorContainer.style.cssText = `
            background: #dc3545;
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin-top: 20px;
            text-align: center;
            font-size: 16px;
            font-weight: 500;
        `;
        errorContainer.textContent = message;
        
        contentArea.appendChild(errorContainer);
        
        setTimeout(() => {
            errorContainer.remove();
        }, 5000);
    }

    // Función para mostrar pasos (placeholder)
    function showSteps() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 16px;
            max-width: 500px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
        `;
        
        const title = document.createElement('h2');
        title.textContent = 'Pasos del Cálculo';
        title.style.cssText = `
            color: #2c3e50;
            margin-bottom: 20px;
        `;
        
        const message = document.createElement('p');
        message.textContent = 'La funcionalidad de mostrar pasos será implementada próximamente.';
        message.style.cssText = `
            color: #666;
            font-size: 16px;
            margin-bottom: 20px;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Cerrar';
        closeBtn.style.cssText = `
            background: #4285f4;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
        `;
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modalContent.appendChild(title);
        modalContent.appendChild(message);
        modalContent.appendChild(closeBtn);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
    }

    // Función para renderizar método
    function renderMethod(method) {
        contentArea.innerHTML = '';
        currentMethod = method;
        
        const methodTitle = document.createElement('h2');
        methodTitle.textContent = `Método: ${method}`;
        methodTitle.style.cssText = `
            color: #2c3e50;
            margin-bottom: 30px;
            font-size: 28px;
            font-weight: 600;
        `;
        
        contentArea.appendChild(methodTitle);
        contentArea.appendChild(createSizeSelector());
        contentArea.appendChild(createActionButtons());
        
        renderMatrix();
    }

    // Event listeners para botones de método
    Object.keys(methodButtons).forEach(method => {
        methodButtons[method].addEventListener('click', () => {
            // Actualizar botón activo
            Object.values(methodButtons).forEach(btn => {
                btn.style.background = '#e8f0fe';
                btn.style.color = '#5f6368';
                btn.dataset.active = 'false';
            });
            
            methodButtons[method].style.background = '#4285f4';
            methodButtons[method].style.color = 'white';
            methodButtons[method].dataset.active = 'true';
            
            renderMethod(method);
        });
    });

    // Inicializar
    leftPanel.appendChild(title);
    rightPanel.appendChild(contentArea);
    mainContainer.appendChild(leftPanel);
    mainContainer.appendChild(rightPanel);
    inversaContainer.appendChild(mainContainer);

    // Renderizar método inicial
    methodButtons['Método de Adjunta'].dataset.active = 'true';
    renderMethod('Método de Adjunta');
});