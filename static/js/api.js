/**
 ************************** RECOLLECTSIGN ****************************
 * La función checkFinishSaveData comprueba si se esta guardando los datos correctamente en el dataSet
 * @returns {Promise<boolean>} - Promesa que resuelve a un booleano indicando varias casuisticas
 */
async function checkFinishSaveData() {
    return new Promise((resolve, reject) => {
        let intervalId = setInterval(() => {
            fetch('/checkSaveData', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
                .then(response => response.json())
                .then(data => {
                    //Respuesta del servidor
                    console.log(data);
                    if (data.finishSave === 'True') {
                        clearInterval(intervalId);
                        // Promesa = True : Indica que se ha almacenado correctamente en el dataSet
                        resolve(true);
                    }
                    if (data.person === 'False') {
                        clearInterval(intervalId);
                        // Promesa = False : Indica que el usuario ha salido del plano mientras se guardaban los datos
                        resolve(false);
                    }
                    if (data.errorSign === 'True') {
                        // Promesa = null : Indica que el usuario no esta realizando correctamente el signo seleccionado
                        resolve(null);
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        }, 1000); // Ejecuta cada segundo
    });
}

/**
 ************************** RECOLLECTSIGN ****************************
 * La función procesarDatos envia la letra seleccionada por el usuario al servidor.
 * @param {string} letterSign - La letra que se procesará.
 * @returns {Promise<boolean>} - Promesa que resuelve a un booleano indicando si la letra se guardo correctamente o no.
 */
function procesarDatos(letterSign) {
    return new Promise((resolve, reject) => {
        fetch('/procesar', {
            method: 'POST',
            body: JSON.stringify({'letterSign': letterSign}),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(response => response.json())
            .then(data => {
                //Respuesta del servidor
                console.log(data);
                // Promesa = True : Indica si la letra se guardo correctamente o no.
                resolve(true);
            })
            .catch(error => {
                console.log(error);
                reject(false);
            });
    });
}

/**
 ************************** RECOLLECTSIGN ****************************
 * La función checkPerson comprueba si la persona se encuentra en la cámara al empezar a guardar datos.
 * @returns {Promise<boolean>} - Promesa que resuelve a un booleano indicando si el usuario se encuentra bien posicionado en la cámara o no.
 */
function checkPerson() {
    return new Promise((resolve, reject) => {
        fetch('/checkPerson', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(response => response.json())
            .then(data => {
                //Respuesta del servidor
                console.log(data);
                if (data.personInCam === 'True') {
                    //
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(error => {
                console.log(error);
                reject(false);
            });
    });
}

/**
 ************************** RECOLLECTSIGN ****************************
 * La función setSaveDataInBackend indica al backend que ya puede empezar a almacenar datos
 * @returns {Promise<boolean>} - Promesa que resuelve a un booleano indicando que va a empezar a almacenar datos.
 */
function setSaveDataInBackend() {
    return new Promise((resolve, reject) => {
        fetch('/goSave', {
            method: 'POST',
            body: JSON.stringify({'startSaveData': "True"}),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(response => response.json())
            .then(data => {
                //Respuesta del servidor
                console.log(data);
                if (data.startSaveDataInFile === 'True') {
                    // Promesa = True : Indica que va a empezar a almacenar datos.
                    resolve(true);
                } else {
                    // Promesa = False : Indica que aun no va a empezar a almacenar datos.
                    resolve(false);
                }
            })
            .catch(error => {
                console.log(error);
                reject(false)
            });
    });
}

/**
 ************************** TRAIN && GAME ****************************
 * La función letterTrainSelectUser envia la letra seleccionada por el usuario al servidor.
 * @param {string} letterTrain - La letra que se procesará.
 * @returns {Promise<boolean>} - Promesa que resuelve a un booleano indicando si la letra se guardo correctamente o no.
 */
function letterTrainSelectUser(letterTrain) {
    return new Promise((resolve, reject) => {
        fetch('/letterTrain', {
            method: 'POST',
            body: JSON.stringify({'letterTrain': letterTrain}),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(response => response.json())
            .then(data => {
                //Respuesta del servidor
                console.log(data);
                // Promesa = True : Indica si la letra se guardo correctamente o no.
                resolve(true);
            })
            .catch(error => {
                console.log(error);
                reject(false);
            });
    });
}

/**
 ************************** TRAIN && GAME ****************************
 * La función checkLetterIfCorrect comprueba si el usuario ha realizado correctamente la letra que esta realizando
 * @returns {Promise<boolean>} - Promesa que resuelve a un booleano indicando si la letra se ha realizado correctamente
 */
async function checkLetterIfCorrect() {
    return new Promise((resolve, reject) => {
        let intervalId = setInterval(() => {
            fetch('/checkLetter', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
                .then(response => response.json())
                .then(data => {
                    //Respuesta del servidor
                    console.log(data);
                    if (data.checkLetter === 'True') {
                        clearInterval(intervalId); // Detiene la llamada a setInterval
                        // Promesa = True : Indica que el usuario ha estado realizado correctamente la letra seleccionada de train o game.
                        resolve(true);
                    }
                    if (data.firstTimeRecognisedPerson === 'True' && data.recognisedPerson === 'False') {
                        clearInterval(intervalId); // Detiene la llamada a setInterval
                        // Promesa = False : Indica que el usuario ha sido reconocido al principio y ha salido del plano cuando se estaba comprobando si hacia bien el signo.
                        resolve(false);
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        }, 1000); // Ejecuta cada segundo
    });
}