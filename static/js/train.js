const rightDiv = document.getElementById("containerImg");
const scrollUpBtn = document.getElementById('scroll-up');
const scrollDownBtn = document.getElementById('scroll-down');
const textSelectImg = document.getElementById('textSelectImg');
const imgsClick = document.querySelectorAll('a');
const img = document.querySelector('.frameWebCam');
const loading = document.getElementById("loading");
let scrollPosition = 0;
const height3Img = 765;


img.addEventListener('load', function () {
    console.log('La imagen se ha cargado correctamente.');
    loading.style.display = "none";
});

// Agrego un Event Listener click para cada elemento <a> (imagenes)
imgsClick.forEach(function (element) {
    element.addEventListener('click', function (event) {
        const allImg = document.querySelectorAll('img');
        //Para todas las imagenes si contiene la clase activeImg activada significa que estaba anteriormente clicada y se ha de substituir
        allImg.forEach(function (imagen) {
            if (imagen.classList.contains("activeImg")) {
                imagen.classList.replace('activeImg', 'notActiveImg');
            }
        });
        //Añado la clase de activeImg a la img donde el evento se ha clicado
        const img = event.target
        if (img.classList.contains("notActiveImg")) {
            img.classList.replace('notActiveImg', 'activeImg')
            textSelectImg.innerHTML = "SIGNO SELECCIONADO PARA PRACTICAR: <strong>" + event.target.alt + "</strong>";
        }
    });
});

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

scrollUpBtn.addEventListener('click', handleScrollUp);
scrollDownBtn.addEventListener('click', handleScrollDown);
