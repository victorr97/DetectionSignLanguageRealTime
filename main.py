import collectFrame
import train
import results

if __name__ == '__main__':
    isCollectPhotos = False
    class_name = "TEST"
    trainData = False

    if isCollectPhotos:
        # Almaceno los datos en coords.csv
        collectFrame.cam_points(class_name)
    else:
        if trainData:
            # Hace el training y guarda el modelo en models.pkl
            train.trainingData()
        else:
            # Lee el models.pkl y lo compara los resultados en tiempo real
            results.pickleFileResults()
