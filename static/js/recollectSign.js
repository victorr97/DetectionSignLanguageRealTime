document.addEventListener('DOMContentLoaded', function() {
    let selectElement = document.querySelector('select');

    //click on the item when the box is closed. (sign language letter)
    selectElement.addEventListener('focus', () => {
      selectElement.size = 5;
      selectElement.classList.add('fadeIn');
      selectElement.classList.remove('fadeOut');
      selectElement.style.backgroundColor = '#FFF';
    });

    //When you mouse over an item
    selectElement.addEventListener('mouseover', () => {
      if(selectElement.size === 1){
         selectElement.style.backgroundColor = 'rgb(247, 247, 247)';
      }
    });

    //When mousing out of an item
    selectElement.addEventListener('mouseout', () => {
      if(selectElement.size === 1){
         selectElement.style.backgroundColor = '#FFF';
      }
    });

    // When you click on an item after displaying it
    selectElement.addEventListener('change', function(e) {
        selectElement.size = 1;
        selectElement.blur();
        selectElement.classList.add('fadeOut');
        selectElement.classList.remove('fadeIn');
        selectElement.style.backgroundColor = '#FFF';

        e.preventDefault(); // Prevent the form from being sent automatically

        // User-selected letter
        const letterSign = selectElement.value;

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