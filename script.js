// Esperamos a que cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    
    const buscador = document.getElementById('buscador');
    const botonesFiltro = document.querySelectorAll('.btn-filtro');
    const productos = document.querySelectorAll('.producto');

    // --- FUNCIÓN 1: FILTRAR POR CATEGORÍA ---
    // Agregamos evento click a cada botón
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            
            // 1. Remover clase 'active' de todos los botones
            botonesFiltro.forEach(b => b.classList.remove('active'));
            // 2. Agregar clase 'active' al botón clicado
            btn.classList.add('active');

            // 3. Obtener la categoría seleccionada (usando el texto dentro de onclick en HTML no es necesario,
            // pero aquí lo haremos capturando el evento para ser más limpios, 
            // aunque el onclick del HTML llama a filtrar(), haremos que funcione con la función de abajo).
            // NOTA: Como en el HTML puse onclick="filtrar()", vamos a definir esa función globalmente.
        });
    });

    // Definimos la función global que usa el HTML
    window.filtrar = function(categoria) {
        
        // Estética de botones (lo repetimos para asegurar que funcione con el onclick del HTML)
        botonesFiltro.forEach(btn => {
            // Un pequeño truco para saber cuál botón es el actual basado en el texto o un atributo
            // Simplificaremos: marcamos activo al que coincida con el texto o lógica
            // Pero para no complicar, usamos el click event de arriba solo para estilo visual
        });

        // Lógica de mostrar/ocultar productos
        productos.forEach(prod => {
            const catProducto = prod.getAttribute('data-categoria');
            
            if (categoria === 'todo' || catProducto === categoria) {
                prod.classList.remove('hide');
                // Animación suave opcional (fade in)
                prod.style.opacity = '0';
                setTimeout(() => prod.style.opacity = '1', 50);
            } else {
                prod.classList.add('hide');
            }
        });
        
        // Actualizar visualmente los botones (para que coincida con la función onclick)
        botonesFiltro.forEach(btn => {
            // Comparamos el onclick del botón con la categoría actual
            if(btn.getAttribute('onclick').includes(categoria)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    };

    // --- FUNCIÓN 2: BUSCADOR EN TIEMPO REAL ---
    buscador.addEventListener('keyup', (e) => {
        const textoBusqueda = e.target.value.toLowerCase();

        productos.forEach(prod => {
            // Buscamos en el título (h3) y en la descripción (p)
            const titulo = prod.querySelector('h3').textContent.toLowerCase();
            const descripcion = prod.querySelector('p').textContent.toLowerCase();

            // Si el texto está visible (no oculto por filtro) Y coincide con la búsqueda
            // Nota: Si quieres que busque en TODO aunque esté filtrado, quita la validación de !hide
            if (titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda)) {
                prod.style.display = 'block';
            } else {
                prod.style.display = 'none';
            }
        });
    });

});