//let tipoPago = ['(1) ->Efectivo', '(2) -> Debito', '(3) -> Credito', '(4) -> Cheque', '(0) -> Salir'];
let montosGuardados = JSON.parse(localStorage.getItem('detalles')) || [];

const metodosDePago = [];
const registro = [];
let tablaBody = document.getElementById('tablabody');
let mTotal = document.getElementById('total').innerText;

let total = 0;
let efectivo = 0;
let debito = 0;
let credito = 0;
let cheque = 0;
let nombre=''

function actualizarTabla() {
    
    montosGuardados = JSON.parse(localStorage.getItem('detalles')) || [];
    montosGuardados.forEach((detalle, index) => {

        tablaBody.innerHTML += `
        <tr data-id='${index + 1}'>
          <td>${index + 1}</td>
          <td>${detalle.detalle}</td>
          <td>${detalle.monto}</td>
          <td><button type="button" class="btn btn-outline-danger btnELim">❌</button></td>
        </tr>
        `;
        total += detalle.monto;

       
          
    });
    let paso = devuelveMiles(String(total));
    document.getElementById('total').innerText = mTotal + paso

    nombre = localStorage.getItem('nomCajero')
    if(nombre != null){
        console.log(nombre);
        const name = document.getElementById('nombre').innerHTML;
        document.getElementById('nombre').innerHTML = `
        <h4>${name} ${nombre.toUpperCase()}</h4>
        ` ;
    }
        
    
}

actualizarTabla();


function obtenerJson(){
    // Utilizaremos fetch para obtener el JSON
    return fetch('json/tiposPago.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener el JSON');
        }
        return response.json();
    })
    .then(jsonData => {
        // Almacenar el JSON en el arreglo metodosDePago
        metodosDePago.push(...jsonData);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function cargaRadios(){
    obtenerJson()
    .then(() => {
        const radiosContainer = document.getElementById('radiosB');
        
        metodosDePago.forEach((valor, indice) => {
            radiosContainer.innerHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadio${valor}" checked>
                    <label class="form-check-label" for="flexRadio${valor}">
                    ${valor}
                    </label>
                </div>
            `;
        });
    })
    .catch(error => {
        console.error("Error:", error.message);
    });
}

function obtenerMetodoDePago(tipoPago) {
    return new Promise((resolve, reject) => {
        const metodo = metodosDePago[tipoPago];
        if (metodo) {
            resolve(metodo);
        } else {
            reject(new Error("Tipo de pago no válido"));
        }
    });
}

function sumaTotal(monto) {
    if (monto > 0) {
        total += monto;
        console.log(total);
    }
}

function focusInit() {

    document.getElementById("flexRadioEfectivo").focus();
}

function devuelveMiles(monto) {
    let nuevoMonto = [];

    for (let i = monto.length - 1; i >= 0; i -= 3) {
        let ini = Math.max(0, i - 2);
        let cad = monto.substring(ini, i + 1);
        nuevoMonto.unshift(cad);
    }
    return (nuevoMonto.join('.'));
}

function igresaCajero() {
    var modalNombre = new bootstrap.Modal(document.getElementById("modalNombre"));

    if (registro == "") {

        const nombre = document.getElementById('floatingTextareaNombre').value;
        const name = document.getElementById('nombre').innerHTML;
        console.log(nombre);
        document.getElementById('nombre').innerHTML = `
            <h4>${name} ${nombre.toUpperCase()}</h4>
        ` ;

        localStorage.setItem('nomCajero', nombre);
    }
    
    modalNombre.dispose();
}

const radiosOP = document.getElementById('botonIngresaNuevo')
radiosOP.onclick = () => {
    cargaRadios(metodosDePago)
}

// obtener valor del radio button
const radioOp = document.querySelectorAll('input[name="flexRadioDefault"]');
let valorRadio = "flexRadioEfectivo";
let montoSumando = 0
radioOp.forEach(radio => {
    radio.addEventListener('change', function (event) {
        if (event.target.checked) {

            valorRadio = radio.id;
        }
    });
});

const botonAgregaMonto = document.getElementById('btnAgregaMonto');
const texto = document.getElementById('textSuma');
botonAgregaMonto.onclick = () => {
    const texto = document.getElementById('textSuma');
    texto.focus();
}

const botonSuma = document.getElementById('buttonSuma');
botonSuma.onclick = () => {
    console.log('aki suma');

    ingresa();

    document.getElementById('textSuma').value = '';
    document.getElementById('textSuma').focus();
}

document.getElementById('textSuma').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        
        event.preventDefault();
        ingresa();
        document.getElementById('textSuma').value = '';
    }
});


function SetSubtotal(monto) {
    let sub = document.getElementById('badge').innerText;
    let suma = parseFloat(sub) + monto;
    document.getElementById('badge').innerText = suma;
}

function ingresa() {


    let op = valorRadio;
    montoSumando = parseFloat(document.getElementById('textSuma').value);

    if (!isNaN(montoSumando)) {

        while (op != '') {
            switch (op) {
                case 'flexRadioEfectivo':
                    let efect = parseFloat(montoSumando);
                    sumaTotal(efect);
                    efectivo += efect;
                    agregaMontos(['Efectivo', efect])

                    SetSubtotal(montoSumando)

                    break;
                case 'flexRadioDebito':
                    let debi = parseFloat(montoSumando)
                    sumaTotal(debi);
                    debito += debi;
                    agregaMontos(['Débito', debi])
                    SetSubtotal(montoSumando)
                    break;
                case 'flexRadioCredito':
                    let credi = parseFloat(montoSumando);
                    sumaTotal(credi);
                    credito += credi;
                    agregaMontos(['Crédito', credi]);
                    SetSubtotal(montoSumando)
                    break;
                case 'flexRadioCheque':
                    let chec = parseFloat(montoSumando);
                    sumaTotal(chec);
                    cheque += chec;
                    agregaMontos(['Cheque', chec]);
                    SetSubtotal(montoSumando)
                    break;
                default:
                    alert('Opcion no valida..🤷🏻‍♂️');
                    break
            }
            op = '';
        }

        let paso = devuelveMiles(String(total));
        document.getElementById('total').innerText = mTotal + paso;
    }
}

function agregaMontos(detalle) {
    registro.push(detalle);
    console.table(registro);

    tablaBody.innerHTML += `
        <tr id="5555">
            <td>${registro.indexOf(detalle) + 1}</td>
            <td>${detalle[0]}</td>
            <td>${detalle[1]}</td>
            <td><button type="button" class="btn btn-outline-danger btnELim">❌</button></td>
        </tr>
    `;

    
    guardarEnLocalStorage(detalle[0], detalle[1]);
}

function guardarEnLocalStorage(detalle, monto) {
    const detalles = { detalle, monto };
    montosGuardados.push(detalles);
    localStorage.setItem('detalles', JSON.stringify(montosGuardados));
}



// limpia el strorage y recarga la pagina
const btnLimpiar = document.getElementById('limpiar');
btnLimpiar.onclick = () => {
    localStorage.clear();
    location.reload(true);
}

const btnElimina = document.querySelectorAll('.btnELim');
btnElimina.forEach(boton => {
    boton.addEventListener('click', (e) => {

        console.log('aki', btnElimina.values)

        const fila = e.target.closest('tr');
        const id = fila.dataset.id;

        const indiceBuscado = id - 1; 

        const objetosGuardados = JSON.parse(localStorage.getItem('detalles')) || [];
        console.log(indiceBuscado);
        if (indiceBuscado >= 0 && indiceBuscado < objetosGuardados.length) {
            objetosGuardados.splice(indiceBuscado, 1); // Eliminar el registro del arreglo
            localStorage.setItem('detalles', JSON.stringify(objetosGuardados));
            console.log('Registro eliminado.');
        } else {
            console.log('Índice fuera de rango o no encontrado.');
        }
        actualizarTabla();

        Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Monto Eliminado',
            showConfirmButton: false,
            timer: 1200
        })
    
        setTimeout(function() {
            location.reload(true);
        }, 1300);
        
    });
});

const btnAcepta = document.getElementById('acepta');
btnAcepta.onclick  = () => {

    let subTotal = document.getElementById('badge').value;
    
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Monto agregado',
        showConfirmButton: false,
        timer: 2000
    })

    setTimeout(function() {
        location.reload(true);
    }, 2200);

    
}

const miModal = new bootstrap.Modal(document.getElementById('exampleModalToggle2'));
miModal._element.addEventListener('shown.bs.modal', function (event) {
    console.log('Modal abierto');
    let textoFocus = document.getElementById('textSuma');
    textoFocus.focus();
});

const miModalNuevoMonto = new bootstrap.Modal(document.getElementById('modalNombre'));
miModalNuevoMonto._element.addEventListener('shown.bs.modal', function (event) {
    console.log('Modal abierto');
    let textoFocus = document.getElementById('floatingTextareaNombre');
    textoFocus.focus();
});