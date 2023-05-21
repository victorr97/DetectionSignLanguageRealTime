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
    sendSignBackend(e);
});

/************** LISTENERS - SAVE DATA *********************/

buttonSave.addEventListener('click', () => {
    saveData();
});

saveMoreData.addEventListener('click', () => {
    console.log("SAVE MORE")
    popup.style.display = "none";
    changeResetPopUp(); //Reseteo el PopUp cuando el usuario quiere almacenar más signos.
});

/**
 * Esta función envia el signo seleccionado por el usuario al backend y cambia la imagen de ejemplo
 */
function sendSignBackend(e) {
    //Compruebo que la letra sea correcta (A-Z)
    if (checkLetter()) { // Si la letra es correcta
        e.preventDefault(); // Evita que se envíe el formulario
        //Envio letra seleccionada por el usuario al backend
        procesarDatos(selectElement.value) // Envía la letra seleccionada por el usuario al backend
            .then(result => {
                if (result === true) { // Si se ha enviado correctamente
                    console.log("LETRA ENVIADA AL BACKEND")
                    containerImg.style.display = "flex"; // Muestra la imagen del signo de ejemplo
                    const rutaImagen = imgHelp.getAttribute("data-img"); // Obtiene la ruta de la imagen del signo de ejemplo
                    //Cargo la ruta de la img por la seleccionada
                    imgHelp.src = rutaImagen.replace("A", selectElement.value); // Carga la ruta de la imagen por la seleccionada
                }
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        //Si el usuario ha seleccionado la casilla por defecto no muestro la imagen del signo de ejemplo
        containerImg.style.display = "none"; // Oculta la imagen del signo de ejemplo
    }
}

/**
 * Esta función se encarga de guardar las coordenadas en el dataSet del backend
 */
function saveData() {
    //Si hay letra compruebo si la persona esta bien posicionado
    if (checkLetter()) {
        popup.style.display = 'block';
        //Cuenta 3 segundos, si result es true significa que ha acabado el contador
        countDownSeconds(3).then(result => {
            if (result === true) {
                console.log("COUNTER FINISHED");
                // Envio una solicitud Fetch al backend para comprobar si la persona esta en la camara
                checkPerson().then(result => {
                    if (result === true) {
                        console.log("USUARIO EN WEBCAM");
                        // Envio una solicitud Fetch al backend indicando que ya se pueden guardar datos
                        setSaveDataInBackend().then(result => {
                            if (result === true) {
                                console.log("GUARDANDO DATOS");
                                messageSaveData.style.display = "block";
                                messageSaveData.innerHTML = "<strong>Guardando datos...</strong> no se mueva porfavor.";
                                //Compruebo el estado del almacenamiento de coordenadas al dataSet
                                checkFinishSaveData().then(result => {
                                    if (result === true) { //Indica que se ha guardado los datos correctamente
                                        changePopUpGoodSave();
                                    } else if (result === false) { //Indica que el usuario ha salido del plano mientras se almacenaban las coordenadas
                                        changePopUpWrongSave();
                                    } else {  //Indica que el usuario ha realizado un signo distinto respecto al seleccionado
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
                        changePopUpPersonIsNotPositioned();  //Indica que el usuario no se encuentra ubicado en la webcam al principio
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        })
    } else {
        //Muestro un popUp indicando al usuario que no ha seleccionado ninguna letra.
        Swal.fire({
            title: '¡Atención!',
            text: 'Parece que no has seleccionado ninguna letra. Por favor, selecciona una letra antes de continuar.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6'
        })
    }
}

/**
 * Esta función comprueba si el usuario ha seleccionado la letra correcta (A-Z)
 */
function checkLetter() {
    return selectElement.value !== "messageSelect";
}

/**
 * Esta función se encarga de hacer una cuenta atrás.
 * @param {int} seconds - Los segundos que tiene que tener la cuenta atrás.
 */
function countDownSeconds(seconds) {
    return new Promise((resolve, reject) => {
        // Crea un temporizador que se ejecuta cada 1000ms (1 segundo)
        const timer = setInterval(() => {
            // Resta 1 segundo del contador
            seconds--;
            // Actualiza el valor del contador en la pantalla
            countDown.innerHTML = seconds;
            // Si el contador llega a 0, detiene el temporizador y resuelve la promesa indicando que ya ha finalizado de contar
            if (seconds === 0) {
                clearInterval(timer);
                isCountdownFinished = true;
                resolve(true);
            }
        }, 1000);
    });
}

/**
 * Esta función muestra el popUp indicando que se ha guardado correctamente en el dataSet
 */
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

/**
 * Esta función muestra el popUp indicando que el usuario no esta bien posicionado al principio
 */
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

/**
 * Esta función muestra el popUp indicando que ha habido un error y el usuario ha salido del plano mientras se estaban guardando las coordenadas
 */
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

/**
 * Esta función muestra el popUp indicando que ha habido un error y el usuario esta realizando un signo diferente al seleccionado
 */
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

/**
 * Esta función muestra resetea el popUp para cuando el usuario quiere seguir guardando datos
 */
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