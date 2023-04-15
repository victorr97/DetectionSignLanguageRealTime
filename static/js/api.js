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
                        resolve(true);
                    }
                    if (data.person === 'False') {
                        clearInterval(intervalId);
                        resolve(false);
                    }
                    if (data.errorSign === 'True'){
                        resolve(null); // Utilizo null para indicar el estado de error
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        }, 1000); // Ejecutar cada segundo
    });
}

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
                resolve(true);
            })
            .catch(error => {
                console.log(error);
                reject(false);
            });
    });
}

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
            if (data.startSaveDataInFile === 'True'){
                resolve(true);
            } else {
                resolve(false);
            }
        })
        .catch(error => {
            console.log(error);
            reject(false)
        });
    });
}

/********** TRAIN & GAME ***********/

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
                resolve(true);
            })
            .catch(error => {
                console.log(error);
                reject(false);
            });
    });
}

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
                        resolve(true);
                    }
                    if (data.firstTimeRecognisedPerson === 'True' && data.recognisedPerson === 'False') {
                        clearInterval(intervalId); // Detiene la llamada a setInterval
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