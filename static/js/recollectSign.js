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
  //Click en submit
  $('#enviar-btn').click(function(e) {
    e.preventDefault(); // Prevenir que el formulario se envíe automáticamente

    // Obtener el valor seleccionado del elemento <select>
    const letterSign = $('#letterSign').val();

    // Enviar una solicitud Fetch al backend
    fetch('/procesar', {
      method: 'POST',
      body: JSON.stringify({ 'letterSign': letterSign }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
    .then(response => response.json())
    .then(data => {
      //Respuesta del servidor
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    });
  });
});