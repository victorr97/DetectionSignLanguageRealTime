import collectFrame

if __name__ == '__main__':
    isCollectPhotos = False
    class_name = "TEST"
    trainData = False

    # Se entrenan datos si la variable 'isCollectPhotos' es False
    collectFrame.cam_points(isCollectPhotos, class_name, trainData)
