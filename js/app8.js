// *** Variables ***
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

// *** Listeners ***
document.addEventListener("DOMContentLoaded", () => {
  // NUEVA FUNCIONALIDAD
  // Cargar el carrito desde LocalStorage al cargar la página
  articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carritoHTML();
});

// *** Añadimos la funcionalidad de búsqueda ***

const buscador = document.querySelector("#buscador");
buscador.addEventListener("input", buscarCurso);

function buscarCurso(e) {
  const texto = e.target.value.toLowerCase();
  const cursos = document.querySelectorAll(".card");
  
  cursos.forEach((curso) => {
    const titulo = curso.querySelector("h4").textContent.toLowerCase();
    if (titulo.includes(texto)) {
      curso.style.display = "block";
    } else {
      curso.style.display = "none";
    }
  });
}


// Añadimos la función de animación al icono del carrito
function animarCarrito() {
  const carritoIcono = document.querySelector("#img-carrito");
  carritoIcono.classList.add("agregar-animacion");

  // Quitamos la clase de animación después de 300 ms para que pueda repetirse
  setTimeout(() => carritoIcono.classList.remove("agregar-animacion"), 300);
}

cargarEventListeners();
function cargarEventListeners() {
  listaCursos.addEventListener("click", añadirCurso);
  carrito.addEventListener("click", eliminarCurso);

  // Vaciar el carrito
  vaciarCarritoBtn.addEventListener("click", () => {
    articulosCarrito = []; // Vaciar el array
    sincronizarStorage(); // Limpiar LocalStorage
    limpiarHTML(); // Limpiar el HTML
  });
}

// *** Funciones ***

// Función para añadir cursos al carrito
function añadirCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
    const curso = e.target.parentElement.parentElement;
    leerDatosCurso(curso);
    animarCarrito(); // Llamada a la animación cuando se añade un curso
  }
}

// Función para eliminar un curso del carrito
function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");
    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);
    carritoHTML(); // Actualizar el HTML
    sincronizarStorage(); // Guardar el cambio en LocalStorage
  }
}

// Lee la información del curso seleccionado.
function leerDatosCurso(curso) {
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  // Comprobamos si el curso ya está en el carrito
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  if (existe) {
    // Aumentar la cantidad si el curso ya existe
    articulosCarrito = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
      }
      return curso;
    });
  } else {
    // Agregar el curso al carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }
  carritoHTML(); // Actualizar el HTML
  sincronizarStorage(); // Guardar en LocalStorage
}

// Muestra el carrito de compras en el HTML
function carritoHTML() {
  limpiarHTML();
  articulosCarrito.forEach((curso) => {
    const { imagen, titulo, precio, cantidad, id } = curso;
    const row = document.createElement("tr");
    row.innerHTML = `
            <td> 
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
            `;
    contenedorCarrito.appendChild(row);
  });
}

// Guardar el carrito en LocalStorage
function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

// Función para limpiar el HTML (elimina los cursos del tbody)
function limpiarHTML() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.firstChild.remove();
  }
}
