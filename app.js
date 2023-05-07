document.addEventListener('DOMContentLoaded', () => {
    const precios = {
        materialesPisos: {
            ceramica: 2300,
            porcelanato: 4500,
            madera: 20000
        },
        materialesParedes: {
            ceramica: 2300,
            porcelanato: 4500,
            pintura: 1800
        },
        griferias: {
            basica: 141000,
            premium: 200000
        }
    };

    // Función para guardar cálculos en localStorage
    function guardarCalculo(costoPisos, costoParedes, costoGriferia, costoTotal) {
        const calculos = JSON.parse(localStorage.getItem("calculos")) || [];
        const calculo = {
            costoPisos,
            costoParedes,
            costoGriferia,
            costoTotal,
            fecha: new Date()
        };
        calculos.push(calculo);
        localStorage.setItem("calculos", JSON.stringify(calculos));
    }
    // Funcion para mostrar calculos anteriores
    function mostrarCalculosAnteriores() {
        const calculos = JSON.parse(localStorage.getItem("calculos")) || [];
        if (calculos.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'No hay cálculos anteriores',
                text: 'No se encontraron cálculos anteriores en el almacenamiento local.'
            });
            return;
        }
    
        let listaCalculos = '<ul>';
        calculos.forEach((calculo, index) => {
            listaCalculos += `<li>Cálculo ${index + 1} (${new Date(calculo.fecha).toLocaleString()}):`;
            listaCalculos += `<ul>`;
            listaCalculos += `<li>Costo Pisos: $${calculo.costoPisos.toFixed(2)}</li>`;
            listaCalculos += `<li>Costo Paredes: $${calculo.costoParedes.toFixed(2)}</li>`;
            listaCalculos += `<li>Costo Grifería: $${calculo.costoGriferia.toFixed(2)}</li>`;
            listaCalculos += `<li>Costo Total: $${calculo.costoTotal.toFixed(2)}</li>`;
            listaCalculos += `</ul></li>`;
        });
        listaCalculos += '</ul>';
    
        Swal.fire({
            title: 'Cálculos anteriores',
            html: listaCalculos,
            confirmButtonText: 'Cerrar',
            footer: '<button id="borrarCalculosAnteriores" class="swal2-confirm swal2-styled">Borrar cálculos anteriores</button>'
        }).then(() => {
            // Reinicializar el evento "click" del botón "Borrar cálculos anteriores" después de cerrar el cuadro de diálogo
            document.getElementById('borrarCalculosAnteriores').addEventListener('click', borrarCalculosAnteriores);
        });
    
        // Agregar el evento "click" al botón "Borrar cálculos anteriores" dentro del cuadro de diálogo
        setTimeout(() => {
            document.getElementById('borrarCalculosAnteriores').addEventListener('click', borrarCalculosAnteriores);
        }, 100);
    }
    function borrarCalculosAnteriores() {
        localStorage.removeItem("calculos");
        Swal.close(); // Cierra el cuadro de diálogo actual
        setTimeout(() => { // Espera un poco antes de mostrar el siguiente cuadro de diálogo
            Swal.fire({
                icon: 'success',
                title: 'Cálculos borrados',
                text: 'Se han borrado todos los cálculos anteriores almacenados.'
            });
        }, 100);
    }

function validarCampos() {
    const largo = parseFloat(document.getElementById('largo').value);
    const ancho = parseFloat(document.getElementById('ancho').value);
    const alto = parseFloat(document.getElementById('alto').value);
    const materialPisos = document.getElementById('materialPisos').value;
    const materialParedes = document.getElementById('materialParedes').value;
    const tipoGriferia = document.getElementById('tipoGriferia').value;

    if (!largo || !ancho || !alto || !materialPisos || !materialParedes || !tipoGriferia || largo <= 0 || ancho <= 0 || alto <= 0) {
        return false;
    }
    return true;
}

    function selectCard(event, inputId, showMessage) {
        const selectedClass = 'selected';
        const card = event.currentTarget;
        const value = card.dataset.value;
        document.getElementById(inputId).value = value;

        card.parentElement.parentElement.querySelectorAll('.card').forEach(c => {
            if (c === card) {
                c.classList.add(selectedClass);
            } else {
                c.classList.remove(selectedClass);
            }
        });

        if (showMessage) {
            const message = {
                ceramica: "Elegiste Ceramica! La cerámica es un material versátil y económico, ideal para pisos y paredes.",
                porcelanato: "Elegiste Porcelanato! El porcelanato es un material más resistente que la cerámica, pero también más costoso.",
                madera: "Elegiste Madera! La madera es un material natural y elegante, pero requiere más mantenimiento.",
                pintura: "Elegiste Pintura! La pintura es una opción económica para decorar las paredes.",
                basica: "Elegiste Griferia Basica!La grifería básica es una opción asequible y funcional.",
                premium: "Elegiste Griferia Premium! La grifería premium ofrece un diseño y calidad superior, pero a un costo más elevado."
            };

            if (message[value]) {
                Swal.fire(message[value]);
            }
        }
    }

    document.querySelectorAll('.tipo-remodelacion').forEach(card => {
        card.addEventListener('click', (event) => selectCard(event, 'tipoRemodelacion', false));
    });

    document.querySelectorAll('.material-pisos').forEach(card => {
        card.addEventListener('click', (event) => selectCard(event, 'materialPisos', true));
    });

    document.querySelectorAll('.material-paredes').forEach(card => {
        card.addEventListener('click', (event) => selectCard(event, 'materialParedes', true));
    });

    document.querySelectorAll('.tipo-griferia').forEach(card => {
        card.addEventListener('click', (event) => selectCard(event, 'tipoGriferia', true));
    });

    async function calcular() {
        if (!validarCampos()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos antes de calcular.'
            });
            return;
        }
        const areaPisos = parseFloat(document.getElementById('largo').value) * parseFloat(document.getElementById('ancho').value);
        const alto = parseFloat(document.getElementById('alto').value);
        const areaParedes = 2 * (parseFloat(document.getElementById('largo').value) * alto) + 2 * (parseFloat(document.getElementById('ancho').value) * alto);
        const costoPisos = areaPisos * precios.materialesPisos[document.getElementById('materialPisos').value];
        const costoParedes = areaParedes * precios.materialesParedes[document.getElementById('materialParedes').value];
        const costoGriferia = precios.griferias[document.getElementById('tipoGriferia').value];
        const costoTotal = costoPisos + costoParedes + costoGriferia;
    
        return new Promise((resolve) => {
            setTimeout(() => {
                document.getElementById('costoPisos').innerHTML = `$${costoPisos.toFixed(2)}`;
                document.getElementById('costoParedes').innerHTML = `$${costoParedes.toFixed(2)}`;
                document.getElementById('costoGriferia').innerHTML = `$${costoGriferia.toFixed(2)}`;
                document.getElementById('costoTotal').innerHTML = `$${costoTotal.toFixed(2)}`;
                document.getElementById('resultado').classList.remove('hidden');
                guardarCalculo(costoPisos, costoParedes, costoGriferia, costoTotal);
                resolve();
            }, 0);
        });
    }

    document.getElementById('calcular').addEventListener('click', () => {
        calcular().then(() => {
            console.log('Cálculo completado');
        }).catch((error) => {
            console.error('Error en el cálculo:', error);
        });
    document.getElementById('verCalculosAnteriores').addEventListener('click', mostrarCalculosAnteriores);
    });
});