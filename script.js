document.addEventListener("DOMContentLoaded", () => {
    marcarMenuActivo();
    animarSecciones();
    saludoDinamico();
    iniciarLista();
    iniciarComentarios();

});

function marcarMenuActivo() {
    const actual = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("nav a").forEach(a => {
        if (a.getAttribute("href") === actual) a.classList.add("activo");
    });
}

function animarSecciones() {
    const secciones = document.querySelectorAll("main section");
    secciones.forEach(s => s.classList.add("oculto"));
    setTimeout(() => {
        secciones.forEach((s, i) => {
            setTimeout(() => s.classList.add("aparece"), i * 150);
        });
    }, 50);
}

function saludoDinamico() {
    const titulo = document.querySelector("h2");
    if (!titulo || !document.title.includes("Inicio")) return;
    const hora = new Date().getHours();
    let saludo = "Buenas noches";
    if (hora < 12) saludo = "Buenos días";
    else if (hora < 19) saludo = "Buenas tardes";
    const p = document.createElement("p");
    p.textContent = saludo + ", hoy es " + new Date().toLocaleDateString("es-GT", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
    titulo.insertAdjacentElement("afterend", p);
}

function iniciarLista() {
    const tabla = document.querySelector("table");
    if (!tabla) return;

    const tbody = tabla.querySelector("tbody");
    const filas = Array.from(tbody.querySelectorAll("tr"));

    const buscador = document.createElement("input");
    buscador.type = "text";
    buscador.id = "buscador";
    buscador.placeholder = "Buscar por título, género o año...";
    const contador = document.createElement("p");
    contador.id = "contador-resultados";
    tabla.before(buscador, contador);

    function filtrar() {
        const texto = buscador.value.toLowerCase().trim();
        let visibles = 0;
        filas.forEach(fila => {
            const coincide = fila.textContent.toLowerCase().includes(texto);
            fila.style.display = coincide ? "" : "none";
            if (coincide) visibles++;
        });
        contador.textContent = visibles + " de " + filas.length + " películas";
    }
    buscador.addEventListener("input", filtrar);
    filtrar();

    const encabezados = tabla.querySelectorAll("th");
    let asc = true;
    encabezados.forEach((th, col) => {
        th.classList.add("ordenable");
        th.title = "Clic para ordenar";
        th.addEventListener("click", () => {
            const ordenadas = Array.from(tbody.querySelectorAll("tr")).sort((a, b) => {
                const x = a.cells[col].textContent.trim();
                const y = b.cells[col].textContent.trim();
                const nx = parseFloat(x), ny = parseFloat(y);
                const cmp = (!isNaN(nx) && !isNaN(ny)) ? nx - ny : x.localeCompare(y, "es");
                return asc ? cmp : -cmp;
            });
            asc = !asc;
            ordenadas.forEach(f => tbody.appendChild(f));
        });
    });

    tbody.addEventListener("click", e => {
        const fila = e.target.closest("tr");
        if (!fila) return;
        tbody.querySelectorAll("tr").forEach(f => f.classList.remove("seleccionada"));
        fila.classList.add("seleccionada");
    });
}

function iniciarComentarios() {
    const form = document.querySelector(".comentarios form");
    if (!form) return;

    const usuario = document.getElementById("usuario");
    const comentario = document.getElementById("comentario");
    const MAX = 200;
    comentario.maxLength = MAX;

    const contador = document.createElement("div");
    contador.id = "contador-caracteres";
    contador.textContent = "0 / " + MAX;
    comentario.after(contador);

    const mensaje = document.createElement("div");
    mensaje.id = "mensaje-form";
    form.appendChild(mensaje);

    const lista = document.createElement("div");
    lista.id = "lista-comentarios";
    form.after(lista);

    comentario.addEventListener("input", () => {
        contador.textContent = comentario.value.length + " / " + MAX;
    });

    form.addEventListener("submit", e => {
        e.preventDefault();
        const nombre = usuario.value.trim();
        const texto = comentario.value.trim();

        if (nombre.length < 2 || texto.length < 5) {
            mensaje.textContent = "Escribe tu nombre y un comentario de al menos 5 letras.";
            mensaje.className = "error";
            return;
        }

        const div = document.createElement("div");
        div.className = "comentario";
        const hora = new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });
        const strong = document.createElement("strong");
        strong.textContent = nombre;
        const small = document.createElement("small");
        small.textContent = hora;
        const p = document.createElement("p");
        p.textContent = texto;   // textContent evita inyectar HTML
        div.append(strong, small, p);
        lista.prepend(div);

        form.reset();
        contador.textContent = "0 / " + MAX;
        mensaje.textContent = "¡Gracias por tu reseña!";
        mensaje.className = "ok";
        setTimeout(() => { mensaje.textContent = ""; }, 3000);
    });
}