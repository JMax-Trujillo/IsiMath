document.addEventListener('DOMContentLoaded', () => {
    // Asegurarse de que el contenedor principal para límites exista y esté vacío
    const limitesContainer = document.getElementById('limites');
    if (!limitesContainer) {
        console.error('No se encontró el elemento con ID "limites". Asegúrate de tener <div id="limites"> en tu HTML.');
        return;
    }
    limitesContainer.textContent = ''; // Limpiar cualquier contenido previo

    // Crear el contenedor principal para la lógica de límites
    const contenedorLogicaLimites = document.createElement('div');
    contenedorLogicaLimites.className = 'gradient-bg-main'; // Clase para fondo gradiente con shimmer
    contenedorLogicaLimites.style.cssText = `
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        border-radius: 25px; /* Más redondeado */
        padding: 40px; /* Más padding */
        box-shadow: 0 25px 50px rgba(0,0,0,0.25); /* Sombra más profunda */
        max-width: 1400px; /* Ancho máximo aumentado */
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        min-height: 70vh; /* Altura mínima para mostrar bien el fondo */
        animation: fadeIn 0.8s ease-out; /* Animación de entrada para el contenedor */
    `;

    // Partículas de fondo (mejoradas y animadas)
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden; /* Asegura que las partículas no se salgan */
    `;

    for (let i = 0; i < 40; i++) { // Más partículas para un efecto más denso
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 4; // Tamaño de partículas un poco más grandes
        const duration = Math.random() * 15 + 10; // Duración de animación más variada
        const delay = Math.random() * 10; // Retraso para un efecto más orgánico
        const blur = Math.random() * 3 + 1; // Un poco de blur para profundidad

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(59, 130, 246, ${0.1 + Math.random() * 0.2}); /* Color azul con transparencia */
            border-radius: 50%;
            filter: blur(${blur}px);
            opacity: 0; /* Empieza invisible */
            animation: floatAndFade ${duration}s infinite ease-in-out ${delay}s forwards;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
        `;
        particlesContainer.appendChild(particle);
    }
    contenedorLogicaLimites.appendChild(particlesContainer);

    // Animaciones CSS para el background y partículas
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatAndFade {
            0% { transform: translateY(0) translateX(0) scale(0); opacity: 0; }
            10% { opacity: 1; scale(1); }
            50% { transform: translateY(-50px) translateX(20px); opacity: 0.8; }
            100% { transform: translateY(-100px) translateX(-30px) scale(0.5); opacity: 0; }
        }
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
        .gradient-bg-main {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            /* Añadir shimmer si es deseado, por ejemplo, para el título */
        }
        .shimmer-text {
            background: linear-gradient(to right, #1e40af 0%, #3b82f6 20%, #1e40af 40%, #1e40af 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: 200% 100%;
            animation: shimmer 5s infinite linear;
        }
        .modal-slide-in {
            animation: slideIn 0.4s ease forwards;
        }
        .modal-fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-50px) scale(0.9); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes pulseBorder {
            0% { border-color: #bae6fd; }
            50% { border-color: #3b82f6; }
            100% { border-color: #bae6fd; }
        }
    `;
    document.head.appendChild(styleSheet);


    // Título principal
    const titulo = document.createElement("h1");
    titulo.textContent = "Calculadora de límites";
    titulo.className = 'shimmer-text'; // Aplicar shimmer al texto del título
    titulo.style.cssText = `
        text-align: center;
        font-size: 2.8rem; /* Tamaño de fuente más grande */
        font-weight: 800; /* Más audaz */
        margin-bottom: 40px; /* Más espacio */
        text-shadow: 0 4px 8px rgba(0,0,0,0.15); /* Sombra de texto más pronunciada */
        position: relative;
        z-index: 1;
        letter-spacing: 1px; /* Espaciado de letras */
        transition: all 0.3s ease;
    `;
    // Animación hover para el título
    titulo.addEventListener('mouseenter', () => {
        titulo.style.transform = 'scale(1.02)';
    });
    titulo.addEventListener('mouseleave', () => {
        titulo.style.transform = 'scale(1)';
    });
    contenedorLogicaLimites.appendChild(titulo);

    // Contenedor de las dos secciones principales
    const sectionsContainer = document.createElement('div');
    sectionsContainer.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px; /* Más espacio entre columnas */
        position: relative;
        z-index: 1;
    `;

    // SECCIÓN IZQUIERDA - Controles
    const leftSection = document.createElement('div');
    leftSection.style.cssText = `
        background: white;
        border-radius: 20px; /* Más redondeado */
        padding: 30px; /* Más padding */
        box-shadow: 0 15px 35px rgba(0,0,0,0.15); /* Sombra mejorada */
        border: 1px solid #e2e8f0;
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); /* Transición más suave */
        transform: translateY(0); /* Estado inicial */
    `;

    const leftTitle = document.createElement('h2');
    leftTitle.textContent = 'Función y parámetros del límite';
    leftTitle.style.cssText = `
        color: #1e40af; /* Color más oscuro para el título */
        font-size: 1.8rem; /* Título más grande */
        margin-bottom: 25px;
        font-weight: 700;
        border-bottom: 2px solid #eff6ff; /* Separador sutil */
        padding-bottom: 10px;
    `;
    leftSection.appendChild(leftTitle);

    // Función para crear inputs estilizados normales
    function createStyledInput(labelText, placeholder, id) {
        const inputGroup = document.createElement('div');
        inputGroup.style.cssText = `
            margin-bottom: 25px; /* Más espacio */
            position: relative;
            animation: fadeIn 0.6s ease-out; /* Animación de entrada */
        `;
        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.cssText = `
            display: block;
            color: #334155; /* Color de texto más oscuro */
            font-weight: 700; /* Más audaz */
            margin-bottom: 10px;
            font-size: 1rem;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = id;
        input.placeholder = placeholder;
        input.style.cssText = `
            width: 100%;
            padding: 14px 18px; /* Más padding */
            border: 2px solid #e5e7eb;
            border-radius: 12px; /* Más redondeado */
            font-size: 1.05rem; /* Fuente ligeramente más grande */
            transition: all 0.3s ease;
            background: #fdfefe; /* Fondo más blanco */
            box-sizing: border-box;
        `;
        // Efectos hover y focus
        input.addEventListener('focus', () => {
            input.style.borderColor = '#3b82f6';
            input.style.background = 'white';
            input.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.2)'; /* Sombra de focus más pronunciada */
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = '#e5e7eb';
            input.style.background = '#fdfefe';
            input.style.boxShadow = 'none';
        });
        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        return inputGroup;
    }

    // Crear grupo para MathField (Función f(x))
    function createMathFieldGroup() {
        const mathGroup = document.createElement('div');
        mathGroup.style.cssText = `
            margin-bottom: 25px; /* Más espacio */
            position: relative;
            animation: fadeIn 0.6s ease-out; /* Animación de entrada */
        `;
        const label = document.createElement('label');
        label.textContent = 'Función f(x):';
        label.style.cssText = `
            display: block;
            color: #334155;
            font-weight: 700;
            margin-bottom: 10px;
            font-size: 1rem;
        `;

        const mathFieldContainer = document.createElement('div');
        mathFieldContainer.style.cssText = `
            border: 2px solid #e5e7eb;
            border-radius: 12px; /* Más redondeado */
            background: #fdfefe;
            transition: all 0.3s ease;
            overflow: hidden;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); /* Sombra interior */
        `;

        const mathField = document.createElement('math-field');
        mathField.id = 'math-function';
        mathField.style.cssText = `
            width: 100%;
            padding: 14px 18px;
            font-size: 1.3rem; /* Tamaño de MathField más grande */
            border: none;
            background: transparent;
            min-height: 60px; /* Altura mínima aumentada */
        `;

        // Configurar opciones de MathField
        mathField.options = {
            virtualKeyboardMode: 'manual',
            defaultMode: 'math',
            placeholder: 'Ej: (x^2 - 4) / (x - 2)'
        };
        // Efectos de focus y blur
        mathField.addEventListener('focus', () => {
            mathFieldContainer.style.borderColor = '#3b82f6';
            mathFieldContainer.style.background = 'white';
            mathFieldContainer.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.2), inset 0 1px 3px rgba(0,0,0,0.05)';
        });
        mathField.addEventListener('blur', () => {
            mathFieldContainer.style.borderColor = '#e5e7eb';
            mathFieldContainer.style.background = '#fdfefe';
            mathFieldContainer.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.05)';
        });
        mathFieldContainer.appendChild(mathField);
        mathGroup.appendChild(label);
        mathGroup.appendChild(mathFieldContainer);
        return mathGroup;
    }

    // Crear select para Tipo de Límite
    function createLimitTypeSelect() {
        const selectGroup = document.createElement('div');
        selectGroup.style.cssText = `
            margin-bottom: 25px; /* Más espacio */
            position: relative;
            animation: fadeIn 0.6s ease-out; /* Animación de entrada */
        `;
        const label = document.createElement('label');
        label.textContent = 'Tipo de Límite:';
        label.style.cssText = `
            display: block;
            color: #334155;
            font-weight: 700;
            margin-bottom: 10px;
            font-size: 1rem;
        `;

        const select = document.createElement('select');
        select.id = 'limit-type';
        select.style.cssText = `
            width: 100%;
            padding: 14px 18px; /* Más padding */
            border: 2px solid #e5e7eb;
            border-radius: 12px; /* Más redondeado */
            font-size: 1.05rem; /* Fuente ligeramente más grande */
            transition: all 0.3s ease;
            background: #fdfefe;
            box-sizing: border-box;
            appearance: none; /* Quitar estilo nativo del select */
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.9rem center; /* Posición de la flecha */
            background-size: 1.8rem; /* Tamaño de la flecha */
        `;

        const options = [
            { value: 'bilateral', text: 'Bilateral' },
            { value: 'left', text: 'Por la Izquierda (x → x₀⁻)' },
            { value: 'right', text: 'Por la Derecha (x → x₀⁺)' }
        ];

        options.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.textContent = optionData.text;
            select.appendChild(option);
        });

        select.addEventListener('focus', () => {
            select.style.borderColor = '#3b82f6';
            select.style.background = 'white';
            select.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.2)';
        });
        select.addEventListener('blur', () => {
            select.style.borderColor = '#e5e7eb';
            select.style.background = '#fdfefe';
            select.style.boxShadow = 'none';
        });

        selectGroup.appendChild(label);
        selectGroup.appendChild(select);
        return selectGroup;
    }

    // Crear inputs
    leftSection.appendChild(createMathFieldGroup());
    leftSection.appendChild(createStyledInput('Punto de Aproximación (x₀):', 'Ej: 2', 'punto-aproximacion'));
    leftSection.appendChild(createLimitTypeSelect());

    // Botón de calcular
    const calculateBtn = document.createElement('button');
    calculateBtn.textContent = 'Calcular Límite y Graficar';
    calculateBtn.style.cssText = `
        width: 100%;
        padding: 18px; /* Más padding */
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        border: none;
        border-radius: 15px; /* Más redondeado */
        font-size: 1.25rem; /* Más grande */
        font-weight: 700; /* Más audaz */
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 6px 20px rgba(59,130,246,0.4); /* Sombra más pronunciada */
        margin-top: 20px; /* Más espacio */
        letter-spacing: 0.5px;
        position: relative;
        overflow: hidden;
    `;

    // Shimmer effect on button
    const shimmerSpan = document.createElement('span');
    shimmerSpan.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.3);
        transform: skewX(-20deg);
        animation: shimmerBtn 2s infinite;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    calculateBtn.appendChild(shimmerSpan);

    calculateBtn.addEventListener('mouseenter', () => {
        calculateBtn.style.transform = 'translateY(-4px)';
        calculateBtn.style.boxShadow = '0 12px 30px rgba(59,130,246,0.5)';
        calculateBtn.style.background = 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)';
        shimmerSpan.style.animationPlayState = 'running';
        shimmerSpan.style.opacity = '1';
    });
    calculateBtn.addEventListener('mouseleave', () => {
        calculateBtn.style.transform = 'translateY(0)';
        calculateBtn.style.boxShadow = '0 6px 20px rgba(59,130,246,0.4)';
        calculateBtn.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
        shimmerSpan.style.animationPlayState = 'paused';
        shimmerSpan.style.opacity = '0';
        shimmerSpan.style.left = '-100%'; // Reset position
    });
    leftSection.appendChild(calculateBtn);

    // Keyframes for button shimmer
    styleSheet.innerHTML += `
        @keyframes shimmerBtn {
            0% { left: -100%; }
            50% { left: 100%; }
            100% { left: -100%; }
        }
    `;

    // SECCIÓN DERECHA - Gráfica y Resultado
    const rightSection = document.createElement('div');
    rightSection.style.cssText = `
        background: white;
        border-radius: 20px; /* Más redondeado */
        padding: 30px; /* Más padding */
        box-shadow: 0 15px 35px rgba(0,0,0,0.15); /* Sombra mejorada */
        border: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        transform: translateY(0);
    `;

    const rightTitle = document.createElement('h2');
    rightTitle.textContent = 'Gráfica y Resultado del Límite';
    rightTitle.style.cssText = `
        color: #1e40af;
        font-size: 1.8rem;
        margin-bottom: 25px;
        font-weight: 700;
        border-bottom: 2px solid #eff6ff;
        padding-bottom: 10px;
    `;
    rightSection.appendChild(rightTitle);

    // Contenedor para la gráfica de Plotly
    const plotContainer = document.createElement('div');
    plotContainer.id = 'plot-container';
    plotContainer.style.cssText = `
        height: 400px; /* Altura aumentada para mejor visualización */
        border: 2px solid #e5e7eb;
        border-radius: 12px; /* Más redondeado */
        background: #fdfefe;
        margin-bottom: 25px;
        transition: all 0.3s ease;
        box-shadow: inset 0 1px 5px rgba(0,0,0,0.05); /* Sombra interior sutil */
        overflow: hidden; /* Asegura que la gráfica no se desborde */
    `;
    rightSection.appendChild(plotContainer);

    // Contenedor del resultado
    const resultContainer = document.createElement('div');
    resultContainer.style.cssText = `
        background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%); /* Gradiente azul claro */
        border-radius: 15px; /* Más redondeado */
        padding: 25px; /* Más padding */
        border: 2px solid #93c5fd;
        margin-top: auto;
        box-shadow: 0 5px 20px rgba(0,0,0,0.08); /* Sombra sutil */
        text-align: center;
        animation: pulseBorder 2s infinite ease-in-out; /* Animación de pulso */
    `;

    const resultLabel = document.createElement('div');
    resultLabel.textContent = 'Valor del Límite:';
    resultLabel.style.cssText = `
        color: #0369a1;
        font-weight: 700;
        margin-bottom: 15px; /* Más espacio */
        font-size: 1.25rem; /* Más grande */
        text-shadow: 0 1px 2px rgba(0,0,0,0.05);
    `;
    const resultValue = document.createElement('div');
    resultValue.id = 'resultado-limite';
    resultValue.textContent = 'Ingrese los datos y presione "Calcular"';
    resultValue.style.cssText = `
        color: #1e40af;
        font-size: 2rem; /* Mucho más grande */
        font-weight: 800; /* Extra audaz */
        font-family: 'Roboto Mono', monospace; /* Fuente monoespaciada para el resultado */
        padding: 15px;
        background: white;
        border-radius: 10px;
        border: 1px solid #bfdbfe;
        box-shadow: inset 0 1px 5px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
    `;

    const stepsBtn = document.createElement('button');
    stepsBtn.textContent = 'Ver Pasos Detallados';
    stepsBtn.style.cssText = `
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%); /* Gradiente verde */
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        font-size: 1.05rem;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 20px;
        opacity: 0.7; /* Inicialmente menos opaco */
        pointer-events: none;
        box-shadow: 0 4px 15px rgba(16,185,129,0.2);
    `;

    stepsBtn.addEventListener('mouseenter', () => {
        stepsBtn.style.transform = 'translateY(-2px)';
        stepsBtn.style.boxShadow = '0 8px 20px rgba(16,185,129,0.4)';
        stepsBtn.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
    });
    stepsBtn.addEventListener('mouseleave', () => {
        stepsBtn.style.transform = 'translateY(0)';
        stepsBtn.style.boxShadow = '0 4px 15px rgba(16,185,129,0.2)';
        stepsBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    });

    resultContainer.appendChild(resultLabel);
    resultContainer.appendChild(resultValue);
    resultContainer.appendChild(stepsBtn);
    rightSection.appendChild(resultContainer);

    // Ensamblar las secciones
    sectionsContainer.appendChild(leftSection);
    sectionsContainer.appendChild(rightSection);
    contenedorLogicaLimites.appendChild(sectionsContainer);

    // Función para convertir LaTeX a expresión evaluable para Math.js
    function latexToMathJS(latex) {
        let expr = latex;

        // Limpiar espacios en blanco innecesarios
        expr = expr.replace(/\s/g, '');

        // Reemplazar \left( y \right) con paréntesis normales
        expr = expr.replace(/\\left\(/g, '(');
        expr = expr.replace(/\\right\)/g, ')');

        // Reemplazos directos de comandos LaTeX a sintaxis Math.js
        expr = expr.replace(/\\cdot/g, '*');
        expr = expr.replace(/\\times/g, '*');
        expr = expr.replace(/\\div/g, '/');
        expr = expr.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
        expr = expr.replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)');
        expr = expr.replace(/\\sin/g, 'sin');
        expr = expr.replace(/\\cos/g, 'cos');
        expr = expr.replace(/\\tan/g, 'tan');
        expr = expr.replace(/\\ln/g, 'log'); // math.js usa log para logaritmo natural
        expr = expr.replace(/\\log/g, 'log10'); // math.js usa log10 para logaritmo base 10
        expr = expr.replace(/\\exp/g, 'exp');
        expr = expr.replace(/\\pi/g, 'pi');
        expr = expr.replace(/\\e/g, 'e');

        // Manejar exponentes: x^2 o x^{ab}
        expr = expr.replace(/\^(\d+)/g, '^$1');
        expr = expr.replace(/\^\{([^}]+)\}/g, '^($1)');

        // Multiplicación implícita:
        // 1. Número seguido de variable (e.g., 2x -> 2*x)
        expr = expr.replace(/(\d)([a-zA-Z])/g, '$1*$2');
        // 2. Número seguido de paréntesis (e.g., 2(x+1) -> 2*(x+1))
        expr = expr.replace(/(\d)(\()/g, '$1*$2');
        // 3. Paréntesis seguido de variable (e.g., (x+1)x -> (x+1)*x)
        expr = expr.replace(/(\))([a-zA-Z])/g, '$1*$2'); // CORRECCIÓN CLAVE
        // 4. Variable seguida de paréntesis (e.g., x(y+1) -> x*(y+1))
        expr = expr.replace(/([a-zA-Z])(\()/g, '$1*$2');
        // 5. Paréntesis seguido de paréntesis (e.g., (x+1)(x-1) -> (x+1)*(x-1))
        expr = expr.replace(/(\))(\()/g, '$1*$2');
       
        // Añadir paréntesis a funciones si no los tienen, ej. 'sin x' -> 'sin(x)'
        expr = expr.replace(/(sin|cos|tan|log|log10|sqrt|exp)([a-zA-Z0-9])/g, '$1($2)');
        expr = expr.replace(/(sin|cos|tan|log|log10|sqrt|exp)(\\([a-zA-Z0-9]+))/g, '$1($2)');


        return expr;
    }

    // Función para evaluar expresiones usando MathJS (MISMA LÓGICA)
    function evaluateFunction(expression, x) {
        try {
            const scope = { x: x };
            const result = math.evaluate(expression, scope);
            // Math.js puede devolver Infinity, -Infinity o NaN
            if (typeof result === 'number' && !isFinite(result)) {
                return result; // Keep Infinity, -Infinity, NaN
            }
            return result;
        } catch (error) {
            console.warn('Error evaluating function for x =', x, 'Expression:', expression, 'Error:', error);
            return NaN;
        }
    }

    // Lógica para el cálculo numérico del límite
    function calculateLimitNumerically(mathExpression, x0, limitType) {
        const epsilon = 1e-7; // Un valor más pequeño para mayor precisión
        const precision = 6; // Para comparar valores

        let original_f_x0 = evaluateFunction(mathExpression, x0);

        let appliedLHopital = false;
        let originalNumerator = null;
        let originalDenominator = null;
        let derivedNumerator = null;
        let derivedDenominator = null;

        // Intentar aplicar L'Hôpital si es una forma indeterminada 0/0 o Inf/Inf
        try {
            const node = math.parse(mathExpression);
            if (node.type === 'OperatorNode' && node.op === '/') {
                originalNumerator = node.args[0].toString();
                originalDenominator = node.args[1].toString();

                const valNum = evaluateFunction(originalNumerator, x0);
                const valDen = evaluateFunction(originalDenominator, x0);

                const isZeroZero = Math.abs(valNum) < epsilon * 1000 && Math.abs(valDen) < epsilon * 1000;
                const isInfInf = (valNum === Infinity || valNum === -Infinity) && (valDen === Infinity || valDen === -Infinity);

                if (isZeroZero || isInfInf) {
                    const diffNumNode = math.derivative(originalNumerator, 'x');
                    const diffDenNode = math.derivative(originalDenominator, 'x');

                    derivedNumerator = diffNumNode.toString();
                    derivedDenominator = diffDenNode.toString();

                    const lHopitalExpression = `(${derivedNumerator}) / (${derivedDenominator})`;

                    // Recalcular el límite con la expresión derivada
                    let leftValLH = NaN;
                    let rightValLH = NaN;

                    if (limitType === 'bilateral' || limitType === 'left') {
                        leftValLH = evaluateFunction(lHopitalExpression, x0 - epsilon);
                        if (isNaN(leftValLH)) {
                            leftValLH = evaluateFunction(lHopitalExpression, x0 - epsilon * 10);
                        }
                    }
                    if (limitType === 'bilateral' || limitType === 'right') {
                        rightValLH = evaluateFunction(lHopitalExpression, x0 + epsilon);
                        if (isNaN(rightValLH)) {
                            rightValLH = evaluateFunction(lHopitalExpression, x0 + epsilon * 10);
                        }
                    }

                    let lHopitalResult = NaN;
                    if (limitType === 'left') {
                        lHopitalResult = leftValLH;
                    } else if (limitType === 'right') {
                        lHopitalResult = rightValLH;
                    } else { // Bilateral
                        if (isFinite(leftValLH) && isFinite(rightValLH) && Math.abs(leftValLH - rightValLH) < Math.pow(10, -precision)) {
                            lHopitalResult = (leftValLH + rightValLH) / 2;
                        } else if (leftValLH === Infinity && rightValLH === Infinity) {
                            lHopitalResult = Infinity;
                        } else if (leftValLH === -Infinity && rightValLH === -Infinity) {
                            lHopitalResult = -Infinity;
                        } else {
                            lHopitalResult = 'DNE';
                        }
                    }

                    if (isFinite(lHopitalResult) || lHopitalResult === Infinity || lHopitalResult === -Infinity || lHopitalResult === 'DNE') {
                        appliedLHopital = true;
                        // Devolver el resultado de L'Hôpital si es válido
                        return {
                            value: lHopitalResult,
                            appliedLHopital: true,
                            originalNumerator: originalNumerator,
                            originalDenominator: originalDenominator,
                            derivedNumerator: derivedNumerator,
                            derivedDenominator: derivedDenominator,
                            indeterminateForm: isZeroZero ? '0/0' : '∞/∞'
                        };
                    }
                }
            }
        } catch (e) {
            console.warn("Could not apply L'Hôpital's Rule:", e);
            // Si hay un error en el parseo o derivación, se procede con el método numérico normal
        }

        // Si no se aplicó L'Hôpital o falló, se usa el método numérico estándar
        let leftVal = NaN;
        let rightVal = NaN;

        // Intentar aproximación desde la izquierda
        if (limitType === 'bilateral' || limitType === 'left') {
            leftVal = evaluateFunction(mathExpression, x0 - epsilon);
            if (isNaN(leftVal)) { // Si es NaN en x0-epsilon, probar con x0-epsilon*10
                 leftVal = evaluateFunction(mathExpression, x0 - epsilon * 10);
            }
        }
        // Intentar aproximación desde la derecha
        if (limitType === 'bilateral' || limitType === 'right') {
            rightVal = evaluateFunction(mathExpression, x0 + epsilon);
            if (isNaN(rightVal)) { // Si es NaN en x0+epsilon, probar con x0+epsilon*10
                rightVal = evaluateFunction(mathExpression, x0 + epsilon * 10);
            }
        }

        let resultValue;
        if (limitType === 'left') {
            if (isFinite(leftVal)) resultValue = leftVal;
            else if (leftVal === Infinity) resultValue = '∞';
            else if (leftVal === -Infinity) resultValue = '-∞';
            else resultValue = 'DNE';
        } else if (limitType === 'right') {
            if (isFinite(rightVal)) resultValue = rightVal;
            else if (rightVal === Infinity) resultValue = '∞';
            else if (rightVal === -Infinity) resultValue = '-∞';
            else resultValue = 'DNE';
        } else { // Bilateral
            if (isFinite(leftVal) && isFinite(rightVal) && Math.abs(leftVal - rightVal) < Math.pow(10, -precision)) {
                resultValue = (leftVal + rightVal) / 2; // Promedio si son muy cercanos
            } else if (leftVal === Infinity && rightVal === Infinity) {
                resultValue = '∞';
            } else if (leftVal === -Infinity && rightVal === -Infinity) {
                resultValue = '-∞';
            } else {
                resultValue = 'DNE'; // Si no coinciden o son indefinidos
            }
        }

        return {
            value: resultValue,
            appliedLHopital: false,
            originalNumerator: null,
            originalDenominator: null,
            derivedNumerator: null,
            derivedDenominator: null,
            indeterminateForm: null
        };
    }

    // Función para crear gráfica con Plotly
    function createPlotlyGraph(mathExpression, x0, limitValue, limitType, latexExpression) {
        const xValues = [];
        const yValues = [];
        const range = 5; // Rango alrededor de x0 para graficar
        const numPoints = 1000; // Más puntos para una curva más suave
        const step = (range * 2) / numPoints;

        let minX = x0 - range;
        let maxX = x0 + range;

        // Ajustar el rango si x0 es muy pequeño o grande
        if (!isFinite(x0)) { // Fallback si x0 no es un número finito (aunque el input lo restringe)
            minX = -10;
            maxX = 10;
        }

        for (let i = 0; i <= numPoints; i++) {
            let x = minX + i * step;
            // Evitar x0 exactamente para funciones con discontinuidades removibles
            // También evita NaN/Infinity si la función es indefinida en x0
            if (Math.abs(x - x0) < 1e-7) { // Pequeña ventana alrededor de x0
                if (x < x0) x = x0 - 1e-7;
                else x = x0 + 1e-7;
            }

            const y = evaluateFunction(mathExpression, x);

            if (!isNaN(y) && isFinite(y)) { // Solo graficar valores finitos
                xValues.push(x);
                yValues.push(y);
            }
        }

        const traces = [
            {
                x: xValues,
                y: yValues,
                type: 'scatter',
                mode: 'lines',
                name: 'f(x)',
                line: {
                    color: '#3b82f6', // Azul principal
                    width: 4, // Línea más gruesa
                    shape: 'spline' // Curva más suave
                },
                fill: 'tozeroy', // Relleno hasta el eje Y=0
                fillcolor: 'rgba(59, 130, 246, 0.1)' // Color de relleno con transparencia
            }
        ];

        // Añadir punto de límite si es un valor numérico finito
        if (isFinite(limitValue)) {
            traces.push({
                x: [x0],
                y: [limitValue],
                mode: 'markers',
                type: 'scatter',
                name: 'Límite',
                marker: {
                    color: '#ef4444', // Rojo vibrante
                    size: 14, // Marcador más grande
                    symbol: 'circle-open', // Círculo abierto
                    line: {
                        color: '#b91c1c', // Borde rojo más oscuro
                        width: 3
                    }
                },
                hoverinfo: 'text',
                text: `<b>Límite (x₀, L):</b> (${x0.toFixed(3)}, ${limitValue.toFixed(6)})` // Tooltip mejorado
            });
        }

        const layout = {
            title: {
                text: `Gráfica de \\(${latexExpression}\\) en torno a x = ${x0}`,
                font: {
                    size: 20, // Título más grande
                    color: '#1e40af', // Color oscuro
                    family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
                }
            },
            xaxis: {
                title: 'x',
                gridcolor: '#e5e7eb',
                zerolinecolor: '#6b7280',
                showline: true,
                linewidth: 2,
                linecolor: '#d1d5db',
                range: [minX, maxX]
            },
            yaxis: {
                title: 'f(x)',
                gridcolor: '#e5e7eb',
                zerolinecolor: '#6b7280',
                showline: true,
                linewidth: 2,
                linecolor: '#d1d5db',
                // range: [minY, maxY] // Plotly es bueno con el auto-rango
            },
            plot_bgcolor: '#fafbfc',
            paper_bgcolor: 'white',
            font: {
                family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
            },
            margin: {
                l: 60,
                r: 60,
                t: 60,
                b: 60
            },
            hovermode: 'x unified', // Muestra información unificada al pasar el mouse
            newplot: true // Asegura que se dibuje una nueva gráfica
        };

        const config = {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian'],
            displaylogo: false,
            toImageButtonOptions: {
                format: 'png', // png, jpeg, webp, svg
                filename: 'limite-grafica',
                height: 600,
                width: 1000,
                scale: 2 // Aumenta la resolución de la imagen descargada
            }
        };

        Plotly.newPlot('plot-container', traces, layout, config);
    }

    // Variables globales para los pasos
    let currentCalculationData = null;

    // Función para generar pasos detallados del cálculo del límite
    function generateLimitSteps(mathExpression, latexExpression, x0, limitResult, limitType) {
        const steps = [];
        const epsilon = 1e-7; // Usar el mismo epsilon que en la función de cálculo

        let limitSymbol = '';
        if (limitType === 'left') limitSymbol = '^-';
        if (limitType === 'right') limitSymbol = '^+';

        steps.push({
            title: "Concepto del Límite",
            latex: `\\lim_{x \\to ${x0}${limitSymbol}} ${latexExpression}`,
            description: `Buscamos el valor al que se aproxima la función f(x) = \\(${latexExpression}\\) cuando x se acerca a ${x0}.`
        });

        // Evaluación numérica
        let descNum = "Evaluamos la función en puntos muy cercanos a \\(x_0\\) para observar su comportamiento:";
        const pointsToEvaluate = [];
        const testEpsilons = [epsilon * 100, epsilon * 10, epsilon];

        if (limitType === 'bilateral' || limitType === 'left') {
            testEpsilons.forEach(e => {
                const xVal = x0 - e;
                pointsToEvaluate.push({ x: xVal, label: `x₀ - ${e}`, val: evaluateFunction(mathExpression, xVal) });
            });
        }
        if (limitType === 'bilateral' || limitType === 'right') {
            testEpsilons.slice().reverse().forEach(e => {
                const xVal = x0 + e;
                pointsToEvaluate.push({ x: xVal, label: `x₀ + ${e}`, val: evaluateFunction(mathExpression, xVal) });
            });
        }
        pointsToEvaluate.push({ x: x0, label: `x₀ (evaluación directa)`, val: evaluateFunction(mathExpression, x0) });


        steps.push({
            title: "Aproximación Numérica Detallada",
            description: descNum,
            points: pointsToEvaluate.filter(p => !isNaN(p.val) || p.val === Infinity || p.val === -Infinity).map(p => ({
                x: p.x,
                fx: p.val,
                i: p.label
            }))
        });

        // Pasos de L'Hôpital si se aplicó
        if (limitResult.appliedLHopital) {
            steps.push({
                title: "Aplicación de la Regla de L'Hôpital",
                description: `Al evaluar directamente la función en \\(x_0 = ${x0}\\), se obtiene una forma indeterminada de tipo **\\(${limitResult.indeterminateForm}\\)**. Por lo tanto, aplicamos la Regla de L'Hôpital, que establece que si \\(\\lim_{x \\to c} \\frac{f(x)}{g(x)}\\) es \\(0/0\\) o \\(\\infty/\\infty\\), entonces \\(\\lim_{x \\to c} \\frac{f(x)}{g(x)} = \\lim_{x \\to c} \\frac{f'(x)}{g'(x)}\\).`,
                substeps: [
                    {
                        title: "1. Derivar Numerador",
                        latex: `f(x) = ${math.parse(limitResult.originalNumerator).toTex()} \\implies f'(x) = ${math.parse(limitResult.derivedNumerator).toTex()}`
                    },
                    {
                        title: "2. Derivar Denominador",
                        latex: `g(x) = ${math.parse(limitResult.originalDenominator).toTex()} \\implies g'(x) = ${math.parse(limitResult.derivedDenominator).toTex()}`
                    },
                    {
                        title: "3. Reevaluar el Límite con las Derivadas",
                        latex: `\\lim_{x \\to ${x0}${limitSymbol}} \\frac{f'(x)}{g'(x)} = \\lim_{x \\to ${x0}${limitSymbol}} \\frac{${math.parse(limitResult.derivedNumerator).toTex()}}{${math.parse(limitResult.derivedDenominator).toTex()}}`
                    }
                ]
            });
        }


        // Conclusión del límite
        let conclusionText = `Observando los valores de f(x) a medida que x se acerca a ${x0}${limitSymbol}, determinamos que el límite es: `;
        let formattedLimitValue;
        const finalLimitValue = limitResult.value;

        if (isFinite(finalLimitValue)) {
            formattedLimitValue = finalLimitValue.toFixed(6);
            conclusionText += `**${formattedLimitValue}**`;
        } else if (finalLimitValue === '∞') {
            formattedLimitValue = '\\infty';
            conclusionText += `**∞ (Infinito Positivo)**`;
        } else if (finalLimitValue === '-∞') {
            formattedLimitValue = '-\\infty';
            conclusionText += `**-∞ (Infinito Negativo)**`;
        } else {
            formattedLimitValue = '\\text{DNE}';
            conclusionText += `**No Existe (DNE)**. Esto puede ocurrir si los límites laterales son diferentes, o si la función oscila indefinidamente.`;
        }
        
        let conclusionLatex = `\\lim_{x \\to ${x0}${limitSymbol}} ${latexExpression} = ${formattedLimitValue}`;

        steps.push({
            title: "Conclusión del Límite",
            description: conclusionText,
            latex: conclusionLatex
        });

        return steps;
    }


    // Función para crear el modal de pasos
    function createStepsModal(steps) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px); /* Más blur */
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.4s ease-out;
        `;

        const modal = document.createElement('div');
        modal.className = 'modal-slide-in'; // Clase para animación
        modal.style.cssText = `
            background: white;
            border-radius: 25px; /* Más redondeado */
            max-width: 950px; /* Ancho un poco más grande */
            max-height: 85vh; /* Más altura */
            width: 90%;
            position: relative;
            box-shadow: 0 35px 70px rgba(0,0,0,0.4); /* Sombra más pronunciada */
            overflow: hidden;
            transform-origin: center;
            display: flex;
            flex-direction: column;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 30px 40px; /* Más padding */
            position: relative;
            overflow: hidden;
            border-bottom: 2px solid rgba(255,255,255,0.2);
        `;

        const headerDecor = document.createElement('div');
        headerDecor.style.cssText = `
            position: absolute;
            top: -50%;
            right: -20%;
            width: 250px; /* Más grande */
            height: 250px;
            background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%); /* Más visible */
            border-radius: 50%;
        `;
        header.appendChild(headerDecor);

        const headerTitle = document.createElement('h2');
        headerTitle.textContent = '📈 Pasos del Cálculo de Límite';
        headerTitle.style.cssText = `
            margin: 0;
            font-size: 2rem; /* Título de modal más grande */
            font-weight: 700;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        header.appendChild(headerTitle);

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 25px;
            right: 30px;
            background: rgba(255,255,255,0.25); /* Más opaco */
            border: none;
            color: white;
            font-size: 1.6rem; /* Más grande */
            font-weight: bold;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            z-index: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.4)';
            closeBtn.style.transform = 'rotate(90deg) scale(1.1)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.25)';
            closeBtn.style.transform = 'rotate(0deg) scale(1)';
        });
        header.appendChild(closeBtn);

        const content = document.createElement('div');
        content.style.cssText = `
            padding: 30px 40px; /* Más padding */
            max-height: calc(85vh - 120px); /* Ajuste dinámico de altura */
            overflow-y: auto;
            scroll-behavior: smooth;
            flex-grow: 1; /* Permite que el contenido ocupe el espacio restante */
        `;

        steps.forEach((step, index) => {
            const stepContainer = document.createElement('div');
            stepContainer.className = 'step-container'; // Para animación de aparición
            stepContainer.style.cssText = `
                margin-bottom: 35px; /* Más espacio */
                padding: 30px; /* Más padding */
                background: linear-gradient(135deg, #f0f4f8 0%, #e9edf2 100%); /* Gradiente suave */
                border-radius: 20px; /* Más redondeado */
                border-left: 6px solid #3b82f6; /* Borde más grueso */
                position: relative;
                overflow: hidden;
                box-shadow: 0 10px 20px rgba(0,0,0,0.08); /* Sombra suave */
            `;

            const stepDecor = document.createElement('div');
            stepDecor.style.cssText = `
                position: absolute;
                top: -15px;
                right: -15px;
                width: 60px;
                height: 60px;
                background: linear-gradient(45deg, #3b82f6, #1d4ed8);
                border-radius: 50%;
                opacity: 0.15; /* Más visible */
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 1.3rem;
            `;
            stepDecor.textContent = index + 1;
            stepContainer.appendChild(stepDecor);

            const stepTitle = document.createElement('h3');
            stepTitle.textContent = `${index + 1}. ${step.title}`;
            stepTitle.style.cssText = `
                color: #1e40af;
                font-size: 1.5rem; /* Título de paso más grande */
                font-weight: 800;
                margin-bottom: 20px;
                position: relative;
                z-index: 1;
            `;
            stepContainer.appendChild(stepTitle);

            if (step.description) {
                const stepDesc = document.createElement('p');
                stepDesc.innerHTML = step.description; // Usar innerHTML para permitir negritas
                stepDesc.style.cssText = `
                    color: #475569;
                    font-size: 1.05rem;
                    margin-bottom: 15px;
                    line-height: 1.7; /* Mayor interlineado */
                `;
                stepContainer.appendChild(stepDesc);
            }

            // Renderizar LaTeX si existe
            if (step.latex) {
                const mathContainer = document.createElement('div');
                mathContainer.style.cssText = `
                    background: white;
                    padding: 22px; /* Más padding */
                    border-radius: 12px; /* Más redondeado */
                    border: 2px solid #e2e8f0;
                    font-size: 1.2rem; /* Más grande */
                    text-align: center;
                    box-shadow: 0 3px 12px rgba(0,0,0,0.08); /* Sombra mejorada */
                    margin-bottom: 18px;
                `;
                const mathField = document.createElement('math-field');
                mathField.value = step.latex;
                mathField.style.cssText = `
                    width: 100%;
                    min-height: 50px; /* Altura mínima aumentada */
                    border: none;
                    background: transparent;
                    font-size: 1.3rem; /* Más grande */
                `;
                mathField.readOnly = true;
                mathContainer.appendChild(mathField);
                stepContainer.appendChild(mathContainer);
            }

            // Mostrar puntos si existen
            if (step.points && step.points.length > 0) {
                const pointsContainer = document.createElement('div');
                pointsContainer.style.cssText = `
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* Columnas más anchas */
                    gap: 15px; /* Más espacio */
                    margin-top: 20px;
                `;

                step.points.forEach(point => {
                    const pointDiv = document.createElement('div');
                    pointDiv.style.cssText = `
                        background: #e0f7fa; /* Fondo azul muy claro */
                        padding: 15px;
                        border-radius: 10px;
                        text-align: center;
                        border: 1px solid #b2ebf2;
                        font-family: 'Roboto Mono', monospace;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    `;
                    let fxText = '';
                    if (isFinite(point.fx)) {
                        fxText = `f(${point.x.toFixed(6)}) ≈ ${point.fx.toFixed(6)}`;
                    } else if (point.fx === Infinity) {
                        fxText = `f(${point.x.toFixed(6)}) = ∞`;
                    } else if (point.fx === -Infinity) {
                        fxText = `f(${point.x.toFixed(6)}) = -∞`;
                    } else {
                        fxText = `f(${point.x.toFixed(6)}) = Indefinido`;
                    }

                    pointDiv.innerHTML = `
                        <strong style="color: #00796b;">${point.i}</strong><br>
                        <span style="color: #006064; font-size: 0.95rem;">${fxText}</span>
                    `;
                    pointsContainer.appendChild(pointDiv);
                });
                stepContainer.appendChild(pointsContainer);
            }

            // Sub-pasos (para L'Hôpital)
            if (step.substeps && step.substeps.length > 0) {
                step.substeps.forEach(substep => {
                    const subStepDiv = document.createElement('div');
                    subStepDiv.style.cssText = `
                        background: #fdf2f8; /* Un fondo más suave */
                        border-left: 4px solid #f472b6; /* Un color de borde distintivo */
                        padding: 20px;
                        margin-top: 20px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    `;
                    const subStepTitle = document.createElement('h4');
                    subStepTitle.textContent = substep.title;
                    subStepTitle.style.cssText = `
                        color: #be185d;
                        margin-bottom: 10px;
                        font-size: 1.15rem;
                    `;
                    subStepDiv.appendChild(subStepTitle);

                    if (substep.description) {
                        const subStepDesc = document.createElement('p');
                        subStepDesc.textContent = substep.description;
                        subStepDesc.style.cssText = `color: #6b21a8; font-size: 0.95rem; margin-bottom: 10px;`;
                        subStepDiv.appendChild(subStepDesc);
                    }
                    if (substep.latex) {
                        const mathContainer = document.createElement('div');
                        mathContainer.style.cssText = `
                            background: white;
                            padding: 15px;
                            border-radius: 8px;
                            border: 1px solid #fbcfe8;
                            text-align: center;
                        `;
                        const mathField = document.createElement('math-field');
                        mathField.value = substep.latex;
                        mathField.style.cssText = `
                            width: 100%;
                            min-height: 40px;
                            border: none;
                            background: transparent;
                            font-size: 1.2rem;
                        `;
                        mathField.readOnly = true;
                        mathContainer.appendChild(mathField);
                        subStepDiv.appendChild(mathContainer);
                    }
                    stepContainer.appendChild(subStepDiv);
                });
            }


            content.appendChild(stepContainer);
        });

        modal.appendChild(header);
        modal.appendChild(content);
        overlay.appendChild(modal);

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('modal-slide-in');
            modal.classList.add('modal-fade-out'); // Animación de salida para el modal
            overlay.classList.add('modal-fade-out'); // Animación de salida para el overlay
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300); // Coincide con la duración de la animación de salida
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeBtn.click();
            }
        });
        document.body.appendChild(overlay);
    }

    // Event listener para el botón de calcular
    calculateBtn.addEventListener('click', () => {
        const mathField = document.getElementById('math-function');
        const latexExpression = mathField.value;
        const mathExpression = latexToMathJS(latexExpression);

        const x0Input = document.getElementById('punto-aproximacion');
        const x0 = parseFloat(x0Input.value);
        const limitType = document.getElementById('limit-type').value;

        // Resetear estilos de error
        mathField.style.borderColor = '';
        x0Input.style.borderColor = '';
        resultValue.style.color = '#1e40af'; // Color por defecto

        if (!latexExpression.trim() || isNaN(x0)) {
            resultValue.textContent = '¡Error! Ingrese función y punto de aproximación válidos.';
            resultValue.style.color = '#dc2626';
            if (!latexExpression.trim()) mathField.parentNode.style.borderColor = '#dc2626';
            if (isNaN(x0)) x0Input.style.borderColor = '#dc2626';
            // También podría añadir un pequeño efecto de vibración
            contenedorLogicaLimites.style.animation = 'shake 0.3s ease-in-out';
            setTimeout(() => {
                 contenedorLogicaLimites.style.animation = '';
            }, 300);
            return;
        }

        // Animación de carga o "pensando"
        resultValue.textContent = 'Calculando...';
        resultValue.style.color = '#2563eb';
        resultValue.style.transform = 'scale(0.9)';
        resultValue.style.opacity = '0.7';

        // Pequeño retraso para la animación de carga antes del cálculo
        setTimeout(() => {
            // Calcular el límite
            const limitResult = calculateLimitNumerically(mathExpression, x0, limitType);
            const limit = limitResult.value;

            if (limit === 'DNE') {
                resultValue.textContent = 'Límite no existe (DNE)';
                resultValue.style.color = '#dc2626';
            } else if (limit === '∞') {
                resultValue.textContent = 'Límite: ∞';
                resultValue.style.color = '#1d4ed8';
            } else if (limit === '-∞') {
                resultValue.textContent = 'Límite: -∞';
                resultValue.style.color = '#1d4ed8';
            } else if (isFinite(limit)) {
                resultValue.textContent = `Límite: ${limit.toFixed(6)}`;
                resultValue.style.color = '#1e40af';
            } else {
                resultValue.textContent = 'Error en la función o cálculo';
                resultValue.style.color = '#dc2626';
            }

            // Animación de resultado
            resultValue.style.transform = 'scale(1)';
            resultValue.style.opacity = '1';
            resultValue.style.transition = 'all 0.3s ease';

            // Guardar datos para el modal de pasos
            currentCalculationData = {
                mathExpression,
                latexExpression,
                x0,
                limitResult: limitResult, // Guardar el objeto completo del resultado
                limitType
            };

            // Crear gráfica con Plotly
            if (isFinite(limit)) {
               createPlotlyGraph(mathExpression, x0, limit, limitType, latexExpression);
            } else {
                // Si el límite no es finito o DNE, crea una gráfica sin el punto de límite claro
                createPlotlyGraph(mathExpression, x0, NaN, limitType, latexExpression); // Pasa NaN para no marcar punto de límite
            }

            // Habilitar botón de pasos
            stepsBtn.style.opacity = '1';
            stepsBtn.style.pointerEvents = 'auto';
            stepsBtn.style.boxShadow = '0 4px 15px rgba(16,185,129,0.2)';

        }, 300); // Pequeño retraso para la animación "Calculando..."
    });

    // Keyframes for shake animation
    styleSheet.innerHTML += `
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
        }
    `;

    // Event listener para el botón de ver pasos
    stepsBtn.addEventListener('click', () => {
        if (currentCalculationData) {
            const steps = generateLimitSteps(
                currentCalculationData.mathExpression,
                currentCalculationData.latexExpression,
                currentCalculationData.x0,
                currentCalculationData.limitResult, // Pasa el objeto completo
                currentCalculationData.limitType
            );
            createStepsModal(steps);
            MathLive.renderMathInElement(document.body); // Renderizar MathML en el modal
        }
    });

    // Agregar efectos hover a las secciones
    leftSection.addEventListener('mouseenter', () => {
        leftSection.style.transform = 'translateY(-8px) scale(1.01)';
        leftSection.style.boxShadow = '0 25px 55px rgba(0,0,0,0.2)';
    });
    leftSection.addEventListener('mouseleave', () => {
        leftSection.style.transform = 'translateY(0) scale(1)';
        leftSection.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
    });
    rightSection.addEventListener('mouseenter', () => {
        rightSection.style.transform = 'translateY(-8px) scale(1.01)';
        rightSection.style.boxShadow = '0 25px 55px rgba(0,0,0,0.2)';
    });
    rightSection.addEventListener('mouseleave', () => {
        rightSection.style.transform = 'translateY(0) scale(1)';
        rightSection.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
    });

    // Agregar el contenedor principal al DOM
    limitesContainer.appendChild(contenedorLogicaLimites);

    // Esperar a que MathLive esté cargado y configurar valores de ejemplo
    // Renderizar MathML en la página (para el título de la gráfica)
    setTimeout(() => {
        const mathField = document.getElementById('math-function');
        if (mathField) {
            // Ejemplo para L'Hopital que ahora debería funcionar
            mathField.value = '\\frac{\\left(x^2-9\\right)}{\\left(x-3\\right)}'; 
        }
        document.getElementById('punto-aproximacion').value = '3'; // Punto donde es indeterminado
        document.getElementById('limit-type').value = 'bilateral';

        // Crear gráfica inicial con un ejemplo simple para que no esté vacía
        const initialLatex = '\\frac{\\sin(x)}{x}';
        const initialMathExpr = latexToMathJS(initialLatex);
        // Llama a calculateLimitNumerically para obtener el objeto de resultado completo
        const initialLimitResult = calculateLimitNumerically(initialMathExpr, 0, 'bilateral');
        createPlotlyGraph(initialMathExpr, 0, initialLimitResult.value, 'bilateral', initialLatex);
        
        // Renderizar cualquier MathML que pueda haber en el HTML inicial (por ejemplo, en el título de la gráfica)
        MathLive.renderMathInElement(document.body);

    }, 500); // Pequeño retraso para asegurar que MathLive esté listo
});