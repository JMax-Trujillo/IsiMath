document.addEventListener('DOMContentLoaded', () => {
    const contentDerivada = document.getElementById('derivadas');
    contentDerivada.textContent = "";

    // Crear la estructura principal
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        display: flex;
        gap: 30px;
        max-width: 1400px;
        margin: 20px auto;
        padding: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
    `;

    // Panel izquierdo - Función y Parámetros
    const leftPanel = document.createElement('div');
    leftPanel.style.cssText = `
        flex: 1;
        background: white;
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        max-width: 450px;
        height: fit-content;
    `;

    // Título con ícono
    const title = document.createElement('h2');
    title.innerHTML = '📊 Función y Parámetros';
    title.style.cssText = `
        color: #6366f1;
        margin-bottom: 25px;
        font-size: 24px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    // Info box
    const infoBox = document.createElement('div');
    infoBox.style.cssText = `
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        border: 2px solid #f59e0b;
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 25px;
        position: relative;
        overflow: hidden;
    `;
    
    const infoIcon = document.createElement('div');
    infoIcon.innerHTML = '💡';
    infoIcon.style.cssText = `
        font-size: 20px;
        margin-bottom: 10px;
    `;
    
    const infoText = document.createElement('div');
    infoText.innerHTML = `
        <strong>Información</strong><br>
        Ingresa tu función usando sintaxis matemática estándar.<br>
        Puedes usar x como variable principal.
    `;
    infoText.style.cssText = `
        font-size: 14px;
        color: #92400e;
        line-height: 1.5;
    `;
    
    infoBox.appendChild(infoIcon);
    infoBox.appendChild(infoText);

    // Campo de función con MathLive
    const functionLabel = document.createElement('label');
    functionLabel.textContent = 'Función f(x):';
    functionLabel.style.cssText = `
        display: block;
        margin-bottom: 10px;
        font-weight: 600;
        color: #374151;
        font-size: 16px;
    `;

    const mathField = document.createElement('math-field');
    mathField.style.cssText = `
        width: 100%;
        min-height: 60px;
        border: 3px solid #e5e7eb;
        border-radius: 15px;
        padding: 15px;
        font-size: 18px;
        margin-bottom: 25px;
        transition: all 0.3s ease;
        background: #f9fafb;
    `;
    mathField.setAttribute('virtual-keyboard-mode', 'manual');
    mathField.value = 'x^2 + 3x + 1';

    // Estilo focus para math-field
    mathField.addEventListener('focus', () => {
        mathField.style.borderColor = '#6366f1';
        mathField.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
        mathField.style.background = 'white';
    });

    mathField.addEventListener('blur', () => {
        mathField.style.borderColor = '#e5e7eb';
        mathField.style.boxShadow = 'none';
        mathField.style.background = '#f9fafb';
    });

    // Tipo de derivada
    const derivativeLabel = document.createElement('label');
    derivativeLabel.textContent = 'Tipo de Derivada:';
    derivativeLabel.style.cssText = `
        display: block;
        margin-bottom: 15px;
        font-weight: 600;
        color: #374151;
        font-size: 16px;
    `;

    const derivativeButtons = document.createElement('div');
    derivativeButtons.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 25px;
    `;

    const derivativeTypes = [
        { id: 'first', label: "Primera (f')", value: 1 },
        { id: 'second', label: 'Segunda (f")', value: 2 },
        { id: 'third', label: 'Tercera (f\'\'\')', value: 3 },
        { id: 'nth', label: 'n-ésima', value: 'n' }
    ];

    let selectedDerivative = 1;
    const buttons = {};

    derivativeTypes.forEach(type => {
        const button = document.createElement('button');
        button.textContent = type.label;
        button.style.cssText = `
            padding: 12px 15px;
            border: 2px solid #e5e7eb;
            background: white;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 14px;
        `;
        
        if (type.value === 1) {
            button.style.background = '#6366f1';
            button.style.color = 'white';
            button.style.borderColor = '#6366f1';
        }

        button.addEventListener('click', () => {
            // Deseleccionar todos
            Object.values(buttons).forEach(btn => {
                btn.style.background = 'white';
                btn.style.color = '#374151';
                btn.style.borderColor = '#e5e7eb';
            });
            
            // Seleccionar actual
            button.style.background = '#6366f1';
            button.style.color = 'white';
            button.style.borderColor = '#6366f1';
            
            selectedDerivative = type.value;
            
            // Mostrar/ocultar campo n
            if (type.value === 'n') {
                nInput.style.display = 'block';
                nLabel.style.display = 'block';
            } else {
                nInput.style.display = 'none';
                nLabel.style.display = 'none';
            }
            
            calculateDerivative();
        });

        buttons[type.id] = button;
        derivativeButtons.appendChild(button);
    });

    // Campo para n-ésima derivada
    const nLabel = document.createElement('label');
    nLabel.textContent = 'Orden de la derivada (n):';
    nLabel.style.cssText = `
        display: none;
        margin-bottom: 10px;
        font-weight: 600;
        color: #374151;
        font-size: 16px;
    `;

    const nInput = document.createElement('input');
    nInput.type = 'number';
    nInput.value = '4';
    nInput.min = '1';
    nInput.style.cssText = `
        display: none;
        width: 100%;
        padding: 15px;
        border: 3px solid #e5e7eb;
        border-radius: 12px;
        font-size: 16px;
        margin-bottom: 25px;
        transition: all 0.3s ease;
    `;

    // Punto de evaluación
    const pointLabel = document.createElement('label');
    pointLabel.textContent = 'Punto de evaluación (opcional):';
    pointLabel.style.cssText = `
        display: block;
        margin-bottom: 10px;
        font-weight: 600;
        color: #374151;
        font-size: 16px;
    `;

    const pointInput = document.createElement('input');
    pointInput.type = 'number';
    pointInput.value = '1';
    pointInput.step = '0.1';
    pointInput.style.cssText = `
        width: 100%;
        padding: 15px;
        border: 3px solid #e5e7eb;
        border-radius: 12px;
        font-size: 16px;
        margin-bottom: 25px;
        transition: all 0.3s ease;
    `;

    // Botón de calcular
    const calculateButton = document.createElement('button');
    calculateButton.innerHTML = '📊 Calcular Derivada';
    calculateButton.style.cssText = `
        width: 100%;
        padding: 18px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 15px;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
    `;

    calculateButton.addEventListener('mouseenter', () => {
        calculateButton.style.transform = 'translateY(-2px)';
        calculateButton.style.boxShadow = '0 15px 30px rgba(99, 102, 241, 0.4)';
    });

    calculateButton.addEventListener('mouseleave', () => {
        calculateButton.style.transform = 'translateY(0)';
        calculateButton.style.boxShadow = '0 10px 20px rgba(99, 102, 241, 0.3)';
    });

    // Ejemplos
    const examplesTitle = document.createElement('h3');
    examplesTitle.innerHTML = '🎯 Ejemplos de funciones:';
    examplesTitle.style.cssText = `
        color: #6366f1;
        margin: 30px 0 15px 0;
        font-size: 18px;
        font-weight: 600;
    `;

    const examples = [
        'x^2 + 3x + 1',
        'x^3 - 2x^2 + 5x - 3',
        'sin(x) + cos(x)',
        'e^x * ln(x)',
        'sqrt(x) + x^{1/3}',
        'tan(x) / (x^2 + 1)',
        '2x^4 - 3x^3 + x^2 - 7',
        'e^{x^2} + ln(x+1)'
    ];

    const examplesList = document.createElement('ul');
    examplesList.style.cssText = `
        list-style: none;
        padding: 0;
        margin: 0;
    `;

    examples.forEach(example => {
        const li = document.createElement('li');
        li.textContent = `• ${example}`;
        li.style.cssText = `
            padding: 8px 0;
            color: #6b7280;
            cursor: pointer;
            transition: color 0.3s ease;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        `;
        
        li.addEventListener('click', () => {
            mathField.value = example;
            calculateDerivative();
        });
        
        li.addEventListener('mouseenter', () => {
            li.style.color = '#6366f1';
        });
        
        li.addEventListener('mouseleave', () => {
            li.style.color = '#6b7280';
        });
        
        examplesList.appendChild(li);
    });

    // Panel derecho - Gráfica y Análisis
    const rightPanel = document.createElement('div');
    rightPanel.style.cssText = `
        flex: 2;
        background: white;
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        min-height: 600px;
    `;

    const rightTitle = document.createElement('h2');
    rightTitle.innerHTML = '📈 Gráfica y Análisis';
    rightTitle.style.cssText = `
        color: #6366f1;
        margin-bottom: 25px;
        font-size: 24px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    // Área de gráfica
    const plotContainer = document.createElement('div');
    plotContainer.id = 'plotContainer';
    plotContainer.style.cssText = `
        width: 100%;
        height: 400px;
        border: 3px solid #e5e7eb;
        border-radius: 15px;
        margin-bottom: 25px;
        background: #f9fafb;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        font-size: 18px;
    `;
    plotContainer.innerHTML = '📈 Ingrese una función y presione "Calcular Derivada"';

    // Área de resultados
    const resultsContainer = document.createElement('div');
    resultsContainer.style.cssText = `
        background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
        border: 3px solid #0ea5e9;
        border-radius: 15px;
        padding: 25px;
        min-height: 150px;
    `;

    const resultsTitle = document.createElement('h3');
    resultsTitle.innerHTML = '🔍 Resultados del Análisis';
    resultsTitle.style.cssText = `
        color: #0c4a6e;
        margin-bottom: 15px;
        font-size: 20px;
        font-weight: 600;
    `;

    const resultsContent = document.createElement('div');
    resultsContent.innerHTML = 'Los resultados aparecerán aquí después de calcular la derivada.';
    resultsContent.style.cssText = `
        color: #0c4a6e;
        font-size: 16px;
        line-height: 1.6;
    `;

    // Área de errores
    const errorContainer = document.createElement('div');
    errorContainer.style.cssText = `
        display: none;
        background: linear-gradient(135deg, #fef2f2, #fee2e2);
        border: 3px solid #ef4444;
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 25px;
    `;

    const errorIcon = document.createElement('span');
    errorIcon.innerHTML = '⚠️ ';
    errorIcon.style.cssText = `
        font-size: 18px;
    `;

    const errorText = document.createElement('span');
    errorText.style.cssText = `
        color: #dc2626;
        font-weight: 600;
        font-size: 16px;
    `;

    errorContainer.appendChild(errorIcon);
    errorContainer.appendChild(errorText);

    // Función para mostrar errores
    function showError(message) {
        errorText.textContent = message;
        errorContainer.style.display = 'block';
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }

    // Función para convertir LaTeX/MathLive a sintaxis de math.js
    function convertMathLiveToMathJS(latexStr) {
        let mathFunction = latexStr;
        
        console.log('Entrada original:', latexStr);
        
        // Remover espacios extra
        mathFunction = mathFunction.replace(/\s+/g, '');
        
        // Primero, manejar las potencias con llaves: x^{2} -> x^2
        mathFunction = mathFunction.replace(/\^\\{([^}]+)\\}/g, '^$1');
        mathFunction = mathFunction.replace(/\^\{([^}]+)\}/g, '^$1');
        
        // Luego convertir todas las potencias a formato math.js
        mathFunction = mathFunction.replace(/\^(\d+)/g, '**$1');
        mathFunction = mathFunction.replace(/\^(\w+)/g, '**$1');
        mathFunction = mathFunction.replace(/\^(\([^)]+\))/g, '**$1');
        
        // Remover llaves restantes
        mathFunction = mathFunction.replace(/[{}]/g, '');
        
        // Convertir multiplicaciones implícitas DESPUÉS de manejar potencias
        mathFunction = mathFunction.replace(/(\d)([a-zA-Z])/g, '$1*$2'); // 3x -> 3*x
        mathFunction = mathFunction.replace(/([a-zA-Z])(\d)/g, '$1*$2'); // x3 -> x*3
        mathFunction = mathFunction.replace(/(\))([a-zA-Z\d])/g, '$1*$2'); // (x+1)x -> (x+1)*x
        mathFunction = mathFunction.replace(/([a-zA-Z\d])(\()/g, '$1*$2'); // x(x+1) -> x*(x+1)
        
        // Funciones trigonométricas y matemáticas
        mathFunction = mathFunction.replace(/\\sin/g, 'sin');
        mathFunction = mathFunction.replace(/\\cos/g, 'cos');
        mathFunction = mathFunction.replace(/\\tan/g, 'tan');
        mathFunction = mathFunction.replace(/\\ln/g, 'log');
        mathFunction = mathFunction.replace(/\\log/g, 'log10');
        mathFunction = mathFunction.replace(/\\sqrt/g, 'sqrt');
        mathFunction = mathFunction.replace(/\\exp/g, 'exp');
        
        // Manejar e como número de Euler
        mathFunction = mathFunction.replace(/\\mathrm\{e\}/g, 'e');
        mathFunction = mathFunction.replace(/\\e\b/g, 'e');
        
        // Manejar pi
        mathFunction = mathFunction.replace(/\\pi/g, 'pi');
        
        // Limpiar backslashes restantes
        mathFunction = mathFunction.replace(/\\/g, '');
        
        console.log('Función procesada:', mathFunction);
        
        // Validar que la función resultante sea válida
        try {
            const testExpr = math.parse(mathFunction);
            console.log('Función válida parseada:', testExpr.toString());
        } catch (e) {
            console.error('Error al parsear función:', e);
            throw new Error(`No se pudo procesar la función: ${mathFunction}`);
        }
        
        return mathFunction;
    }

    // Función para calcular derivada
    function calculateDerivative() {
        try {
            const functionStr = mathField.value;
            if (!functionStr || functionStr.trim() === '') {
                showError('Por favor ingrese una función válida');
                return;
            }

            const point = parseFloat(pointInput.value) || 0;
            let order = selectedDerivative;
            
            if (selectedDerivative === 'n') {
                order = parseInt(nInput.value) || 4;
            }

            // Convertir la función para math.js
            let mathFunction = convertMathLiveToMathJS(functionStr);
            
            console.log('Función original:', functionStr);
            console.log('Función convertida:', mathFunction);

            // Calcular la derivada usando math.js
            const expr = math.parse(mathFunction);
            let derivative = expr;
            
            for (let i = 0; i < order; i++) {
                derivative = math.derivative(derivative, 'x');
            }

            const derivativeStr = derivative.toString();
            
            // Evaluar en el punto
            let valueAtPoint = null;
            try {
                const compiled = derivative.compile();
                valueAtPoint = compiled.evaluate({ x: point });
            } catch (e) {
                console.warn('No se pudo evaluar en el punto:', e);
            }

            // Actualizar resultados
            let orderText = '';
            switch(order) {
                case 1: orderText = 'Primera derivada (f\')'; break;
                case 2: orderText = 'Segunda derivada (f")'; break;
                case 3: orderText = 'Tercera derivada (f\'\'\')'; break;
                default: orderText = `Derivada de orden ${order}`;
            }

            resultsContent.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <strong>📊 Función original:</strong><br>
                    <code style="background: rgba(99, 102, 241, 0.1); padding: 8px; border-radius: 8px; display: inline-block; margin-top: 5px;">${functionStr}</code>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>🔄 ${orderText}:</strong><br>
                    <code style="background: rgba(16, 185, 129, 0.1); padding: 8px; border-radius: 8px; display: inline-block; margin-top: 5px;">${derivativeStr}</code>
                </div>
                ${valueAtPoint !== null ? `
                <div style="margin-bottom: 15px;">
                    <strong>📍 Valor en x = ${point}:</strong><br>
                    <code style="background: rgba(245, 158, 11, 0.1); padding: 8px; border-radius: 8px; display: inline-block; margin-top: 5px;">${valueAtPoint.toFixed(6)}</code>
                </div>
                ` : ''}
                <div style="color: #059669; font-weight: 600; margin-top: 20px;">
                    ✅ Derivada calculada exitosamente
                </div>
            `;

            // Graficar
            plotFunction(mathFunction, derivativeStr, point, order);

        } catch (error) {
            console.error('Error completo:', error);
            console.error('Función original:', functionStr);
            console.error('Función convertida:', mathFunction);
            showError(`Error al procesar la función: ${error.message}. Revise la sintaxis matemática.`);
        }
    }

    // Función para graficar
    function plotFunction(originalFunc, derivativeFunc, point, order) {
        try {
            const xRange = [];
            const yOriginal = [];
            const yDerivative = [];
            
            const xMin = point - 5;
            const xMax = point + 5;
            const step = 0.1;

            // Compilar funciones
            const originalCompiled = math.compile(originalFunc);
            const derivativeCompiled = math.compile(derivativeFunc);

            for (let x = xMin; x <= xMax; x += step) {
                try {
                    const yOrig = originalCompiled.evaluate({ x: x });
                    const yDeriv = derivativeCompiled.evaluate({ x: x });
                    
                    if (isFinite(yOrig) && isFinite(yDeriv)) {
                        xRange.push(x);
                        yOriginal.push(yOrig);
                        yDerivative.push(yDeriv);
                    }
                } catch (e) {
                    // Saltar puntos problemáticos
                }
            }

            // Calcular punto específico
            let pointOriginal = null;
            let pointDerivative = null;
            try {
                pointOriginal = originalCompiled.evaluate({ x: point });
                pointDerivative = derivativeCompiled.evaluate({ x: point });
            } catch (e) {
                console.warn('No se pudo calcular el punto específico');
            }

            const traces = [
                {
                    x: xRange,
                    y: yOriginal,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'f(x)',
                    line: { color: '#6366f1', width: 3 }
                },
                {
                    x: xRange,
                    y: yDerivative,
                    type: 'scatter',
                    mode: 'lines',
                    name: `f${order === 1 ? '\'' : order === 2 ? '\"' : `^(${order})`}(x)`,
                    line: { color: '#10b981', width: 3, dash: 'dash' }
                }
            ];

            // Agregar puntos específicos si existen
            if (pointOriginal !== null && isFinite(pointOriginal)) {
                traces.push({
                    x: [point],
                    y: [pointOriginal],
                    type: 'scatter',
                    mode: 'markers',
                    name: `f(${point})`,
                    marker: { color: '#6366f1', size: 12, symbol: 'circle' }
                });
            }

            if (pointDerivative !== null && isFinite(pointDerivative)) {
                traces.push({
                    x: [point],
                    y: [pointDerivative],
                    type: 'scatter',
                    mode: 'markers',
                    name: `f'(${point})`,
                    marker: { color: '#10b981', size: 12, symbol: 'diamond' }
                });
            }

            const layout = {
                title: {
                    text: `📈 Función y su ${order === 1 ? 'Primera' : order === 2 ? 'Segunda' : order === 3 ? 'Tercera' : order + '-ésima'} Derivada`,
                    font: { size: 18, color: '#374151' }
                },
                xaxis: { 
                    title: 'x',
                    gridcolor: '#e5e7eb',
                    zerolinecolor: '#9ca3af'
                },
                yaxis: { 
                    title: 'y',
                    gridcolor: '#e5e7eb',
                    zerolinecolor: '#9ca3af'
                },
                plot_bgcolor: '#fafafa',
                paper_bgcolor: 'white',
                font: { family: 'Segoe UI', size: 12 },
                margin: { t: 60, r: 20, b: 60, l: 60 },
                legend: {
                    x: 0.02,
                    y: 0.98,
                    bgcolor: 'rgba(255,255,255,0.8)',
                    bordercolor: '#e5e7eb',
                    borderwidth: 1
                }
            };

            const config = {
                responsive: true,
                displayModeBar: true,
                modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
                displaylogo: false
            };

            Plotly.newPlot('plotContainer', traces, layout, config);

        } catch (error) {
            console.error('Error al graficar:', error);
            showError('Error al generar la gráfica');
        }
    }

    // Event listeners
    calculateButton.addEventListener('click', calculateDerivative);
    
    mathField.addEventListener('input', () => {
        // Auto-calcular después de 1 segundo de inactividad
        clearTimeout(mathField.timeout);
        mathField.timeout = setTimeout(calculateDerivative, 1000);
    });

    pointInput.addEventListener('input', () => {
        clearTimeout(pointInput.timeout);
        pointInput.timeout = setTimeout(calculateDerivative, 500);
    });

    nInput.addEventListener('input', () => {
        clearTimeout(nInput.timeout);
        nInput.timeout = setTimeout(calculateDerivative, 500);
    });

    // Ensamblar la interfaz
    leftPanel.appendChild(title);
    leftPanel.appendChild(infoBox);
    leftPanel.appendChild(functionLabel);
    leftPanel.appendChild(mathField);
    leftPanel.appendChild(derivativeLabel);
    leftPanel.appendChild(derivativeButtons);
    leftPanel.appendChild(nLabel);
    leftPanel.appendChild(nInput);
    leftPanel.appendChild(pointLabel);
    leftPanel.appendChild(pointInput);
    leftPanel.appendChild(calculateButton);
    leftPanel.appendChild(examplesTitle);
    leftPanel.appendChild(examplesList);

    resultsContainer.appendChild(resultsTitle);
    resultsContainer.appendChild(resultsContent);

    rightPanel.appendChild(rightTitle);
    rightPanel.appendChild(errorContainer);
    rightPanel.appendChild(plotContainer);
    rightPanel.appendChild(resultsContainer);

    mainContainer.appendChild(leftPanel);
    mainContainer.appendChild(rightPanel);
    contentDerivada.appendChild(mainContainer);

    // Calcular derivada inicial
    setTimeout(calculateDerivative, 100);
});