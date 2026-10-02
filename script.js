// ========================================
// CANVAS
// ========================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ========================================
// ELEMENTOS
// ========================================

const colorInput = document.getElementById("color");
const fondoInput = document.getElementById("fondo");

const grosorInput = document.getElementById("grosor");
const valorGrosor = document.getElementById("valor-grosor");

const herramientaActual =
    document.getElementById("herramienta-actual");

const tamano =
    document.getElementById("tamano");

const herramientas =
    document.querySelectorAll(".herramienta");

const deshacerBtn =
    document.getElementById("deshacer");

const rehacerBtn =
    document.getElementById("rehacer");

const limpiarBtn =
    document.getElementById("limpiar");

const guardarBtn =
    document.getElementById("guardar");

const cargarImagen =
    document.getElementById("cargar-imagen");


// ========================================
// VARIABLES
// ========================================

let dibujando = false;

let herramienta = "lapiz";

let inicioX = 0;
let inicioY = 0;

let ultimaX = 0;
let ultimaY = 0;


// Historial
let historial = [];
let historialActual = -1;


// ========================================
// CONFIGURAR CANVAS
// ========================================

function configurarCanvas() {

    canvas.width = 1200;
    canvas.height = 700;

    ctx.fillStyle = fondoInput.value;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    guardarEstado();
}

configurarCanvas();


// ========================================
// HERRAMIENTAS
// ========================================

herramientas.forEach(boton => {

    boton.addEventListener("click", () => {

        herramientas.forEach(b => {
            b.classList.remove("activo");
        });

        boton.classList.add("activo");

        herramienta =
            boton.dataset.herramienta;

        herramientaActual.textContent =
            obtenerNombreHerramienta(herramienta);
    });

});


function obtenerNombreHerramienta(nombre) {

    const nombres = {

        lapiz: "Lápiz",
        goma: "Goma",
        linea: "Línea",
        rectangulo: "Rectángulo",
        circulo: "Círculo",
        relleno: "Relleno"

    };

    return nombres[nombre];
}


// ========================================
// GROSOR
// ========================================

grosorInput.addEventListener("input", () => {

    valorGrosor.textContent =
        grosorInput.value + " px";

    tamano.textContent =
        grosorInput.value + " px";

});


// ========================================
// OBTENER POSICIÓN DEL MOUSE
// ========================================

function obtenerPosicion(event) {

    const rect =
        canvas.getBoundingClientRect();

    const escalaX =
        canvas.width / rect.width;

    const escalaY =
        canvas.height / rect.height;

    return {

        x:
            (event.clientX - rect.left)
            * escalaX,

        y:
            (event.clientY - rect.top)
            * escalaY

    };
}


// ========================================
// MOUSE DOWN
// ========================================

canvas.addEventListener("mousedown", iniciarDibujo);


function iniciarDibujo(event) {

    const posicion =
        obtenerPosicion(event);

    inicioX = posicion.x;
    inicioY = posicion.y;

    ultimaX = posicion.x;
    ultimaY = posicion.y;


    // Relleno
    if (herramienta === "relleno") {

        rellenar(
            Math.floor(posicion.x),
            Math.floor(posicion.y)
        );

        guardarEstado();

        return;
    }


    dibujando = true;

    ctx.beginPath();

    ctx.moveTo(
        posicion.x,
        posicion.y
    );

}


// ========================================
// MOUSE MOVE
// ========================================

canvas.addEventListener(
    "mousemove",
    dibujar
);


function dibujar(event) {

    if (!dibujando) {
        return;
    }

    const posicion =
        obtenerPosicion(event);


    // LÁPIZ
    if (herramienta === "lapiz") {

        ctx.globalCompositeOperation =
            "source-over";

        ctx.strokeStyle =
            colorInput.value;

        ctx.lineWidth =
            grosorInput.value;

        ctx.lineTo(
            posicion.x,
            posicion.y
        );

        ctx.stroke();

    }


    // GOMA
    else if (herramienta === "goma") {

        ctx.globalCompositeOperation =
            "destination-out";

        ctx.lineWidth =
            grosorInput.value;

        ctx.lineTo(
            posicion.x,
            posicion.y
        );

        ctx.stroke();

        ctx.globalCompositeOperation =
            "source-over";

    }


    // Guardar última posición
    ultimaX = posicion.x;
    ultimaY = posicion.y;

}


// ========================================
// MOUSE UP
// ========================================

canvas.addEventListener(
    "mouseup",
    terminarDibujo
);

canvas.addEventListener(
    "mouseleave",
    terminarDibujo
);


function terminarDibujo(event) {

    if (!dibujando) {
        return;
    }

    dibujando = false;


    const posicion =
        obtenerPosicion(event);


    if (herramienta === "linea") {

        dibujarLinea(
            inicioX,
            inicioY,
            posicion.x,
            posicion.y
        );

    }


    else if (herramienta === "rectangulo") {

        dibujarRectangulo(
            inicioX,
            inicioY,
            posicion.x,
            posicion.y
        );

    }


    else if (herramienta === "circulo") {

        dibujarCirculo(
            inicioX,
            inicioY,
            posicion.x,
            posicion.y
        );

    }


    if (
        herramienta === "lapiz" ||
        herramienta === "goma" ||
        herramienta === "linea" ||
        herramienta === "rectangulo" ||
        herramienta === "circulo"
    ) {

        guardarEstado();

    }

}


// ========================================
// LÍNEA
// ========================================

function dibujarLinea(
    x1,
    y1,
    x2,
    y2
) {

    ctx.globalCompositeOperation =
        "source-over";

    ctx.strokeStyle =
        colorInput.value;

    ctx.lineWidth =
        grosorInput.value;

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.stroke();
}


// ========================================
// RECTÁNGULO
// ========================================

function dibujarRectangulo(
    x1,
    y1,
    x2,
    y2
) {

    ctx.globalCompositeOperation =
        "source-over";

    ctx.strokeStyle =
        colorInput.value;

    ctx.lineWidth =
        grosorInput.value;

    ctx.strokeRect(
        x1,
        y1,
        x2 - x1,
        y2 - y1
    );
}


// ========================================
// CÍRCULO
// ========================================

function dibujarCirculo(
    x1,
    y1,
    x2,
    y2
) {

    ctx.globalCompositeOperation =
        "source-over";

    ctx.strokeStyle =
        colorInput.value;

    ctx.lineWidth =
        grosorInput.value;


    const radio = Math.sqrt(

        Math.pow(x2 - x1, 2)
        +
        Math.pow(y2 - y1, 2)

    );


    ctx.beginPath();

    ctx.arc(
        x1,
        y1,
        radio,
        0,
        Math.PI * 2
    );

    ctx.stroke();
}


// ========================================
// RELLENO
// ========================================

function rellenar(x, y) {

    const imagen =
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

    const datos = imagen.data;

    const posicion =
        (y * canvas.width + x) * 4;


    const colorObjetivo = [

        datos[posicion],
        datos[posicion + 1],
        datos[posicion + 2],
        datos[posicion + 3]

    ];


    const colorNuevo =
        hexToRgb(colorInput.value);


    if (
        colorObjetivo[0] === colorNuevo[0] &&
        colorObjetivo[1] === colorNuevo[1] &&
        colorObjetivo[2] === colorNuevo[2]
    ) {

        return;
    }


    const pila = [[x, y]];

    const ancho = canvas.width;
    const alto = canvas.height;


    while (pila.length > 0) {

        const [px, py] =
            pila.pop();


        if (
            px < 0 ||
            px >= ancho ||
            py < 0 ||
            py >= alto
        ) {

            continue;
        }


        const index =
            (py * ancho + px) * 4;


        if (
            datos[index] !== colorObjetivo[0] ||
            datos[index + 1] !== colorObjetivo[1] ||
            datos[index + 2] !== colorObjetivo[2] ||
            datos[index + 3] !== colorObjetivo[3]
        ) {

            continue;
        }


        datos[index] =
            colorNuevo[0];

        datos[index + 1] =
            colorNuevo[1];

        datos[index + 2] =
            colorNuevo[2];

        datos[index + 3] =
            255;


        pila.push([px + 1, py]);
        pila.push([px - 1, py]);
        pila.push([px, py + 1]);
        pila.push([px, py - 1]);
    }


    ctx.putImageData(
        imagen,
        0,
        0
    );
}


// ========================================
// HEX → RGB
// ========================================

function hexToRgb(hex) {

    hex = hex.replace("#", "");

    return {

        0: parseInt(
            hex.substring(0, 2),
            16
        ),

        1: parseInt(
            hex.substring(2, 4),
            16
        ),

        2: parseInt(
            hex.substring(4, 6),
            16
        )

    };
}


// ========================================
// FONDO
// ========================================

fondoInput.addEventListener(
    "change",
    cambiarFondo
);


function cambiarFondo() {

    const imagen =
        document.createElement("canvas");

    imagen.width = canvas.width;
    imagen.height = canvas.height;

    const imagenCtx =
        imagen.getContext("2d");

    imagenCtx.fillStyle =
        fondoInput.value;

    imagenCtx.fillRect(
        0,
        0,
        imagen.width,
        imagen.height
    );

    imagenCtx.drawImage(
        canvas,
        0,
        0
    );

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        imagen,
        0,
        0
    );

    guardarEstado();
}


// ========================================
// LIMPIAR
// ========================================

limpiarBtn.addEventListener(
    "click",
    () => {

        const confirmar =
            confirm(
                "¿Querés borrar todo el dibujo?"
            );

        if (!confirmar) {
            return;
        }

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle =
            fondoInput.value;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        guardarEstado();

    }
);


// ========================================
// GUARDAR ESTADO
// ========================================

function guardarEstado() {

    historial =
        historial.slice(
            0,
            historialActual + 1
        );

    historial.push(
        canvas.toDataURL()
    );

    historialActual =
        historial.length - 1;

    actualizarBotones();
}


// ========================================
// DESHACER
// ========================================

deshacerBtn.addEventListener(
    "click",
    deshacer
);


function deshacer() {

    if (historialActual <= 0) {
        return;
    }

    historialActual--;

    restaurarEstado(
        historial[historialActual]
    );

    actualizarBotones();
}


// ========================================
// REHACER
// ========================================

rehacerBtn.addEventListener(
    "click",
    rehacer
);


function rehacer() {

    if (
        historialActual >=
        historial.length - 1
    ) {

        return;
    }

    historialActual++;

    restaurarEstado(
        historial[historialActual]
    );

    actualizarBotones();
}


// ========================================
// RESTAURAR ESTADO
// ========================================

function restaurarEstado(data) {

    const imagen =
        new Image();

    imagen.onload = () => {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.drawImage(
            imagen,
            0,
            0
        );

    };

    imagen.src = data;
}


// ========================================
// ACTUALIZAR BOTONES
// ========================================

function actualizarBotones() {

    deshacerBtn.disabled =
        historialActual <= 0;

    rehacerBtn.disabled =
        historialActual >=
        historial.length - 1;

}


// ========================================
// GUARDAR PNG
// ========================================

guardarBtn.addEventListener(
    "click",
    guardarImagen
);


function guardarImagen() {

    const enlace =
        document.createElement("a");

    enlace.download =
        "mi-dibujo.png";

    enlace.href =
        canvas.toDataURL(
            "image/png"
        );

    enlace.click();

}


// ========================================
// CARGAR IMAGEN
// ========================================

cargarImagen.addEventListener(
    "change",
    function(event) {

        const archivo =
            event.target.files[0];

        if (!archivo) {
            return;
        }


        const lector =
            new FileReader();


        lector.onload = function(e) {

            const imagen =
                new Image();


            imagen.onload = function() {

                ctx.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                // Mantener proporción
                const escala =
                    Math.min(

                        canvas.width /
                            imagen.width,

                        canvas.height /
                            imagen.height

                    );


                const ancho =
                    imagen.width * escala;

                const alto =
                    imagen.height * escala;


                const x =
                    (canvas.width - ancho) / 2;

                const y =
                    (canvas.height - alto) / 2;


                ctx.drawImage(
                    imagen,
                    x,
                    y,
                    ancho,
                    alto
                );


                guardarEstado();

            };


            imagen.src =
                e.target.result;

        };


        lector.readAsDataURL(archivo);

        // Permitir volver a cargar el mismo archivo
        event.target.value = "";

    }
);


// ========================================
// SOPORTE PARA TABLET / CELULAR
// ========================================

canvas.addEventListener(
    "touchstart",
    iniciarTouch,
    { passive: false }
);

canvas.addEventListener(
    "touchmove",
    moverTouch,
    { passive: false }
);

canvas.addEventListener(
    "touchend",
    terminarTouch,
    { passive: false }
);


function crearEventoMouse(touch) {

    return {

        clientX: touch.clientX,
        clientY: touch.clientY

    };
}


function iniciarTouch(event) {

    event.preventDefault();

    const touch =
        event.touches[0];

    iniciarDibujo(
        crearEventoMouse(touch)
    );

}


function moverTouch(event) {

    event.preventDefault();

    if (!dibujando) {
        return;
    }

    const touch =
        event.touches[0];

    dibujar(
        crearEventoMouse(touch)
    );

}


function terminarTouch(event) {

    event.preventDefault();

    if (!dibujando) {
        return;
    }

    const touch =
        event.changedTouches[0];

    terminarDibujo(
        crearEventoMouse(touch)
    );

}
