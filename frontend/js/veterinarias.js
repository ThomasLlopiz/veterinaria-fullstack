const listaVeterinarias = document.getElementById("lista-veterinarias");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const documento = document.getElementById("documento");
const indice = document.getElementById("indice");
const form = document.getElementById("form");
const exampleModal = document.getElementById("exampleModal");
const btnGuardar = document.getElementById("btn-guardar");
const alert = document.getElementById("alert");
const url = "http://localhost:5000/veterinarias";
let veterinarias = [];

async function listarVeterinarias() {
    try {
        const respuesta = await fetch(url);
        const veterinariasDelServer = await respuesta.json();
        if (Array.isArray(veterinariasDelServer)) {
            veterinarias = veterinariasDelServer;
        }
        if (veterinarias.length > 0) {
            const htmlVeterinarias = veterinarias
                .map((veterinaria, index) => `
            <tr>
            <th scope="row">${index}</th>
            <td>${veterinaria.nombre}</td>
            <td>${veterinaria.apellido}</td>
            <td>${veterinaria.documento}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-info editar" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn btn-danger eliminar"><i class="far fa-trash-alt"></i></button>
                </div>
            </td>
            </tr>
            `).join("");
            listaVeterinarias.innerHTML = htmlVeterinarias;
            Array.from(document.getElementsByClassName("editar")).forEach((bontonEditar, index) => bontonEditar.onclick = editar(index));
            Array.from(document.getElementsByClassName("eliminar")).forEach((bontonEliminar, index) => bontonEliminar.onclick = eliminar(index));
            return;
        }
        listaVeterinarias.innerHTML = `<tr>
                                        <td colspan="5">No hay veterinarias</td>
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
        let method = "POST";
        let urlEnvio = url;
        const accion = btnGuardar.innerHTML;
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
        });
        if (respuesta.ok) {
            listarVeterinarias();
            resetModal();
        }
    } catch (error) {
        console.log({ error });
        $(alert).show();
    }
}

function editar(index) {
    return function cuandoHagoClick() {
        btnGuardar.innerHTML = "Editar"
        const veterinaria = veterinarias[index];
        documento.value = veterinaria.documento;
        nombre.value = veterinaria.nombre;
        apellido.value = veterinaria.apellido;
        indice.value = index;
    }
}

function resetModal() {
    documento.value = "";
    nombre.value = "";
    apellido.value = "";
    indice.value = "";
    btnGuardar.innerHTML = "Crear"
}

function eliminar(index) {
    try {
        const urlEnvio = `${url}/${index}`;
        return async function clicklEnEliminar() {
            const respuesta = await fetch(urlEnvio, {
                method: "DELETE",
            });
            if (respuesta.ok) {
                listarVeterinarias();
                resetModal();
            }
            listarVeterinarias();
        }
    }
    catch (error) {
        console.log({ error });
        $(alert).show();
    }
};

listarVeterinarias();
form.onsubmit = enviarDatos;
btnGuardar.onclick = enviarDatos;