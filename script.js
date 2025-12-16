document.addEventListener('DOMContentLoaded', () => {
    // Llamamos a la función principal
    cargarMenu();
});

async function cargarMenu() {
    try {
        // 1. Petición para obtener el JSON
        const respuesta = await fetch('data.json');
        const datos = await respuesta.json();

        // 2. Cambiamos el nombre del restaurante en el título
        document.getElementById('restaurant-name').textContent = datos.restaurante;

        // 3. Generamos el HTML para cada categoría
        const contenedor = document.getElementById('menu-container');
        
        datos.menu.forEach(categoria => {
            // Creamos una sección para la categoría (ej: Entradas)
            const seccion = document.createElement('section');
            seccion.classList.add('categoria');
            
            // Título de la categoría
            seccion.innerHTML = `<h2>${categoria.categoria}</h2>`;

            // Contenedor de los platos de esa categoría
            const listaPlatos = document.createElement('div');
            listaPlatos.classList.add('lista-platos');

            // Recorremos los items (platos)
            categoria.items.forEach(plato => {
                const platoHTML = `
                    <div class="plato-card">
                        <img src="img/${plato.imagen}" alt="${plato.nombre}" class="plato-foto">
                        
                        <div class="info">
                            <h3>${plato.nombre}</h3>
                            <p class="descripcion">${plato.descripcion}</p>
                            <p class="precio">$${plato.precio.toLocaleString('es-CL')}</p>
                        </div>
                    </div>
                `;
                listaPlatos.innerHTML += platoHTML;
            });

            // Agregamos todo al contenedor principal
            seccion.appendChild(listaPlatos);
            contenedor.appendChild(seccion);
        });

    } catch (error) {
        console.error('Error cargando el menú:', error);
        document.getElementById('menu-container').innerHTML = '<p>Error al cargar el menú.</p>';
    }
}