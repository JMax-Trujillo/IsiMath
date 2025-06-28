document.addEventListener('DOMContentLoaded', async () => {
    // Referencia al div principal
    const contentLimites = document.getElementById('limites');
    contentLimites.textContent = "";

    // --- Crear estructura base ---
    // Título
    const titulo = document.createElement('h2');
    titulo.textContent = "Calculadora de Límites y Derivadas";
    titulo.style.textAlign = "center";
    contentLimites.appendChild(titulo);

    // Contenedor de inputs
    const contenedor = document.createElement('div');
    contenedor.style.display = "flex";
    contenedor.style.flexDirection = "column";
    contenedor.style.gap = "1rem";
    contenedor.style.maxWidth = "480px";
    contenedor.style.margin = "auto";
    contenedor.style.background = "#f9f9f9";
    contenedor.style.padding = "1.5rem";
    contenedor.style.borderRadius = "1rem";
    contenedor.style.boxShadow = "0 2px 12px #0001";
    contentLimites.appendChild(contenedor);

    // --- MathLive input para la función ---
    const labelFuncion = document.createElement('label');
    labelFuncion.textContent = "Función f(x):";
    labelFuncion.style.fontWeight = "bold";
    contenedor.appendChild(labelFuncion);

    const mathfield = document.createElement('math-field');
    mathfield.setAttribute('virtual-keyboard-mode', 'onfocus');
    mathfield.style.fontSize = "1.3rem";
    mathfield.style.padding = "0.5rem";
    mathfield.style.border = "1px solid #ccc";
    mathfield.style.borderRadius = "0.5rem";
    mathfield.value = "x^2";
    contenedor.appendChild(mathfield);

    // --- Punto de evaluación ---
    const labelPunto = document.createElement('label');
    labelPunto.textContent = "Punto de evaluación (a):";
    labelPunto.style.fontWeight = "bold";
    contenedor.appendChild(labelPunto);

    const inputPunto = document.createElement('input');
    inputPunto.type = "number";
    inputPunto.value = "1";
    inputPunto.style.width = "80px";
    inputPunto.style.fontSize = "1.1rem";
    inputPunto.style.padding = "0.3rem";
    inputPunto.style.borderRadius = "0.3rem";
    inputPunto.style.border = "1px solid #ccc";
    contenedor.appendChild(inputPunto);

    // --- Selección de orden de derivada ---
    const labelDerivada = document.createElement('label');
    labelDerivada.textContent = "Orden de la derivada:";
    labelDerivada.style.fontWeight = "bold";
    contenedor.appendChild(labelDerivada);

    const selectOrden = document.createElement('select');
    selectOrden.style.fontSize = "1.1rem";
    selectOrden.style.padding = "0.3rem";
    selectOrden.style.borderRadius = "0.3rem";
    selectOrden.style.border = "1px solid #ccc";
    ["Primera", "Segunda", "Tercera", "n-ésima"].forEach((txt, i) => {
        const opt = document.createElement('option');
        opt.value = i + 1;
        opt.textContent = txt;
        selectOrden.appendChild(opt);
    });
    contenedor.appendChild(selectOrden);

    // Input para n (solo visible si se selecciona n-ésima)
    const inputN = document.createElement('input');
    inputN.type = "number";
    inputN.value = "4";
    inputN.min = "1";
    inputN.style.width = "60px";
    inputN.style.fontSize = "1.1rem";
    inputN.style.padding = "0.3rem";
    inputN.style.borderRadius = "0.3rem";
    inputN.style.border = "1px solid #ccc";
    inputN.style.display = "none";
    contenedor.appendChild(inputN);

    selectOrden.addEventListener('change', () => {
        inputN.style.display = selectOrden.value == 4 ? "inline-block" : "none";
    });

    // --- Resultados ---
    const resultados = document.createElement('div');
    resultados.style.marginTop = "1rem";
    resultados.style.fontSize = "1.1rem";
    resultados.style.background = "#eef";
    resultados.style.padding = "0.7rem";
    resultados.style.borderRadius = "0.5rem";
    contenedor.appendChild(resultados);

    // --- Gráfica ---
    const graficaDiv = document.createElement('div');
    graficaDiv.id = "grafica-limites";
    graficaDiv.style.width = "100%";
    graficaDiv.style.height = "320px";
    graficaDiv.style.marginTop = "1.5rem";
    contentLimites.appendChild(graficaDiv);

    // --- Utilidades ---
    function parseMathLiveToMathJS(latex) {
        // MathLive usa ^ para potencias, \frac{a}{b} para fracciones, etc.
        // Math.js interpreta expresiones tipo JS, pero soporta ^, sqrt, sin, cos, etc.
        // Aquí podrías adaptar algunos reemplazos si fuera necesario.
        return latex.replace(/\\cdot/g, '*').replace(/\\times/g, '*');
    }

    function derivadaN(expr, variable, orden) {
        let res = math.parse(expr);
        for (let i = 0; i < orden; ++i) {
            res = math.derivative(res, variable);
        }
        return res;
    }

    // --- Lógica principal ---
    async function actualizar() {
        const latex = mathfield.value;
        const exprStr = parseMathLiveToMathJS(latex);
        const punto = parseFloat(inputPunto.value);
        let orden = parseInt(selectOrden.value);
        if (selectOrden.value == 4) {
            orden = Math.max(1, parseInt(inputN.value) || 1);
        }
        let resultadoHTML = "";
        try {
            // Derivada simbólica
            let derivadaNode = derivadaN(exprStr, 'x', orden);
            const derivadaLatex = derivadaNode.toTex();
            // Evaluación en el punto
            const derivadaEval = derivadaNode.evaluate({x: punto});
            resultadoHTML += `<b>Derivada ${orden === 1 ? '' : orden + 'ª'}:</b> <span style="font-family:serif;font-size:1.2em;">\\(${derivadaLatex}\\)</span><br>`;
            resultadoHTML += `<b>Valor en x = ${punto}:</b> <span style="color:blue;font-weight:bold;">${derivadaEval}</span>`;
        } catch (err) {
            resultadoHTML = `<span style="color:red;">Error en la función o derivada</span>`;
        }
        resultados.innerHTML = resultadoHTML;

        // --- Graficar función y derivada ---
        try {
            // Dominio para graficar
            const xMin = punto - 5, xMax = punto + 5;
            const xValues = [];
            const yValues = [];
            const yDerivada = [];
            for (let x = xMin; x <= xMax; x += (xMax-xMin)/200) {
                let y = NaN, yd = NaN;
                try {
                    y = math.evaluate(exprStr, {x});
                } catch {}
                try {
                    let dn = derivadaN(exprStr, 'x', orden);
                    yd = dn.evaluate({x});
                } catch {}
                xValues.push(x);
                yValues.push(y);
                yDerivada.push(yd);
            }
            // Punto de evaluación
            const yPunto = math.evaluate(exprStr, {x: punto});
            const yDerivadaPunto = derivadaN(exprStr, 'x', orden).evaluate({x: punto});

            const data = [
                {
                    x: xValues,
                    y: yValues,
                    mode: 'lines',
                    name: 'f(x)',
                    line: {color: '#1f77b4', width: 2}
                },
                {
                    x: xValues,
                    y: yDerivada,
                    mode: 'lines',
                    name: `Derivada ${orden === 1 ? '' : orden + 'ª'}`,
                    line: {color: '#d62728', dash: 'dot', width: 2}
                },
                {
                    x: [punto],
                    y: [yPunto],
                    mode: 'markers',
                    name: 'Punto (a, f(a))',
                    marker: {color: '#1f77b4', size: 10, symbol: 'circle'}
                },
                {
                    x: [punto],
                    y: [yDerivadaPunto],
                    mode: 'markers',
                    name: `Punto derivada`,
                    marker: {color: '#d62728', size: 10, symbol: 'diamond'}
                }
            ];
            const layout = {
                title: `Gráfica de la función y su derivada`,
                xaxis: {title: 'x', zeroline: false},
                yaxis: {title: 'y', zeroline: false},
                legend: {orientation: "h", y: -0.2},
                margin: {t: 35, r: 10, l: 50, b: 40}
            };
            Plotly.react(graficaDiv, data, layout);
        } catch (err) {
            // Si hay error al graficar, limpiar la gráfica
            Plotly.purge(graficaDiv);
        }

        // Renderizar LaTeX en el resultado
        if (window.MathJax) MathJax.typesetPromise([resultados]);
    }

    // --- Eventos ---
    mathfield.addEventListener('input', actualizar);
    inputPunto.addEventListener('input', actualizar);
    selectOrden.addEventListener('change', actualizar);
    inputN.addEventListener('input', actualizar);

    // MathJax para renderizar LaTeX en resultados
    if (!window.MathJax) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
        script.async = true;
        script.onload = () => actualizar();
        document.head.appendChild(script);
    } else {
        actualizar();
    }
});