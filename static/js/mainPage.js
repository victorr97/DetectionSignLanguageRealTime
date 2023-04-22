//Variables que seleccionan elementos de HTML mediante el ID
const clickBtnRecollect = document.getElementById("clickBtnRecollect");
const clickBtnTrain = document.getElementById("clickBtnTrain");
const clickBtnStart = document.getElementById("clickBtnStart");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closeBtn");
let buttonInners = document.querySelectorAll(".button_su_inner"); //Selecciona todos los elementos con la classe 'button_su_inner' y los almacena en un NodeList

/************** LISTENERS - NEXT PAGE *********************/
clickBtnRecollect.addEventListener('click', ()=>{
    popup.style.display = 'block';
    addButtonAcceptCam("recollectData")
});

clickBtnTrain.addEventListener('click', ()=>{
    popup.style.display = 'block';
    addButtonAcceptCam("train")
});

clickBtnStart.addEventListener('click', ()=>{
    popup.style.display = 'block';
    addButtonAcceptCam("start")
});

/************** LISTENERS - CLOSE POPUP *********************/
closeBtn.addEventListener('click', ()=>{
    popup.style.display = 'none';
    removeButtonAcceptCam()
});

popup.addEventListener('click', ()=>{
    popup.style.display = 'none';
    removeButtonAcceptCam()
});

/************** EFFECT 3 BUTTONS MAINPAGE *********************/

// Agrega un listener a cada elemento
buttonInners.forEach(function (buttonInner) {
    // Agrega el listener 'animationend'
    buttonInner.addEventListener("animationend", function () {
        // Eliminar el listener 'animationend' para evitar múltiples ejecuciones
        buttonInner.removeEventListener("animationend", arguments.callee);

        //  En cada botón agrega los listeners 'mouseenter' y 'mouseleave'
        buttonInner.addEventListener("mouseenter", mouseEnterHandler);
        buttonInner.addEventListener("mouseleave", mouseLeaveHandler);
    });
});

/**
 * Esta función maneja el evento "mouseenter" para el botón. Cuando se activa, anima el botón
 * para que haga explote hacia afuera en la dirección del puntero del ratón.
 * @param {MouseEvent} e - El mouse event cuando el puntero del ratón entró en el botón.
 */
function mouseEnterHandler(e) {
    // Se obtiene el rectángulo que rodea el botón
    let parentOffset = this.offsetParent.getBoundingClientRect();

    // Se calcula la posición relativa del puntero del ratón dentro del botón
    let relX = e.pageX - parentOffset.left;
    let relY = e.pageY - parentOffset.top;

    // Se establece la posición CSS de la propiedad left y top del botón para que aplique la animación
    this.previousElementSibling.style.left = relX + "px";
    this.previousElementSibling.style.top = relY + "px";

    // Se elimina la clase "desplode-circle" y se agrega la clase "explode-circle" al botón. Lo que inicia la animación CSS
    this.previousElementSibling.classList.remove("desplode-circle");
    this.previousElementSibling.classList.add("explode-circle");
}

/**
 * Esta función maneja el evento "mouseleave" para el botón. Cuando se activa, anima el botón
 * para que haga desplode hacia afuera en la dirección del puntero del ratón.
 * @param {MouseEvent} e - El mouse event cuando el puntero del ratón entró en el botón.
 */
function mouseLeaveHandler(e) {
    // Se obtiene el rectángulo que rodea el botón
    let parentOffset = this.offsetParent.getBoundingClientRect();

    // Se calcula la posición relativa del puntero del ratón dentro del botón
    let relX = e.pageX - parentOffset.left;
    let relY = e.pageY - parentOffset.top;

    // Se establece la posición CSS de la propiedad left y top del botón para que aplique la animación
    this.previousElementSibling.style.left = relX + "px";
    this.previousElementSibling.style.top = relY + "px";

    // Se elimina la clase "explode-circle" y se agrega la clase "desplode-circle" al botón. Lo que inicia la animación CSS
    this.previousElementSibling.classList.remove("explode-circle");
    this.previousElementSibling.classList.add("desplode-circle");
}

/************** POPUP ACCEPT CAM *********************/

/**
 * Añade el elemento <a> con su ruta correspondiente según el botón pulsado.
 * @param {String} route - ruta href del elemento <a>.
 */
function addButtonAcceptCam(route){
    // Creamos el elemento "a"
    const buttonAccept = document.createElement("a");

    // Agregamos los atributos "href" y "class"
    buttonAccept.setAttribute("href", route);
    buttonAccept.setAttribute("class", "popup-btn");

    // Añadimos el texto "Aceptar" dentro del elemento "a"
    buttonAccept.appendChild(document.createTextNode("Aceptar"));

    // Añadimos el elemento "a" al container del popup
    document.getElementById("popUpContainer").appendChild(buttonAccept);
}

/**
 * Elimina el elemento <a> si cierras la ventana PopUp para no duplicar elementos.
 */
function removeButtonAcceptCam() {
    //Guardamos una referencia al elemento "a" (Boton aceptar)
    const buttonAccept = document.querySelector(".popup-btn");

    // Verificamos si el elemento existe antes de eliminarlo
    if (buttonAccept !== null) {
      // Obtenemos el padre del elemento "a"
      const parent = buttonAccept.parentNode;

      // Eliminamos el elemento "a" utilizando la función "removeChild()"
      parent.removeChild(buttonAccept);
    }
}