/************** EFFECT 3 BUTTONS MAINPAGE *********************/

// Obtener todos los elementos .button_su_inner
let buttonInners = document.querySelectorAll(".button_su_inner");

// Agregar un controlador de eventos a cada elemento
buttonInners.forEach(function (buttonInner) {
    // Agregar controlador de eventos 'animationend'
    buttonInner.addEventListener("animationend", function () {
        // Eliminar el controlador de eventos para evitar múltiples ejecuciones
        buttonInner.removeEventListener("animationend", arguments.callee);

        // Agregar controladores de eventos 'mouseenter' y 'mouseleave'
        buttonInner.addEventListener("mouseenter", mouseEnterHandler);
        buttonInner.addEventListener("mouseleave", mouseLeaveHandler);
    });
});

function mouseEnterHandler(e) {
    let parentOffset = this.offsetParent.getBoundingClientRect();
    let relX = e.pageX - parentOffset.left;
    let relY = e.pageY - parentOffset.top;
    this.previousElementSibling.style.left = relX + "px";
    this.previousElementSibling.style.top = relY + "px";
    this.previousElementSibling.classList.remove("desplode-circle");
    this.previousElementSibling.classList.add("explode-circle");
}

function mouseLeaveHandler(e) {
  let parentOffset = this.offsetParent.getBoundingClientRect();
  let relX = e.pageX - parentOffset.left;
  let relY = e.pageY - parentOffset.top;
  this.previousElementSibling.style.left = relX + "px";
  this.previousElementSibling.style.top = relY + "px";
  this.previousElementSibling.classList.remove("explode-circle");
  this.previousElementSibling.classList.add("desplode-circle");
}

/************** GET ELEMENTS *********************/
const clickBtnRecollect = document.getElementById("clickBtnRecollect");
const clickBtnTrain = document.getElementById("clickBtnTrain");
const clickBtnStart = document.getElementById("clickBtnStart");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closeBtn");

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

/**
 * Add the <a> element with it's corresponding path according to the button you clicked.
 *
 * @param {String} route - href path of the <a> element.
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
 * Remove the <a> element if you close the PopUp window so as not to duplicate elements.
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