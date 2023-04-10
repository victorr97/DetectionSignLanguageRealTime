const rightDiv = document.getElementById("containerImg");
const textSelectImg = document.getElementById('textSelectImg');
const imgsClick = document.querySelectorAll('a');
const allImg = document.querySelectorAll('img');
const img = document.querySelector('.frameWebCam');
const loading = document.getElementById("loading");
let scrollPosition = 0;
const height3Img = 765;
let activeIndex = 0;

img.addEventListener('load', function () {
    loading.style.display = "none";
    textSelectImg.style.display = "flex";
    firstLetter("A")
    countDownStartGame()
});

function firstLetter(letter) {
    console.log(imgsClick[activeIndex])
    imgsClick[activeIndex].classList.replace('notActiveImg', 'activeImg');
    if (imgsClick[activeIndex].classList.contains("notActiveImg")) {
        imgsClick[activeIndex].classList.replace('notActiveImg', 'activeImg');
        console.log("changed")
        console.log(imgsClick[activeIndex])
    }

    textSelectImg.innerHTML = "SIGNO PARA REALIZAR: <strong>" + letter + "</strong>";
}

function updateActiveImage() {

    // Cambiamos la clase del elemento activo actual a "notActiveImg"
    imgsClick[activeIndex].classList.replace('activeImg', 'notActiveImg');

    // Incrementamos el índice del elemento activo
    activeIndex++;

    // Cambiamos la clase del nuevo elemento activo a "activeImg"
    imgsClick[activeIndex].classList.replace('notActiveImg', 'activeImg');
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
                    countdown.textContent = 'YA!';
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
        console.log("EMPIEZA EL JUEGO")
    });
}


function resetLetter() {
    textSelectImg.innerHTML = "SIGNO: ";
    allImg.forEach(function (imagen) {
        if (imagen.classList.contains("activeImg")) {
            imagen.classList.replace('activeImg', 'notActiveImg');
        }
    });
}

function handleScrollUp() {
    scrollPosition -= height3Img;
    scrollSmoothly();
}

function handleScrollDown() {
    scrollPosition += height3Img;
    scrollSmoothly();
}

/*
* La función scrollSmoothly calcula la distancia entre la posición actual y la posición deseada y hace un efecto de scrolling.
*/
function scrollSmoothly() {
    const targetPosition = scrollPosition;
    const duration = 500; //500ms
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