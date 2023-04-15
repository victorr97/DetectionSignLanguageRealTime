document.addEventListener('DOMContentLoaded', function () {
    /************** GET ELEMENTS *********************/
    const selectElement = document.getElementById("letterSign");
    const popup = document.getElementById("popupSaveData");
    const saveMoreData = document.getElementById("saveMoreData");
    const noSaveMore = document.getElementById("noSaveMore");
    const popUpContainer = document.getElementById("popUpContainer");
    const containerButtonsPopUp = document.getElementById("containerButtonsPopUp");
    const messageSaveData = document.getElementById("messageSaveData");
    const loading = document.getElementById("loadingRecollect");
    let buttonSave = document.getElementById('save');
    let countDown = document.getElementById("countDown");
    let boxCountDown = document.getElementById("boxCountDown");
    let titlePopUp = document.getElementById("titlePopUp");
    let containerImg = document.getElementById("containerImg");
    let imgHelp = document.getElementById("imgHelp");
    let img = document.getElementById("webCam");

    img.addEventListener('load', function () {
        loading.style.display = "none";
    });

    saveMoreData.style.display = "none";
    noSaveMore.style.display = "none";
    containerButtonsPopUp.style.display = "none";

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

        //Compruebo que la letra sea correcta
        if (checkLetter()) {
            e.preventDefault();
            //Envio letra seleccionada por el usuario al backend
            procesarDatos(selectElement.value)
                .then(result => {
                    if (result === true) {
                        console.log("LETRA ENVIADA AL BACKEND")
                        containerImg.style.display = "flex";
                        const rutaImagen = imgHelp.getAttribute("data-img");
                        imgHelp.src = rutaImagen.replace("A", selectElement.value);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            containerImg.style.display = "none";
        }
    });

    buttonSave.addEventListener('click', () => {
        //Si hay letra compruebo si la persona esta bien posicionado
        if (checkLetter()) {
            // Enviado una solicitud Fetch al backend para comprobar si la persona esta en la camara
            popup.style.display = 'block';
            //Cuenta 3 segundos
            countdownThreeSeconds(4).then(result => {
                if (result === true) {
                    console.log("COUNTER FINISHED");
                    checkPerson().then(result => {
                        if (result === true) {
                            console.log("PERSONA EN WEBCAM");
                            setSaveDataInBackend().then(result => {
                                if (result === true) {
                                    console.log("GUARDANDO DATOS");
                                    messageSaveData.style.display = "block";
                                    messageSaveData.innerHTML = "<strong>Guardando datos...</strong> no se mueva porfavor.";
                                    checkFinishSaveData().then(result => {
                                        if (result === true) {
                                            console.log("GUARDADO DATOS CORRECTAMENTE");
                                            changePopUpGoodSave();
                                        } else if (result === false) {
                                            console.log("EL USUARIO HA SALIDO DEL PLANO");
                                            changePopUpWrongSave();
                                        } else {
                                            console.log("EL USUARIO HA REALIZADO MAL EL SIGNO");
                                            changePopUpWrongSign();
                                        }
                                    }).catch(error => {
                                        console.log(error);
                                    });
                                }
                            }).catch(error => {
                                console.log(error);
                            });
                        } else {
                            console.log("PERSONA NO ESTA EN LA WEBCAM")
                            changePopUpPersonIsNotPositioned()
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }
            })
        } else {
            Swal.fire({
                title: '¡Atención!',
                text: 'Parece que no has seleccionado ninguna letra. Por favor, selecciona una letra antes de continuar.',
                icon: 'error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6'
            })
        }
    });

    saveMoreData.addEventListener('click', () => {
        console.log("SAVE MORE")
        popup.style.display = "none";
        changeResetPopUp();
    });

    function checkLetter() {
        return selectElement.value !== "messageSelect";
    }

    function countdownThreeSeconds(seconds) {
        const countDownDate = new Date().getTime() + seconds * 1000;
        // Actualiza contador cada 1seg
        return new Promise((resolve, reject) => {
            let x = setInterval(() => {
                const now = new Date().getTime();
                let distance = countDownDate - now;

                //  Cálculo del tiempo segundos
                countDown.innerHTML = Math.floor((distance % (1000 * 60)) / 1000).toString();

                if (distance < 0) {
                    isCountdownFinished = true
                    clearInterval(x);
                    countDown.innerHTML = "0";
                    resolve(true);
                }
            }, 1000);
        });
    }

    function changePopUpGoodSave() {
        boxCountDown.style.display = "none";
        messageSaveData.innerHTML = null;
        titlePopUp.innerHTML = null;
        titlePopUp.innerHTML = "Se ha guardado correctamente";
        messageSaveData.innerHTML = "Quieres guardar más datos?";
        saveMoreData.style.display = "flex"
        noSaveMore.style.display = "flex"
        containerButtonsPopUp.style.display = "flex";
        containerButtonsPopUp.style.marginTop = "2%";
        popUpContainer.style.height = "20vh";
        popUpContainer.style.marginBottom = "16rem";
        saveMoreData.style.margin = "0";
        saveMoreData.style.marginRight = "15%";
        noSaveMore.style.margin = "0";
    }

    function changePopUpPersonIsNotPositioned() {
        boxCountDown.style.display = "none";
        messageSaveData.innerHTML = null;
        titlePopUp.innerHTML = null;
        titlePopUp.innerHTML = "¡Error! Por favor, colócate frente a la cámara y asegúrate de que tu mano derecha esté en la posición correcta antes de continuar.\n";
        messageSaveData.innerHTML = "Quieres volver a repetir?";
        saveMoreData.style.display = "flex"
        noSaveMore.style.display = "flex"
        containerButtonsPopUp.style.display = "flex";
        containerButtonsPopUp.style.marginTop = "2%";
        messageSaveData.style.display = "block";
        popUpContainer.style.height = "25vh";
        popUpContainer.style.marginBottom = "19rem";
        saveMoreData.style.margin = "0";
        saveMoreData.style.marginRight = "15%";
        noSaveMore.style.margin = "0";
    }

    function changePopUpWrongSave() {
        boxCountDown.style.display = "none";
        messageSaveData.innerHTML = null;
        titlePopUp.innerHTML = null;
        titlePopUp.innerHTML = "¡Error! Has salido del plano";
        messageSaveData.innerHTML = "Quieres volver a repetir?";
        saveMoreData.style.display = "flex"
        noSaveMore.style.display = "flex"
        containerButtonsPopUp.style.display = "flex";
        containerButtonsPopUp.style.marginTop = "2%";
        popUpContainer.style.height = "20vh";
        popUpContainer.style.marginBottom = "16rem";
        saveMoreData.style.margin = "0";
        saveMoreData.style.marginRight = "15%";
        noSaveMore.style.margin = "0";
    }

    function changePopUpWrongSign() {
        boxCountDown.style.display = "none";
        messageSaveData.innerHTML = null;
        titlePopUp.innerHTML = null;
        titlePopUp.innerHTML = "¡Error! El signo que ingresaste es incorrecto y no se puede guardar";
        messageSaveData.innerHTML = "Quieres volver a repetir?";
        saveMoreData.style.display = "flex"
        noSaveMore.style.display = "flex"
        containerButtonsPopUp.style.display = "flex";
        containerButtonsPopUp.style.marginTop = "2%";
        popUpContainer.style.height = "20vh";
        popUpContainer.style.marginBottom = "16rem";
        saveMoreData.style.margin = "0";
        saveMoreData.style.marginRight = "15%";
        noSaveMore.style.margin = "0";
    }

    function changeResetPopUp() {
        boxCountDown.style.display = "flex";
        countDown.innerHTML = "3";
        messageSaveData.innerHTML = null;
        titlePopUp.innerHTML = null;
        titlePopUp.innerHTML = "Guardando coordenadas en ";
        popUpContainer.style.height = "20vh";
        popUpContainer.style.marginBottom = "16rem";
        saveMoreData.style.display = "none"
        noSaveMore.style.display = "none"
    }
});