// integralesIndefinidas.js (actualizado: con gráfica implementada)

document.addEventListener('DOMContentLoaded', () => {
    const integralesIndefinidasTool = document.getElementById('integrales-indefinidas');
    integralesIndefinidasTool.textContent = '';

    if (integralesIndefinidasTool) {
        integralesIndefinidasTool.innerHTML = `
            <div class="integrales-indefinidas-container">
                <h2>Calculadora de Integrales Indefinidas</h2>
                <div class="integral-input-group">
                    <label for="function-input">Función a integrar f(x):</label>
                    <math-field id="function-input" class="math-input" virtual-keyboard-mode="manual"></math-field>
                </div>
                <button id="calculate-integral-btn" class="calculate-button">Calcular Integral</button>
                <div id="integral-result" class="integral-result" style="display:none;">
                    <h3>Resultado:</h3>
                    <p>La integral indefinida de la función es:</p>
                    <div id="result-math-field" class="math-output"></div>
                    <p class="mt-3 text-sm text-gray-500">
                        Nota: Esta es una simplificación simbólica. Recuerda añadir la constante de integración "C".
                    </p>
                </div>

                <div id="steps-container" style="display:none; margin-top: 20px;">
                    <h3>Pasos de resolución:</h3>
                    <button id="toggle-steps-btn" class="calculate-button toggle-steps-btn" style="margin-bottom: 15px;">
                        Mostrar pasos detallados
                    </button>
                    <div id="steps-content" style="display:none; background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
                        <div id="steps-list"></div>
                    </div>
                </div>
                <div id="integral-error" class="error-message" style="display:none;"></div>

                <!-- Nuevo contenedor para la gráfica -->
                <div id="graph-container" style="display:none; margin-top: 20px;">
                    <h3>Gráfica de la función y su integral</h3>
                    <canvas id="integral-graph" width="600" height="400" style="border: 1px solid #ccc; max-width: 100%;"></canvas>
                    <div style="margin-top: 10px;">
                        <span style="color: #2563eb; font-weight: bold;">━━━ f(x) (función original)</span>
                        <span style="color: #dc2626; font-weight: bold; margin-left: 20px;">━━━ ∫f(x)dx (integral)</span>
                    </div>
                </div>
            </div>
        `;

        const functionInput = document.getElementById('function-input');
        const calculateIntegralBtn = document.getElementById('calculate-integral-btn');
        const integralResultDiv = document.getElementById('integral-result');
        const resultMathField = document.getElementById('result-math-field');
        const integralErrorDiv = document.getElementById('integral-error');
        const graphContainer = document.getElementById('graph-container');
        const canvas = document.getElementById('integral-graph');
        const ctx = canvas.getContext('2d');
        const stepsContainer = document.getElementById('steps-container');
        const toggleStepsBtn = document.getElementById('toggle-steps-btn');
        const stepsContent = document.getElementById('steps-content');
        const stepsList = document.getElementById('steps-list');

        // Variables para almacenar las funciones y pasos
        let originalFunction = null;
        let integralFunction = null;
        let integrationSteps = [];

        // Manejar el toggle de pasos
        toggleStepsBtn.addEventListener('click', () => {
            if (stepsContent.style.display === 'none') {
                stepsContent.style.display = 'block';
                toggleStepsBtn.textContent = 'Ocultar pasos detallados';
            } else {
                stepsContent.style.display = 'none';
                toggleStepsBtn.textContent = 'Mostrar pasos detallados';
            }
        });

        const normalizeInput = (input) => {
            return input
                .replace(/\\cdot/g, '*')
                .replace(/\\left\(/g, '(')
                .replace(/\\right\)/g, ')')
                .replace(/\\sin/g, 'sin')
                .replace(/\\cos/g, 'cos')
                .replace(/\\tan/g, 'tan')
                .replace(/\\sec/g, 'sec')
                .replace(/\\csc/g, 'csc')
                .replace(/\\cot/g, 'cot')
                .replace(/\\ln/g, 'log')
                .replace(/\\exp/g, 'exp')
                .replace(/\\sqrt{([^}]+)}/g, 'sqrt($1)')
                .replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1)/($2)')
                .replace(/\\ /g, '')
                .replace(/\s+/g, '');
        };

        const extractNumericValue = (node) => {
            try {
                return parseFloat(math.evaluate(node.toString()));
            } catch {
                return NaN;
            }
        };

        const isSymbolX = (node) => {
            if (node.type === 'SymbolNode' && node.name === 'x') return true;
            if (node.type === 'ParenthesisNode') return isSymbolX(node.content);
            return false;
        };

        const isOneOverX = (n) => {
            if (n.type === 'OperatorNode' && n.op === '/') {
                let numerator = n.args[0];
                const denominator = n.args[1];

                if (numerator.type === 'ParenthesisNode') {
                    numerator = numerator.content;
                }

                const isNumeratorConst = numerator.type === 'ConstantNode' ||
                    (numerator.type === 'UnaryMinusNode' && numerator.args[0].type === 'ConstantNode');

                return isNumeratorConst && isSymbolX(denominator);
            }
            return false;
        };

        // Función para agregar pasos de integración
        const addStep = (description, formula, rule) => {
            integrationSteps.push({
                description: description,
                formula: formula,
                rule: rule
            });
        };

        // Función para mostrar los pasos
        const displaySteps = () => {
            stepsList.innerHTML = '';
            integrationSteps.forEach((step, index) => {
                const stepDiv = document.createElement('div');
                stepDiv.style.marginBottom = '15px';
                stepDiv.innerHTML = `
                    <div style="font-weight: bold; color: #2563eb; margin-bottom: 5px;">
                        Paso ${index + 1}: ${step.description}
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 4px; margin-bottom: 5px;">
                        <math-field read-only>${step.formula}</math-field>
                    </div>
                    <div style="font-size: 0.9em; color: #666; font-style: italic;">
                        Regla aplicada: ${step.rule}
                    </div>
                `;
                stepsList.appendChild(stepDiv);
            });
        };
        const drawGraph = (originalFunc, integralFunc) => {
            const width = canvas.width;
            const height = canvas.height;
            const padding = 40;
            
            // Limpiar canvas
            ctx.clearRect(0, 0, width, height);
            
            // Configurar el rango de x
            const xMin = -5;
            const xMax = 5;
            const xRange = xMax - xMin;
            const step = xRange / (width - 2 * padding);
            
            // Calcular los valores y para determinar el rango de y
            let yValues = [];
            let integralValues = [];
            
            for (let x = xMin; x <= xMax; x += step) {
                try {
                    const y = originalFunc.evaluate({x: x});
                    const integral = integralFunc.evaluate({x: x});
                    if (isFinite(y) && Math.abs(y) < 100) yValues.push(y);
                    if (isFinite(integral) && Math.abs(integral) < 100) integralValues.push(integral);
                } catch (e) {
                    // Ignorar errores de evaluación
                }
            }
            
            const allValues = [...yValues, ...integralValues];
            const yMin = Math.min(...allValues) - 1;
            const yMax = Math.max(...allValues) + 1;
            const yRange = yMax - yMin;
            
            // Función para convertir coordenadas
            const toCanvasX = (x) => padding + ((x - xMin) / xRange) * (width - 2 * padding);
            const toCanvasY = (y) => height - padding - ((y - yMin) / yRange) * (height - 2 * padding);
            
            // Dibujar ejes
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.beginPath();
            
            // Eje X
            const yAxisX = toCanvasX(0);
            if (yAxisX >= padding && yAxisX <= width - padding) {
                ctx.moveTo(yAxisX, padding);
                ctx.lineTo(yAxisX, height - padding);
            }
            
            // Eje Y
            const xAxisY = toCanvasY(0);
            if (xAxisY >= padding && xAxisY <= height - padding) {
                ctx.moveTo(padding, xAxisY);
                ctx.lineTo(width - padding, xAxisY);
            }
            
            ctx.stroke();
            
            // Dibujar cuadrícula
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            
            // Líneas verticales
            for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
                const canvasX = toCanvasX(x);
                ctx.moveTo(canvasX, padding);
                ctx.lineTo(canvasX, height - padding);
            }
            
            // Líneas horizontales
            for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
                const canvasY = toCanvasY(y);
                ctx.moveTo(padding, canvasY);
                ctx.lineTo(width - padding, canvasY);
            }
            
            ctx.stroke();
            
            // Dibujar función original
            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            let firstPoint = true;
            for (let x = xMin; x <= xMax; x += step) {
                try {
                    const y = originalFunc.evaluate({x: x});
                    if (isFinite(y) && Math.abs(y) < 100) {
                        const canvasX = toCanvasX(x);
                        const canvasY = toCanvasY(y);
                        
                        if (firstPoint) {
                            ctx.moveTo(canvasX, canvasY);
                            firstPoint = false;
                        } else {
                            ctx.lineTo(canvasX, canvasY);
                        }
                    } else {
                        firstPoint = true;
                    }
                } catch (e) {
                    firstPoint = true;
                }
            }
            ctx.stroke();
            
            // Dibujar integral
            ctx.strokeStyle = '#dc2626';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            firstPoint = true;
            for (let x = xMin; x <= xMax; x += step) {
                try {
                    const y = integralFunc.evaluate({x: x});
                    if (isFinite(y) && Math.abs(y) < 100) {
                        const canvasX = toCanvasX(x);
                        const canvasY = toCanvasY(y);
                        
                        if (firstPoint) {
                            ctx.moveTo(canvasX, canvasY);
                            firstPoint = false;
                        } else {
                            ctx.lineTo(canvasX, canvasY);
                        }
                    } else {
                        firstPoint = true;
                    }
                } catch (e) {
                    firstPoint = true;
                }
            }
            ctx.stroke();
            
            // Etiquetas de los ejes
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            
            // Etiquetas del eje X
            for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
                if (x !== 0) {
                    const canvasX = toCanvasX(x);
                    ctx.fillText(x.toString(), canvasX, height - padding + 15);
                }
            }
            
            // Etiquetas del eje Y
            ctx.textAlign = 'right';
            for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
                if (y !== 0) {
                    const canvasY = toCanvasY(y);
                    ctx.fillText(y.toString(), padding - 5, canvasY + 4);
                }
            }
        };

        const calculateIndefiniteIntegral = (funcText) => {
            integralResultDiv.style.display = 'none';
            integralErrorDiv.style.display = 'none';
            integralErrorDiv.textContent = '';
            graphContainer.style.display = 'none';
            stepsContainer.style.display = 'none';
            stepsContainer.style.display = 'none';
            integrationSteps = []; // Limpiar pasos anteriores

            try {
                const cleanInput = normalizeInput(funcText);
                const node = math.parse(cleanInput);
                
                // Compilar la función original
                originalFunction = math.compile(cleanInput);
                
                // Agregar paso inicial
                addStep(
                    "Función original a integrar",
                    `\\int ${node.toTex()} \\, dx`,
                    "Identificación de la función"
                );

                const integrateNode = (n, depth = 0) => {
                    const indent = "  ".repeat(depth);
                    
                    if (n.type === 'ConstantNode') {
                        const result = new math.OperatorNode('*', 'multiply', [
                            new math.ConstantNode(parseFloat(n.value)),
                            new math.SymbolNode('x')
                        ]);
                        addStep(
                            "Integración de constante",
                            `\\int ${n.toTex()} \\, dx = ${result.toTex()} + C`,
                            "∫k dx = kx + C"
                        );
                        return result;
                    } else if (isSymbolX(n)) {
                        const result = math.parse('x^2 / 2');
                        addStep(
                            "Integración de x",
                            `\\int x \\, dx = \\frac{x^2}{2} + C`,
                            "∫x dx = x²/2 + C"
                        );
                        return result;
                    } else if (isOneOverX(n)) {
                        let numerator = n.args[0];

                        if (numerator.type === 'ParenthesisNode') {
                            numerator = numerator.content;
                        }

                        let coefficient = 1;

                        if (numerator.type === 'ConstantNode') {
                            coefficient = parseFloat(numerator.value);
                        } else if (numerator.type === 'UnaryMinusNode') {
                            const inner = numerator.args[0];
                            if (inner.type === 'ConstantNode') {
                                coefficient = -parseFloat(inner.value);
                            } else if (inner.type === 'ParenthesisNode' && inner.content.type === 'ConstantNode') {
                                coefficient = -parseFloat(inner.content.value);
                            }
                        }

                        const lnNode = math.parse('log(abs(x))');
                        const result = coefficient === 1
                            ? lnNode
                            : new math.OperatorNode('*', 'multiply', [
                                new math.ConstantNode(coefficient),
                                lnNode
                            ]);
                        
                        addStep(
                            "Integración de 1/x",
                            `\\int ${n.toTex()} \\, dx = ${result.toTex().replace('log', '\\ln')} + C`,
                            "∫(1/x) dx = ln|x| + C"
                        );
                        return result;
                    } else if (n.type === 'OperatorNode' && n.op === '^') {
                        const base = n.args[0];
                        const exponent = extractNumericValue(n.args[1]);
                        if (isSymbolX(base)) {
                            if (exponent === -1) {
                                const result = math.parse('log(abs(x))');
                                addStep(
                                    "Integración de x^(-1)",
                                    `\\int x^{-1} \\, dx = \\ln|x| + C`,
                                    "∫x^(-1) dx = ln|x| + C"
                                );
                                return result;
                            }
                            const newExp = exponent + 1;
                            const numerator = new math.OperatorNode('^', 'pow', [
                                new math.SymbolNode('x'),
                                new math.ConstantNode(newExp)
                            ]);
                            const denominator = new math.ConstantNode(newExp);
                            const result = new math.OperatorNode('/', 'divide', [numerator, denominator]);
                            
                            addStep(
                                `Integración de potencia x^${exponent}`,
                                `\\int x^{${exponent}} \\, dx = \\frac{x^{${newExp}}}{${newExp}} + C`,
                                `∫x^n dx = x^(n+1)/(n+1) + C (n ≠ -1)`
                            );
                            return result;
                        }
                    } else if (n.type === 'OperatorNode' && n.op === '*') {
                        const left = n.args[0];
                        const right = n.args[1];
                        if (left.type === 'ConstantNode') {
                            const integratedRight = integrateNode(right, depth + 1);
                            if (integratedRight) {
                                const result = new math.OperatorNode('*', 'multiply', [
                                    new math.ConstantNode(parseFloat(left.value)),
                                    integratedRight
                                ]);
                                addStep(
                                    "Aplicación de la regla del múltiplo constante",
                                    `\\int ${left.toTex()} \\cdot (${right.toTex()}) \\, dx = ${left.toTex()} \\int ${right.toTex()} \\, dx`,
                                    "∫k·f(x) dx = k·∫f(x) dx"
                                );
                                return result;
                            }
                        } else if (right.type === 'ConstantNode') {
                            const integratedLeft = integrateNode(left, depth + 1);
                            if (integratedLeft) {
                                const result = new math.OperatorNode('*', 'multiply', [
                                    integratedLeft,
                                    new math.ConstantNode(parseFloat(right.value))
                                ]);
                                addStep(
                                    "Aplicación de la regla del múltiplo constante",
                                    `\\int (${left.toTex()}) \\cdot ${right.toTex()} \\, dx = ${right.toTex()} \\int ${left.toTex()} \\, dx`,
                                    "∫f(x)·k dx = k·∫f(x) dx"
                                );
                                return result;
                            }
                        }
                    } else if (n.type === 'OperatorNode' && (n.op === '+' || n.op === '-')) {
                        addStep(
                            `Aplicación de la regla de la ${n.op === '+' ? 'suma' : 'resta'}`,
                            `\\int (${n.args[0].toTex()} ${n.op} ${n.args[1].toTex()}) \\, dx = \\int ${n.args[0].toTex()} \\, dx ${n.op} \\int ${n.args[1].toTex()} \\, dx`,
                            `∫(f(x) ${n.op} g(x)) dx = ∫f(x) dx ${n.op} ∫g(x) dx`
                        );
                        
                        const leftIntegrated = integrateNode(n.args[0], depth + 1);
                        const rightIntegrated = integrateNode(n.args[1], depth + 1);
                        if (leftIntegrated && rightIntegrated) {
                            return new math.OperatorNode(n.op === '+' ? '+' : '-', n.op === '+' ? 'add' : 'subtract', [
                                leftIntegrated,
                                rightIntegrated
                            ]);
                        }
                    } else if (n.type === 'FunctionNode') {
                        const arg = n.args[0];
                        if (isSymbolX(arg)) {
                            switch (n.fn.name) {
                                case 'sin':
                                    const sinResult = math.parse('-cos(x)');
                                    addStep(
                                        "Integración de función seno",
                                        `\\int \\sin(x) \\, dx = -\\cos(x) + C`,
                                        "∫sin(x) dx = -cos(x) + C"
                                    );
                                    return sinResult;
                                case 'cos':
                                    const cosResult = math.parse('sin(x)');
                                    addStep(
                                        "Integración de función coseno",
                                        `\\int \\cos(x) \\, dx = \\sin(x) + C`,
                                        "∫cos(x) dx = sin(x) + C"
                                    );
                                    return cosResult;
                                case 'tan':
                                    const tanResult = math.parse('-log(abs(cos(x)))');
                                    addStep(
                                        "Integración de función tangente",
                                        `\\int \\tan(x) \\, dx = -\\ln|\\cos(x)| + C`,
                                        "∫tan(x) dx = -ln|cos(x)| + C"
                                    );
                                    return tanResult;
                                case 'sec':
                                    const secResult = math.parse('log(abs(sec(x) + tan(x)))');
                                    addStep(
                                        "Integración de función secante",
                                        `\\int \\sec(x) \\, dx = \\ln|\\sec(x) + \\tan(x)| + C`,
                                        "∫sec(x) dx = ln|sec(x) + tan(x)| + C"
                                    );
                                    return secResult;
                                case 'csc':
                                    const cscResult = math.parse('-log(abs(csc(x) + cot(x)))');
                                    addStep(
                                        "Integración de función cosecante",
                                        `\\int \\csc(x) \\, dx = -\\ln|\\csc(x) + \\cot(x)| + C`,
                                        "∫csc(x) dx = -ln|csc(x) + cot(x)| + C"
                                    );
                                    return cscResult;
                                case 'cot':
                                    const cotResult = math.parse('log(abs(sin(x)))');
                                    addStep(
                                        "Integración de función cotangente",
                                        `\\int \\cot(x) \\, dx = \\ln|\\sin(x)| + C`,
                                        "∫cot(x) dx = ln|sin(x)| + C"
                                    );
                                    return cotResult;
                                case 'exp':
                                    const expResult = math.parse('exp(x)');
                                    addStep(
                                        "Integración de función exponencial",
                                        `\\int e^x \\, dx = e^x + C`,
                                        "∫e^x dx = e^x + C"
                                    );
                                    return expResult;
                                case 'log':
                                    const logResult = math.parse('x * log(x) - x');
                                    addStep(
                                        "Integración de función logaritmo natural",
                                        `\\int \\ln(x) \\, dx = x\\ln(x) - x + C`,
                                        "∫ln(x) dx = x·ln(x) - x + C (integración por partes)"
                                    );
                                    return logResult;
                            }
                        }
                    }
                    return null;
                };

                const integratedNode = integrateNode(node);

                if (integratedNode) {
                    const simplifiedNode = math.simplify(integratedNode);
                    
                    // Agregar paso de simplificación si es necesario
                    if (integratedNode.toString() !== simplifiedNode.toString()) {
                        addStep(
                            "Simplificación del resultado",
                            `${integratedNode.toTex()} = ${simplifiedNode.toTex()}`,
                            "Simplificación algebraica"
                        );
                    }
                    
                    // Agregar paso final
                    addStep(
                        "Resultado final",
                        `\\int ${node.toTex()} \\, dx = ${simplifiedNode.toTex()} + C`,
                        "Resultado de la integral indefinida"
                    );
                    
                    // Compilar la función integral
                    integralFunction = math.compile(simplifiedNode.toString());
                    
                    const integralLatex = simplifiedNode.toTex({
                        handler: (node, options) => {
                            if (node.type === 'FunctionNode' && (node.fn.name === 'log' || node.fn.name === 'ln')) {
                                return `\\ln\\left(${node.args[0].toTex(options)}\\right)`;
                            }
                            return undefined;
                        }
                    });

                    resultMathField.innerHTML = `<math-field read-only>${integralLatex}</math-field>`;
                    integralResultDiv.style.display = 'block';
                    
                    // Mostrar pasos
                    stepsContainer.style.display = 'block';
                    displaySteps();
                    
                    // Mostrar y dibujar la gráfica
                    graphContainer.style.display = 'block';
                    drawGraph(originalFunction, integralFunction);
                } else {
                    integralErrorDiv.textContent = `No se pudo integrar la función. Tipo de nodo no soportado o sintaxis compleja.`;
                    integralErrorDiv.style.display = 'block';
                }
            } catch (error) {
                if (!error.message.includes('render is not a function')) {
                    integralErrorDiv.textContent = 'Error al procesar la función. Asegúrete de que la sintaxis es correcta. Mensaje: ' + error.message;
                    integralErrorDiv.style.display = 'block';
                }
                console.error("Error al calcular la integral indefinida:", error);
            }
        };

        calculateIntegralBtn.addEventListener('click', () => {
            const functionText = functionInput.getValue();
            integralResultDiv.style.display = 'none';
            integralErrorDiv.style.display = 'none';
            integralErrorDiv.textContent = '';
            graphContainer.style.display = 'none';

            if (!functionText) {
                integralErrorDiv.textContent = 'Por favor, introduce una función para integrar.';
                integralErrorDiv.style.display = 'block';
                return;
            }

            calculateIndefiniteIntegral(functionText);
        });
    }
});