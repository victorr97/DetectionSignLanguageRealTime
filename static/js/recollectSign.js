document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById("letterSign");


    //click on the item when the box is closed. (sign language letter)
    selectElement.addEventListener('focus', () => {
        selectElement.size = 5;
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
        selectElement.style.backgroundColor = '#FFF';

        if (checkLetter()){
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
        }
    });

    let buttonSave = document.getElementById('save');
    buttonSave.addEventListener('click', ()=>{
        const letterSign = selectElement.value;
        //Si hay letra compruebo si la persona esta bien posicionado
        if (checkLetter()){
            console.log("HAY LETRA")
            // Enviar una solicitud Fetch al backend
            fetch('/checkPerson', {
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
                if (data.mensaje === "True"){
                    console.log("Hay persona")
                } else {
                    console.log("No hay persona")
                }
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            console.log("NO HAY LETRA SELECCIONADA")
        }
        //checkPositionHuman()
    });

    function checkLetter(){
        if(selectElement.value !== "messageSelect"){
            return true
        }
    }

});

