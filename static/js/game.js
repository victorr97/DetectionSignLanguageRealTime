//Variables que seleccionan elementos de HTML mediante el ID
const rightDiv = document.getElementById("containerImg");
const textSelectImg = document.getElementById('textSelectImg');
const infoSign = document.getElementById('infoSign');
const loading = document.getElementById("loading");
const imgsClick = document.querySelectorAll('a'); //Selecciona todos los elementos 'a' y los almacena en un NodeList
const img = document.querySelector('.frameWebCam'); //Selecciona el primer elemento con la clase "frameWebCam"

//Variables de control
let scrollPosition = 0;
const heightImg = 235;
const NUMBER_IMG = 26;
let activeIndex = 0;
let tiempoGlobal = "00:00";
let contador;

/************** LISTENER - LOAD IMG *********************/

// Cuando la webcam ha terminado de cargarse, se ejecuta el juego
img.addEventListener('load', function () {
    loading.style.display = "none";
    infoSign.style.display = "flex";
    textSelectImg.style.display = "flex";
    imgsClick[activeIndex].firstElementChild.classList.replace('notActiveImg', 'activeImg'); //Mostramos la primera imagen seleccionada
    selectLetter() //Mostramos al usuario que signo ha de realizar
    countDownStartGame() //Mostramos el popUp de la cuenta atras para empezar el juego
});

/**
 * Esta función muestra el signo que ha de realizar el usuario
 */
function selectLetter() {
    textSelectImg.innerHTML = "SIGNO PARA REALIZAR: <strong>" + imgsClick[activeIndex].firstElementChild.alt + "</strong>";
}

/**
 * Esta función reemplaza la imagen seleccionada por la siguiente
 */
function updateActiveImage() {
    // Cambiamos la clase del elemento activo actual a "notActiveImg"
    imgsClick[activeIndex].firstElementChild.classList.replace('activeImg', 'notActiveImg');
    activeIndex++;
    // Cambiamos la clase del nuevo elemento activo a "activeImg"
    imgsClick[activeIndex].firstElementChild.classList.replace('notActiveImg', 'activeImg');
}

/**
 * Esta función reemplaza la ultima imagen seleccionada por la primera (reset)
 */
function updateLastActiveImage() {
    imgsClick[activeIndex].firstElementChild.classList.replace('activeImg', 'notActiveImg');
    activeIndex = 0;
    imgsClick[activeIndex].firstElementChild.classList.replace('notActiveImg', 'activeImg');
}

/**
 * Esta función muestra un popUp de 6 segundos para indicar al usuario que va a empezar la partida
 */
function countDownStartGame() {
    Swal.fire({
        title: 'Prepárate para jugar en',
        html: '<div><h3 id="countdown" style="font-size: 60px; font-weight: bold; color: red;">5</h3></div>',
        timer: 6000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const countdown = document.getElementById('countdown');
            let counter = 5;
            const timer = setInterval(() => {
                counter--;
                if (counter === 0) {
                    countdown.textContent = '¡YA!';
                    countdown.classList.add('highlight');
                    setTimeout(() => {
                        countdown.textContent = '';
                        countdown.classList.remove('highlight');
                        clearInterval(timer);
                        Swal.hideLoading();
                        Swal.close();
                    }, 1000);
                    clearInterval(timer);
                } else {
                    countdown.textContent = counter;
                }
            }, 1000);
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        backdrop: false,
        showConfirmButton: false
    }).then(() => {
        //Una vez ha acabado el tiempo empieza el juego
        startGame()
    });
}

/**
 * Esta función hace empezar el juego
 */
function startGame() {
    const tiempoInicio = Date.now();
    let formatoHora = false;
    //Tenemos el contador en una variable global para ir controlando su estado, aqui se va actualizando su valor cada 1 segundo.
    contador = setInterval(function () {
        setCounter(tiempoInicio, formatoHora);
    }, 1000);

    //Llamamos a la funcion recursiva que se encarga de ir cambiando de letra si es correcta
    recursiveFunction()
}

/**
 * Esta función recursiva se encarga de enviar automaticamente la siguiente letra que tiene que hacer el usuario al backend
 * y hace las comprobaciones de que esta haciendo la letra correctamente.
 */
function recursiveFunction() {
    //Guardamos la letra que tiene que hacer el usuario y la enviamos al backend
    let letterGame = imgsClick[activeIndex].firstElementChild.alt;
    letterTrainSelectUser(letterGame).then(result => {
        if (result === true) {
            //Si la letra se ha enviado correctamente vamos comprobando hasta que sea correcto
            checkLetterIfCorrect().then(result => {
                //Si el usuario ha realizado la letra correctamente se muestra el popUp de correcto
                if (result === true) {
                    Swal.fire({
                        title: '¡Correcto!',
                        text: '¡Sigue practicando signos!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    //Si la letra no es la 'Z' actualizamos la imagen, la letra a hacer, hacemos el efecto de scroll y volvemos a hacer lo mismo con la siguient letra
                    if (letterGame !== 'Z') {
                        updateActiveImage();
                        selectLetter();
                        handleScrollDown();
                        recursiveFunction(); // Llamada la función recursivamente con la siguiente letra
                    } else {
                        //Si la letra es la Z significa que ha acabado el juego, paramos contador y mostramos popUp al usuario
                        stopCounter()
                        Swal.fire({
                            title: '¡Felicitaciones!',
                            text: 'Completaste el juego en ' + tiempoGlobal + ' segundos.',
                            icon: 'success',
                            showCancelButton: true,
                            confirmButtonText: 'Volver a jugar',
                            cancelButtonText: 'Cancelar',
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33'
                        }).then((result) => {
                            // Si el usuario hizo clic en "Volver a jugar" se resetea el juego y vuelve a empezar
                            if (result.isConfirmed) {
                                resetGame()
                                countDownStartGame()
                            } else if (result.isDismissed) {
                                // Redirigir al usuario a la página 'mainPage.html'
                                window.location.href = mainPageUrl;
                            }
                        })
                    }
                } else {
                    Swal.fire({
                        title: '¡Error!',
                        text: '¡No se detectan las coordenadas en la webcam!',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    if (letterGame !== 'Z') {
                        recursiveFunction(); // Llamar la función recursivamente
                    }
                }
            }).catch(error => {
                console.log(error);
            });
        }
    });
}

/**
 * Esta función, llamada setCounter, actualiza el contador del juego cada segundo.
 * @param {number} tiempoInicio - El tiempo de inicio del juego, en milisegundos.
 * @param {boolean} formatoHora - Indica si se debe utilizar el formato HH:MM:SS (si el tiempo de juego ha superado 1 hora).
 */
function setCounter(tiempoInicio, formatoHora) {
    const tiempoActual = Date.now();
    const tiempoTranscurrido = tiempoActual - tiempoInicio;
    const horas = Math.floor(tiempoTranscurrido / 3600000);
    const minutos = Math.floor((tiempoTranscurrido % 3600000) / 60000);
    const segundos = Math.floor((tiempoTranscurrido % 60000) / 1000);

    if (horas >= 1) {
        formatoHora = true;
    }

    //Si el juego ha llegado a la hora cambiamos el formato a HH:MM:SS
    if (formatoHora) {
        document.getElementById("minutos").innerHTML = horas.toString().padStart(2, "0");
        document.getElementById("segundos").innerHTML = minutos.toString().padStart(2, "0") + ":" + segundos.toString().padStart(2, "0");
        tiempoGlobal = horas.toString().padStart(2, "0") + ":" + minutos.toString().padStart(2, "0") + ":" + segundos.toString().padStart(2, "0");
    } else {
        document.getElementById("minutos").innerHTML = minutos.toString().padStart(2, "0");
        document.getElementById("segundos").innerHTML = segundos.toString().padStart(2, "0");
        tiempoGlobal = minutos.toString().padStart(2, "0") + ":" + segundos.toString().padStart(2, "0");
    }
}

/**
 * Esta función resetea el juego una vez ha acabado de hacer todas las letras
 */
function resetGame() {
    updateLastActiveImage() //Cambia el css de seleccion de imagen de la ultima a la primera y actualiza el indice
    selectLetter() //Muestra la primera letra seleccionada
    handleScrollUp() //Hace el efecto de scroll hacia arriba
}

/**
 * Esta función para el contador sin resetearlo
 */
function stopCounter() {
    clearInterval(contador);
}

/**
 * Esta función se llama cuando el usuario ha realizado correctamente el signo y ha de hacer el siguiente
 */
function handleScrollDown() {
    scrollPosition += heightImg; //Sumo la altura de la imagen al valor de la posición de desplazamiento actual
    scrollSmoothly(500); //Creo un efecto de scroll suave hacia esa nueva posición.
}

/**
 * Esta función se llama cuando el usuario ha realizado todos los signos y quiere volver a empezar el juego
 */
function handleScrollUp() {
    scrollPosition -= heightImg * NUMBER_IMG; //Resto la altura de todas las imagen al valor de la posición de desplazamiento actual
    scrollSmoothly(1500); //Creo un efecto de scroll suave hacia la posición principal.
    scrollPosition = 0;
}

/**
 * La función scrollSmoothly calcula la distancia entre la posición actual y la posición deseada y hace un efecto de scrolling.
 */
function scrollSmoothly(time) {
    const targetPosition = scrollPosition;
    const duration = time; // Puede ser 500ms o 1.5s, dependiendo del valor que se pase como argumento
    const startPosition = rightDiv.scrollTop;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Es la función que se encarga de animar el desplazamiento
    function animation(currentTime) {
        if (startTime === null) {
            startTime = currentTime;
        }
        // Se calcula el tiempo transcurrido desde el inicio de la animación
        const elapsedTime = currentTime - startTime;

        // Se establece la posición de desplazamiento utilizando la función "scrolling"
        rightDiv.scrollTop = scrolling(elapsedTime, startPosition, distance, duration);
        if (elapsedTime < duration) {
            // Utilizo requestAnimationFrame para animar gradualmente la posición de desplazamiento.
            requestAnimationFrame(animation);
        }
    }

    //La función scrolling crea un efecto de scroll según la distancia, la posicion y los ms del efecto.
    function scrolling(elapsedTime, startPosition, distance, duration) {
        elapsedTime /= duration / 2;
        if (elapsedTime < 1) {
            return (distance / 2) * elapsedTime * elapsedTime + startPosition;
        }
        elapsedTime--;
        return (-distance / 2) * (elapsedTime * (elapsedTime - 2) - 1) + startPosition;
    }

    // Se llama a requestAnimationFrame para iniciar la animación
    requestAnimationFrame(animation);
}