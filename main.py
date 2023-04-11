import collectFrame
import trainUser
import trainModel
import dataChartsModel
from argparse import ArgumentParser
from flask import Flask, render_template, Response, jsonify, request

app = Flask(__name__)


# ROUTES POST
@app.route('/procesar', methods=['POST'])
def procesar():
    if request.is_json:
        letterSign = request.get_json()['letterSign']
        respuesta = {'letter': letterSign}
        collectFrame.setSelectSign(letterSign)
        # Reset var FinishSaveData
        collectFrame.setFinishSaveData("False")
        return jsonify(respuesta)
    else:
        return jsonify({'mensaje': 'La solicitud no es una solicitud JSON'})


@app.route('/goSave', methods=['POST'])
def goSave():
    if request.is_json:
        startSaveData = request.get_json()['startSaveData']
        respuesta = {'startSaveDataInFile': startSaveData}
        #collectFrame.setStartSaveData(startSaveData)
        collectFrame.setStartSaveData("True")
        return jsonify(respuesta)

    else:
        return jsonify({'mensaje': 'La solicitud no es una solicitud JSON'})


@app.route('/letterTrain', methods=['POST'])
def letterTrain():
    if request.is_json:
        letterTrain = request.get_json()['letterTrain']
        respuesta = {'letterTrain': letterTrain}
        trainUser.setSelectSignTrain(letterTrain)
        trainUser.setLetterDoneRight("False")
        trainUser.setFirstTimeRecognisedPerson("False")
        trainUser.resetListLetters()
        return jsonify(respuesta)
    else:
        return jsonify({'mensaje': 'La solicitud no es una solicitud JSON'})


# ROUTES GET

@app.route('/checkSaveData', methods=['GET'])
def checkSaveData():
    if request.is_json:
        respuesta = {'finishSave': collectFrame.getFinishSaveData(), 'person': collectFrame.getPersonWhenSaveData()}
        return jsonify(respuesta)

    else:
        return jsonify({'mensaje': 'La solicitud no es una solicitud JSON'})


@app.route('/checkPerson', methods=['GET'])
def checkPerson():
    if request.is_json:
        respuesta = {'personInCam': collectFrame.getPerson()}
        return jsonify(respuesta)
    else:
        return jsonify({'mensaje': 'La solicitud no es una solicitud JSON'})


@app.route('/checkLetter', methods=['GET'])
def checkLetter():
    if request.is_json:
        respuesta = {'checkLetter': trainUser.getCountArrayIfCorrect(), 'recognisedPerson': trainUser.getRecognisedPerson(), 'firstTimeRecognisedPerson': trainUser.getFirstTimeRecognisedPerson()}
        return jsonify(respuesta)
    else:
        return jsonify({'mensaje': 'La solicitud no es una solicitud JSON'})


@app.route('/', methods=['GET'])
def index():
    return render_template('mainPage.html')


@app.route('/main', methods=['GET'])
def main():
    return render_template('mainPage.html')


@app.route('/recollectData', methods=['GET'])
def recollectData():
    return render_template('recollectData.html')


@app.route('/train', methods=['GET'])
def train():
    return render_template('train.html')


@app.route('/start', methods=['GET'])
def start():
    return render_template('game.html')


@app.route('/recollect', methods=['GET'])
def recollect():
    return Response(collectFrame.saveDataSet(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/trainuser', methods=['GET'])
def trainuser():
    return Response(trainUser.trainWeb(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/letterGame', methods=['GET'])
def letterGame():
    return Response(trainUser.trainWeb(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':

    parser = ArgumentParser()
    parser.add_argument('--train', action='store_true', help="Serves to train the data model")
    parser.add_argument('--dataCharts', action='store_true', help="Used to generate graphs of the trained model")
    args = parser.parse_args()

    if args.train:
        trainModel.trainingData()
    if args.dataCharts:
        dataChartsModel.showCharts()
    else:
        app.run(host="localhost", debug=True)
