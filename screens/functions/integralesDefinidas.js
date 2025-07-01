// integralesDefinidas.js

document.addEventListener('DOMContentLoaded', () => {
    const containerIntegralesDefinidas = document.getElementById('integrales-definidas');
    containerIntegralesDefinidas.textContent = '';

    // Crear el contenedor principal
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
    `;

    // Añadir elemento de fondo decorativo
    const backgroundDecor = document.createElement('div');
    backgroundDecor.style.cssText = `
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%);
        pointer-events: none;
        z-index: 0;
    `;
    mainContainer.appendChild(backgroundDecor);

    // Título principal
    const title = document.createElement('h1');
    title.textContent = 'Calculadora de Integrales Definidas';
    title.style.cssText = `
        text-align: center;
        color: #1e40af;
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 30px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: relative;
        z-index: 1;
    `;
    mainContainer.appendChild(title);

    // Contenedor de las dos secciones principales
    const sectionsContainer = document.createElement('div');
    sectionsContainer.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        position: relative;
        z-index: 1;
    `;

    // SECCIÓN IZQUIERDA - Controles
    const leftSection = document.createElement('div');
    leftSection.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border: 1px solid #e2e8f0;
        transition: all 0.3s ease;
    `;

    const leftTitle = document.createElement('h2');
    leftTitle.textContent = 'Función y Parámetros';
    leftTitle.style.cssText = `
        color: #2563eb;
        font-size: 1.5rem;
        margin-bottom: 20px;
        font-weight: 600;
    `;
    leftSection.appendChild(leftTitle);

    // Función para crear inputs estilizados normales
    function createStyledInput(labelText, placeholder, id) {
        const inputGroup = document.createElement('div');
        inputGroup.style.cssText = `
            margin-bottom: 20px;
            position: relative;
        `;

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.cssText = `
            display: block;
            color: #374151;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 0.95rem;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = id;
        input.placeholder = placeholder;
        input.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: #fafbfc;
            box-sizing: border-box;
        `;

        // Efectos hover y focus
        input.addEventListener('focus', () => {
            input.style.borderColor = '#3b82f6';
            input.style.background = 'white';
            input.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = '#e5e7eb';
            input.style.background = '#fafbfc';
            input.style.boxShadow = 'none';
        });

        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        return inputGroup;
    }

    // Crear grupo para MathField
    function createMathFieldGroup() {
        const mathGroup = document.createElement('div');
        mathGroup.style.cssText = `
            margin-bottom: 20px;
            position: relative;
        `;

        const label = document.createElement('label');
        label.textContent = 'Función f(x):';
        label.style.cssText = `
            display: block;
            color: #374151;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 0.95rem;
        `;

        const mathFieldContainer = document.createElement('div');
        mathFieldContainer.style.cssText = `
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            background: #fafbfc;
            transition: all 0.3s ease;
            overflow: hidden;
        `;

        const mathField = document.createElement('math-field');
        mathField.id = 'math-function';
        mathField.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            font-size: 1.2rem;
            border: none;
            background: transparent;
            min-height: 50px;
        `;

        // Configurar opciones de MathField
        mathField.options = {
            virtualKeyboardMode: 'manual',
            defaultMode: 'math',
            placeholder: 'Ej: x^2 + 2x + 1'
        };

        // Efectos de focus y blur
        mathField.addEventListener('focus', () => {
            mathFieldContainer.style.borderColor = '#3b82f6';
            mathFieldContainer.style.background = 'white';
            mathFieldContainer.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
        });

        mathField.addEventListener('blur', () => {
            mathFieldContainer.style.borderColor = '#e5e7eb';
            mathFieldContainer.style.background = '#fafbfc';
            mathFieldContainer.style.boxShadow = 'none';
        });

        mathFieldContainer.appendChild(mathField);
        mathGroup.appendChild(label);
        mathGroup.appendChild(mathFieldContainer);
        return mathGroup;
    }

    // Crear inputs
    leftSection.appendChild(createMathFieldGroup());
    leftSection.appendChild(createStyledInput('Límite Inferior (a):', 'Ej: 0', 'limite-inferior'));
    leftSection.appendChild(createStyledInput('Límite Superior (b):', 'Ej: 2', 'limite-superior'));
    leftSection.appendChild(createStyledInput('Número de Intervalos (n):', 'Ej: 100', 'intervalos'));

    // Botón de calcular
    const calculateBtn = document.createElement('button');
    calculateBtn.textContent = 'Calcular Integral';
    calculateBtn.style.cssText = `
        width: 100%;
        padding: 15px;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(59,130,246,0.3);
        margin-top: 10px;
    `;

    calculateBtn.addEventListener('mouseenter', () => {
        calculateBtn.style.transform = 'translateY(-2px)';
        calculateBtn.style.boxShadow = '0 8px 25px rgba(59,130,246,0.4)';
        calculateBtn.style.background = 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)';
    });

    calculateBtn.addEventListener('mouseleave', () => {
        calculateBtn.style.transform = 'translateY(0)';
        calculateBtn.style.boxShadow = '0 4px 15px rgba(59,130,246,0.3)';
        calculateBtn.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    });

    leftSection.appendChild(calculateBtn);

    // SECCIÓN DERECHA - Gráfica y Resultado
    const rightSection = document.createElement('div');
    rightSection.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
    `;

    const rightTitle = document.createElement('h2');
    rightTitle.textContent = 'Gráfica y Área';
    rightTitle.style.cssText = `
        color: #2563eb;
        font-size: 1.5rem;
        margin-bottom: 20px;
        font-weight: 600;
    `;
    rightSection.appendChild(rightTitle);

    // Contenedor para la gráfica de Plotly
    const plotContainer = document.createElement('div');
    plotContainer.id = 'plot-container';
    plotContainer.style.cssText = `
        height: 350px;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        background: #fafbfc;
        margin-bottom: 20px;
        transition: all 0.3s ease;
    `;
    rightSection.appendChild(plotContainer);

    // Contenedor del resultado
    const resultContainer = document.createElement('div');
    resultContainer.style.cssText = `
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border-radius: 12px;
        padding: 20px;
        border: 2px solid #bae6fd;
        margin-top: auto;
    `;

    const resultLabel = document.createElement('div');
    resultLabel.textContent = 'Valor de la Integral:';
    resultLabel.style.cssText = `
        color: #0369a1;
        font-weight: 600;
        margin-bottom: 10px;
        font-size: 1.1rem;
    `;

    const resultValue = document.createElement('div');
    resultValue.id = 'resultado-integral';
    resultValue.textContent = 'Ingrese los datos y presione "Calcular"';
    resultValue.style.cssText = `
        color: #1e40af;
        font-size: 1.5rem;
        font-weight: 700;
        font-family: 'Courier New', monospace;
        text-align: center;
        padding: 10px;
        background: white;
        border-radius: 8px;
        border: 1px solid #93c5fd;
    `;

    const stepsBtn = document.createElement('button');
    stepsBtn.textContent = 'Ver Pasos';
    stepsBtn.style.cssText = `
        width: 100%;
        padding: 10px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 10px;
        opacity: 0.6;
        pointer-events: none;
    `;

    resultContainer.appendChild(resultLabel);
    resultContainer.appendChild(resultValue);
    resultContainer.appendChild(stepsBtn);
    rightSection.appendChild(resultContainer);

    // Ensamblar las secciones
    sectionsContainer.appendChild(leftSection);
    sectionsContainer.appendChild(rightSection);
    mainContainer.appendChild(sectionsContainer);

    // Función para convertir LaTeX a expresión evaluable
    function latexToMathJS(latex) {
        let expr = latex;
        
        // Conversiones básicas de LaTeX a notación JavaScript
        expr = expr.replace(/\\cdot/g, '*');
        expr = expr.replace(/\\times/g, '*');
        expr = expr.replace(/\\div/g, '/');
        expr = expr.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
        expr = expr.replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)');
        expr = expr.replace(/\\sin\{([^}]+)\}/g, 'sin($1)');
        expr = expr.replace(/\\cos\{([^}]+)\}/g, 'cos($1)');
        expr = expr.replace(/\\tan\{([^}]+)\}/g, 'tan($1)');
        expr = expr.replace(/\\ln\{([^}]+)\}/g, 'log($1)');
        expr = expr.replace(/\\log\{([^}]+)\}/g, 'log10($1)');
        expr = expr.replace(/\\exp\{([^}]+)\}/g, 'exp($1)');
        expr = expr.replace(/\\pi/g, 'pi');
        expr = expr.replace(/\\e/g, 'e');
        
        // Manejar exponentes
        expr = expr.replace(/\^(\d+)/g, '^$1');
        expr = expr.replace(/\^\{([^}]+)\}/g, '^($1)');
        
        // Multiplicación implícita
        expr = expr.replace(/(\d+)([a-zA-Z])/g, '$1*$2');
        expr = expr.replace(/\)([a-zA-Z])/g, ')*$2');
        expr = expr.replace(/([a-zA-Z])\(/g, '$1*(');
        
        return expr;
    }

    // Función para evaluar expresiones usando MathJS
    function evaluateFunction(expression, x) {
        try {
            const scope = { x: x };
            return math.evaluate(expression, scope);
        } catch (error) {
            console.error('Error evaluating function:', error);
            return NaN;
        }
    }

    // Método de Simpson usando MathJS
    function simpsonRule(mathExpression, a, b, n) {
        if (n % 2 !== 0) n++; // Asegurar que n sea par
        
        const h = (b - a) / n;
        let sum = evaluateFunction(mathExpression, a) + evaluateFunction(mathExpression, b);
        
        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            const fx = evaluateFunction(mathExpression, x);
            if (isNaN(fx)) return NaN;
            
            if (i % 2 === 0) {
                sum += 2 * fx;
            } else {
                sum += 4 * fx;
            }
        }
        
        return (h / 3) * sum;
    }

    // Función para crear gráfica con Plotly
    function createPlotlyGraph(mathExpression, a, b, integral) {
        const xValues = [];
        const yValues = [];
        const areaX = [];
        const areaY = [];
        
        // Generar puntos para la función
        const numPoints = 200;
        const step = (b - a) / numPoints;
        
        for (let i = 0; i <= numPoints; i++) {
            const x = a + i * step;
            const y = evaluateFunction(mathExpression, x);
            
            if (!isNaN(y)) {
                xValues.push(x);
                yValues.push(y);
                
                // Puntos para el área (solo entre a y b)
                areaX.push(x);
                areaY.push(y);
            }
        }
        
        // Cerrar el área
        areaX.push(b);
        areaY.push(0);
        areaX.push(a);
        areaY.push(0);
        
        const traces = [
            {
                x: xValues,
                y: yValues,
                type: 'scatter',
                mode: 'lines',
                name: 'f(x)',
                line: {
                    color: '#3b82f6',
                    width: 3
                }
            },
            {
                x: areaX,
                y: areaY,
                type: 'scatter',
                fill: 'toself',
                fillcolor: 'rgba(59, 130, 246, 0.3)',
                line: {
                    color: 'rgba(59, 130, 246, 0.6)',
                    width: 1
                },
                name: `Área = ${integral.toFixed(6)}`,
                hoverinfo: 'none'
            }
        ];
        
        const layout = {
            title: {
                text: `Integral definida de ${a} a ${b}`,
                font: {
                    size: 16,
                    color: '#1e40af'
                }
            },
            xaxis: {
                title: 'x',
                gridcolor: '#e5e7eb',
                zerolinecolor: '#6b7280'
            },
            yaxis: {
                title: 'f(x)',
                gridcolor: '#e5e7eb',
                zerolinecolor: '#6b7280'
            },
            plot_bgcolor: '#fafbfc',
            paper_bgcolor: 'white',
            font: {
                family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
            },
            margin: {
                l: 50,
                r: 50,
                t: 50,
                b: 50
            }
        };
        
        const config = {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d'],
            displaylogo: false
        };
        
        Plotly.newPlot('plot-container', traces, layout, config);
    }

    // Variables globales para los pasos
    let currentCalculationData = null;

    // Función para generar pasos detallados del método de Simpson
    function generateSimpsonSteps(mathExpression, latexExpression, a, b, n, integral) {
        const h = (b - a) / n;
        const steps = [];
        
        // Paso 1: Fórmula general
        steps.push({
            title: "Fórmula del Método de Simpson (1/3)",
            latex: `\\int_{${a}}^{${b}} f(x) \\, dx \\approx \\frac{h}{3}[f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + \\cdots + f(x_n)]`,
            description: "Donde h es el ancho de cada subintervalo y n debe ser par"
        });
        
        // Paso 2: Cálculo de h
        steps.push({
            title: "Cálculo del ancho del intervalo",
            latex: `h = \\frac{b - a}{n} = \\frac{${b} - ${a}}{${n}} = ${h.toFixed(6)}`,
            description: `Con n = ${n} intervalos`
        });
        
        // Paso 3: Puntos de evaluación
        const points = [];
        for (let i = 0; i <= n; i++) {
            const x = a + i * h;
            const fx = evaluateFunction(mathExpression, x);
            points.push({ x, fx, i });
        }
        
        steps.push({
            title: "Puntos de evaluación",
            latex: `x_i = a + i \\cdot h, \\quad i = 0, 1, 2, \\ldots, ${n}`,
            description: "Evaluamos la función en cada punto:",
            points: points.slice(0, Math.min(8, points.length)) // Mostrar solo los primeros 8 puntos
        });
        
        // Paso 4: Aplicación de la fórmula
        let sumFormula = `f(${a.toFixed(3)})`;
        let sumCalculation = `${points[0].fx.toFixed(6)}`;
        
        for (let i = 1; i < n; i++) {
            const coeff = i % 2 === 0 ? 2 : 4;
            sumFormula += ` + ${coeff}f(${points[i].x.toFixed(3)})`;
            sumCalculation += ` + ${coeff} \\cdot ${points[i].fx.toFixed(6)}`;
        }
        
        sumFormula += ` + f(${b.toFixed(3)})`;
        sumCalculation += ` + ${points[n].fx.toFixed(6)}`;
        
        steps.push({
            title: "Aplicación de la fórmula",
            latex: `\\int_{${a}}^{${b}} ${latexExpression} \\, dx \\approx \\frac{${h.toFixed(6)}}{3}[${sumFormula}]`,
            description: "Sustituyendo los valores calculados"
        });
        
        // Paso 5: Resultado final
        steps.push({
            title: "Resultado final",
            latex: `\\int_{${a}}^{${b}} ${latexExpression} \\, dx \\approx ${integral.toFixed(8)}`,
            description: `Usando ${n} intervalos con el método de Simpson`
        });
        
        return steps;
    }

    // Función para crear el modal de pasos
    function createStepsModal(steps) {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        `;

        // Crear modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 20px;
            max-width: 900px;
            max-height: 80vh;
            width: 90%;
            position: relative;
            box-shadow: 0 30px 60px rgba(0,0,0,0.3);
            overflow: hidden;
            animation: slideIn 0.4s ease;
            transform-origin: center;
        `;

        // Header del modal
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 25px 30px;
            position: relative;
            overflow: hidden;
        `;

        const headerDecor = document.createElement('div');
        headerDecor.style.cssText = `
            position: absolute;
            top: -50%;
            right: -20%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            border-radius: 50%;
        `;
        header.appendChild(headerDecor);

        const headerTitle = document.createElement('h2');
        headerTitle.textContent = '📊 Pasos del Método de Simpson';
        headerTitle.style.cssText = `
            margin: 0;
            font-size: 1.8rem;
            font-weight: 700;
            position: relative;
            z-index: 1;
        `;
        header.appendChild(headerTitle);

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 25px;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 2;
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.3)';
            closeBtn.style.transform = 'rotate(90deg) scale(1.1)';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.2)';
            closeBtn.style.transform = 'rotate(0deg) scale(1)';
        });

        header.appendChild(closeBtn);

        // Contenido del modal
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 30px;
            max-height: 60vh;
            overflow-y: auto;
            scroll-behavior: smooth;
        `;

        // Agregar CSS para las animaciones
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { 
                    opacity: 0; 
                    transform: translateY(-50px) scale(0.9);
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0) scale(1);
                }
            }
            @keyframes stepAppear {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .step-container {
                animation: stepAppear 0.6s ease forwards;
                opacity: 0;
            }
            .step-container:nth-child(1) { animation-delay: 0.1s; }
            .step-container:nth-child(2) { animation-delay: 0.2s; }
            .step-container:nth-child(3) { animation-delay: 0.3s; }
            .step-container:nth-child(4) { animation-delay: 0.4s; }
            .step-container:nth-child(5) { animation-delay: 0.5s; }
        `;
        document.head.appendChild(style);

        // Generar pasos
        steps.forEach((step, index) => {
            const stepContainer = document.createElement('div');
            stepContainer.className = 'step-container';
            stepContainer.style.cssText = `
                margin-bottom: 30px;
                padding: 25px;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-radius: 15px;
                border-left: 5px solid #3b82f6;
                position: relative;
                overflow: hidden;
            `;

            const stepDecor = document.createElement('div');
            stepDecor.style.cssText = `
                position: absolute;
                top: -20px;
                right: -20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(45deg, #3b82f6, #1d4ed8);
                border-radius: 50%;
                opacity: 0.1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 1.2rem;
            `;
            stepDecor.textContent = index + 1;
            stepContainer.appendChild(stepDecor);

            const stepTitle = document.createElement('h3');
            stepTitle.textContent = `${index + 1}. ${step.title}`;
            stepTitle.style.cssText = `
                color: #1e40af;
                font-size: 1.3rem;
                font-weight: 700;
                margin-bottom: 15px;
                position: relative;
                z-index: 1;
            `;
            stepContainer.appendChild(stepTitle);

            if (step.description) {
                const stepDesc = document.createElement('p');
                stepDesc.textContent = step.description;
                stepDesc.style.cssText = `
                    color: #475569;
                    font-size: 1rem;
                    margin-bottom: 15px;
                    line-height: 1.6;
                `;
                stepContainer.appendChild(stepDesc);
            }

            // Renderizar LaTeX
            const mathContainer = document.createElement('div');
            mathContainer.style.cssText = `
                background: white;
                padding: 20px;
                border-radius: 10px;
                border: 2px solid #e2e8f0;
                font-size: 1.1rem;
                text-align: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                margin-bottom: 15px;
            `;

            const mathField = document.createElement('math-field');
            mathField.value = step.latex;
            mathField.style.cssText = `
                width: 100%;
                min-height: 40px;
                border: none;
                background: transparent;
                font-size: 1.2rem;
            `;
            mathField.readOnly = true;
            mathContainer.appendChild(mathField);
            stepContainer.appendChild(mathContainer);

            // Mostrar puntos si existen
            if (step.points) {
                const pointsContainer = document.createElement('div');
                pointsContainer.style.cssText = `
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                    margin-top: 15px;
                `;

                step.points.forEach(point => {
                    const pointDiv = document.createElement('div');
                    pointDiv.style.cssText = `
                        background: #f0f9ff;
                        padding: 10px;
                        border-radius: 8px;
                        text-align: center;
                        border: 1px solid #bae6fd;
                        font-family: 'Courier New', monospace;
                    `;
                    pointDiv.innerHTML = `
                        <strong>x<sub>${point.i}</sub> = ${point.x.toFixed(4)}</strong><br>
                        <span style="color: #0369a1;">f(${point.x.toFixed(4)}) = ${point.fx.toFixed(6)}</span>
                    `;
                    pointsContainer.appendChild(pointDiv);
                });

                stepContainer.appendChild(pointsContainer);
            }

            content.appendChild(stepContainer);
        });

        // Ensamblar modal
        modal.appendChild(header);
        modal.appendChild(content);
        overlay.appendChild(modal);

        // Event listeners
        closeBtn.addEventListener('click', () => {
            overlay.style.animation = 'fadeIn 0.3s ease reverse';
            modal.style.animation = 'slideIn 0.4s ease reverse';
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.head.removeChild(style);
            }, 300);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeBtn.click();
            }
        });

        // Agregar al DOM
        document.body.appendChild(overlay);
    }

    // Event listener para el botón de calcular
    calculateBtn.addEventListener('click', () => {
        const mathField = document.getElementById('math-function');
        const latexExpression = mathField.value; // Obtener LaTeX
        const mathExpression = latexToMathJS(latexExpression);
        
        const a = parseFloat(document.getElementById('limite-inferior').value);
        const b = parseFloat(document.getElementById('limite-superior').value);
        const n = parseInt(document.getElementById('intervalos').value);
        
        if (!latexExpression || isNaN(a) || isNaN(b) || isNaN(n)) {
            resultValue.textContent = 'Por favor, complete todos los campos correctamente';
            resultValue.style.color = '#dc2626';
            return;
        }
        
        if (a >= b) {
            resultValue.textContent = 'El límite inferior debe ser menor que el superior';
            resultValue.style.color = '#dc2626';
            return;
        }
        
        if (n <= 0) {
            resultValue.textContent = 'El número de intervalos debe ser positivo';
            resultValue.style.color = '#dc2626';
            return;
        }
        
        // Calcular la integral
        const integral = simpsonRule(mathExpression, a, b, n);
        
        if (isNaN(integral)) {
            resultValue.textContent = 'Error en la función o cálculo';
            resultValue.style.color = '#dc2626';
            return;
        }
        
        // Guardar datos para el modal de pasos
        currentCalculationData = {
            mathExpression,
            latexExpression,
            a, b, n,
            integral
        };
        
        // Mostrar resultado con animación
        resultValue.style.transform = 'scale(0.8)';
        resultValue.style.opacity = '0';
        
        setTimeout(() => {
            resultValue.textContent = integral.toFixed(8);
            resultValue.style.color = '#1e40af';
            resultValue.style.transform = 'scale(1)';
            resultValue.style.opacity = '1';
            resultValue.style.transition = 'all 0.3s ease';
        }, 150);
        
        // Crear gráfica con Plotly
        createPlotlyGraph(mathExpression, a, b, integral);
        
        // Habilitar botón de pasos
        stepsBtn.style.opacity = '1';
        stepsBtn.style.pointerEvents = 'auto';
        
        stepsBtn.addEventListener('mouseenter', () => {
            stepsBtn.style.transform = 'translateY(-2px)';
            stepsBtn.style.boxShadow = '0 4px 15px rgba(16,185,129,0.3)';
        });
        
        stepsBtn.addEventListener('mouseleave', () => {
            stepsBtn.style.transform = 'translateY(0)';
            stepsBtn.style.boxShadow = 'none';
        });
    });

    // Event listener para el botón de ver pasos
    stepsBtn.addEventListener('click', () => {
        if (currentCalculationData) {
            const steps = generateSimpsonSteps(
                currentCalculationData.mathExpression,
                currentCalculationData.latexExpression,
                currentCalculationData.a,
                currentCalculationData.b,
                currentCalculationData.n,
                currentCalculationData.integral
            );
            createStepsModal(steps);
        }
    });

    // Agregar efectos hover a las secciones
    leftSection.addEventListener('mouseenter', () => {
        leftSection.style.transform = 'translateY(-5px)';
        leftSection.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    });

    leftSection.addEventListener('mouseleave', () => {
        leftSection.style.transform = 'translateY(0)';
        leftSection.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
    });

    rightSection.addEventListener('mouseenter', () => {
        rightSection.style.transform = 'translateY(-5px)';
        rightSection.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    });

    rightSection.addEventListener('mouseleave', () => {
        rightSection.style.transform = 'translateY(0)';
        rightSection.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
    });

    // Agregar el contenedor principal al DOM
    containerIntegralesDefinidas.appendChild(mainContainer);

    // Esperar a que MathLive esté cargado y configurar valores de ejemplo
    setTimeout(() => {
        const mathField = document.getElementById('math-function');
        if (mathField) {
            mathField.value = 'x^2'; // Establecer función de ejemplo
        }
        document.getElementById('limite-inferior').value = '0';
        document.getElementById('limite-superior').value = '2';
        document.getElementById('intervalos').value = '100';
        
        // Crear gráfica inicial vacía
        const layout = {
            title: {
                text: 'Ingrese una función y presione "Calcular"',
                font: {
                    size: 16,
                    color: '#6b7280'
                }
            },
            xaxis: {
                title: 'x',
                gridcolor: '#e5e7eb'
            },
            yaxis: {
                title: 'f(x)',
                gridcolor: '#e5e7eb'
            },
            plot_bgcolor: '#fafbfc',
            paper_bgcolor: 'white'
        };
        
        Plotly.newPlot('plot-container', [], layout, {
            responsive: true,
            displayModeBar: false,
            displaylogo: false
        });
    }, 500);
});