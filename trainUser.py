import joblib
import mediapipe as mp
import numpy as np
import cv2
import pandas as pd
import landmarks

selectSignTrain = ""
letterDoneRight = "False"
list_letters_realtime = []
NUMBER_CORRECT = 20
recognisedPerson = "False"
firstTimeRecognisedPerson = "False"
counter = 0


def getCounter():
    return counter


def setCounter(reset):
    global counter
    if reset:
        counter = 0
    else:
        counter += 1


def getFirstTimeRecognisedPerson():
    return firstTimeRecognisedPerson


def setFirstTimeRecognisedPerson(firstTime) -> None:
    global firstTimeRecognisedPerson
    firstTimeRecognisedPerson = firstTime


def setSelectSignTrain(selectLetterUser) -> None:
    global selectSignTrain
    selectSignTrain = selectLetterUser


def setLetterDoneRight(letterRight) -> None:
    global letterDoneRight
    letterDoneRight = letterRight


def getRecognisedPerson():
    return recognisedPerson


def setRecognisedPerson(recognised) -> None:
    global recognisedPerson
    recognisedPerson = recognised


def getCountArrayIfCorrect():
    global letterDoneRight
    global selectSignTrain
    if list_letters_realtime.count(selectSignTrain) >= NUMBER_CORRECT:
        letterDoneRight = "True"
        selectSignTrain = ""
        resetListLetters()
    else:
        letterDoneRight = "False"
    return letterDoneRight


def resetListLetters() -> None:
    global list_letters_realtime
    list_letters_realtime = []
    setCounter(True)


def getListLetters():
    return list_letters_realtime


def trainWeb():
    print("*** TRAIN ***")
    with open('generatedFiles/neuralNetwork/dataSet192landmarks.pkl', 'rb') as f:
        MAX_ARRAY = 500
        model = joblib.load(f)[5]

        mp_drawing = mp.solutions.drawing_utils
        mp_holistic = mp.solutions.holistic
        mp_drawing_styles = mp.solutions.drawing_styles

        # WEBCAM:
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

                cv2.rectangle(image, (0, 0), (200, 60), (245, 117, 16), -1)
                cv2.putText(image, 'LETRA', (95, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                cv2.putText(image, 'PROB.', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

                if getRecognisedPerson() == "False":
                    (flag, encodedImage) = cv2.imencode(".jpg", image)
                    if not flag:
                        continue
                    yield b'--frame\r\n' b'Content-type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n'

                if (results.pose_landmarks is None) or (results.left_hand_landmarks is None):
                    setRecognisedPerson("False")
                else:
                    setRecognisedPerson("True")
                    if getCounter() == 0:
                        setFirstTimeRecognisedPerson("True")
                    row = landmarks.pointsRealTime(results)
                    Z = pd.DataFrame([row])

                    body_language_class = model.predict(Z)[0]
                    body_language_prob = model.predict_proba(Z)[0]

                    if getCounter() == MAX_ARRAY:
                        resetListLetters()
                        setCounter(True)

                    getListLetters().append(body_language_class)
                    setCounter(False)

                    # print("Selected Class: " + body_language_class)
                    # classes = model.best_estimator_.classes_
                    # probAllClasses = zip(classes, body_language_prob)
                    # for i in probAllClasses:
                    #     print(i)

                    cv2.putText(image, str(round(body_language_prob[np.argmax(body_language_prob)], 2)), (10, 40),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
                    cv2.putText(image, body_language_class, (110, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2,
                                cv2.LINE_AA)
                    (flag, encodedImage) = cv2.imencode(".jpg", image)

                    if not flag:
                        continue
                    yield b'--frame\r\n' b'Content-type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n'
