const acceso = document.getElementById("acceso");
const panel = document.getElementById("panel");
const salir = document.getElementById("salir");
const mensaje = document.getElementById("mensaje");
const horario = document.getElementById("horario");
const formRecurso = document.getElementById("formRecurso");
let rol = "";
let recursos = [];

async function leerRespuesta(response) {
    const data = await response.json();
    if (!response.ok) {
        if (response.status === 401) mostrarAcceso();
        mensaje.textContent = data.message;
        return;
    }
    return data;
}

async function getData(url) {
    try {
        const response = await fetch(url, {
            headers: {Authorization: "Bearer " + localStorage.getItem("token")}
        });
        if (response.status === 401) {
            mostrarAcceso();
            return;
        }
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener los datos");
        }
        return await response.json();
    } catch (error) {
        mensaje.textContent = error.message;
    }
}

async function iniciarSesion(correo, contrasena) {
    try {
        const response = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({correo, contrasena})
        });
        const data = await response.json();
        console.log(data.message);
        if (!response.ok) {
            mensaje.textContent = data.message;
            return;
        }
        localStorage.setItem("token", data.token);
        return data;
    } catch {
        mensaje.textContent = "No se pudo conectar con el servidor.";
    }
}

async function registrarUsuario(usuario) {
    try {
        const response = await fetch("http://localhost:3000/api/users/create", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(usuario)
        });
        return await leerRespuesta(response);
    } catch {
        mensaje.textContent = "No se pudo conectar con el servidor.";
    }
}

async function cerrarSesion() {
    try {
        const response = await fetch("http://localhost:3000/api/users/logout", {
            method: "POST",
            headers: {Authorization: "Bearer " + localStorage.getItem("token")}
        });
        return await leerRespuesta(response);
    } catch {
        mensaje.textContent = "No se pudo conectar con el servidor.";
    }
}

async function eliminarRecurso(id) {
    try {
        const response = await fetch("http://localhost:3000/api/recurso/delete/" + id, {
            method: "DELETE",
            headers: {Authorization: "Bearer " + localStorage.getItem("token")}
        });
        return await leerRespuesta(response);
    } catch {
        mensaje.textContent = "No se pudo conectar con el servidor.";
    }
}

async function crearReserva(reserva) {
    try {
        const response = await fetch("http://localhost:3000/api/reserva/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(reserva)
        });
        return await leerRespuesta(response);
    } catch {
        mensaje.textContent = "No se pudo conectar con el servidor.";
    }
}

async function actualizarRecurso(id, recurso) {
    try {
        const response = await fetch("http://localhost:3000/api/recurso/update/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(recurso)
        });
        return await leerRespuesta(response);
    } catch {
        mensaje.textContent = "No se pudo conectar con el servidor.";
    }
}

async function crearRecurso(recurso) {
    try {
        const response = await fetch("http://localhost:3000/api/recurso/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(recurso)
        });
        return await leerRespuesta(response);
    } catch {
        mensaje.textContent = "No se pudo conectar con el servidor.";
    }
}

async function actualizarReserva(id, estado) {
    try {
        const response = await fetch("http://localhost:3000/api/reserva/update/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({estado})
        });
        return await leerRespuesta(response);
    } catch {
        mensaje.textContent = "No se pudo conectar con el servidor.";
    }
}

async function desactivarUsuario(id) {
    try {
        const response = await fetch("http://localhost:3000/api/users/delete/" + id, {
            method: "DELETE",
            headers: {Authorization: "Bearer " + localStorage.getItem("token")}
        });
        return await leerRespuesta(response);
    } catch {
        mensaje.textContent = "No se pudo conectar con el servidor.";
    }
}

function mostrarAcceso() {
    localStorage.removeItem("token");
    acceso.hidden = false;
    panel.hidden = true;
    salir.hidden = true;
    rol = "";
}

async function cargarSesion() {
    if (!localStorage.getItem("token")) {
        mostrarAcceso();
        return;
    }
    const usuario = await getData("http://localhost:3000/api/users/sesion");
    if (!usuario) return;
    rol = usuario.rol;
    acceso.hidden = true;
    panel.hidden = false;
    salir.hidden = false;
    document.querySelector('[data-vista="usuarios"]').hidden = rol !== "Administrador";
    document.querySelector('[data-vista="auditoria"]').hidden = rol !== "Administrador";
    document.getElementById("nuevo").hidden = rol !== "Administrador";
    formRecurso.hidden = true;
    horario.reset();
    await mostrarVista("recursos");
}

document.getElementById("login").onsubmit = async function(event) {
    event.preventDefault();
    const data = await iniciarSesion(this.elements.correo.value, this.elements.contrasena.value);
    if (data) {
        this.reset();
        await cargarSesion();
    }
};

document.getElementById("registro").onsubmit = async function(event) {
    event.preventDefault();
    const data = await registrarUsuario({
        nombre: this.elements.nombre.value,
        edad: this.elements.edad.value,
        correo: this.elements.correo.value,
        telefono: this.elements.telefono.value,
        contrasena: this.elements.contrasena.value
    });
    if (data) {
        document.querySelector("#login [name=correo]").value = this.elements.correo.value;
        this.reset();
        this.closest("details").open = false;
        mensaje.textContent = "Cuenta creada. Ya podés iniciar sesión.";
    }
};

salir.onclick = async function() {
    if (await cerrarSesion()) {
        mostrarAcceso();
        mensaje.textContent = "";
    }
};

async function mostrarVista(vista) {
    mensaje.textContent = "";
    document.querySelectorAll("#panel > section").forEach(section => section.hidden = section.id !== vista);
    document.querySelectorAll("nav button").forEach(button => {
        button.setAttribute("aria-current", button.dataset.vista === vista ? "page" : "false");
    });
    if (vista === "recursos") await cargarRecursos();
    if (vista === "reservas") await cargarReservas();
    if (vista === "usuarios") await cargarUsuarios();
    if (vista === "auditoria") await cargarAuditoria();
}

document.querySelectorAll("nav button").forEach(button => {
    button.onclick = () => mostrarVista(button.dataset.vista);
});

//Cada registro se muestra en una tarjeta. Los botones llaman a la ruta que corresponde
function crearTarjeta(lista, titulo, lineas) {
    const tarjeta = document.createElement("article");
    const nombre = document.createElement("h3");
    nombre.textContent = titulo;
    tarjeta.appendChild(nombre);
    lineas.forEach(linea => {
        const p = document.createElement("p");
        p.textContent = linea;
        tarjeta.appendChild(p);
    });
    const acciones = document.createElement("div");
    acciones.className = "acciones";
    tarjeta.appendChild(acciones);
    lista.appendChild(tarjeta);
    return acciones;
}

function agregarBoton(acciones, texto, funcion) {
    const boton = document.createElement("button");
    boton.textContent = texto;
    boton.onclick = funcion;
    acciones.appendChild(boton);
}

async function cargarRecursos(filtrar = false) {
    const lista = document.getElementById("listaRecursos");
    lista.replaceChildren();
    let data;
    if (filtrar) {
        const desde = horario.elements.fecha_inicio.value;
        const hasta = horario.elements.fecha_fin.value;
        data = await getData(`http://localhost:3000/api/recurso/disponibles?fecha_inicio=${desde}&fecha_fin=${hasta}`);
    } else {
        data = await getData("http://localhost:3000/api/recurso/all");
    }
    if (!data) return;
    if (!filtrar) recursos = data;
    if (!data.length) lista.textContent = "No se encontraron recursos.";
    data.forEach(recurso => {
        const acciones = crearTarjeta(lista, recurso.nombre, [recurso.estado, recurso.detalles || "Sin detalles"]);
        if (recurso.estado === "Disponible") agregarBoton(acciones, "Reservar", () => reservar(recurso));
        if (rol === "Administrador" || rol === "Editor") agregarBoton(acciones, "Editar", () => editarRecurso(recurso));
        if (rol === "Administrador") agregarBoton(acciones, "Eliminar", async () => {
            if (!confirm("¿Eliminar " + recurso.nombre + "?")) return;
            if (await eliminarRecurso(recurso.id)) await cargarRecursos();
        });
    });
}

horario.onsubmit = function(event) {
    event.preventDefault();
    cargarRecursos(true);
};

document.getElementById("verTodos").onclick = function() {
    horario.reset();
    cargarRecursos();
};

async function reservar(recurso) {
    if (!horario.reportValidity()) return;
    const datos = {
        id_recurso: recurso.id,
        fecha_inicio: horario.elements.fecha_inicio.value,
        fecha_fin: horario.elements.fecha_fin.value
    };
    if (await crearReserva(datos)) {
        await mostrarVista("reservas");
        mensaje.textContent = "Reserva creada para " + recurso.nombre + ".";
    }
}

function editarRecurso(recurso) {
    formRecurso.reset();
    formRecurso.hidden = false;
    formRecurso.dataset.id = recurso ? recurso.id : "";
    document.getElementById("tituloForm").textContent = recurso ? "Editar recurso" : "Nuevo recurso";
    if (recurso) {
        formRecurso.elements.nombre.value = recurso.nombre;
        formRecurso.elements.estado.value = recurso.estado;
        formRecurso.elements.detalles.value = recurso.detalles || "";
    }
    formRecurso.elements.nombre.focus();
}

document.getElementById("nuevo").onclick = () => editarRecurso();
document.getElementById("volver").onclick = () => formRecurso.hidden = true;
formRecurso.onsubmit = async function(event) {
    event.preventDefault();
    const id = this.dataset.id;
    const recurso = {
        nombre: this.elements.nombre.value,
        estado: this.elements.estado.value,
        detalles: this.elements.detalles.value
    };
    let resultado;
    if (id) {
        resultado = await actualizarRecurso(id, recurso);
    } else {
        resultado = await crearRecurso(recurso);
    }
    if (resultado) {
        this.hidden = true;
        await cargarRecursos();
        mensaje.textContent = "Recurso guardado.";
    }
};

function fecha(valor) {
    return new Date(valor).toLocaleString("es-UY", {dateStyle: "short", timeStyle: "short"});
}

async function cargarReservas() {
    const lista = document.getElementById("listaReservas");
    lista.replaceChildren();
    const data = await getData("http://localhost:3000/api/reserva/all");
    if (!data) return;
    if (!data.length) lista.textContent = "No se encontraron reservas.";
    data.forEach(reserva => {
        const recurso = recursos.find(item => item.id === reserva.id_recurso);
        const lineas = [reserva.estado, "Desde " + fecha(reserva.fecha_inicio), "Hasta " + fecha(reserva.fecha_fin)];
        if (rol === "Administrador") lineas.push("Usuario N.º " + reserva.id_usuario);
        const acciones = crearTarjeta(lista, recurso ? recurso.nombre : "Recurso N.º " + reserva.id_recurso, lineas);
        if (rol === "Administrador" && reserva.estado === "pendiente") {
            agregarBoton(acciones, "Aprobar", () => cambiarEstado(reserva.id, "aprobada"));
            agregarBoton(acciones, "Rechazar", () => cambiarEstado(reserva.id, "rechazada"));
        }
        if (reserva.estado === "pendiente" || reserva.estado === "aprobada") {
            agregarBoton(acciones, "Cancelar reserva", () => cambiarEstado(reserva.id, "cancelada"));
        }
    });
}

async function cambiarEstado(id, estado) {
    if (await actualizarReserva(id, estado)) await cargarReservas();
}

async function cargarUsuarios() {
    const lista = document.getElementById("listaUsuarios");
    lista.replaceChildren();
    const data = await getData("http://localhost:3000/api/users/all");
    if (!data) return;
    if (!data.length) lista.textContent = "No se encontraron usuarios.";
    data.forEach(usuario => {
        const acciones = crearTarjeta(lista, usuario.nombre, [usuario.correo, usuario.rol, usuario.estado ? "Activo" : "Inactivo"]);
        if (usuario.estado) agregarBoton(acciones, "Desactivar", async () => {
            if (!confirm("¿Desactivar a " + usuario.nombre + "?")) return;
            if (await desactivarUsuario(usuario.id)) await cargarUsuarios();
        });
    });
}

async function cargarAuditoria() {
    const lista = document.getElementById("listaAuditoria");
    lista.replaceChildren();
    const data = await getData("http://localhost:3000/api/auditoria/all");
    if (!data) return;
    if (!data.length) lista.textContent = "No hay movimientos registrados.";
    data.forEach(registro => {
        crearTarjeta(lista, registro.detalles, [fecha(registro.fecha), "Usuario N.º " + registro.id_usuario,
            registro.accion + " · " + registro.entidad + " N.º " + registro.id_entidad]);
    });
}

if (location.protocol === "file:") {
    location.replace("http://localhost:3000/");
} else {
    cargarSesion();
}
