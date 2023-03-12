document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById("letterSign");
    const textErrorMessage = document.getElementById("textErrorMessage");
    const popup = document.getElementById("popupSaveData");

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
        textErrorMessage.style.display = "none"

        if (checkLetter()){
            e.preventDefault(); // Prevent the form from being sent automatically

            // User-selected letter
            const letterSign = selectElement.value;
            //TODO: MOSTRAR IMAGEN DE COMO SE HACE LA LETRA SELECCIONADA

            // Envio la letra seleccionada con solicitud Fetch al backend
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
            // Enviar una solicitud Fetch al backend para comprobar si la persona esta en la camara
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
                    textErrorMessage.style.display = "none"
                    popup.style.display = 'block';
                    //Cuenta 3 segundos
                    countdown3Seconds(4);

                } else {
                    textErrorMessage.style.display = "block"
                    textErrorMessage.innerHTML = "Por favor, colócate frente a la cámara y asegúrate <br> de que tus manos estén en la posición correcta antes de continuar.";
                }
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            textErrorMessage.style.display = "block";
            textErrorMessage.innerHTML = "Parece que no has seleccionado ninguna letra. <br> Por favor, selecciona una letra antes de continuar.";
        }
    });

    function checkLetter(){
        if(selectElement.value !== "messageSelect"){
            return true
        }
    }

    function countdown3Seconds(seconds) {
        const countDownDate = new Date().getTime() + seconds * 1000;

        // Actualiza contador cada 1seg
        const x = setInterval(function () {
            const now = new Date().getTime();
            let distance = countDownDate - now;

            //  Cálculo del tiempo segundos
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            console.log(seconds)
            document.getElementById("countDown").innerHTML = seconds.toString();

            if (distance < 0) {
                clearInterval(x);
                document.getElementById("countDown").innerHTML = "0";
                const messageSaveData = document.getElementById("messageSaveData");
                messageSaveData.style.display = "block"
                setSaveDataInBackend()
            }
        }, 1000);
    }

    function setSaveDataInBackend(){
        fetch('/goSave', {
            method: 'POST',
            body: JSON.stringify({ 'startSaveData': "True" }),
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

