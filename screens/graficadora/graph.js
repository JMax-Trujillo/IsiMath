// screens/graficadora/graph.js

/**
 * Función para graficar una función matemática.
 *
 * @param {string} containerId - El ID del elemento HTML donde se renderizará la gráfica (ej. 'integral-graph').
 * @param {string} expression - La expresión matemática a graficar (ej. 'x^2 + 2*x - 1').
 * @param {Array<number>} [xDomain=[-10, 10]] - El rango inicial del eje X [min, max] para la vista.
 * @param {Array<number>} [yDomain=[-10, 10]] - El rango inicial del eje Y [min, max] para la vista.
 * @param {Object} [options={}] - Opciones adicionales para function-plot (ej. { height: 300, width: 500 }).
 * @param {Object} [integralHighlight=null] - Objeto para resaltar área de integral: { xMin: number, xMax: number, color: string }
 */
export function plotFunction(containerId, expression, xDomain = [-10, 10], yDomain = [-10, 10], options = {}, integralHighlight = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Contenedor de gráfica no encontrado: ${containerId}`);
        return;
    }

    // Limpiar cualquier gráfica anterior en el contenedor
    container.innerHTML = '';

    const defaultOptions = {
        target: `#${containerId}`,
        data: [{
            fn: expression,
            color: '#3b82f6', // Color principal para la función (var(--primary-color))
            graphType: 'polyline' // Asegura que se dibuje una línea
        }],
        grid: true,
        tip: {
            xLine: true,
            yLine: true,
        },
        xAxis: {
            domain: xDomain,
            label: 'x'
        },
        yAxis: {
            domain: yDomain,
            label: 'f(x)'
        },
        width: container.offsetWidth,
        height: container.offsetHeight,
        disableZoom: false, // Permitir zoom y paneo
        ...options // Sobrescribir con opciones personalizadas
    };

    if (integralHighlight && integralHighlight.xMin !== undefined && integralHighlight.xMax !== undefined) {
        // Añadir una función de sombra para la integral definida
        defaultOptions.data.push({
            fn: expression,
            range: [integralHighlight.xMin, integralHighlight.xMax],
            closed: true, // Cierra el área con el eje X
            skipTip: true, // No mostrar tooltip para esta área
            graphType: 'area', // Indica que es un área sombreada
            color: integralHighlight.color || '#93c5fd', // Un azul más claro por defecto
            // Para asegurar que la sombra se renderice debajo de la línea de la función:
            // Usar z-index si function-plot lo soporta, o simplemente el orden en el array data.
            // Generalmente, el orden del array 'data' importa, los últimos se dibujan encima.
            // Aquí queremos la sombra debajo de la función principal, así que la ponemos primero.
        });
        // Reorganizamos data para que la función principal esté siempre encima de la sombra
        defaultOptions.data.sort((a, b) => a.graphType === 'area' ? -1 : 1);
    }

    try {
        // Verificar si functionPlot está disponible globalmente
        if (typeof window.functionPlot === 'function') {
            window.functionPlot(defaultOptions);
        } else {
            console.error("function-plot library not loaded. Make sure <script src='https://unpkg.com/function-plot/dist/function-plot.js'></script> is in your index.html");
            container.innerHTML = `<p style="color: #dc2626; text-align: center; padding-top: 50px;">Error: Librería de graficado no cargada.</p>`;
        }
    } catch (e) {
        console.error("Error al graficar la función:", e);
        container.innerHTML = `<p style="color: #dc2626; text-align: center; padding-top: 50px;">Error al graficar: ${e.message}. Asegúrate de que la función sea válida.</p>`;
    }

    // El ResizeObserver ya está en el código de arriba, lo mantendría si es necesario que la gráfica se reajuste.
    // Sin embargo, function-plot ya tiene cierta reactividad, y en un layout flex, esto puede ser redundante o generar bucles si no se maneja bien.
    // Por simplicidad, y dado que el contenedor tendrá un tamaño fijo inicial, podríamos omitir el ResizeObserver si causa problemas.
    // Pero si el tamaño del contenedor principal (integrales-definidas-content) es dinámico, sí es útil.
    /*
    new ResizeObserver(() => {
        const currentWidth = container.offsetWidth;
        const currentHeight = container.offsetHeight;
        if (defaultOptions.width !== currentWidth || defaultOptions.height !== currentHeight) {
            defaultOptions.width = currentWidth;
            defaultOptions.height = currentHeight;
            window.functionPlot(defaultOptions); // Re-renderizar la gráfica
        }
    }).observe(container);
    */
}