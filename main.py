import collectFrame
import train
import results
from argparse import ArgumentParser

if __name__ == '__main__':

    parser = ArgumentParser()
    parser.add_argument('--collect', action='store_true', help="Collects landmarks and stores them in coords.csv file")
    parser.add_argument('--nameSign', nargs='?', help="Use to specify which sign you want to save in coords.csv")
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

    if args.collect:
        # Almaceno los datos en coords.csv
        collectFrame.cam_points(args.nameSign)
    else:
        if args.train:
            # Hace el training y guarda el modelo en models.pkl
            train.trainingData()
        else:
            # Lee el models.pkl y lo compara los resultados en tiempo real
            results.pickleFileResults()
