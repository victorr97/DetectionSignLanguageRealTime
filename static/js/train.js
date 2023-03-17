/*
const scrollButton = document.querySelector(".scroll-down");
const scrollContent = document.querySelector(".scroll-content");


let scrollPosition = 0;

scrollButton.addEventListener("click", () => {
  scrollPosition += 400;
  scrollContent.style.transform = `translateY(-${scrollPosition}px)`;
});

 */

const rightDiv = document.getElementById("containerImg");
const scrollUpBtn = document.getElementById('scroll-up');
const scrollDownBtn = document.getElementById('scroll-down');

let scrollPosition = 0;

function handleScrollUp() {
    scrollPosition -= 1500;
    scrollSmoothly();
}

function handleScrollDown() {
    scrollPosition += 1500;
    scrollSmoothly();
}

function scrollSmoothly() {
    const targetPosition = scrollPosition;
    const duration = 500; // Duración de la animación en milisegundos
    const startPosition = rightDiv.scrollTop;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) {
            startTime = currentTime;
        }
        const elapsedTime = currentTime - startTime;
        const position = easeInOutQuad(elapsedTime, startPosition, distance, duration);
        rightDiv.scrollTop = position;
        if (elapsedTime < duration) {
            requestAnimationFrame(animation);
        }
    }

    function easeInOutQuad(currentTime, startValue, changeInValue, duration) {
      currentTime /= duration / 2;
      if (currentTime < 1) {
        return (changeInValue / 2) * currentTime * currentTime + startValue;
      }
      currentTime--;
      return (-changeInValue / 2) * (currentTime * (currentTime - 2) - 1) + startValue;
    }

    requestAnimationFrame(animation);
}

/*
* En esta versión actualizada, la función handleScrollUp y handleScrollDown ahora simplemente actualizan la posición de desplazamiento en 100, y luego llaman a la nueva función scrollSmoothly.

La función scrollSmoothly calcula la distancia entre la posición actual y la posición deseada, y luego utiliza requestAnimationFrame para animar gradualmente la posición de desplazamiento. La animación utiliza una función de aceleración (ease) para crear un efecto suave y natural.

Con estos cambios, los usuarios verán un efecto de desplazamiento suave cuando hagan clic en los botones de subir y bajar, y el desplazamiento se detendrá automáticamente cuando se alcance la posición deseada. Puedes ajustar la cantidad y duración del desplazamiento cambiando los valores en la función scrollSmoothly.
*
* */

scrollUpBtn.addEventListener('click', handleScrollUp);
scrollDownBtn.addEventListener('click', handleScrollDown);
