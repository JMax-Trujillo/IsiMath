// Limpiar el contenedor
const determinantesContainer = document.getElementById("determinantes");
determinantesContainer.innerHTML = "";

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
title.textContent = 'Cálculo de Determinantes';
title.style.cssText = `
    color: #2c3e50;
    margin-bottom: 30px;
    font-size: 24px;
    font-weight: 600;
`;

// Botones de métodos
const methods = ['Sarrus', 'Cofactores', 'Reducción por filas'];
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
let currentMethod = 'Sarrus';
let matrixSize = 3;
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
    
    // Agregar opciones según el método
    const maxSize = currentMethod === 'Sarrus' ? 3 : 6; // Sarrus solo para 3x3
    const minSize = currentMethod === 'Sarrus' ? 3 : 2;
    
    for (let i = minSize; i <= maxSize; i++) {
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
            input.value = '0';
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
    calculateBtn.textContent = 'Calcular';
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
    calculateBtn.addEventListener('click', calculateDeterminant);
    
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

// Función para calcular determinante
function calculateDeterminant() {
    const matrix = getMatrixValues();
    let result;
    
    try {
        switch (currentMethod) {
            case 'Sarrus':
                result = calculateSarrus(matrix);
                break;
            case 'Cofactores':
                result = calculateCofactors(matrix);
                break;
            case 'Reducción por filas':
                result = calculateRowReduction(matrix);
                break;
        }
        
        showResult(result);
    } catch (error) {
        showError(error.message);
    }
}

// Método de Sarrus (solo 3x3)
function calculateSarrus(matrix) {
    if (matrix.length !== 3) {
        throw new Error('El método de Sarrus solo funciona para matrices 3x3');
    }
    
    // Diagonal principal y paralelas
    const pos = matrix[0][0] * matrix[1][1] * matrix[2][2] +
               matrix[0][1] * matrix[1][2] * matrix[2][0] +
               matrix[0][2] * matrix[1][0] * matrix[2][1];
    
    // Diagonal secundaria y paralelas
    const neg = matrix[0][2] * matrix[1][1] * matrix[2][0] +
               matrix[0][1] * matrix[1][0] * matrix[2][2] +
               matrix[0][0] * matrix[1][2] * matrix[2][1];
    
    return pos - neg;
}

// Método de Cofactores
function calculateCofactors(matrix) {
    const n = matrix.length;
    
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let j = 0; j < n; j++) {
        const minor = getMinor(matrix, 0, j);
        const cofactor = Math.pow(-1, j) * calculateCofactors(minor);
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

// Método de Reducción por filas
function calculateRowReduction(matrix) {
    const n = matrix.length;
    const mat = matrix.map(row => [...row]); // Copia de la matriz
    let det = 1;
    
    for (let i = 0; i < n; i++) {
        // Buscar pivote
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) {
                maxRow = k;
            }
        }
        
        // Intercambiar filas si es necesario
        if (maxRow !== i) {
            [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
            det *= -1;
        }
        
        // Si el pivote es 0, el determinante es 0
        if (Math.abs(mat[i][i]) < 1e-10) {
            return 0;
        }
        
        det *= mat[i][i];
        
        // Eliminación
        for (let k = i + 1; k < n; k++) {
            const factor = mat[k][i] / mat[i][i];
            for (let j = i; j < n; j++) {
                mat[k][j] -= factor * mat[i][j];
            }
        }
    }
    
    return Math.round(det * 1000000) / 1000000; // Redondear para evitar errores de precisión
}

// Función para mostrar resultado
function showResult(result) {
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
        text-align: center;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    `;
    
    const title = document.createElement('h3');
    title.textContent = `Determinante (${currentMethod})`;
    title.style.cssText = `
        margin: 0 0 15px 0;
        font-size: 20px;
        font-weight: 600;
    `;
    
    const value = document.createElement('div');
    value.textContent = result;
    value.style.cssText = `
        font-size: 32px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.2);
        padding: 20px;
        border-radius: 12px;
        backdrop-filter: blur(10px);
    `;
    
    resultContainer.appendChild(title);
    resultContainer.appendChild(value);
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

// Función para mostrar pasos
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
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        position: relative;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 20px;
        background: none;
        border: none;
        font-size: 30px;
        cursor: pointer;
        color: #666;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    `;
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = '#f0f0f0';
        closeBtn.style.color = '#333';
    });
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'none';
        closeBtn.style.color = '#666';
    });
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    const title = document.createElement('h2');
    title.textContent = `Pasos del Método de ${currentMethod}`;
    title.style.cssText = `
        color: #2c3e50;
        margin-bottom: 20px;
        font-size: 24px;
        font-weight: 600;
        padding-right: 40px;
    `;
    
    const stepsContent = document.createElement('div');
    stepsContent.innerHTML = getStepsContent();
    stepsContent.style.cssText = `
        line-height: 1.6;
        color: #333;
    `;
    
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(stepsContent);
    modal.appendChild(modalContent);
    
    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    document.body.appendChild(modal);
}

// Función para generar contenido de pasos
function getStepsContent() {
    const matrix = getMatrixValues();
    
    switch (currentMethod) {
        case 'Sarrus':
            return generateSarrusSteps(matrix);
        case 'Cofactores':
            return generateCofactorsSteps(matrix);
        case 'Reducción por filas':
            return generateRowReductionSteps(matrix);
        default:
            return '<p>Método no implementado</p>';
    }
}

// Generar pasos para Sarrus
function generateSarrusSteps(matrix) {
    if (matrix.length !== 3) return '<p>El método de Sarrus solo funciona para matrices 3x3</p>';
    
    return `
        <div style="font-family: monospace; font-size: 14px;">
            <h3>Método de Sarrus para matriz 3x3:</h3>
            <p><strong>Paso 1:</strong> Escribir la matriz y repetir las dos primeras columnas:</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                ${matrix[0][0]} ${matrix[0][1]} ${matrix[0][2]} | ${matrix[0][0]} ${matrix[0][1]}<br>
                ${matrix[1][0]} ${matrix[1][1]} ${matrix[1][2]} | ${matrix[1][0]} ${matrix[1][1]}<br>
                ${matrix[2][0]} ${matrix[2][1]} ${matrix[2][2]} | ${matrix[2][0]} ${matrix[2][1]}
            </div>
            
            <p><strong>Paso 2:</strong> Calcular productos de diagonales principales (↘):</p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 10px 0;">
                ${matrix[0][0]} × ${matrix[1][1]} × ${matrix[2][2]} = ${matrix[0][0] * matrix[1][1] * matrix[2][2]}<br>
                ${matrix[0][1]} × ${matrix[1][2]} × ${matrix[2][0]} = ${matrix[0][1] * matrix[1][2] * matrix[2][0]}<br>
                ${matrix[0][2]} × ${matrix[1][0]} × ${matrix[2][1]} = ${matrix[0][2] * matrix[1][0] * matrix[2][1]}<br>
                <strong>Suma: ${matrix[0][0] * matrix[1][1] * matrix[2][2] + matrix[0][1] * matrix[1][2] * matrix[2][0] + matrix[0][2] * matrix[1][0] * matrix[2][1]}</strong>
            </div>
            
            <p><strong>Paso 3:</strong> Calcular productos de diagonales secundarias (↙):</p>
            <div style="background: #ffe8e8; padding: 15px; border-radius: 8px; margin: 10px 0;">
                ${matrix[0][2]} × ${matrix[1][1]} × ${matrix[2][0]} = ${matrix[0][2] * matrix[1][1] * matrix[2][0]}<br>
                ${matrix[0][1]} × ${matrix[1][0]} × ${matrix[2][2]} = ${matrix[0][1] * matrix[1][0] * matrix[2][2]}<br>
                ${matrix[0][0]} × ${matrix[1][2]} × ${matrix[2][1]} = ${matrix[0][0] * matrix[1][2] * matrix[2][1]}<br>
                <strong>Suma: ${matrix[0][2] * matrix[1][1] * matrix[2][0] + matrix[0][1] * matrix[1][0] * matrix[2][2] + matrix[0][0] * matrix[1][2] * matrix[2][1]}</strong>
            </div>
            
            <p><strong>Paso 4:</strong> Determinante = Suma principal - Suma secundaria:</p>
            <div style="background: #e8f0fe; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <strong>det(A) = ${matrix[0][0] * matrix[1][1] * matrix[2][2] + matrix[0][1] * matrix[1][2] * matrix[2][0] + matrix[0][2] * matrix[1][0] * matrix[2][1]} - ${matrix[0][2] * matrix[1][1] * matrix[2][0] + matrix[0][1] * matrix[1][0] * matrix[2][2] + matrix[0][0] * matrix[1][2] * matrix[2][1]} = ${calculateSarrus(matrix)}</strong>
            </div>
        </div>
    `;
}

// Generar pasos para Cofactores
function generateCofactorsSteps(matrix) {
    const n = matrix.length;
    
    if (n === 1) {
        return `
            <div style="font-family: monospace; font-size: 14px;">
                <h3>Método de Cofactores para matriz 1x1:</h3>
                <p><strong>Resultado:</strong> Para una matriz 1x1, el determinante es el único elemento.</p>
                <div style="background: #e8f0fe; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <strong>det(A) = ${matrix[0][0]}</strong>
                </div>
            </div>
        `;
    }
    
    if (n === 2) {
        return `
            <div style="font-family: monospace; font-size: 14px;">
                <h3>Método de Cofactores para matriz 2x2:</h3>
                <p><strong>Matriz:</strong></p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    [${matrix[0][0]}  ${matrix[0][1]}]<br>
                    [${matrix[1][0]}  ${matrix[1][1]}]
                </div>
                <p><strong>Fórmula:</strong> det(A) = a₁₁×a₂₂ - a₁₂×a₂₁</p>
                <div style="background: #e8f0fe; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    det(A) = ${matrix[0][0]} × ${matrix[1][1]} - ${matrix[0][1]} × ${matrix[1][0]}<br>
                    det(A) = ${matrix[0][0] * matrix[1][1]} - ${matrix[0][1] * matrix[1][0]}<br>
                    <strong>det(A) = ${matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]}</strong>
                </div>
            </div>
        `;
    }
    
    let html = `
        <div style="font-family: monospace; font-size: 14px;">
            <h3>Método de Cofactores para matriz ${n}x${n}:</h3>
            <p><strong>Matriz original:</strong></p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
    `;
    
    // Mostrar matriz original
    for (let i = 0; i < n; i++) {
        html += '[';
        for (let j = 0; j < n; j++) {
            html += matrix[i][j];
            if (j < n - 1) html += '  ';
        }
        html += ']<br>';
    }
    html += '</div>';
    
    html += '<p><strong>Expandimos por la primera fila:</strong></p>';
    html += '<div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 10px 0;">';
    html += 'det(A) = ';
    
    let totalDet = 0;
    for (let j = 0; j < n; j++) {
        const sign = j % 2 === 0 ? '+' : '-';
        const element = matrix[0][j];
        
        if (j > 0) html += ' ';
        if (element !== 0) {
            html += `${sign} ${Math.abs(element)} × M₁${j+1}`;
            
            // Calcular menor
            const minor = getMinor(matrix, 0, j);
            const minorDet = calculateCofactors(minor);
            const cofactor = Math.pow(-1, j) * minorDet;
            
            totalDet += element * cofactor;
        }
    }
    html += '</div>';
    
    // Mostrar menores
    html += '<p><strong>Calculando los menores:</strong></p>';
    for (let j = 0; j < n; j++) {
        if (matrix[0][j] !== 0) {
            const minor = getMinor(matrix, 0, j);
            const minorDet = calculateCofactors(minor);
            const sign = j % 2 === 0 ? '+' : '-';
            
            html += `<div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 5px 0;">`;
            html += `<strong>M₁${j+1} (menor ${j+1}):</strong><br>`;
            
            // Mostrar menor
            for (let i = 0; i < minor.length; i++) {
                html += '[';
                for (let k = 0; k < minor[i].length; k++) {
                    html += minor[i][k];
                    if (k < minor[i].length - 1) html += '  ';
                }
                html += ']<br>';
            }
            html += `det(M₁${j+1}) = ${minorDet}<br>`;
            html += `Cofactor C₁${j+1} = ${sign}${minorDet} = ${Math.pow(-1, j) * minorDet}`;
            html += '</div>';
        }
    }
    
    // Resultado final
    html += '<p><strong>Cálculo final:</strong></p>';
    html += '<div style="background: #e8f0fe; padding: 15px; border-radius: 8px; margin: 10px 0;">';
    html += 'det(A) = ';
    let calculation = '';
    for (let j = 0; j < n; j++) {
        if (matrix[0][j] !== 0) {
            const minor = getMinor(matrix, 0, j);
            const minorDet = calculateCofactors(minor);
            const cofactor = Math.pow(-1, j) * minorDet;
            
            if (calculation !== '') calculation += ' + ';
            calculation += `${matrix[0][j]} × (${cofactor})`;
        }
    }
    html += calculation + '<br>';
    html += `<strong>det(A) = ${totalDet}</strong>`;
    html += '</div>';
    
    html += '</div>';
    return html;
}

// Generar pasos para Reducción por filas
function generateRowReductionSteps(matrix) {
    const n = matrix.length;
    const mat = matrix.map(row => [...row]); // Copia de la matriz
    let det = 1;
    let steps = [];
    
    let html = `
        <div style="font-family: monospace; font-size: 14px;">
            <h3>Método de Reducción por Filas para matriz ${n}x${n}:</h3>
            <p><strong>Matriz original:</strong></p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
    `;
    
    // Mostrar matriz original
    for (let i = 0; i < n; i++) {
        html += '[';
        for (let j = 0; j < n; j++) {
            html += mat[i][j].toString().padStart(6);
        }
        html += ' ]<br>';
    }
    html += '</div>';
    
    html += '<p><strong>Proceso de eliminación:</strong></p>';
    
    for (let i = 0; i < n; i++) {
        // Buscar pivote
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) {
                maxRow = k;
            }
        }
        
        // Intercambiar filas si es necesario
        if (maxRow !== i) {
            [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
            det *= -1;
            
            html += `<div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 5px 0;">`;
            html += `<strong>Paso ${i + 1}a:</strong> Intercambiar filas ${i + 1} y ${maxRow + 1} (det × -1)<br>`;
            html += `Determinante actual: det × (-1) = ${det > 0 ? '+' : ''}${det !== 1 && det !== -1 ? Math.abs(det) : ''}det<br>`;
            
            // Mostrar matriz después del intercambio
            for (let row = 0; row < n; row++) {
                html += '[';
                for (let col = 0; col < n; col++) {
                    html += mat[row][col].toString().padStart(6);
                }
                html += ' ]<br>';
            }
            html += '</div>';
        }
        
        // Verificar si el pivote es cero
        if (Math.abs(mat[i][i]) < 1e-10) {
            html += `<div style="background: #f8d7da; padding: 10px; border-radius: 8px; margin: 5px 0;">`;
            html += `<strong>Pivote en posición (${i + 1}, ${i + 1}) es cero!</strong><br>`;
            html += `Por lo tanto, det(A) = 0`;
            html += '</div>';
            html += '</div>';
            return html;
        }
        
        // Guardar el pivote para el determinante
        const pivot = mat[i][i];
        det *= pivot;
        
        html += `<div style="background: #e8f5e8; padding: 10px; border-radius: 8px; margin: 5px 0;">`;
        html += `<strong>Paso ${i + 1}b:</strong> Pivote = ${pivot.toFixed(4)}<br>`;
        html += `Determinante actual: det × ${pivot.toFixed(4)} = ${det.toFixed(4)}<br>`;
        html += `Eliminar elementos debajo del pivote:`;
        
        // Eliminación hacia adelante
        let hasElimination = false;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(mat[k][i]) > 1e-10) {
                hasElimination = true;
                const factor = mat[k][i] / mat[i][i];
                html += `<br>F${k + 1} → F${k + 1} - (${factor.toFixed(4)}) × F${i + 1}`;
                
                for (let j = i; j < n; j++) {
                    mat[k][j] -= factor * mat[i][j];
                }
            }
        }
        
        if (!hasElimination) {
            html += '<br>No hay elementos que eliminar.';
        }
        
        html += '<br><br>Matriz resultante:<br>';
        for (let row = 0; row < n; row++) {
            html += '[';
            for (let col = 0; col < n; col++) {
                const val = Math.abs(mat[row][col]) < 1e-10 ? 0 : mat[row][col];
                html += val.toFixed(2).padStart(8);
            }
            html += ' ]<br>';
        }
        html += '</div>';
    }
    
    // Resultado final
    const finalDet = Math.round(det * 1000000) / 1000000;
    html += '<p><strong>Resultado final:</strong></p>';
    html += '<div style="background: #e8f0fe; padding: 15px; border-radius: 8px; margin: 10px 0;">';
    html += 'La matriz está en forma triangular superior.<br>';
    html += 'El determinante es el producto de los elementos de la diagonal principal<br>';
    html += 'multiplicado por el factor de intercambios de filas.<br><br>';
    html += `<strong>det(A) = ${finalDet}</strong>`;
    html += '</div>';
    
    html += '</div>';
    return html;
}

// Función para renderizar método
function renderMethod(method) {
    contentArea.innerHTML = '';
    currentMethod = method;
    
    // Actualizar tamaño de matriz según el método
    if (method === 'Sarrus') {
        matrixSize = 3;
    }
    
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
determinantesContainer.appendChild(mainContainer);

// Renderizar método inicial
methodButtons['Sarrus'].dataset.active = 'true';
renderMethod('Sarrus');