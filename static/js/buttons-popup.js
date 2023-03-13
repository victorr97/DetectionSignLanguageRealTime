/************** EFFECT 3 BUTTONS MAINPAGE *********************/
$(".button_su_inner").mouseenter(function(e) {
    let parentOffset = $(this).offset();
    let relX = e.pageX - parentOffset.left;
    let relY = e.pageY - parentOffset.top;
    $(this).prev(".su_button_circle").css({"left": relX, "top": relY });
    $(this).prev(".su_button_circle").removeClass("desplode-circle");
    $(this).prev(".su_button_circle").addClass("explode-circle");
}).mouseleave(function(e) {
    let parentOffset = $(this).offset();
    let relX = e.pageX - parentOffset.left;
    let relY = e.pageY - parentOffset.top;
    $(this).prev(".su_button_circle").css({"left": relX, "top": relY });
    $(this).prev(".su_button_circle").removeClass("explode-circle");
    $(this).prev(".su_button_circle").addClass("desplode-circle");
});



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