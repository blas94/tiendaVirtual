const buscarCategoria = document.querySelector('#buscarCategoria');
const spanCantidad = document.querySelector('#cantidad');
const cartCount = document.querySelector('#cartCount');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#sumaTotal');
const checkoutTotal = document.querySelector('#carritoCheckout #sumaTotal');


// Productos
let productos = [
    { name: "Computadora gamer", description: "Ryzen 7, fuente de poder 800w, 16 GB de RAM", price: 900000, pic: "Imgenes/pc.jpg", category: "Computadoras", id: "computadora" },
    { name: "Silla gamer", description: "Con RGB incluido", price: 150000, pic: "Imgenes/silla.jpg", category: "Periféricos", id: "silla" },
    { name: "Auriculares gamer", description: "Hyper X", price: 60000, pic: "Imgenes/auriculares.jpg", category: "Periféricos", id: "auriculares" },
    { name: "Teclado gamer", description: "Con RGB incluido", price: 50000, pic: "Imgenes/teclado.jpg", category: "Periféricos", id: "teclado" },
    { name: "Monitor", description: "144hz y panel IPS", price: 300000, pic: "Imgenes/monitor.jpg", category: "Monitores", id: "monitor" },
    { name: "Mouse gamer", description: "Viper mini chroma RGB", price: 30000, pic: "Imgenes/mouse.jpeg", category: "Periféricos", id: "mouse" }
];

let carrito = [];

// renderizar productos
const renderizarLista = (productos) => {
    const rowProductos = document.querySelector('#rowProductos');
    rowProductos.innerHTML = '';

    productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('col-4', 'd-flex', 'justify-content-center', 'row');
        card.innerHTML = `
            <div class="card m-3">
                <img src="${producto.pic}" class="card-img-top" alt="${producto.name}">
                <div class="card-body text-center">
                    <p class="card-title">${producto.name}</p>
                    <p class="card-text">${producto.description}</p>
                    <p class="card-text">${producto.category}</p>
                    <p class="card-text"><strong>$ ${producto.price.toLocaleString()}</strong></p>
                    <button type="button" class="btn rounded-3 add-to-cart btn btn-danger" data-id="${producto.id}">Agregar al carrito</button>
                    <button type="button" class="btn rounded-3 add-to-cart btn btn-dark">Ver detalle</button>
                </div>
            </div>
        `;
        rowProductos.appendChild(card);
    });
};


//  agregar producto al carrito
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart')) {
        const productoId = event.target.getAttribute('data-id');
        const producto = productos.find(i => i.id === productoId);

        if (producto) {
            carrito.push(producto);
            actualizarCarrito();
        } else {
            console.error('Producto no encontrado');
        }
    }
});

//  manejar el carrito
const actualizarCarrito = () => {
    cartItems.innerHTML = ''; 
    let total = 0;

    carrito.forEach((producto, index) => {
        const li = document.createElement('li');
        li.textContent = `${producto.name} - $${producto.price.toLocaleString()}`;
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('btn', 'btn-danger', 'ms-3');
        btnEliminar.addEventListener('click', () => {
            carrito.splice(index, 1);
            actualizarCarrito();
        });
        li.appendChild(btnEliminar);
        cartItems.appendChild(li);

        total += producto.price;
    });

    cartCount.innerText = carrito.length;
    cartTotal.innerText = total.toLocaleString();

    if (checkoutTotal) {
        checkoutTotal.innerText = total.toLocaleString();
    }
};


// eliminar todo

const btnEliminarTodo = document.querySelector('[data-action="eliminar-todo"]');

// Le asignamos la acción de eliminar todo el carrito
btnEliminarTodo.addEventListener('click', () => {
    carrito.length = 0; // Vaciar el carrito
    actualizarCarrito(); // Actualizar la vista del carrito
});

// Función para filtrar productos por categoría
buscarCategoria.addEventListener('change', () => {
    const category = buscarCategoria.value;
    const productosFiltrados = category === 'tds' ? productos : productos.filter(item => item.category === category);
    renderizarLista(productosFiltrados);
});


// guardar productos en localStorage
const guardarLocal = () => localStorage.setItem('productos', JSON.stringify(productos));

// inicializar productos desde localStorage o array inicial
const dataLeer = () => JSON.parse(localStorage.getItem('productos')) || productos;


// renderizar productos al cargar la página
productos = dataLeer();
renderizarLista(productos);


// obtener los elementos de los modales
const carritoModal = new bootstrap.Modal(document.getElementById('carritoModal'));
const checkoutModal = new bootstrap.Modal(document.getElementById('carritoCheckout'));

// agregar evento al botón "Proceder a la compra"
const btnProcederCompra = document.querySelector('#carritoModal .btn-primary');

btnProcederCompra.addEventListener('click', () => {
    // ocultar el modal de carrito
    carritoModal.hide();
    
    // mostrar el modal de checkout
    checkoutModal.show();

    actualizarCarrito();
});



// modal de detalle del producto
const detalleProductoModal = new bootstrap.Modal(document.getElementById('detalleProductoModal'));
const detalleProductoInfo = document.getElementById('detalleProductoInfo');

// función para mostrar los detalles del producto
const mostrarDetalleProducto = (producto) => {
    // llenar el contenido del modal con los detalles del producto
    detalleProductoInfo.innerHTML = `
        <h4>${producto.name}</h4>
        <img src="${producto.pic}" class="img-fluid" alt="${producto.name}">
        <p><strong>Descripción:</strong> ${producto.description}</p>
        <p class="card-text">${producto.category}</p>
        <p><strong>Precio:</strong> $${producto.price.toLocaleString()}</p>
        
    `;

    // mostrar el modal
    detalleProductoModal.show();
};

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-dark')) {
        const productoId = event.target.closest('.card').querySelector('.add-to-cart').getAttribute('data-id');
        const producto = productos.find(p => p.id === productoId);
        
        if (producto) {
            mostrarDetalleProducto(producto);
        } else {
            console.error('Producto no encontrado');
        }
    }
});