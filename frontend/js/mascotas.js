const listaMascotas = document.getElementById("lista-mascotas");
const tipo = document.getElementById("tipo");
const nombre = document.getElementById("nombre");
const dueno = document.getElementById("dueno");
const indice = document.getElementById("indice");
const form = document.getElementById("form");
const exampleModal = document.getElementById("exampleModal");
const btnGuardar = document.getElementById("btn-guardar");
const alert = document.getElementById("alert");
const url = "http://localhost:5000/mascotas";
let mascotas = [];

async function listarMascotas() {
    try {
        const respuesta = await fetch(url);
        const mascotasDelServer = await respuesta.json();
        if (Array.isArray(mascotasDelServer)) {
            mascotas = mascotasDelServer;
        }
        if (mascotas.length > 0) {
            const htmlMascotas = mascotas
                .map((mascota, index) => `
                <tr>
                <th scope="row">${index}</th>
                <td>${mascota.tipo}</td>
                <td>${mascota.nombre}</td>
                <td>${mascota.dueno}</td>
                <td>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-info editar" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fas fa-edit"></i></button>
                        <button type="button" class="btn btn-danger eliminar"><i class="far fa-trash-alt"></i></button>
                    </div>
                </td>
                </tr>
                `).join("");
            listaMascotas.innerHTML = htmlMascotas;
            Array.from(document.getElementsByClassName("editar")).forEach((bontonEditar, index) => bontonEditar.onclick = editar(index));
            Array.from(document.getElementsByClassName("eliminar")).forEach((bontonEliminar, index) => bontonEliminar.onclick = eliminar(index)
            );
            return;
        }
        listaMascotas.innerHTML =`<tr>
                                    <td colspan="5">No hay mascotas</td>
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
            tipo: tipo.value,
            nombre: nombre.value,
            dueno: dueno.value
        };
        let method = "POST";
        let urlEnvio = url;
        const accion = btnGuardar.innerHTML;
        if (accion === "Editar") {
            method = "PUT";
            mascotas[indice.value] = datos;
            urlEnvio = `${url}/${indice.value}`;
        }
        const respuesta = await fetch(urlEnvio, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
        })
        if (respuesta.ok) {
            listarMascotas();
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
        const mascota = mascotas[index];
        tipo.value = mascota.tipo;
        nombre.value = mascota.nombre;
        dueno.value = mascota.dueno;
        indice.value = index;
    }
}

function resetModal() {
    tipo.value = "";
    nombre.value = "";
    dueno.value = "";
    indice.value = "";
    btnGuardar.innerHTML = "Crear"
}

function eliminar(index) {
    try {
        const urlEnvio = `${url}/${index}`;
        return async function clickEnEliminar() {
            const respuesta = await fetch(urlEnvio, {
                method: "DELETE"
            });
            if (respuesta.ok) {
                listarMascotas();
                resetModal();
            }
            listarMascotas();
        }
    } catch (error) {
        console.log({ error });
        $(alert).show();
    }
};

listarMascotas();
form.onsubmit = enviarDatos;
btnGuardar.onclick = enviarDatos;