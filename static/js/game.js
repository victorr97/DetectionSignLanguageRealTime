

const rightDiv = document.getElementById("containerImg");
const textSelectImg = document.getElementById('textSelectImg');
const infoSign = document.getElementById('infoSign');
const imgsClick = document.querySelectorAll('a');
const img = document.querySelector('.frameWebCam');
const loading = document.getElementById("loading");

let scrollPosition = 0;
const heightImg = 235;
const NUMBER_IMG = 26;
let activeIndex = 0;
let tiempoGlobal = "00:00";
let contador;


img.addEventListener('load', function () {
    loading.style.display = "none";
    infoSign.style.display = "flex";
    textSelectImg.style.display = "flex";
    imgsClick[activeIndex].firstElementChild.classList.replace('notActiveImg', 'activeImg');
    selectLetter()
    countDownStartGame()
});

function selectLetter() {
    textSelectImg.innerHTML = "SIGNO PARA REALIZAR: <strong>" + imgsClick[activeIndex].firstElementChild.alt + "</strong>";
}

function updateActiveImage() {
    // Cambiamos la clase del elemento activo actual a "notActiveImg"
    imgsClick[activeIndex].firstElementChild.classList.replace('activeImg', 'notActiveImg');
    activeIndex++;
    // Cambiamos la clase del nuevo elemento activo a "activeImg"
    imgsClick[activeIndex].firstElementChild.classList.replace('notActiveImg', 'activeImg');
}

function updateLastActiveImage(){
    imgsClick[activeIndex].firstElementChild.classList.replace('activeImg', 'notActiveImg');
    activeIndex = 0;
    imgsClick[activeIndex].firstElementChild.classList.replace('notActiveImg', 'activeImg');
}

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
        startGame()
    });
}

function startGame() {
    const tiempoInicio = Date.now();
    let formatoHora = false;
    contador = setInterval(function () {
        setCounter(tiempoInicio, formatoHora);
    }, 1000);

    recursiveFunction(contador)
}

function recursiveFunction() {
    let letterGame = imgsClick[activeIndex].firstElementChild.alt;
    letterTrainSelectUser(letterGame).then(result => {
        if (result === true) {
            checkLetterIfCorrect().then(result => {
                if (result === true) {
                    Swal.fire({
                        title: '¡Correcto!',
                        text: '¡Sigue practicando signos!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    if (letterGame !== 'Z') {
                        updateActiveImage();
                        selectLetter();
                        handleScrollDown();
                        recursiveFunction(); // Llamar la función recursivamente
                    } else {
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
                            // Si el usuario hizo clic en "Volver a jugar"
                            if (result.isConfirmed) {
                                resetGame()
                                startGame()
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

function setCounter(tiempoInicio, formatoHora) {
    const tiempoActual = Date.now();
    const tiempoTranscurrido = tiempoActual - tiempoInicio;
    const horas = Math.floor(tiempoTranscurrido / 3600000);
    const minutos = Math.floor((tiempoTranscurrido % 3600000) / 60000);
    const segundos = Math.floor((tiempoTranscurrido % 60000) / 1000);

    if (horas >= 1) {
        formatoHora = true;
    }

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

function resetGame() {
    updateLastActiveImage()
    selectLetter()
    handleScrollUp()
}

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

/*
* La función scrollSmoothly calcula la distancia entre la posición actual y la posición deseada y hace un efecto de scrolling.
*/
function scrollSmoothly(time) {
    const targetPosition = scrollPosition;
    const duration = time; //500ms o 1,5s
    const startPosition = rightDiv.scrollTop;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) {
            startTime = currentTime;
        }
        const elapsedTime = currentTime - startTime;
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

    requestAnimationFrame(animation);
}

