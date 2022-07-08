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
    actulizarResumen();
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


    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);


    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);

    contenido.appendChild(resumen);
}

function limpiarHTML() {
    const duplicado = document.querySelector('#resumen .contenido');

    while (duplicado.firstChild) {
        duplicado.removeChild(duplicado.firstChild);
    }
}