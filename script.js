document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. CONFIGURACIÓN DE HORARIOS Y DATOS
    // =========================================
    
    // DEFINICIÓN DE HORARIOS (Sistema 24 horas)
    const horariosConfig = {
        1: { abre: 12, cierra: 22 }, // Lunes
        2: { abre: 12, cierra: 22 }, // Martes
        3: { abre: 12, cierra: 22 }, // Miércoles
        4: { abre: 12, cierra: 22 }, // Jueves
        5: { abre: 12, cierra: 22 }, // Viernes
        6: { abre: 13, cierra: 23 }, // Sábado
        0: { abre: 0, cierra: 0 }    // Domingo (Cerrado)
    };

    const baseDeDatos = [
        { id: 1, nombre: "Hamburguesa Clásica", precio: 5000, categoria: "hamburguesas", img: "img/hamburguesa-clasica.jpg", desc: "Carne a la parrilla, queso y vegetales frescos." },
        { id: 2, nombre: "Doble Bacon Cheese", precio: 6500, categoria: "hamburguesas", img: "img/doble-bacon.jpg", desc: "Doble carne, doble queso cheddar y tocino crujiente." },
        { id: 3, nombre: "Veggie Burger", precio: 5800, categoria: "hamburguesas", img: "img/veggie-burger.jpg", desc: "Medallón de lentejas, lechuga, tomate y palta." },
        { id: 4, nombre: "Pizza Pepperoni", precio: 8500, categoria: "pizzas", img: "img/pizza-pepperoni.jpg", desc: "Masa artesanal con salsa de tomate y extra pepperoni." },
        { id: 5, nombre: "Pizza Pollo BBQ", precio: 9000, categoria: "pizzas", img: "img/pizza-bbq.jpg", desc: "Salsa barbacoa, pollo, cebolla morada y mozzarella." },
        { id: 6, nombre: "Tacos al Pastor", precio: 4000, categoria: "tacos", img: "img/tacos-pastor.jpg", desc: "3 unidades de cerdo adobado con piña y cilantro." },
        { id: 7, nombre: "Quesabirrias", precio: 5500, categoria: "tacos", img: "img/quesabirrias.jpg", desc: "Tacos de carne con queso fundido y consomé." },
        { id: 8, nombre: "Handroll de Pollo", precio: 3500, categoria: "sushi", img: "img/handroll-pollo.jpg", desc: "Pollo, queso crema y cebollín frito en panko." },
        { id: 9, nombre: "Avocado Roll", precio: 4200, categoria: "sushi", img: "img/avocado-roll.jpg", desc: "Envuelto en palta, relleno de salmón y queso crema." },
        { id: 10, nombre: "Jugo de Fresa", precio: 2000, categoria: "bebidas", img: "img/jugo-fresa.jpg", desc: "Natural y refrescante, hecho al momento." },
        { id: 11, nombre: "Jugo de Piña", precio: 2000, categoria: "bebidas", img: "img/jugo-pina.jpg", desc: "Dulce y tropical, recién exprimido." },
        { id: 12, nombre: "Jugo de Mango", precio: 2200, categoria: "bebidas", img: "img/jugo-mango.jpg", desc: "Néctar suave de mango maduro." },
        { id: 13, nombre: "Limonada Menta", precio: 2500, categoria: "bebidas", img: "img/limonada-menta.jpg", desc: "La especialidad de la casa para la sed." },
        { id: 14, nombre: "Agua Mineral", precio: 1500, categoria: "bebidas", img: "img/agua-mineral.jpg", desc: "Botella personal con o sin gas." },
        { id: 15, nombre: "Bebida en Lata", precio: 1800, categoria: "bebidas", img: "img/bebida-lata.jpg", desc: "Coca-Cola, Fanta o Sprite helada." }
    ];

    // VARIABLES Y SELECTORES
    const gridContainer = document.getElementById('menu-container');
    const buscador = document.getElementById('buscador');       
    const botonesFiltro = document.querySelectorAll('.btn-filtro'); 
    
    let carrito = []; 
    let descuentoAplicado = 0; 
    let nombreCupon = ""; 
    let localAbierto = false; 

    const contadorCarrito = document.getElementById('contador-carrito'); 
    const sidebarCarrito = document.getElementById('carrito-sidebar'); 
    const listaCarrito = document.getElementById('lista-carrito'); 
    const subtotalElemento = document.getElementById('carrito-subtotal');
    const descuentoElemento = document.getElementById('carrito-descuento');
    const filaDescuento = document.getElementById('fila-descuento');
    const totalElemento = document.getElementById('carrito-total'); 
    const inputCupon = document.getElementById('input-cupon');
    const msgCupon = document.getElementById('msg-cupon');
    const estadoLocalBadge = document.getElementById('estado-local'); 

    const modal = document.getElementById('modal-producto');
    const closeBtn = document.querySelector('.close-btn');
    const btnAgregarModal = document.querySelector('.btn-pedir-modal'); 
    const btnCheckout = document.querySelector('.btn-checkout'); 

    // =========================================
    // 2. FUNCIÓN DE VALIDACIÓN DE HORARIO
    // =========================================
    function verificarHorario() {
        const ahora = new Date();
        const diaSemana = ahora.getDay(); 
        const horaActual = ahora.getHours(); 
        
        const horarioHoy = horariosConfig[diaSemana];

        if (horarioHoy.abre === 0 && horarioHoy.cierra === 0) {
            localAbierto = false;
        } else if (horaActual >= horarioHoy.abre && horaActual < horarioHoy.cierra) {
            localAbierto = true;
        } else {
            localAbierto = false;
        }
        actualizarEstadoVisual();
    }

    function actualizarEstadoVisual() {
        if (localAbierto) {
            estadoLocalBadge.textContent = " Abierto Ahora";
            estadoLocalBadge.className = "estado-badge abierto";
            btnCheckout.disabled = false; 
            btnCheckout.innerHTML = 'Enviar Pedido <i class="fab fa-whatsapp"></i>';
        } else {
            estadoLocalBadge.textContent = " Cerrado Ahora";
            estadoLocalBadge.className = "estado-badge cerrado";
            btnCheckout.disabled = true; 
            btnCheckout.innerHTML = 'Local Cerrado <i class="fas fa-lock"></i>';
        }
    }

    // =========================================
    // 3. FUNCIONES DE SISTEMA
    // =========================================

    function renderizarProductos(lista = baseDeDatos) {
        gridContainer.innerHTML = ''; 
        
        lista.forEach(producto => {
            const tarjetaHTML = `
                <div class="producto" data-categoria="${producto.categoria}" data-id="${producto.id}">
                    <img src="${producto.img}" alt="${producto.nombre}">
                    <div class="info">
                        <h3>${producto.nombre}</h3>
                        <p>${producto.desc}</p>
                        <span class="precio">$${producto.precio.toLocaleString('es-CL')}</span>
                    </div>
                </div>
            `;
            gridContainer.innerHTML += tarjetaHTML;
        });

        asignarEventosModal(); // Tus eventos de click
        iniciarAnimacionScroll(); // <--- AQUÍ ACTIVAMOS EL OBSERVER NUEVO
    }

    function iniciarAnimacionScroll() {
        // CAMBIO AQUÍ: Ahora seleccionamos '.producto' Y TAMBIÉN '.footer-mega'
        const elementos = document.querySelectorAll('.producto, .footer-mega');

        const observador = new IntersectionObserver((entradas, observador) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('mostrar'); // Agrega la clase para animar
                    observador.unobserve(entrada.target);    // Deja de vigilar una vez animado
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Se activa cuando se ve el 10% del elemento
        });

        elementos.forEach(el => {
            observador.observe(el);
        });
    }

    window.mostrarToast = function(mensaje, tipo = 'info') {
        const contenedor = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.classList.add('toast', tipo);
        
        let icono = '<i class="fas fa-info-circle"></i>';
        if(tipo === 'success') icono = '<i class="fas fa-check-circle"></i>';
        if(tipo === 'error') icono = '<i class="fas fa-exclamation-circle"></i>';

        toast.innerHTML = `${icono} <span>${mensaje}</span>`;
        contenedor.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    };

    function guardarStorage() {
        localStorage.setItem('carritoRestaurante', JSON.stringify(carrito));
        localStorage.setItem('cuponRestaurante', JSON.stringify({ nombre: nombreCupon, valor: descuentoAplicado }));
    }

    function cargarStorage() {
        const carritoGuardado = localStorage.getItem('carritoRestaurante');
        if (carritoGuardado) carrito = JSON.parse(carritoGuardado);

        const cuponGuardado = localStorage.getItem('cuponRestaurante');
        if (cuponGuardado) {
            const cuponData = JSON.parse(cuponGuardado);
            nombreCupon = cuponData.nombre;
            descuentoAplicado = cuponData.valor;
            if(nombreCupon) {
                inputCupon.value = nombreCupon;
                msgCupon.textContent = `Cupón guardado: ${nombreCupon}`;
                msgCupon.className = "texto-exito";
            }
        }
        actualizarCarritoUI();
    }

    // =========================================
    // 4. LÓGICA DE MODAL
    // =========================================
    function asignarEventosModal() {
        const productosDOM = document.querySelectorAll('.producto');
        productosDOM.forEach(prod => {
            prod.addEventListener('click', () => {
                const id = parseInt(prod.getAttribute('data-id'));
                const dataProducto = baseDeDatos.find(p => p.id === id);

                if(dataProducto) {
                    document.getElementById('modal-img').src = dataProducto.img;
                    document.getElementById('modal-titulo').textContent = dataProducto.nombre;
                    document.getElementById('modal-desc').textContent = dataProducto.desc;
                    document.getElementById('modal-precio').textContent = '$' + dataProducto.precio.toLocaleString('es-CL');
                    btnAgregarModal.setAttribute('data-id-producto', id);
                    modal.style.display = 'flex';
                }
            });
        });
    }

    if(closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    // =========================================
    // 5. LÓGICA DEL CARRITO
    // =========================================
    window.toggleCarrito = function() { sidebarCarrito.classList.toggle('active'); };

    if(btnAgregarModal) {
        btnAgregarModal.addEventListener('click', () => {
            const idProducto = parseInt(btnAgregarModal.getAttribute('data-id-producto'));
            const productoDB = baseDeDatos.find(p => p.id === idProducto);

            if (productoDB) {
                const productoEnCarrito = carrito.find(item => item.id === idProducto);
                if (productoEnCarrito) {
                    productoEnCarrito.cantidad++;
                    mostrarToast(`Otra unidad agregada: ${productoDB.nombre}`, 'info');
                } else {
                    const nuevoItem = { ...productoDB, cantidad: 1 };
                    carrito.push(nuevoItem);
                    mostrarToast(`${productoDB.nombre} agregado al carrito`, 'success');
                }
                guardarStorage();
                actualizarCarritoUI();
                modal.style.display = 'none';
                sidebarCarrito.classList.add('active');
            }
        });
    }

    window.aplicarCupon = function() {
        const codigo = inputCupon.value.toUpperCase().trim();
        const cuponesValidos = { "SABOR10": 0.10, "COSA20": 0.20, "GRATIS": 1.00 };

        if (cuponesValidos.hasOwnProperty(codigo)) {
            descuentoAplicado = cuponesValidos[codigo]; 
            nombreCupon = codigo;
            msgCupon.textContent = `¡Cupón ${codigo} aplicado!`;
            msgCupon.className = "texto-exito";
            mostrarToast("Cupón aplicado correctamente", "success");
        } else {
            descuentoAplicado = 0;
            nombreCupon = "";
            msgCupon.textContent = "Cupón no válido.";
            msgCupon.className = "texto-error";
            mostrarToast("El código no existe", "error");
        }
        guardarStorage();
        actualizarCarritoUI();
    };

    function actualizarCarritoUI() {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contadorCarrito.textContent = totalItems;

        listaCarrito.innerHTML = '';
        let subtotal = 0; 

        carrito.forEach(producto => {
            subtotal += (producto.precio * producto.cantidad);
            const item = document.createElement('div');
            item.classList.add('item-carrito');
            item.innerHTML = `
                <img src="${producto.img}" alt="Producto">
                <div class="item-info">
                    <h4>${producto.nombre} <span style="color: var(--color-acento);">x${producto.cantidad}</span></h4>
                    <p>$${(producto.precio * producto.cantidad).toLocaleString('es-CL')}</p>
                </div>
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${producto.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            listaCarrito.appendChild(item);
        });

        if (carrito.length === 0) listaCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';

        const valorDescuento = subtotal * descuentoAplicado;
        const totalFinal = subtotal - valorDescuento;

        subtotalElemento.textContent = '$' + subtotal.toLocaleString('es-CL');
        totalElemento.textContent = '$' + totalFinal.toLocaleString('es-CL');

        if (descuentoAplicado > 0) {
            filaDescuento.style.display = 'flex';
            descuentoElemento.textContent = '-$' + valorDescuento.toLocaleString('es-CL');
        } else {
            filaDescuento.style.display = 'none';
        }
        
        verificarHorario();
    }

    window.eliminarDelCarrito = function(id) {
        const producto = carrito.find(p => p.id === id);
        if (producto) {
            if (producto.cantidad > 1) {
                producto.cantidad--;
                mostrarToast("Se restó 1 unidad", "info");
            } else {
                carrito = carrito.filter(p => p.id !== id);
                mostrarToast("Producto eliminado", "error");
            }
        }
        guardarStorage();
        actualizarCarritoUI(); 
    };

    window.finalizarPedido = function() {
        if (!localAbierto) {
            mostrarToast("El local está cerrado en este momento.", "error");
            return;
        }

        if (carrito.length === 0) {
            mostrarToast("Tu carrito está vacío", "error");
            return;
        }
        const numeroTienda = "56912345678"; 
        let mensaje = "Hola! Quiero pedir:%0A";
        carrito.forEach(p => {
            const subtotalItem = p.precio * p.cantidad;
            mensaje += `- ${p.cantidad}x ${p.nombre} ($${subtotalItem.toLocaleString('es-CL')})%0A`;
        });
        mensaje += `%0A----------------`;
        mensaje += `%0ASubtotal: ${subtotalElemento.textContent}`;
        if (descuentoAplicado > 0) {
            mensaje += `%0A*Cupón ${nombreCupon} aplicado!*`;
            mensaje += `%0ADescuento: ${descuentoElemento.textContent}`;
        }
        mensaje += `%0A*Total a Pagar: ${totalElemento.textContent}*`;
        window.open(`https://wa.me/${numeroTienda}?text=${mensaje}`, '_blank');
    };

    // =========================================
    // 6. FILTROS Y LÓGICA DE SCROLL MEJORADA
    // =========================================
    
    window.filtrar = function(categoria) {
        // 1. Filtrar
        let productosFiltrados = baseDeDatos;
        if (categoria !== 'todo') {
            productosFiltrados = baseDeDatos.filter(p => p.categoria === categoria);
        }
        
        // 2. Renderizar
        renderizarProductos(productosFiltrados);
        
        // 3. Botones Activos
        botonesFiltro.forEach(btn => {
            if(btn.getAttribute('onclick').includes(categoria)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 4. SCROLL CORRECTO HACIA LOS CONTROLES (Debajo del Hero)
        const seccionControles = document.querySelector('.controles');
        if (seccionControles) {
            seccionControles.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };

    // =========================================
    // 7. BUSCADOR Y MODO OSCURO
    // =========================================

    if(buscador){
        buscador.addEventListener('keyup', (e) => {
            const texto = e.target.value.toLowerCase();
            const filtrados = baseDeDatos.filter(p => 
                p.nombre.toLowerCase().includes(texto) || p.desc.toLowerCase().includes(texto)
            );
            renderizarProductos(filtrados);
        });
    }

    const btnTema = document.getElementById('dark-mode-toggle');
    const iconoTema = btnTema.querySelector('i');
    if(btnTema) {
        btnTema.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if(document.body.classList.contains('dark-mode')){
                iconoTema.classList.remove('fa-moon');
                iconoTema.classList.add('fa-sun');
            } else {
                iconoTema.classList.remove('fa-sun');
                iconoTema.classList.add('fa-moon');
            }
        });
    }

    // INICIALIZACIÓN
    renderizarProductos();
    cargarStorage();
    verificarHorario(); 
    
    setInterval(verificarHorario, 60000);
});