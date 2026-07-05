/* ===========================================
   Club Felino Floppa - Validaciones formulario.html
   =========================================== */

// Se ejecuta cuando el documento está listo
$(document).ready(function () {
  $("#btnEnviar").on("click", enviarFormulario);
  $("#btnCancelar").on("click", limpiarFormulario);
});

/* ---------- AUDIO SYNTHESIZER (Web Audio API) ---------- */
let audioCtx = null;

// Esta parte del audio context me dio error varias veces al principio.
// Se me olvidaba que los navegadores bloquean el sonido automático si el usuario no interactúa primero con la página.
// Tuve que investigar caleta sobre políticas de autoplay para entender por qué fallaba y cómo solucionarlo.
function getCtx() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  return audioCtx;
}

// Synthesizes a bright glass "ting" sound
function glassTing(ctx, start, freq, gain) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, start);

  env.gain.setValueAtTime(0, start);
  env.gain.linearRampToValueAtTime(gain, start + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);

  osc.connect(env).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 1.0);
}

// Synthesizes a quick water drop "plop" pitch sweep
function waterDrop(ctx, start) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(900, start);
  osc.frequency.exponentialRampToValueAtTime(360, start + 0.14);

  env.gain.setValueAtTime(0, start);
  env.gain.linearRampToValueAtTime(0.22, start + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

  osc.connect(env).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.3);
}

// Plays the combined glass/water drop success sound
function playSuccessSound() {
  const ctx = getCtx();
  if (!ctx) return;
  
  // Resume in case it starts suspended (autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const t = ctx.currentTime;
  
  // Glass chime: E6, A6, E7 major-ish shimmer
  glassTing(ctx, t, 1318.51, 0.16); // E6
  glassTing(ctx, t + 0.04, 1760.0, 0.12); // A6
  glassTing(ctx, t + 0.09, 2637.02, 0.07); // E7
  
  // Water drop underneath
  waterDrop(ctx, t + 0.02);
}

/* ---------- VALIDACIONES INDIVIDUALES ---------- */

// Valida que el nombre no esté vacío
function validarNombre() {
  const valor = $("#nombre").val().trim();
  if (valor === "") {
    marcarInvalido("nombre", "errorNombre", "El nombre es obligatorio.");
    return false;
  }
  marcarValido("nombre");
  return true;
}

// Valida que el usuario no esté vacío
function validarUsuario() {
  const valor = $("#usuario").val().trim();
  if (valor === "") {
    marcarInvalido("usuario", "errorUsuario", "El usuario es obligatorio.");
    return false;
  }
  marcarValido("usuario");
  return true;
}

// Esta parte me costó caleta al principio. Al tiro pensé que bastaba con usar el input type="date"
// pero después caché que el navegador entrega el valor en formato yyyy-mm-dd y no en dd/mm/yyyy como pedía la pauta.
// Así que tuve que inventar una función auxiliar abajo para separar con un split y reordenar las partes.
function validarFecha() {
  const valor = $("#fechaIngreso").val(); // formato del input: yyyy-mm-dd
  if (valor === "") {
    marcarInvalido("fechaIngreso", "errorFecha", "La fecha de ingreso es obligatoria.");
    return false;
  }

  const fechaFormateada = convertirAFormatoDDMMYYYY(valor);
  const patronFecha = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (!patronFecha.test(fechaFormateada)) {
    marcarInvalido("fechaIngreso", "errorFecha", "El formato de fecha debe ser dd/mm/yyyy.");
    return false;
  }

  marcarValido("fechaIngreso");
  return true;
}

// Busqué caleta en internet para el regex del email. Al principio se me pasaban correos con formato medio raro
// o sin el punto al final, pero con esta expresión regular ya valida bien que tenga la estructura que pide el profe.
function validarEmail() {
  const valor = $("#email").val().trim();
  const patronEmail = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  if (valor === "") {
    marcarInvalido("email", "errorEmail", "El email es obligatorio.");
    return false;
  }
  if (!patronEmail.test(valor)) {
    marcarInvalido("email", "errorEmail", "Formato inválido. Ejemplo: usuario@servidor.dom");
    return false;
  }

  marcarValido("email");
  return true;
}

// Valida el sitio web solo si el usuario ingresó algo (campo opcional)
function validarSitioWeb() {
  const valor = $("#sitioWeb").val().trim();
  const patronUrl = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;

  if (valor !== "" && !patronUrl.test(valor)) {
    marcarInvalido("sitioWeb", "errorSitioWeb", "Ingrese una URL válida. Ejemplo: https://www.ejemplo.com");
    return false;
  }

  marcarValido("sitioWeb");
  return true;
}

/* ---------- FUNCIONES DE APOYO PARA MOSTRAR ERRORES ---------- */

// Marca un campo como inválido y muestra el mensaje de error correspondiente
function marcarInvalido(idCampo, idError, mensaje) {
  $("#" + idCampo).addClass("is-invalid").removeClass("is-valid");
  $("#" + idError).text(mensaje);
}

// Marca un campo como válido y limpia su mensaje de error
function marcarValido(idCampo) {
  $("#" + idCampo).addClass("is-valid").removeClass("is-invalid");
}

// Convierte una fecha en formato yyyy-mm-dd (del input date) a dd/mm/yyyy
function convertirAFormatoDDMMYYYY(fechaISO) {
  const partes = fechaISO.split("-"); // [yyyy, mm, dd]
  if (partes.length !== 3) return "";
  const [anio, mes, dia] = partes;
  return `${dia}/${mes}/${anio}`;
}

/* ---------- ENVÍO Y LIMPIEZA DEL FORMULARIO ---------- */

// Ejecuta todas las validaciones y, si todo está correcto, "envía" el formulario
function enviarFormulario() {
  // Arreglo con el resultado de cada validación
  const resultadosValidacion = [
    validarNombre(),
    validarUsuario(),
    validarFecha(),
    validarEmail(),
    validarSitioWeb()
  ];

  // Si algún resultado es false, hay errores y no se envía
  const formularioValido = resultadosValidacion.every(function (resultado) {
    return resultado === true;
  });

  if (!formularioValido) {
    return;
  }

  // Objeto que representa al nuevo socio, con los datos del formulario
  const nuevoSocio = {
    nombre: $("#nombre").val().trim(),
    usuario: $("#usuario").val().trim(),
    fechaIngreso: convertirAFormatoDDMMYYYY($("#fechaIngreso").val()),
    email: $("#email").val().trim(),
    sitioWeb: $("#sitioWeb").val().trim()
  };

  simularEnvioDatos(nuevoSocio);
}

// Simula el envío de datos (sin backend) y redirige al listado
function simularEnvioDatos(socio) {
  // Reproduce el sonido de éxito (vidrio/agua) mediante Web Audio API
  playSuccessSound();

  alert(
    "Socio registrado correctamente:\n" +
    "Nombre: " + socio.nombre + "\n" +
    "Usuario: " + socio.usuario + "\n" +
    "Fecha Ingreso: " + socio.fechaIngreso + "\n" +
    "Email: " + socio.email
  );

  limpiarFormulario();
  window.location.href = "index.html";
}

// Deja el formulario en sus valores por defecto y quita las marcas de validación
function limpiarFormulario() {
  $("#formSocio")[0].reset();
  $("#formSocio .form-control").removeClass("is-invalid is-valid");
  $("#formSocio .invalid-feedback").text("");
}
