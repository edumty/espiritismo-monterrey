// Scroll suave en navegación
document.querySelectorAll('nav a').forEach(enlace => {
  enlace.addEventListener('click', function(e) {
    const destino = document.querySelector(this.getAttribute('href'));
    if (destino) {
      e.preventDefault();
      destino.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Botón de modo oscuro
const toggleButton = document.getElementById('toggle-dark');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggleButton.textContent = document.body.classList.contains('dark-mode')
    ? '☀️ Desactivar modo oscuro'
    : '🌙 Activar modo oscuro';
});

// Firebase configuración
const firebaseConfig = {
  apiKey: "AIzaSyAP5oDPamyQoMD--F-dSY7TTT4x-Ys-o_s",
  authDomain: "foro-espiritual.firebaseapp.com",
  databaseURL: "https://foro-espiritual-default-rtdb.firebaseio.com",
  projectId: "foro-espiritual",
  storageBucket: "foro-espiritual.firebasestorage.app",
  messagingSenderId: "768751154089",
  appId: "1:768751154089:web:dbb23e5625496fd9568ab8"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let modoAdmin = false;

// Activar modo administrador
function activarAdmin() {
  const clave = document.getElementById('clave-admin').value.trim();
  if (clave === 'monterrey2025') {
    modoAdmin = true;
    alert('Modo administrador activado');
    mostrarBotonesEliminar();
  } else {
    alert('Clave incorrecta');
  }
}

// Mostrar campo de clave con Ctrl + M
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key.toLowerCase() === 'm') {
    document.getElementById('admin-acceso').style.display = 'block';
  }
});

// Enviar pregunta al foro
const formulario = document.getElementById('formulario-foro');
const lista = document.getElementById('lista-preguntas');

formulario.addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim() || 'Anónimo';
  const pregunta = document.getElementById('pregunta').value.trim();
  if (pregunta === '') return;

  const nuevaPregunta = db.ref('preguntas').push();
  nuevaPregunta.set({
    nombre: nombre,
    pregunta: pregunta,
    fecha: new Date().toISOString()
  });

  formulario.reset();
});

// Mostrar preguntas en tiempo real
db.ref('preguntas').on('child_added', function(snapshot) {
  const datos = snapshot.val();
  const li = document.createElement('li');
  li.innerHTML = `<strong>${datos.nombre} pregunta:</strong><br>${datos.pregunta}`;
  li.setAttribute('data-key', snapshot.key);
  lista.appendChild(li);
  if (modoAdmin) mostrarBotonesEliminar();
});

// Mostrar botones de eliminar si modoAdmin está activo
function mostrarBotonesEliminar() {
  document.querySelectorAll('#lista-preguntas li').forEach(li => {
    const key = li.getAttribute('data-key');
    if (!li.querySelector('.boton-eliminar')) {
      const boton = document.createElement('button');
      boton.textContent = '✖';
      boton.className = 'boton-eliminar';
      boton.onclick = function() {
        db.ref('preguntas/' + key).remove();
        li.remove();
      };
      li.appendChild(boton);
    }
  });
}
