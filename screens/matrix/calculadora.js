// Limpiar el contenedor
const container = document.getElementById('calculadora-basica');
container.textContent = '';

// Crear estructura principal
const mainContainer = document.createElement('div');
mainContainer.style.cssText = `
    display: flex;
    width: 100%;
    height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f8f9fa;
`;

// Panel izquierdo - Navegación
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
title.textContent = 'Calculadora de Matrices';
title.style.cssText = `
    color: #2c3e50;
    margin-bottom: 30px;
    font-size: 24px;
    font-weight: 600;
`;

// Botones de operación
const operations = ['Suma', 'Resta', 'Producto', 'Traspuesta'];
const operationButtons = {};

operations.forEach((op, index) => {
    const btn = document.createElement('button');
    btn.textContent = op;
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
    
    operationButtons[op] = btn;
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
let currentOperation = 'Suma';
let matrices = {};
let matrixCounter = 0;

// Función para crear sección de matriz
function createMatrixSection(id, canDelete = true) {
    const section = document.createElement('div');
    section.style.cssText = `
        background: #f8f9fa;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 25px;
        border: 2px solid #e9ecef;
        transition: all 0.3s ease;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    `;
    
    const matrixLabel = document.createElement('h3');
    matrixLabel.textContent = `Matriz ${id}`;
    matrixLabel.style.cssText = `
        color: #2c3e50;
        font-size: 20px;
        font-weight: 600;
        margin: 0;
    `;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
    `;
    
    if (canDelete) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.style.cssText = `
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
        `;
        deleteBtn.addEventListener('mouseenter', () => deleteBtn.style.background = '#c82333');
        deleteBtn.addEventListener('mouseleave', () => deleteBtn.style.background = '#dc3545');
        deleteBtn.addEventListener('click', () => {
            delete matrices[id];
            section.remove();
        });
        buttonContainer.appendChild(deleteBtn);
    }
    
    header.appendChild(matrixLabel);
    header.appendChild(buttonContainer);
    
    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
        display: flex;
        gap: 20px;
        align-items: center;
        margin-bottom: 20px;
    `;
    
    const rowsContainer = document.createElement('div');
    rowsContainer.style.cssText = `flex: 1;`;
    const rowsLabel = document.createElement('label');
    rowsLabel.textContent = 'Filas:';
    rowsLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        color: #5f6368;
        font-weight: 500;
    `;
    const rowsInput = document.createElement('input');
    rowsInput.type = 'number';
    rowsInput.min = '1';
    rowsInput.max = '10';
    rowsInput.value = '2';
    rowsInput.style.cssText = `
        width: 100%;
        padding: 12px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.2s;
    `;
    rowsInput.addEventListener('focus', () => rowsInput.style.borderColor = '#4285f4');
    rowsInput.addEventListener('blur', () => rowsInput.style.borderColor = '#e9ecef');
    
    const colsContainer = document.createElement('div');
    colsContainer.style.cssText = `flex: 1;`;
    const colsLabel = document.createElement('label');
    colsLabel.textContent = 'Columnas:';
    colsLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        color: #5f6368;
        font-weight: 500;
    `;
    const colsInput = document.createElement('input');
    colsInput.type = 'number';
    colsInput.min = '1';
    colsInput.max = '10';
    colsInput.value = '2';
    colsInput.style.cssText = `
        width: 100%;
        padding: 12px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.2s;
    `;
    colsInput.addEventListener('focus', () => colsInput.style.borderColor = '#4285f4');
    colsInput.addEventListener('blur', () => colsInput.style.borderColor = '#e9ecef');
    
    const modifyBtn = document.createElement('button');
    modifyBtn.textContent = 'Modificar';
    modifyBtn.style.cssText = `
        background: #4285f4;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        transition: background 0.2s;
        white-space: nowrap;
    `;
    modifyBtn.addEventListener('mouseenter', () => modifyBtn.style.background = '#3367d6');
    modifyBtn.addEventListener('mouseleave', () => modifyBtn.style.background = '#4285f4');
    
    rowsContainer.appendChild(rowsLabel);
    rowsContainer.appendChild(rowsInput);
    colsContainer.appendChild(colsLabel);
    colsContainer.appendChild(colsInput);
    
    inputContainer.appendChild(rowsContainer);
    inputContainer.appendChild(colsContainer);
    inputContainer.appendChild(modifyBtn);
    
    const matrixContainer = document.createElement('div');
    matrixContainer.style.cssText = `
        margin-top: 20px;
        display: none;
    `;
    
    let matrixVisible = false;
    
    modifyBtn.addEventListener('click', () => {
        const rows = parseInt(rowsInput.value);
        const cols = parseInt(colsInput.value);
        
        if (rows < 1 || cols < 1 || rows > 10 || cols > 10) {
            alert('Las dimensiones deben estar entre 1 y 10');
            return;
        }
        
        if (!matrixVisible) {
            // Mostrar matriz
            matrixContainer.innerHTML = '';
            matrixContainer.style.display = 'block';
            
            const grid = document.createElement('div');
            grid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(${cols}, 1fr);
                gap: 10px;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            `;
            
            const inputs = [];
            for (let i = 0; i < rows; i++) {
                inputs[i] = [];
                for (let j = 0; j < cols; j++) {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.value = '0';
                    input.style.cssText = `
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #e9ecef;
                        border-radius: 8px;
                        text-align: center;
                        font-size: 16px;
                        font-weight: 500;
                        transition: all 0.2s;
                    `;
                    input.addEventListener('focus', () => {
                        input.style.borderColor = '#4285f4';
                        input.style.boxShadow = '0 0 0 3px rgba(66, 133, 244, 0.1)';
                    });
                    input.addEventListener('blur', () => {
                        input.style.borderColor = '#e9ecef';
                        input.style.boxShadow = 'none';
                    });
                    inputs[i][j] = input;
                    grid.appendChild(input);
                }
            }
            
            matrixContainer.appendChild(grid);
            matrices[id] = { rows, cols, inputs };
            matrixVisible = true;
        } else {
            // Ocultar matriz
            matrixContainer.style.display = 'none';
            matrixVisible = false;
        }
    });
    
    section.appendChild(header);
    section.appendChild(inputContainer);
    section.appendChild(matrixContainer);
    
    return section;
}

// Función para crear botón de añadir matriz
function createAddMatrixButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Añadir otra matriz';
    btn.style.cssText = `
        background: #34a853;
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 12px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        transition: background 0.2s;
        margin-bottom: 30px;
    `;
    btn.addEventListener('mouseenter', () => btn.style.background = '#2d8c47');
    btn.addEventListener('mouseleave', () => btn.style.background = '#34a853');
    
    btn.addEventListener('click', () => {
        matrixCounter++;
        const id = String.fromCharCode(65 + matrixCounter);
        const section = createMatrixSection(id, true);
        contentArea.insertBefore(section, btn);
    });
    
    return btn;
}

// Función para crear botón de calcular
function createCalculateButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Calcular';
    btn.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 15px 40px;
        border-radius: 12px;
        cursor: pointer;
        font-size: 18px;
        font-weight: 600;
        transition: transform 0.2s;
        margin: 20px 0;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    `;
    btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
    btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
    
    btn.addEventListener('click', calculate);
    
    return btn;
}

// Función para mostrar resultado
function showResult(result, operation) {
    const existingResult = document.getElementById('result-container');
    if (existingResult) {
        existingResult.remove();
    }
    
    const resultContainer = document.createElement('div');
    resultContainer.id = 'result-container';
    resultContainer.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        border-radius: 16px;
        margin-top: 30px;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    `;
    
    const title = document.createElement('h3');
    title.textContent = `Resultado - ${operation}`;
    title.style.cssText = `
        margin: 0 0 20px 0;
        font-size: 22px;
        font-weight: 600;
    `;
    
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${result[0].length}, 1fr);
        gap: 12px;
        max-width: 600px;
        margin: 0 auto;
    `;
    
    result.forEach(row => {
        row.forEach(value => {
            const cell = document.createElement('div');
            cell.textContent = value;
            cell.style.cssText = `
                background: rgba(255, 255, 255, 0.2);
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                font-size: 18px;
                font-weight: 500;
                backdrop-filter: blur(10px);
            `;
            grid.appendChild(cell);
        });
    });
    
    resultContainer.appendChild(title);
    resultContainer.appendChild(grid);
    contentArea.appendChild(resultContainer);
}

// Función para mostrar error
function showError(message) {
    const existingError = document.getElementById('error-container');
    if (existingError) {
        existingError.remove();
    }
    
    const errorContainer = document.createElement('div');
    errorContainer.id = 'error-container';
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

// Función para obtener valores de matriz
function getMatrixValues(id) {
    const matrix = matrices[id];
    if (!matrix) return null;
    
    const values = [];
    for (let i = 0; i < matrix.rows; i++) {
        values[i] = [];
        for (let j = 0; j < matrix.cols; j++) {
            values[i][j] = parseFloat(matrix.inputs[i][j].value) || 0;
        }
    }
    return values;
}

// Función para calcular
function calculate() {
    const existingResult = document.getElementById('result-container');
    const existingError = document.getElementById('error-container');
    if (existingResult) existingResult.remove();
    if (existingError) existingError.remove();
    
    try {
        let result;
        
        switch (currentOperation) {
            case 'Suma':
                result = calculateSum();
                break;
            case 'Resta':
                result = calculateSubtraction();
                break;
            case 'Producto':
                result = calculateProduct();
                break;
            case 'Traspuesta':
                result = calculateTranspose();
                break;
        }
        
        if (result) {
            showResult(result, currentOperation);
        }
    } catch (error) {
        showError(error.message);
    }
}

// Operaciones matemáticas
function calculateSum() {
    const matrixIds = Object.keys(matrices);
    if (matrixIds.length < 2) {
        throw new Error('Se necesitan al menos 2 matrices para sumar');
    }
    
    const firstMatrix = getMatrixValues(matrixIds[0]);
    const rows = firstMatrix.length;
    const cols = firstMatrix[0].length;
    
    // Verificar dimensiones
    for (let i = 1; i < matrixIds.length; i++) {
        const matrix = getMatrixValues(matrixIds[i]);
        if (matrix.length !== rows || matrix[0].length !== cols) {
            throw new Error('Todas las matrices deben tener las mismas dimensiones para sumar');
        }
    }
    
    // Sumar matrices
    const result = Array(rows).fill().map(() => Array(cols).fill(0));
    
    matrixIds.forEach(id => {
        const matrix = getMatrixValues(id);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[i][j] += matrix[i][j];
            }
        }
    });
    
    return result;
}

function calculateSubtraction() {
    const matrixIds = Object.keys(matrices);
    if (matrixIds.length !== 2) {
        throw new Error('Se necesitan exactamente 2 matrices para restar');
    }
    
    const matrixA = getMatrixValues(matrixIds[0]);
    const matrixB = getMatrixValues(matrixIds[1]);
    
    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        throw new Error('Las matrices deben tener las mismas dimensiones para restar');
    }
    
    const result = Array(matrixA.length).fill().map(() => Array(matrixA[0].length).fill(0));
    
    for (let i = 0; i < matrixA.length; i++) {
        for (let j = 0; j < matrixA[0].length; j++) {
            result[i][j] = matrixA[i][j] - matrixB[i][j];
        }
    }
    
    return result;
}

function calculateProduct() {
    const matrixIds = Object.keys(matrices);
    if (matrixIds.length !== 2) {
        throw new Error('Se necesitan exactamente 2 matrices para multiplicar');
    }
    
    const matrixA = getMatrixValues(matrixIds[0]);
    const matrixB = getMatrixValues(matrixIds[1]);
    
    if (matrixA[0].length !== matrixB.length) {
        throw new Error('El número de columnas de la primera matriz debe ser igual al número de filas de la segunda');
    }
    
    const rows = matrixA.length;
    const cols = matrixB[0].length;
    const result = Array(rows).fill().map(() => Array(cols).fill(0));
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            for (let k = 0; k < matrixA[0].length; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }
    
    return result;
}

function calculateTranspose() {
    const matrixIds = Object.keys(matrices);
    if (matrixIds.length !== 1) {
        throw new Error('Se necesita exactamente 1 matriz para transponer');
    }
    
    const matrix = getMatrixValues(matrixIds[0]);
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    const result = Array(cols).fill().map(() => Array(rows).fill(0));
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    
    return result;
}

// Función para renderizar operación
function renderOperation(operation) {
    contentArea.innerHTML = '';
    matrices = {};
    matrixCounter = 0;
    
    const operationTitle = document.createElement('h2');
    operationTitle.textContent = `Operación: ${operation}`;
    operationTitle.style.cssText = `
        color: #2c3e50;
        margin-bottom: 30px;
        font-size: 28px;
        font-weight: 600;
    `;
    contentArea.appendChild(operationTitle);
    
    switch (operation) {
        case 'Suma':
            const sectionA = createMatrixSection('A', false);
            const sectionB = createMatrixSection('B', false);
            contentArea.appendChild(sectionA);
            contentArea.appendChild(sectionB);
            matrixCounter = 1;
            contentArea.appendChild(createAddMatrixButton());
            break;
            
        case 'Resta':
        case 'Producto':
            const sectionA2 = createMatrixSection('A', false);
            const sectionB2 = createMatrixSection('B', false);
            contentArea.appendChild(sectionA2);
            contentArea.appendChild(sectionB2);
            break;
            
        case 'Traspuesta':
            const sectionA3 = createMatrixSection('A', false);
            contentArea.appendChild(sectionA3);
            break;
    }
    
    contentArea.appendChild(createCalculateButton());
}

// Event listeners para botones de operación
Object.keys(operationButtons).forEach(op => {
    operationButtons[op].addEventListener('click', () => {
        // Actualizar botón activo
        Object.values(operationButtons).forEach(btn => {
            btn.style.background = '#e8f0fe';
            btn.style.color = '#5f6368';
            btn.dataset.active = 'false';
        });
        
        operationButtons[op].style.background = '#4285f4';
        operationButtons[op].style.color = 'white';
        operationButtons[op].dataset.active = 'true';
        
        currentOperation = op;
        renderOperation(op);
    });
});

// Inicializar
leftPanel.appendChild(title);
rightPanel.appendChild(contentArea);
mainContainer.appendChild(leftPanel);
mainContainer.appendChild(rightPanel);
container.appendChild(mainContainer);

// Renderizar operación inicial
operationButtons['Suma'].dataset.active = 'true';
renderOperation('Suma');