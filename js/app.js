let cliente = { //se crea un objeto para cada mesa o cliente
    mesa: '',
    hora: '',
    pedido: []
};

let categoriaComida = { //asignamos la categoria de la comida a categoria del menu
    1: ' Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardaCliente = document.querySelector('#guardar-cliente');
btnGuardaCliente.addEventListener('click', guardarCLiente);

function guardarCLiente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //evalua el form para detectar campos vacios retornando true o false segun sea el caso
    const camposVacios = [mesa, hora].some(form => form === '');



    if (camposVacios) {
        const existenciaAlert = document.querySelector('invalid-feedback');
        if (!existenciaAlert) {
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }

        return;
    }
    //  asignando datos del formulario al objeto cliente
    cliente = { ...cliente, mesa, hora }

    // ocualtadno formulario despues de validar
    const modalFormulario = document.querySelector('#formulario');
    const modalBoostrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBoostrap.hide();


    // mostrar las secciones
    mostrarSeccion();

    // obtener los platillos de la api de JSON-Server
    consultarAPI();

}


function mostrarSeccion() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function consultarAPI() {

    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostarPlatillos(resultado))
        .catch(error => console.log(error));
}

function mostarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;


        const categorias = document.createElement('div');
        categorias.classList.add('col-md-3')
        categorias.textContent = categoriaComida[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        // evento que detecta el cambio en el input para agregar la cantidad y el platillo
        // agregamos un nueva propiedad catidad, para posteriormente hacer la matematica correspondiente
        inputCantidad.onchange = function () {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({ ...platillo, cantidad }); // es necesario hacer spread operato para formar una lista de argumentos
        }


        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);


        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categorias);
        row.appendChild(agregar);

        contenido.appendChild(row);
    });
}

function agregarPlatillo(producto) {
    // Extraigo el pedido actual
    let { pedido } = cliente;

    // revisar que el procuto sea mayor a 0
    if (producto.cantidad > 0) {

        // comprueba si el pedido se repite
        if (pedido.some(articulo => articulo.id === producto.id)) {
            const pedidoActualizado = pedido.map(articulo => {
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            })
            // se asigna el nuevo arrey a clinete.pedido
            cliente.pedido = [...pedidoActualizado]
        }
        else {
            // El articulo no existe lo agregamos al array de pedido
            cliente.pedido = [...pedido, producto];
        }

    }
    else {
        // eliminar cuando la cantidad sea cero
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
    }
    // limpiar codigo HTML previo, es decir eliminar el html para que no 
    // repita la informacion impresa
    limpiarHTML();
// mostrar rl resumen del pedido
    if (cliente.pedido.lengt) {
        actulizarResumen();
    }
    else{
        mensajePedidoVacio()
    }
// El producto se elimino por lo tanto la cantidad 0 en el formulario
const productoEliminado = `#producto-${id}`;
const inputEliminado = document.querySelector(productoEliminado);
inputEliminado.value= 0;

    
    
}

function actulizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'cad', 'py-5', 'px-3', 'shadow');

    // informacion de mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');
    mesa.appendChild(mesaSpan);

    // informacion de hora
    const hora = document.createElement('p');
    hora.textContent = 'Mesa: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    // titulo de la seccion
    const heading = document.createElement('h3');
    heading.textContent = 'Platillos Consumidos';

    heading.classList.add('my-4', 'text-center');

    // Iterar sobre el array de pedidos

    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const {pedido} = cliente;
    pedido.forEach(articulo =>{
        const{nombre, cantidad, precio, id} = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');
        
        const nombreEl = document.createElement('h3');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        // cantidad del articulo
        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        // presio del articulo
        const precioEl = document.createElement('p');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = precio;

        // subtotal
        const subtotalEl = document.createElement('p');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubTotal(precio, cantidad);

        // agregando boton de eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn','btn-danger');
        btnEliminar.textContent ='Eliminar pedido';

        // funcion para eliminar el producto de la lista
        btnEliminar.onclick = function() {
            eliminarProduc(id);
        }
        // agregar valores a sus contenedores
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);


        // agregar elementos a la lista
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        // agregar lista al grupo principal
        grupo.appendChild(lista);



    })


    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);


    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);


    contenido.appendChild(resumen);
}

function limpiarHTML() {
    const duplicado = document.querySelector('#resumen .contenido');

    while (duplicado.firstChild) {
        duplicado.removeChild(duplicado.firstChild);
    }
}

function calcularSubTotal(precio,cantidad){
 return `$ ${precio * cantidad}`;
}

function eliminarProduc(id){
    const{pedido}=cliente;
    const resultado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...resultado];
        // limpiar codigo HTML previo, es decir eliminar el html para que no 
    // repita la informacion impresa
    limpiarHTML();
    if (cliente.pedido.lengt) {
        actulizarResumen();
    }
    else{
        mensajePedidoVacio();
    }
    
}
function mensajePedidoVacio (){
    const contenido = document.querySelector('#resumen .contacto');
     const texto = document.createElement('p');

     texto.classList.add('text-center');
     texto.textContent ='Añade los elementos del pedido';

     contenido.appendChild(texto);

    //  el preducto se elimino debemos regresar el producto a cer




}