// Esperamos a que cargue todo el HTML antes de ejecutar el script para evitar errores
document.addEventListener('DOMContentLoaded', () => {
    
    // === REFERENCIAS A ELEMENTOS DEL DOM ===
    const buscador = document.getElementById('buscador');       // Referencia al input de texto del buscador
    const botonesFiltro = document.querySelectorAll('.btn-filtro'); // Selecciona todos los botones de filtro
    const productos = document.querySelectorAll('.producto');     // Selecciona todas las tarjetas de productos

    // --- FUNCIÓN 1: FILTRAR POR CATEGORÍA (Click en botones) ---
    // Recorremos cada botón para agregarle funcionalidad
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            
            // 1. Estética: Remover clase 'active' de todos los botones para desmarcarlos
            botonesFiltro.forEach(b => b.classList.remove('active'));
            
            // 2. Estética: Agregar clase 'active' solo al botón que se acaba de clicar
            btn.classList.add('active');

            // 3. Nota: La lógica real de filtrado se maneja en la función global 'filtrar()' 
            // que se llama desde el HTML (onclick="filtrar(...)").
        });
    });

    // Definimos la función global 'filtrar' para que el HTML pueda llamarla directamente
    window.filtrar = function(categoria) {
        
        // Hace un scroll suave hacia el inicio del menú al filtrar
        document.getElementById('inicio-menu').scrollIntoView({ behavior: 'smooth' });
        
        // Mantenemos la lógica visual de los botones activa
        botonesFiltro.forEach(btn => {
            // Aquí podríamos agregar lógica extra si fuera necesario
        });

        // Lógica principal: Mostrar u ocultar productos según la categoría
        productos.forEach(prod => {
            // Obtiene la categoría oculta en el atributo 'data-categoria' del HTML
            const catProducto = prod.getAttribute('data-categoria');
            
            // Si el filtro es 'todo' O la categoría del producto coincide con la seleccionada
            if (categoria === 'todo' || catProducto === categoria) {
                prod.classList.remove('hide'); // Muestra el producto quitando la clase ocultar
                
                // Pequeña animación de entrada (fade in)
                prod.style.opacity = '0';      // Lo hace transparente momentáneamente
                setTimeout(() => prod.style.opacity = '1', 50); // Lo vuelve visible suavemente
            } else {
                prod.classList.add('hide');    // Oculta el producto si no coincide
            }
        });
        
        // Sincronización visual: Asegura que el botón activo coincida con la función onclick
        botonesFiltro.forEach(btn => {
            // Verifica si el botón tiene el atributo onclick con la categoría actual
            if(btn.getAttribute('onclick').includes(categoria)) {
                btn.classList.add('active');    // Lo marca como activo
            } else {
                btn.classList.remove('active'); // Lo desmarca
            }
        });
    };

    // --- FUNCIÓN 2: BUSCADOR EN TIEMPO REAL ---
    // Escucha cada vez que el usuario suelta una tecla en el buscador
    buscador.addEventListener('keyup', (e) => {
        const textoBusqueda = e.target.value.toLowerCase(); // Convierte lo escrito a minúsculas

        productos.forEach(prod => {
            // Busca el texto dentro del título (h3) y lo convierte a minúsculas
            const titulo = prod.querySelector('h3').textContent.toLowerCase();
            // Busca el texto dentro de la descripción (p) y lo convierte a minúsculas
            const descripcion = prod.querySelector('p').textContent.toLowerCase();

            // Comprueba si el texto buscado está incluido en el título O en la descripción
            if (titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda)) {
                prod.style.display = 'block'; // Muestra la tarjeta si hay coincidencia
            } else {
                prod.style.display = 'none';  // Oculta la tarjeta si no hay coincidencia
            }
        });
    });

}); // Fin del DOMContentLoaded

/* --- ANIMACIÓN SCROLL REVEAL (Aparición al bajar) --- */
    
    // 1. Selección de elementos a animar (Productos y columnas del footer)
    const elementosAnimar = document.querySelectorAll('.producto, .footer-col');

    // 2. Configuración del "Vigilante" (IntersectionObserver)
    const vigilante = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            // Verifica si el elemento ha entrado en la pantalla visible
            if(entrada.isIntersecting) {
                // Añade la clase 'active' que tiene la animación CSS (transform y opacity)
                entrada.target.classList.add('active');
                
                // Deja de vigilar el elemento una vez animado para ahorrar recursos
                vigilante.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.1 // La animación se dispara cuando el 10% del elemento es visible
    });

    // 3. Inicialización: Agrega la clase base y empieza a vigilar
    elementosAnimar.forEach(el => {
        el.classList.add('reveal'); // Añade la clase que lo hace invisible inicialmente
        vigilante.observe(el);      // Ordena al vigilante que observe este elemento
    });

/* --- LÓGICA DEL MODAL (VENTANA EMERGENTE) --- */
    
    // Referencias a los elementos dentro de la ventana modal
    const modal = document.getElementById('modal-producto'); // El contenedor negro fondo
    const modalImg = document.getElementById('modal-img');   // La imagen del modal
    const modalTitulo = document.getElementById('modal-titulo'); // El título del modal
    const modalDesc = document.getElementById('modal-desc');     // La descripción
    const modalPrecio = document.getElementById('modal-precio'); // El precio
    const closeBtn = document.querySelector('.close-btn');       // La X para cerrar

    // 1. Abrir Modal al hacer clic en un producto
    const listaProductos = document.querySelectorAll('.producto'); // Selecciona productos nuevamente

    listaProductos.forEach(prod => {
        prod.addEventListener('click', () => {
            // Captura la información de la tarjeta clickeada
            const imagenSrc = prod.querySelector('img').src;       // Ruta de la imagen
            const titulo = prod.querySelector('h3').textContent;   // Texto del título
            const descripcion = prod.querySelector('p').textContent; // Texto de descripción
            const precio = prod.querySelector('.precio').textContent; // Texto del precio

            // Inyecta la información capturada dentro del HTML del modal
            modalImg.src = imagenSrc;
            modalTitulo.textContent = titulo;
            modalDesc.textContent = descripcion;
            modalPrecio.textContent = precio;

            // Cambia el estilo display para mostrar el modal (flex para centrar)
            modal.style.display = 'flex';
        });
    });

    // 2. Cerrar Modal al hacer clic en la X
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none'; // Oculta el modal
    });

    // 3. Cerrar Modal al hacer clic fuera de la tarjeta (en el fondo oscuro)
    window.addEventListener('click', (e) => {
        if (e.target === modal) {     // Si el click fue directamente en el fondo negro
            modal.style.display = 'none'; // Oculta el modal
        }
    });

    /* --- MODO OSCURO (DARK MODE) --- */
    const btnTema = document.getElementById('dark-mode-toggle'); // Botón flotante
    const iconoTema = btnTema.querySelector('i');                // Icono dentro del botón

    btnTema.addEventListener('click', () => {
        // 1. Alternar la clase 'dark-mode' en la etiqueta <body>
        document.body.classList.toggle('dark-mode');

        // 2. Lógica para cambiar el icono (Sol <-> Luna)
        if(document.body.classList.contains('dark-mode')){
            // Si está oscuro: quita luna, pon sol
            iconoTema.classList.remove('fa-moon');
            iconoTema.classList.add('fa-sun'); 
        } else {
            // Si está claro: quita sol, pon luna
            iconoTema.classList.remove('fa-sun');
            iconoTema.classList.add('fa-moon'); 
        }
    });