import results
import collectFrame
from argparse import ArgumentParser
from flask import Flask, render_template, Response, jsonify, request

app = Flask(__name__)


@app.route('/procesar', methods=['POST'])
def procesar():

    if request.is_json:
        lenguaje_seleccionado = request.get_json()['lenguajeSeleccionado']
        # Haz algo con el lenguaje seleccionado, como guardarlo en una base de datos o procesarlo
        respuesta = {'mensaje': 'El lenguaje seleccionado fue ' + lenguaje_seleccionado}
        return jsonify(respuesta)
    else:
        return jsonify({'mensaje': 'La solicitud no es una solicitud JSON'})


@app.route('/', methods=['GET'])
def index():
    return render_template('mainPage.html')


@app.route('/recollectData', methods=['GET'])
def recollectData():
    return render_template('recollectData.html')


@app.route('/train', methods=['GET'])
def train():
    return "TRAIN"


@app.route('/start', methods=['GET'])
def start():
    return render_template('start.html')


@app.route('/result', methods=['GET'])
def result():
    return Response(results.resultsWeb(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/recollect', methods=['GET'])
def recollect():
    return Response(collectFrame.saveDataSet(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(host="localhost", debug=True)

    parser = ArgumentParser()
    parser.add_argument('--collect', action='store_true', help="Collects landmarks and stores them in coords.csv file")
    parser.add_argument('--nameSign', type=str, nargs='?', help="Use to specify which sign you want to save in "
                                                                "coords.csv")
    parser.add_argument('--train', action='store_true', help="Serves to train the data model")

    args = parser.parse_args()

    print(args)

    # Control de errores de argumentos
    if args.collect and args.train:
        raise TypeError("One argument or the other, not both")
    elif args.collect and args.nameSign is None:
        raise TypeError("Missing --nameSign letter")
    elif args.nameSign is not None and args.collect is False:
        raise TypeError("Missing --collect")

    # if args.collect:
    #     # Almaceno los datos en coords.csv
    #     collectFrame.cam_points(args.nameSign)
    # else:
    #     if args.train:
    #         # Hace el training y guarda el modelo en models.pkl
    #         train.trainingData()
    #     else:
    #         # Lee el models.pkl y lo compara los resultados en tiempo real
    #         #results.pickleFileResults()
