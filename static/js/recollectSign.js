document.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.getElementById("letterSign");
    const textErrorMessage = document.getElementById("textErrorMessage");
    const popup = document.getElementById("popupSaveData");

    //click on the item when the box is closed. (sign language letter)
    selectElement.addEventListener('focus', () => {
        selectElement.size = 5;
    });

    //When you mouse over an item
    selectElement.addEventListener('mouseover', () => {
        if (selectElement.size === 1) {
            selectElement.style.backgroundColor = 'rgb(247, 247, 247)';
        }
    });

    //When mousing out of an item
    selectElement.addEventListener('mouseout', () => {
        if (selectElement.size === 1) {
            selectElement.style.backgroundColor = '#FFF';
        }
    });

    // When you click on an item after displaying it
    selectElement.addEventListener('change', function (e) {
        selectElement.size = 1;
        selectElement.blur();
        selectElement.style.backgroundColor = '#FFF';
        textErrorMessage.style.display = "none"

        //Compruebo que la letra sea correcta
        if (checkLetter()) {
            e.preventDefault();

            //Envio letra seleccionada por el usuario al backend
            procesarDatos(selectElement.value)
                .then(result => {
                    if (result === true) {
                        console.log("LETRA ENVIADA AL BACKEND")
                        //TODO: MOSTRAR IMAGEN DE COMO SE HACE LA LETRA SELECCIONADA
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    });

    let buttonSave = document.getElementById('save');
    buttonSave.addEventListener('click', () => {
        //Si hay letra compruebo si la persona esta bien posicionado
        if (checkLetter()) {
            // Enviado una solicitud Fetch al backend para comprobar si la persona esta en la camara
            checkPerson()
                .then(result => {
                    if (result === true) {
                        console.log("PERSONA EN WEBCAM");
                        textErrorMessage.style.display = "none"
                        popup.style.display = 'block';
                        //Cuenta 3 segundos
                        countdownThreeSeconds(4).then(result => {
                            if (result === true) {
                                console.log("COUNTER FINISHED");
                                setSaveDataInBackend().then(result => {
                                    if (result === true) {
                                        console.log("GUARDANDO DATOS")
                                        checkFinishSaveData()
                                            .then(result => {
                                                if (result === true) {
                                                    console.log("GUARDADO DATOS CORRECTAMENTE");
                                                } else {
                                                    console.log("EL USUARIO HA SALIDO DEL PLANO");
                                                }
                                            })
                                            .catch(error => {
                                                console.log(error);
                                            });
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                            }
                        })
                    } else {
                        console.log("PERSONA NO ESTA EN LA WEBCAM")
                        textErrorMessage.style.display = "block"
                        textErrorMessage.innerHTML = "Por favor, colócate frente a la cámara y asegúrate <br> de que tu mano derecha esté en la posición correcta antes de continuar.";
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

    function checkLetter() {
        if (selectElement.value !== "messageSelect") {
            return true
        }
    }

    function countdownThreeSeconds(seconds) {
        const countDownDate = new Date().getTime() + seconds * 1000;
        // Actualiza contador cada 1seg
        return new Promise((resolve, reject) => {
            let x = setInterval(() => {
                const now = new Date().getTime();
                let distance = countDownDate - now;

                //  Cálculo del tiempo segundos
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);
                document.getElementById("countDown").innerHTML = seconds.toString();

                if (distance < 0) {
                    isCountdownFinished = true
                    clearInterval(x);
                    document.getElementById("countDown").innerHTML = "0";
                    const messageSaveData = document.getElementById("messageSaveData");
                    messageSaveData.style.display = "block";
                    resolve(true);
                }
            }, 1000);
        });
    }
});