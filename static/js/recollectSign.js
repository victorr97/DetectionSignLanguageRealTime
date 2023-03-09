/*// Obtener el elemento <select>
const selectElement = document.getElementById("sign");

// Agregar un evento de escucha para el evento "change"
selectElement.addEventListener("change", function() {
    // Obtener el valor seleccionado del elemento <select>
    const selectedValue = selectElement.value;

    // Hacer algo con el valor seleccionado
    console.log(selectedValue);
});*/

$(document).ready(function() {
  // Agregar un evento de escucha para el evento de clic del botón de envío
  $('#enviar-btn').click(function(e) {
    e.preventDefault(); // Prevenir que el formulario se envíe automáticamente

    // Obtener el valor seleccionado del elemento <select>
    const lenguajeSeleccionado = $('#lenguajes').val();

    // Enviar una solicitud AJAX al backend Flask
    $.ajax({
      type: 'POST',
      url: '/procesar',
      data: JSON.stringify({ 'lenguajeSeleccionado': lenguajeSeleccionado }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(respuesta) {
        // Manejar la respuesta del servidor aquí
        console.log(respuesta);
      },
      error: function(error) {
        // Manejar errores aquí
        console.log(error);
      }
    });
  });
});