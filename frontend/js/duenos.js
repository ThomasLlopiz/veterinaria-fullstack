const listaDuenos = document.getElementById('lista-duenos');
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const documento = document.getElementById('documento');
const indice = document.getElementById('indice');
const form = document.getElementById('form');
const exampleModal = document.getElementById('exampleModal');
const btnGuardar = document.getElementById('btn-guardar');
const alert = document.getElementById("alert");
const url = "http://localhost:5000/duenos";
let duenos = []

async function listarDuenos() {
    try {
        const respuesta = await fetch(url);
        const duenosDelServer = await respuesta.json();
        if (Array.isArray(duenosDelServer)) {
            duenos = duenosDelServer;
        }
        if (duenos.length > 0) {
            const htmlDuenos = duenos.map((dueno,index) => `
            <tr>
            <th scope="row">${index}</th>
            <td>${dueno.nombre}</td>
            <td>${dueno.apellido}</td>
            <td>${dueno.documento}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-info editar" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn btn-danger eliminar"><i class="far fa-trash-alt"></i></button>
                </div>
            </td>
            </tr>
            `).join('');
            listaDuenos.innerHTML = htmlDuenos;
            Array.from(document.getElementsByClassName('editar')).forEach((bontonEditar,index)=>bontonEditar.onclick = editar(index));
            Array.from(document.getElementsByClassName('eliminar')).forEach((bontonEliminar,index)=>bontonEliminar.onclick = eliminar(index));
            return;
        }
        listaDuenos.innerHTML = `<tr>
                                    <td colspan="5">No hay dueñ@s</td>
                                </tr>`;
    } catch (error) {
        console.log({ error });
        $(alert).show();
    }

}

async function enviarDatos(e) {
    e.preventDefault();
    try {
        const datos = {
            apellido: apellido.value,
            nombre: nombre.value,
            documento: documento.value
        };
        const accion = btnGuardar.innerHTML;
        let urlEnvio = url;
        let method = "POST";
        if (accion === "Editar") {
            method = "PUT";
            urlEnvio += `/${indice.value}`;
        }
        const respuesta = await fetch(urlEnvio, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
            mode: "cors",
        });
        if (respuesta.ok) {
            listarDuenos();
            resetModal();
        }
    } catch (error) {
        console.log({ error });
        $(alert).show();
    }
}

function editar(index){
    return function cuandoHagoClick(){
        btnGuardar.innerHTML = 'Editar'
        const dueno = duenos[index];
        documento.value = dueno.documento;
        nombre.value = dueno.nombre;
        apellido.value = dueno.apellido;
        indice.value = index;
    }
}

function resetModal(){
    indice.value = '';
    documento.value = '';
    nombre.value = '';
    apellido.value = '';
    btnGuardar.innerHTML = 'Crear'
}

function eliminar(index) {
    const urlEnvio = `${url}/${index}`;
    return async function clicklEnEliminar() {
        try {
            const respuesta = await fetch(urlEnvio, {
                method: "DELETE",
                mode: "cors",
            });
            if (respuesta.ok) {
                listarDuenos();
            }
        }
        catch (error) {
            console.log({ error });
            $(alert).show();
        }
    }
}

listarDuenos();
form.onsubmit = enviarDatos;
btnGuardar.onclick = enviarDatos;