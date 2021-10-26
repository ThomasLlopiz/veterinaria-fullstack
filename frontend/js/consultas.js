const listaConsultas = document.getElementById("lista-consultas");
const mascota = document.getElementById("mascota");
const veterinaria = document.getElementById("veterinaria");
const btnGuardar = document.getElementById("btn-guardar");
const indice = document.getElementById("indice");
const historia = document.getElementById("historia");
const diagnostico = document.getElementById("diagnostico");
const alert = document.getElementById("alert");
const alertWarning = document.getElementById("alertWarning");
const modal = document.getElementsByClassName('modal');
const url = "http://localhost:5000";
let consultas = [];
let mascotas = [];
let veterinarias = [];

async function listarConsultas() {
    const entidad = "consultas"
    try {
        const respuesta = await fetch(`${url}/${entidad}`);
        const consultasDelServidor = await respuesta.json();
        if (Array.isArray(consultasDelServidor)) {
            consultas = consultasDelServidor;
        }
        if (respuesta.ok) {
            const htmlConsultas = consultas
                .map((consulta, indice) =>
                    `<tr>
                <th scope="row">${indice}</th>
                <td>${consulta.mascota.nombre}</td>
                <td>${consulta.veterinaria.nombre} ${consulta.veterinaria.apellido}</td>
                <td>${consulta.historia}</td>
                <td>${consulta.diagnostico}</td>
                <td>${consulta.fechaCreacion}</td>
                <td>${consulta.fechaEdicion}</td>
                <td>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-info editar" data-bs-toggle="modal" data-bs-target="#exampleModal" ><i class="fas fa-edit"></i></button>
                    </div>
                </td>
            </tr>`).join("");
            listaConsultas.innerHTML = htmlConsultas;
            Array.from(document.getElementsByClassName("editar")).forEach((bontonEditar, index) => bontonEditar.onclick = editar(index));
        }
    } catch (error) {
        console.log({ error });
        $(alert).show();
    }
}

async function listarMascotas() {
    const entidad = "mascotas"
    try {
        const respuesta = await fetch(`${url}/${entidad}`);
        const mascotasDelServidor = await respuesta.json();
        if (Array.isArray(mascotasDelServidor)) {
            mascotas = mascotasDelServidor;
        }
        if (respuesta.ok) {
            const htmlMascotas = mascotas
                .forEach((_mascota, indice) => {
                    const optionActual = document.createElement("option");
                    optionActual.innerHTML = _mascota.nombre;
                    optionActual.value = indice;
                    mascota.appendChild(optionActual);
                });
        }
    } catch (error) {
        console.log({ error });
        $(alert).show();
    }
}

async function listarVeterinarias() {
    const entidad = "veterinarias"
    try {
        const respuesta = await fetch(`${url}/${entidad}`);
        const veterinariasDelServidor = await respuesta.json();
        if (Array.isArray(veterinariasDelServidor)) {
            veterinarias = veterinariasDelServidor;
        }
        if (respuesta.ok) {
            const htmlVeterinarias = veterinarias
                .forEach((_veterinaria, indice) => {
                    const optionActual = document.createElement("option");
                    optionActual.innerHTML = `${_veterinaria.nombre} ${_veterinaria.apellido}`;
                    optionActual.value = indice;
                    veterinaria.appendChild(optionActual);
                });
        }
    } catch (error) {
        console.log({ error });
        $(alert).show();
    }
}

function editar(index) {
    return function cuandoHagoClick() {
        btnGuardar.innerHTML = "Editar"
        const consulta = consultas[index];
        indice.value = index;
        mascota.value = consulta.mascota.id;
        veterinaria.value = consulta.veterinaria.id;
        historia.value = consulta.historia;
        diagnostico.value = consulta.diagnostico;
    };
}

async function enviarDatos(e) {
    const entidad = "consultas";
    e.preventDefault();
    try {
        const datos = {
            mascota: mascota.value,
            veterinaria: veterinaria.value,
            historia: historia.value,
            diagnostico: diagnostico.value,
        };
        if (validar(datos) === true) {
            const accion = btnGuardar.innerHTML;
            let urlEnvio = `${url}/${entidad}`;
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
                listarConsultas();
                resetModal();
            }
            return;
        }
        $(alertWarning).show();
        //$("#exampleModal").modal("toggle")
        //$(modal).hide();
    } catch (error) {
        console.log({ error });
        $(alert).show();
    }
}

function resetModal() {
    btnGuardar.innerHTML = "Crear";
    [indice, mascota, veterinaria, historia, diagnostico].forEach(
        (inputActual) => {
            inputActual.value = "";
            inputActual.classList.remove("is-invalid");
            inputActual.classList.remove("is-valid");
        }
    );
    $(alertWarning).hide();
    //$("#exampleModal").modal("toggle")
    //$(modal).hide();
}

function validar(datos) {
    if (typeof datos !== "object") return false;
    let respuesta = true;
    for (let llave in datos) {
        if (datos[llave].length === 0) {
            document.getElementById(llave).classList.add("is-invalid");
            respuesta = false;
        } else {
            document.getElementById(llave).classList.remove("is-invalid");
            document.getElementById(llave).classList.add("is-valid");
        }
    }
    if (respuesta === true) $(alertWarning).hide();
    return respuesta;
}
btnGuardar.onclick = enviarDatos;
listarConsultas();
listarMascotas();
listarVeterinarias();