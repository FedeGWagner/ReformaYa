const dolarInfoDiv = document.getElementById("cotizaciones");
let dolarOficial = 1;

// Función para obtener la cotizacion del dolar a la API de DolarSi
async function getDolarInfo() {
    const response = await fetch(
        "https://www.dolarsi.com/api/api.php?type=valoresprincipales"
    );
    const data = await response.json();
    //con el metodo MAP almaceno la data en un nuevo array
    const dolarData = data.map((element) => {
        return {
            nombre: element.casa.nombre,
            compra: element.casa.compra,
            venta: element.casa.venta,
            variacion: element.casa.variacion,
        };
    });

    // con el mertodo INCLUDES selecciono las cotizaciones que me interesan
    const ticker = dolarData.filter((element) => {
        return [
            "Dolar Oficial",
            "Dolar Contado con Liqui",
            "Dolar turista",
            "Argentina",
        ].includes(element.nombre);
    });

    dolarOficial = parseFloat(ticker[0].venta.replace(',', '.'));

    let salida = `<div class=" lead"><marquee>`;
    for (let i = 0; i < ticker.length - 1; i++) {
        salida += `${ticker[i].nombre}  Compra $ ${ticker[i].compra} / Venta $ ${ticker[i].venta} / Var. ${ticker[i].variacion} %  -  `;
    }
    // salida += `Riesgo País: ${ticker[3].compra} puntos.</marquee></div>`;
    dolarInfoDiv.innerHTML = salida;
}

getDolarInfo();