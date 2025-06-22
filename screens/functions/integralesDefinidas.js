// screens/functions/integralesDefinidas.js

import { plotFunction } from '../graficadora/graph.js';

document.addEventListener('DOMContentLoaded', function() {
    const integralesDefinidasContainer = document.getElementById("integrales-definidas"); // Asegúrate que el ID sea correcto

    if (integralesDefinidasContainer) {
        integralesDefinidasContainer.innerHTML = ""; // Limpiar contenido existente

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("integrales-definidas-content");

        const title = document.createElement("h2");
        title.textContent = "Integrales Definidas (Método de Simpson)";
        contentDiv.appendChild(title);

        const mainLayoutDiv = document.createElement("div");
        mainLayoutDiv.classList.add("integral-main-layout");
        contentDiv.appendChild(mainLayoutDiv);

        // --- Sección de Inputs (Izquierda) ---
        const inputsSection = document.createElement("div");
        inputsSection.classList.add("integral-inputs-section");
        mainLayoutDiv.appendChild(inputsSection);

        // Campo de entrada de la función (MathLive)
        const functionInputGroup = document.createElement("div");
        functionInputGroup.classList.add("input-group");
        const functionLabel = document.createElement("label");
        functionLabel.textContent = "Función f(x):";
        functionInputGroup.appendChild(functionLabel);
        const mathField = document.createElement("math-field");
        mathField.id = "mathFieldIntegralDefinida";
        mathField.setAttribute("virtual-keyboard-mode", "manual");
        mathField.setAttribute("placeholder", "Ej. x^2, sin(x), e^{-x^2}");
        functionInputGroup.appendChild(mathField);
        inputsSection.appendChild(functionInputGroup);

        // Límite Inferior (a)
        const limitAInputGroup = document.createElement("div");
        limitAInputGroup.classList.add("input-group");
        const labelA = document.createElement("label");
        labelA.textContent = "Límite Inferior (a):";
        const inputA = document.createElement("input");
        inputA.type = "number";
        inputA.step = "any";
        inputA.value = "0";
        inputA.id = "integral-limit-a";
        limitAInputGroup.appendChild(labelA);
        limitAInputGroup.appendChild(inputA);
        inputsSection.appendChild(limitAInputGroup);

        // Límite Superior (b)
        const limitBInputGroup = document.createElement("div");
        limitBInputGroup.classList.add("input-group");
        const labelB = document.createElement("label");
        labelB.textContent = "Límite Superior (b):";
        const inputB = document.createElement("input");
        inputB.type = "number";
        inputB.step = "any";
        inputB.value = "1";
        inputB.id = "integral-limit-b";
        limitBInputGroup.appendChild(labelB);
        limitBInputGroup.appendChild(inputB);
        inputsSection.appendChild(limitBInputGroup);

        // Número de Subintervalos (n)
        const nInputGroup = document.createElement("div");
        nInputGroup.classList.add("input-group");
        const labelN = document.createElement("label");
        labelN.textContent = "Número de Subintervalos (n, debe ser par):";
        const inputN = document.createElement("input");
        inputN.type = "number";
        inputN.step = "2"; // Para forzar números pares si el navegador lo soporta bien
        inputN.min = "2";
        inputN.value = "4"; // Valor por defecto, debe ser par
        inputN.id = "integral-num-subintervals";
        nInputGroup.appendChild(labelN);
        nInputGroup.appendChild(inputN);
        inputsSection.appendChild(nInputGroup);

        // Botón de Calcular
        const calculateButton = document.createElement("button");
        calculateButton.textContent = "Calcular Integral";
        calculateButton.classList.add("action-button", "calculate");
        inputsSection.appendChild(calculateButton);

        // Área para mensajes de error
        const errorMessageDiv = document.createElement("div");
        errorMessageDiv.classList.add("error-message");
        inputsSection.appendChild(errorMessageDiv);

        // --- Sección de Resultados y Gráfica (Derecha) ---
        const resultsSection = document.createElement("div");
        resultsSection.classList.add("integral-results-section");
        mainLayoutDiv.appendChild(resultsSection);

        // Contenedor de resultados
        const resultContainer = document.createElement("div");
        resultContainer.classList.add("result-container");
        const resultTitle = document.createElement("h3");
        resultTitle.textContent = "Resultado de la Integral Definida:";
        const resultValue = document.createElement("p");
        resultValue.classList.add("result-value");
        resultValue.textContent = "N/A";
        resultContainer.appendChild(resultTitle);
        resultContainer.appendChild(resultValue);
        resultsSection.appendChild(resultContainer);

        // Contenedor de la Graficadora
        const graphContainer = document.createElement("div");
        graphContainer.classList.add("graph-container");
        graphContainer.id = "integral-graph";
        resultContainer.appendChild(graphContainer);

        // Botón para mostrar resolución
        const showStepsButton = document.createElement("button");
        showStepsButton.textContent = "Mostrar Resolución Paso a Paso";
        showStepsButton.classList.add("show-steps-button");
        resultContainer.appendChild(showStepsButton);

        // Contenedor para la resolución paso a paso (oculto por defecto)
        const resolutionContainer = document.createElement("div");
        resolutionContainer.classList.add("resolution-container");
        const resolutionTitle = document.createElement("h3");
        resolutionTitle.textContent = "Resolución Paso a Paso del Método de Simpson";
        resolutionContainer.appendChild(resolutionTitle);
        const resolutionContent = document.createElement("div");
        resolutionContent.classList.add("resolution-content");
        resolutionContainer.appendChild(resolutionContent);
        resultsSection.appendChild(resolutionContainer); // Añadir al contenedor de resultados

        // Añadir el contenido completo al contenedor principal
        integralesDefinidasContainer.appendChild(contentDiv);

        // --- Lógica de MathLive y Cálculo ---

        let mathFunction = null; // Para almacenar la función parseada de Math.js

        // Event listener para actualizar la función cuando cambia el MathField
        mathField.addEventListener('input', () => {
            errorMessageDiv.classList.remove('active');
            errorMessageDiv.textContent = '';
            try {
                // Convertir LaTeX a una expresión que math.js pueda evaluar
                // Esta conversión es una simplificación y podría necesitar más robustez
                const latex = mathField.value;
                const expression = convertLaTeXToMathJs(latex);
                mathFunction = math.compile(expression);

                // Intentar graficar inmediatamente para previsualizar
                const a = parseFloat(inputA.value);
                const b = parseFloat(inputB.value);
                if (!isNaN(a) && !isNaN(b) && a < b) {
                    plotFunction(
                        'integral-graph',
                        expression,
                        [Math.min(a, b) - 2, Math.max(a, b) + 2], // Dominio extendido
                        [-10, 10] // Dominio Y inicial
                    );
                }

            } catch (e) {
                errorMessageDiv.textContent = "Error en la función: " + e.message;
                errorMessageDiv.classList.add('active');
                mathFunction = null; // Invalida la función si hay error
                graphContainer.innerHTML = `<p style="color: #dc2626; text-align: center; padding-top: 50px;">Error de sintaxis en la función.</p>`;
            }
        });

        // Helper para convertir LaTeX a una expresión compatible con function-plot/math.js
        function convertLaTeXToMathJs(latex) {
            // function-plot y math.js son bastante flexibles, pero algunas cosas son diferentes.
            // Ejemplo: x^2 en LaTeX es x^2 en math.js
            // \sin(x) -> sin(x)
            // \cos(x) -> cos(x)
            // \exp(x) -> exp(x) o e^x
            // \sqrt{x} -> sqrt(x)
            // Algunos reemplazos básicos:
            let expr = latex
                .replace(/\\sin/g, 'sin')
                .replace(/\\cos/g, 'cos')
                .replace(/\\tan/g, 'tan')
                .replace(/\\exp/g, 'exp')
                .replace(/\\ln/g, 'log') // Math.js usa log para ln
                .replace(/\\log_{10}/g, 'log10')
                .replace(/\\sqrt\[(.*?)\]\{(.*?)\}/g, 'nthRoot($2, $1)') // nthRoot(value, root)
                .replace(/\\sqrt\{(.*?)\}/g, 'sqrt($1)')
                .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '($1)/($2)')
                .replace(/([0-9])([a-zA-Z])/g, '$1*$2') // 2x -> 2*x
                .replace(/([a-zA-Z])([0-9])/g, '$1*$2') // x2 -> x*2 (menos común, pero por si acaso)
                .replace(/([a-zA-Z])([a-zA-Z])/g, '$1*$2'); // xy -> x*y

            // MathLive a veces genera \cdot para la multiplicación explícita.
            expr = expr.replace(/\\cdot/g, '*');

            // Asegurar que 'e' se interprete como la constante de Euler
            expr = expr.replace(/\be\b/g, 'E'); // Reemplaza 'e' como palabra completa por Math.js 'E'

            // Para potencias, math.js y function-plot usan '^'
            // No es necesario reemplazar aquí si MathLive ya lo maneja bien.

            return expr;
        }


        // Implementación del Método de Simpson 1/3
        function simpsonIntegration(func, a, b, n, resolutionSteps) {
            const h = (b - a) / n;
            let sum = func(a) + func(b); // f(a) + f(b)

            resolutionSteps.push(`<h3>Datos iniciales:</h3>`);
            resolutionSteps.push(`<div class="resolution-step"><p>Límite Inferior (a): ${a}</p><p>Límite Superior (b): ${b}</p><p>Número de Subintervalos (n): ${n}</p><p>Ancho de subintervalo (h): (b - a) / n = (${b} - ${a}) / ${n} = ${h}</p></div>`);
            resolutionSteps.push(`<h3>Cálculo de los términos:</h3>`);

            // Iterar para los términos pares (multiplicados por 4)
            for (let i = 1; i < n; i += 2) {
                const x_i = a + i * h;
                const fx_i = func(x_i);
                sum += 4 * fx_i;
                resolutionSteps.push(`<div class="resolution-step"><p>i = ${i} (impar): x<sub>${i}</sub> = a + ${i}h = ${a} + ${i}*${h} = ${x_i}</p><p>f(x<sub>${i}</sub>) = f(${x_i}) = ${fx_i.toFixed(6)}</p><p>Añadir a la suma: 4 * f(x<sub>${i}</sub>) = 4 * ${fx_i.toFixed(6)} = ${(4 * fx_i).toFixed(6)}</p></div>`);
            }

            // Iterar para los términos impares (multiplicados por 2)
            for (let i = 2; i < n; i += 2) {
                const x_i = a + i * h;
                const fx_i = func(x_i);
                sum += 2 * fx_i;
                resolutionSteps.push(`<div class="resolution-step"><p>i = ${i} (par): x<sub>${i}</sub> = a + ${i}h = ${a} + ${i}*${h} = ${x_i}</p><p>f(x<sub>${i}</sub>) = f(${x_i}) = ${fx_i.toFixed(6)}</p><p>Añadir a la suma: 2 * f(x<sub>${i}</sub>) = 2 * ${fx_i.toFixed(6)} = ${(2 * fx_i).toFixed(6)}</p></div>`);
            }

            const integralResult = (h / 3) * sum;

            resolutionSteps.push(`<h3>Suma Total de f(x) * coeficiente:</h3>`);
            resolutionSteps.push(`<div class="resolution-step"><p>Suma (Σ): f(a) + 4Σf(x<sub>impares</sub>) + 2Σf(x<sub>pares</sub>) + f(b) = ${sum.toFixed(6)}</p></div>`);
            resolutionSteps.push(`<h3>Resultado Final:</h3>`);
            resolutionSteps.push(`<div class="resolution-step"><p>Integral ≈ (h / 3) * Σ = (${h.toFixed(6)} / 3) * ${sum.toFixed(6)} = ${integralResult.toFixed(6)}</p></div>`);

            return integralResult;
        }

        calculateButton.addEventListener('click', () => {
            errorMessageDiv.classList.remove('active');
            errorMessageDiv.textContent = '';
            resultContainer.classList.remove('active');
            resolutionContainer.classList.remove('active');
            resolutionContent.innerHTML = '';

            const a = parseFloat(inputA.value);
            const b = parseFloat(inputB.value);
            const n = parseInt(inputN.value);
            const latexExpression = mathField.value;
            let expression = '';

            if (!latexExpression) {
                errorMessageDiv.textContent = "Por favor, ingrese una función f(x).";
                errorMessageDiv.classList.add('active');
                return;
            }

            try {
                expression = convertLaTeXToMathJs(latexExpression);
                mathFunction = math.compile(expression);
                // Prueba la función con un valor para asegurar que sea evaluable
                mathFunction.evaluate({ x: 0 });
            } catch (e) {
                errorMessageDiv.textContent = "Error en la función: " + e.message + ". Asegúrate de usar 'x' como variable.";
                errorMessageDiv.classList.add('active');
                return;
            }

            if (isNaN(a) || isNaN(b) || isNaN(n)) {
                errorMessageDiv.textContent = "Por favor, ingrese valores numéricos válidos para los límites y el número de subintervalos.";
                errorMessageDiv.classList.add('active');
                return;
            }

            if (a >= b) {
                errorMessageDiv.textContent = "El límite inferior (a) debe ser menor que el límite superior (b).";
                errorMessageDiv.classList.add('active');
                return;
            }

            if (n <= 0 || n % 2 !== 0) {
                errorMessageDiv.textContent = "El número de subintervalos (n) debe ser un entero par positivo (mínimo 2).";
                errorMessageDiv.classList.add('active');
                return;
            }

            const funcToEvaluate = (x) => {
                try {
                    return mathFunction.evaluate({ x: x });
                } catch (e) {
                    console.error("Error evaluando la función en x =", x, ":", e);
                    throw new Error("Error al evaluar la función en el rango. Posiblemente división por cero o dominio inválido.");
                }
            };

            const resolutionSteps = [];
            try {
                const integralResult = simpsonIntegration(funcToEvaluate, a, b, n, resolutionSteps);
                resultValue.textContent = integralResult.toFixed(6); // Mostrar con 6 decimales
                resultContainer.classList.add('active');

                // Graficar la función con el área resaltada
                // Ajustar el dominio X para que abarque los límites y un poco más
                const padding = (b - a) * 0.2; // 20% de padding a cada lado
                const plotXMin = a - padding;
                const plotXMax = b + padding;

                // Intentar determinar un dominio Y razonable para la gráfica
                // Podríamos evaluar la función en varios puntos para encontrar min/max en el rango [a,b]
                let minY = funcToEvaluate(a);
                let maxY = funcToEvaluate(a);
                for (let i = 0; i <= n; i++) {
                    const x = a + i * (b - a) / n;
                    const y = funcToEvaluate(x);
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
                const yPadding = (maxY - minY) * 0.2 || 1; // 20% padding, mínimo 1 si es una constante
                const plotYMin = minY - yPadding;
                const plotYMax = maxY + yPadding;


                plotFunction(
                    'integral-graph',
                    expression,
                    [plotXMin, plotXMax],
                    [plotYMin, plotYMax],
                    {}, // Opciones adicionales de function-plot (vacío por ahora)
                    { xMin: a, xMax: b, color: '#93c5fd' } // Resaltar el área
                );

                // Mostrar los pasos de la resolución
                resolutionContent.innerHTML = resolutionSteps.join('');
                showStepsButton.style.display = 'block'; // Asegurarse de que el botón sea visible

            } catch (e) {
                errorMessageDiv.textContent = "Error durante el cálculo de la integral: " + e.message;
                errorMessageDiv.classList.add('active');
                resultContainer.classList.remove('active');
                showStepsButton.style.display = 'none';
                resolutionContainer.classList.remove('active');
                graphContainer.innerHTML = `<p style="color: #dc2626; text-align: center; padding-top: 50px;">No se pudo graficar debido a un error en el cálculo o dominio.</p>`;
            }
        });

        showStepsButton.addEventListener('click', () => {
            resolutionContainer.classList.toggle('active');
            if (resolutionContainer.classList.contains('active')) {
                showStepsButton.textContent = "Ocultar Resolución Paso a Paso";
            } else {
                showStepsButton.textContent = "Mostrar Resolución Paso a Paso";
            }
        });

        // Inicializar una gráfica vacía o de ejemplo al cargar
        // Esto es opcional, pero ayuda a que no se vea vacío
        plotFunction('integral-graph', 'x'); // Grafica f(x) = x por defecto

    }
});