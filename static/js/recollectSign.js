//Variables que seleccionan elementos de HTML mediante el ID
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

//Inicializo en none para no mostrar los elementos
saveMoreData.style.display = "none";
noSaveMore.style.display = "none";
containerButtonsPopUp.style.display = "none";

/************** LISTENER - LOAD IMG *********************/

// Cuando la webcam ha terminado de cargarse, desaparece el 'cargando'
img.addEventListener('load', function () {
    loading.style.display = "none";
});

/************** LISTENERS - SELECT SIGN *********************/

//clic en el elemento cuando la caja esté cerrada. (letra en lenguaje de signos)
selectElement.addEventListener('focus', () => {
    selectElement.size = 5;
});

//Al pasar el ratón por encima de un elemento
selectElement.addEventListener('mouseover', () => {
    if (selectElement.size === 1) {
        selectElement.style.backgroundColor = 'rgb(247, 247, 247)';
    }
});

//Al salir de un elemento con el ratón
selectElement.addEventListener('mouseout', () => {
    if (selectElement.size === 1) {
        selectElement.style.backgroundColor = '#FFF';
    }
});

// Al hacer clic en un elemento después de mostrarlo
selectElement.addEventListener('change', function (e) {
    selectElement.size = 1;
    selectElement.blur();
    selectElement.style.backgroundColor = '#FFF';
    sendSignBackend();
});

/************** LISTENERS - SAVE DATA *********************/

buttonSave.addEventListener('click', () => {
    saveData();
});

saveMoreData.addEventListener('click', () => {
    console.log("SAVE MORE")
    popup.style.display = "none";
    changeResetPopUp();
});

function sendSignBackend() {
    //Compruebo que la letra sea correcta (A-Z)
    if (checkLetter()) {
        e.preventDefault();
        //Envio letra seleccionada por el usuario al backend
        procesarDatos(selectElement.value)
            .then(result => {
                if (result === true) {
                    console.log("LETRA ENVIADA AL BACKEND")
                    containerImg.style.display = "flex";
                    const rutaImagen = imgHelp.getAttribute("data-img");
                    //Cargo la ruta de la img por la seleccionada
                    imgHelp.src = rutaImagen.replace("A", selectElement.value);
                }
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        //Si el usuario ha seleccionado la casilla por defecto no muestro la imagen del signo de ejemplo
        containerImg.style.display = "none";
    }
}

function saveData() {
    //Si hay letra compruebo si la persona esta bien posicionado
    if (checkLetter()) {
        // Enviado una solicitud Fetch al backend para comprobar si la persona esta en la camara
        popup.style.display = 'block';
        //Cuenta 3 segundos
        countDownSeconds(3).then(result => {
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
}

function checkLetter() {
    return selectElement.value !== "messageSelect";
}

function countDownSeconds(seconds) {
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            seconds--;
            countDown.innerHTML = seconds
            if (seconds === 0) {
                clearInterval(timer);
                isCountdownFinished = true
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