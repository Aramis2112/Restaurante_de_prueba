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
        
        document.getElementById('inicio-menu').scrollIntoView({ behavior: 'smooth' });
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

/* --- ANIMACIÓN SCROLL REVEAL --- */
    
    // 1. Seleccionamos qué elementos queremos animar
    // En este caso: todos los productos y las columnas del footer
    const elementosAnimar = document.querySelectorAll('.producto, .footer-col');

    // 2. Configuramos al "Vigilante" (Observer)
    const vigilante = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            // Si el elemento entra en pantalla...
            if(entrada.isIntersecting) {
                // ...le ponemos la clase 'active' para que suba y aparezca
                entrada.target.classList.add('active');
                
                // (Opcional) Dejamos de vigilarlo para que no se anime 
                // otra vez si subes y bajas rápido. Ahorra recursos.
                vigilante.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.1 // Se activa cuando al menos el 10% del elemento es visible
    });

    // 3. Le ponemos la clase base 'reveal' a todos y empezamos a vigilar
    elementosAnimar.forEach(el => {
        el.classList.add('reveal'); // Añade la invisibilidad inicial
        vigilante.observe(el);      // Activa al vigilante
    });

/* --- LÓGICA DEL MODAL (POPUP) --- */
    
    const modal = document.getElementById('modal-producto');
    const modalImg = document.getElementById('modal-img');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrecio = document.getElementById('modal-precio');
    const closeBtn = document.querySelector('.close-btn');

    // 1. Abrir Modal al hacer clic en un producto
    // Nota: Como usamos querySelectorAll('.producto') antes, podemos reutilizar esa variable o crearla de nuevo
    const listaProductos = document.querySelectorAll('.producto');

    listaProductos.forEach(prod => {
        prod.addEventListener('click', () => {
            // Capturamos los datos del producto clickeado
            const imagenSrc = prod.querySelector('img').src;
            const titulo = prod.querySelector('h3').textContent;
            const descripcion = prod.querySelector('p').textContent;
            const precio = prod.querySelector('.precio').textContent;

            // Rellenamos el modal con esos datos
            modalImg.src = imagenSrc;
            modalTitulo.textContent = titulo;
            modalDesc.textContent = descripcion;
            modalPrecio.textContent = precio;

            // Mostramos el modal (cambiamos display: none a flex)
            modal.style.display = 'flex';
        });
    });

    // 2. Cerrar Modal con la X
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 3. Cerrar Modal si haces clic fuera de la tarjeta (en el fondo oscuro)
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });