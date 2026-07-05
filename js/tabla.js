/* ===========================================
   Club Felino Floppa - Carga de socios en tabla
   Los datos se obtienen desde jsonplaceholder.com
   y se simulan como "socios" del club.
   =========================================== */

// Se ejecuta cuando el documento está listo
$(document).ready(function () {
  iniciarTablaSocios();
});

// Inicializa la DataTable con los datos obtenidos desde la API
function iniciarTablaSocios() {
  $("#tablaSocios").DataTable({
    ajax: {
      url: "https://jsonplaceholder.typicode.com/users",
      dataSrc: function (json) {
        // json es un arreglo de objetos (usuarios)
        // se transforma cada objeto en el formato que necesita la tabla
        return json.map(transformarUsuarioASocio);
      }
    },
    columns: [
      { data: "id" },
      { data: "nombre" },
      { data: "usuario" },
      { data: "email" },
      { data: "sitioWeb" },
      { data: "ciudad" }
    ],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.8/i18n/es-ES.json"
    }
  });
}

// Acá transformo el formato de los datos que entrega JSONPlaceholder para que coincida con las columnas.
// Tuve que mapear la ciudad (address.city) porque venía dentro de un objeto anidado y la datatable se mareaba si la ponía directo.
function transformarUsuarioASocio(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.name,
    usuario: usuario.username,
    email: usuario.email,
    sitioWeb: usuario.website,
    ciudad: usuario.address.city
  };
}
