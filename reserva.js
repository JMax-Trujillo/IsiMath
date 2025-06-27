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
    const maxSize = currentMethod === 'Sarrus' ? 3 : 6;
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
    stepsBtn.textContent = 'Ver Pasos Detallados';
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
    const mat = matrix.map(row => [...row]);
    let det = 1;
    
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) {
                maxRow = k;
            }
        }
        
        if (maxRow !== i) {
            [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
            det *= -1;
        }
        
        if (Math.abs(mat[i][i]) < 1e-10) {
            return 0;
        }
        
        det *= mat[i][i];
        
        for (let k = i + 1; k < n; k++) {
            const factor = mat[k][i] / mat[i][i];
            for (let j = i; j < n; j++) {
                mat[k][j] -= factor * mat[i][j];
            }
        }
    }
    
    return Math.round(det * 1000000) / 1000000;
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

// Función mejorada para mostrar pasos detallados
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
        max-width: 90%;
        max-height: 90%;
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
    title.textContent = `Pasos Detallados: Método de ${currentMethod}`;
    title.style.cssText = `
        color: #2c3e50;
        margin-bottom: 20px;
        font-size: 24px;
        font-weight: 600;
        padding-right: 40px;
        border-bottom: 3px solid #4285f4;
        padding-bottom: 10px;
    `;
    
    const stepsContent = document.createElement('div');
    stepsContent.innerHTML = getDetailedStepsContent();
    stepsContent.style.cssText = `
        line-height: 1.8;
        color: #333;
        font-size: 16px;
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

// Función mejorada para generar contenido detallado de pasos
function getDetailedStepsContent() {
    const matrix = getMatrixValues();
    
    switch (currentMethod) {
        case 'Sarrus':
            return generateDetailedSarrusSteps(matrix);
        case 'Cofactores':
            return generateDetailedCofactorsSteps(matrix);
        case 'Reducción por filas':
            return generateDetailedRowReductionSteps(matrix);
        default:
            return '<p>Método no implementado</p>';
    }
}

// Función para crear representación visual de matriz
function createMatrixHTML(matrix, highlightCells = []) {
    const n = matrix.length;
    let html = '<table style="margin: 10px auto; border-collapse: collapse; font-family: monospace; font-size: 16px;">';
    
    for (let i = 0; i < n; i++) {
        html += '<tr>';
        for (let j = 0; j < n; j++) {
            let cellStyle = 'border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold;';
            
            // Aplicar resaltado si está especificado
            const highlight = highlightCells.find(h => h.row === i && h.col === j);
            if (highlight) {
                cellStyle += ` background: ${highlight.color}; color: ${highlight.textColor || '#000'};`;
            }
            
            html += `<td style="${cellStyle}">${matrix[i][j]}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

// Generar pasos detallados para Sarrus
function generateDetailedSarrusSteps(matrix) {
    if (matrix.length !== 3) return '<p style="color: #dc3545; font-weight: bold;">⚠️ El método de Sarrus solo funciona para matrices 3x3</p>';
    
    const pos1 = matrix[0][0] * matrix[1][1] * matrix[2][2];
    const pos2 = matrix[0][1] * matrix[1][2] * matrix[2][0];
    const pos3 = matrix[0][2] * matrix[1][0] * matrix[2][1];
    const totalPos = pos1 + pos2 + pos3;
    
    const neg1 = matrix[0][2] * matrix[1][1] * matrix[2][0];
    const neg2 = matrix[0][1] * matrix[1][0] * matrix[2][2];
    const neg3 = matrix[0][0] * matrix[1][2] * matrix[2][1];
    const totalNeg = neg1 + neg2 + neg3;
    
    const result = totalPos - totalNeg;
    
    return `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                <h3 style="color: #1565c0; margin-top: 0;">📚 ¿Qué es el Método de Sarrus?</h3>
                <p>El método de Sarrus es una técnica específica para calcular determinantes de matrices 3×3. 
                Consiste en extender la matriz agregando las dos primeras columnas al lado derecho, 
                luego sumar los productos de las diagonales principales y restar los productos de las diagonales secundarias.</p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-top: 0;">📝 Matriz Original:</h3>
                ${createMatrixHTML(matrix)}
                <p style="text-align: center; margin-top: 15px; color: #666;">
                    Esta es nuestra matriz A de 3×3 con los valores que ingresaste.
                </p>
            </div>

            <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 5px solid #ff9800;">
                <h3 style="color: #e65100; margin-top: 0;">🔄 Paso 1: Extensión de la Matriz</h3>
                <p><strong>Explicación:</strong> Para aplicar Sarrus, copiamos las dos primeras columnas al lado derecho de la matriz.</p>
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center; font-family: monospace; font-size: 18px; border: 2px dashed #ff9800;">
                    <div style="display: inline-block;">
                        ${matrix[0][0]} &nbsp;&nbsp; ${matrix[0][1]} &nbsp;&nbsp; ${matrix[0][2]} &nbsp;&nbsp;|&nbsp;&nbsp; <span style="color: #ff9800; font-weight: bold;">${matrix[0][0]} &nbsp;&nbsp; ${matrix[0][1]}</span><br>
                        ${matrix[1][0]} &nbsp;&nbsp; ${matrix[1][1]} &nbsp;&nbsp; ${matrix[1][2]} &nbsp;&nbsp;|&nbsp;&nbsp; <span style="color: #ff9800; font-weight: bold;">${matrix[1][0]} &nbsp;&nbsp; ${matrix[1][1]}</span><br>
                        ${matrix[2][0]} &nbsp;&nbsp; ${matrix[2][1]} &nbsp;&nbsp; ${matrix[2][2]} &nbsp;&nbsp;|&nbsp;&nbsp; <span style="color: #ff9800; font-weight: bold;">${matrix[2][0]} &nbsp;&nbsp; ${matrix[2][1]}</span>
                    </div>
                </div>
                <p style="color: #666; font-style: italic;">Las columnas en naranja son las repetidas para facilitar el cálculo.</p>
            </div>

            <div style="background: #e8f5e8; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 5px solid #4caf50;">
                <h3 style="color: #2e7d32; margin-top: 0;">➕ Paso 2: Diagonales Principales (↘)</h3>
                <p><strong>Explicación:</strong> Calculamos los productos de las tres diagonales que van de arriba-izquierda a abajo-derecha.</p>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h4 style="color: #2e7d32; margin-top: 0;">🔹 Primera diagonal principal:</h4>
                    <p style="margin: 10px 0; font-size: 18px;">
                        <span style="background: #c8e6c9; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${matrix[0][0]}</span> × 
                        <span style="background: #c8e6c9; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${matrix[1][1]}</span> × 
                        <span style="background: #c8e6c9; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${matrix[2][2]}</span> = 
                        <strong style="color: #2e7d32;">${pos1}</strong>
                    </p>
                    <p style="color: #666; font-size: 14px;">Elementos en posiciones (0,0), (1,1), (2,2)</p>
                </div>

                <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h4 style="color: #2e7d32; margin-top: 0;">🔹 Segunda diagonal principal:</h4>
                    <p style="margin: 10px 0; font-size: 18px;">
                        <span style="background: #c8e6c9; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${matrix[0][1]}</span> × 
                        <span style="background: #c8e6c9; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${matrix[1][2]}</span> × 
                        <span style="background: #c8e6c9; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${matrix[2][0]}</span> = 
                        <strong style="color: #2e7d32;">${pos2}</strong>
                    </p>
                    <p style="color: #666; font-size: 14px;">Elementos en posiciones (0,1), (1,2), (2,0) - usando extensión</p>
                </div>

                <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h4 style="color: #2e7d32; margin-top: 0;">🔹 Tercera diagonal principal:</h4>
                    <p style="margin: 10px 0; font-size: 18px;">
                        <span style="background: #c8e6c9; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${matrix[0][2]}</span> × 
                        <span style="background: #c8e6c9; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${matrix[1][0]}</span> × 
                        <span style="background: #c8e6c9; padding: 3px 8px; border-