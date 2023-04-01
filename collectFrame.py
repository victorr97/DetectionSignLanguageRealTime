import mediapipe as mp
import cv2

import landmarks
import csv

total = []
num = 0
selectSign = ""
detectPerson = "False"
startSaveData = ""
finishSaveData = "False"
detectPersonWhenSaveData = "False"


def setSelectSign(selectUser) -> None:
    global selectSign
    selectSign = selectUser


def getPerson():
    return detectPerson


def getPersonWhenSaveData():
    return detectPerson


def setStartSaveData(saveData) -> None:
    global startSaveData
    startSaveData = saveData


def setFinishSaveData(saveData):
    global finishSaveData
    finishSaveData = saveData


def getFinishSaveData():
    return finishSaveData


def saveDataSet() -> None:
    print("*** SAVE DATA ***")
    mp_drawing = mp.solutions.drawing_utils
    mp_holistic = mp.solutions.holistic
    mp_drawing_styles = mp.solutions.drawing_styles

    # WEBCAM
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Failed to open camera")
    with mp_holistic.Holistic(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5) as holistic:
        while cap.isOpened():
            success, image = cap.read()
            if not success:
                print("Ignoring empty camera frame.")
                continue

            image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            results = holistic.process(image)

            # Draw landmark on the image
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            mp_drawing.draw_landmarks(
                image, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION,
                mp_drawing.DrawingSpec(color=(80, 109, 11), thickness=1, circle_radius=1),
                mp_drawing.DrawingSpec(color=(80, 256, 120), thickness=1, circle_radius=1))
            mp_drawing.draw_landmarks(
                image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
                mp_drawing.DrawingSpec(color=(80, 109, 11), thickness=1, circle_radius=1),
                mp_drawing.DrawingSpec(color=(80, 256, 120), thickness=1, circle_radius=1))
            mp_drawing.draw_landmarks(
                image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style())
            mp_drawing.draw_landmarks(
                image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style())
            (flag, encodedImage) = cv2.imencode(".jpg", image)
            if not flag:
                continue
            yield b'--frame\r\n' b'Content-type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n'


            # if ((results.face_landmarks is None) or (results.pose_landmarks is None) or (results.left_hand_landmarks is None) or (results.right_hand_landmarks is None)):
            if (results.pose_landmarks is not None) and (results.left_hand_landmarks is not None):
                global detectPerson
                detectPerson = "True"

                #Si hay letra y podemos empezar a guardar, se almacena en el archivo csv
                if len(selectSign) != 0 and startSaveData == "True":
                    print("SI SE ESTA GUARDANDO")
                    global detectPersonWhenSaveData
                    detectPersonWhenSaveData = "True"
                    landmarks.formatLandmarks(results)
                    row = landmarks.collectPointsRow(results, selectSign)
                    saveAllDataSignLanguage(row)
            else:
                detectPerson = "False"
                if len(selectSign) != 0 and startSaveData == "True":
                    print("NO SE ESTA GUARDANDO ")
                    detectPersonWhenSaveData = "False"
                    #Si empieza a guardar datos y no se detecta el usuario dejo de guardar.
                    total.clear()
                    setStartSaveData("False")

            # Cerrar CAM
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    cap.release()
    cv2.destroyAllWindows()


def saveAllDataSignLanguage(row):
    total.append(row)

    if len(total) == 2:
        for i in total:
            with open('generatedFiles/landmarks/dataSet.csv', mode='a+', newline='') as file:
                csv_writer = csv.writer(file)
                csv_writer.writerow(i)
        #Una vez guardado reseteo las variables
        total.clear()
        setFinishSaveData("True")
        setStartSaveData("False")