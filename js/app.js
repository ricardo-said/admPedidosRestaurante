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
    cliente = {...cliente, mesa, hora}

// ocualtadno formulario despues de validar
const modalFormulario = document.querySelector('#formulario');
const modalBoostrap = bootstrap.Modal.getInstance(modalFormulario);
modalBoostrap.hide();


// mostrar las secciones
    mostrarSeccion();

    // obtener los platillos de la api de JSON-Server
    consultarAPI();

}


function mostrarSeccion(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach( seccion => seccion.classList.remove('d-none'));
}

function consultarAPI(){

    const url = 'http://localhost:4000/platillos';

    fetch(url)
    .then( respuesta => respuesta.json())
    .then(resultado => mostarPlatillos(resultado))
    .catch(error => console.log(error));
}

function mostarPlatillos(platillos){
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');
        
        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent= `$${platillo.precio}`;


        const categorias = document.createElement('div');
        categorias.classList.add('col-md-3')
        categorias.textContent = categoriaComida[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type= 'number';
        inputCantidad.min=0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        // evento que detecta el cambio en el input para agregar la cantidad y el platillo
        // agregamos un nueva propiedad catidad, para posteriormente hacer la matematica correspondiente
        inputCantidad.onchange = function (){
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad}); // es necesario hacer spread operato para formar una lista de argumentos
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

function agregarPlatillo(producto){
    // Extraigo el pedido actual
    let {pedido}= cliente;

    // revisar que el procuto sea mayor a 0
    if (producto.cantidad > 0) {

        // comprueba si el pedido se repite
        if (pedido.some(articulo => articulo.id === producto.id)) {
            const pedidoActualizado = pedido.map(articulo =>{
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            })
            // se asigna el nuevo arrey a clinete.pedido
            cliente.pedido = [...pedidoActualizado]
        }
        else{
            // El articulo no existe lo agregamos al array de pedido
           cliente.pedido = [...pedido, producto]; 
        }
        
    }
    else{
        console.log('mo es mayor a 0');
    
    }
    console.log(cliente.pedido)
}