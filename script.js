async function search() {
    const regionSelect = document.getElementById('regionSelect');
    const regionSelected = regionSelect.value; // Obtener la región seleccionada
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();

    // Validar que la región esté seleccionada y que el campo de entrada no esté vacío
    if (!regionSelected) {
        document.getElementById('results').innerHTML = '<p>Por favor, selecciona una región.</p>';
        return;
    }

    if (!searchInput) {
        document.getElementById('results').innerHTML = '<p>Por favor, ingresa el nombre del PDV.</p>';
        return;
    }

    const url = 'https://botai.smartdataautomation.com//api_backend_ai/dinamic-db/report/119/Jolifood_PDVs';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Token 4e15396f99ae10dd5c195d81fb6a3722c0a44a10',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            document.getElementById('results').innerHTML = '<p>Error al obtener los datos.</p>';
            return;
        }

        const data = await response.json();
        const results = data.result || [];

        // Filtrar los resultados primero por región y luego por nombre del PDV
        const filteredResults = results.filter(item =>
            item.REGION === regionSelected && item.PDV.toLowerCase().includes(searchInput)
        );

        // Mostrar resultados
        let output = `<h2>Resultados de la Búsqueda (${filteredResults.length} encontrados):</h2>`;
        if (filteredResults.length > 0) {
            filteredResults.forEach((result, index) => {
                output += `
                    <div class="result-item">
                        <h3>Resultado ${index + 1}</h3>
                        <ul>
                            <li>
                                <strong>SAP:</strong> ${result.SAP} 
                                <i onclick="copyToClipboard('${result.SAP}')">
                                    <i class="material-icons copy-icon">content_copy</i>
                                </i>
                            </li>
                            <li><strong>Región:</strong> ${result.REGION}</li>
                            <li><strong>Ciudad:</strong> ${result.CIUDAD}</li>
                            <li><strong>Canal:</strong> ${result.CANAL}</li>
                            <li><strong>Cadena:</strong> ${result.CADENA}</li>
                            <li><strong>Punto de Venta:</strong> ${result.PDV}</li>
                        </ul>
                    </div>
                `;
            });
        } else {
            output += '<p>No se encontraron resultados para tu búsqueda.</p>';
        }

        document.getElementById('results').innerHTML = output;
    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
        document.getElementById('results').innerHTML = '<p>Ocurrió un error al buscar los datos.</p>';
    }
}

// Función para copiar texto al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`Copiado al portapapeles: ${text}`);
    }).catch(err => {
        console.error('Error al copiar al portapapeles:', err);
    });
}
