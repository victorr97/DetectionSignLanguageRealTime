const rightDiv = document.getElementById("containerImg");
const textSelectImg = document.getElementById('textSelectImg');
const imgsClick = document.querySelectorAll('a');
const allImg = document.querySelectorAll('img');
const img = document.querySelector('.frameWebCam');
const loading = document.getElementById("loading");
let scrollPosition = 0;
const height3Img = 765;

img.addEventListener('load', function () {
    loading.style.display = "none";
    textSelectImg.style.display = "flex";
    countDownStartGame()
});


function countDownStartGame() {
    Swal.fire({
      title: 'Preparados para jugar',
      html: '<div><h3 id="countdown" style="font-size: 60px; font-weight: bold;">5</h3></div>',
      timer: 5000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const countdown = document.getElementById('countdown');
        let counter = 5;
        const timer = setInterval(() => {
          counter--;
          countdown.textContent = counter;
          if (counter === 0) {
            clearInterval(timer);
            countdown.classList.add('highlight');
            Swal.hideLoading();
          }
        }, 1000);
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      backdrop: false,
      showConfirmButton: false
    }).then((result) => {
      // Acción a realizar cuando se cierre el SweetAlert (no se ejecutará en este caso)
    });

    // Agregamos un estilo CSS para resaltar el número al final de la cuenta atrás
    Swal.insertRule('.highlight { background-color: yellow; }', true);

    // Evento que se dispara cuando termina la cuenta atrás
    Swal.on('timer', () => {
      // Acción a realizar cuando termina la cuenta atrás
    });
}


function resetLetter(){
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