import time

import cv2
import mediapipe as mp
import csv
import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression, RidgeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score
import pickle

total = []

def landmarks(puntos) -> None:
    #numCoords = len(puntos.pose_landmarks.landmark) + len(puntos.face_landmarks.landmark) + len(puntos.left_hand_landmarks.landmark) + len(puntos.right_hand_landmarks.landmark)
    numCoords = len(puntos.pose_landmarks.landmark) + len(puntos.left_hand_landmarks.landmark)
    print("Detect " + str(numCoords) + " landmarks")

    landmarks = ['class']
    for val in range(1, numCoords+1):
        landmarks += ['x{}'.format(val), 'y{}'.format(val), 'z{}'.format(val), 'v{}'.format(val)]
    if not os.path.isfile('coords.csv'):
        with open('coords.csv', mode='w', newline='') as f:
            mywriter = csv.writer(f)
            mywriter.writerow(landmarks)

def collectPointsRow(puntos, class_name):

    #puntosCara = puntos.face_landmarks.landmark
    #face_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosCara]).flatten())

    puntosPose = puntos.pose_landmarks.landmark
    pose_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosPose]).flatten())

    puntosManoIzq = puntos.left_hand_landmarks.landmark
    manoIzq_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosManoIzq]).flatten())

    #puntosManoDer = puntos.right_hand_landmarks.landmark
    #manoDer_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosManoDer]).flatten())

    #row = face_row+pose_row+manoIzq_row+manoDer_row
    row = pose_row + manoIzq_row

    row.insert(0, class_name)

    return row

def saveAllDataSignLanguage(cap,row):
    total.append(row)

    if len(total) == 300:
        for i in total:
            with open('coords.csv', mode='a+', newline='') as file:
                csv_writer = csv.writer(file)
                csv_writer.writerow(i)
                cap.release()
                cv2.destroyAllWindows()

def trainingData() -> None:
    df = pd.read_csv('coords.csv')
    X = df.drop('class', axis=1)
    y = df['class']

    X_train, X_test, y_train, y_test = train_test_split(X,y, test_size=0.3, random_state=1234)

    pipelines = {
        'lr' : make_pipeline(StandardScaler(), LogisticRegression()),
        'rc': make_pipeline(StandardScaler(), RidgeClassifier()),
        'rf': make_pipeline(StandardScaler(), RandomForestClassifier()),
        'gb': make_pipeline(StandardScaler(), GradientBoostingClassifier()),
    }

    fit_models = {}
    for algo, pipeline in pipelines.items():
        model = pipeline.fit(X_train.values, y_train)
        fit_models[algo] = model
    print(fit_models['rc'].predict(X_test))

    for algo, model in fit_models.items():
        yhat = model.predict(X_test)
        print(algo, accuracy_score(y_test, yhat))

    fit_models['rf'].predict(X_test)

    with open('body_language.pkl', 'wb') as f:
        pickle.dump(fit_models['rf'], f)

    with open('body_language.pkl', 'rb') as f:
        model = pickle.load(f)
        print(model)

        mp_drawing = mp.solutions.drawing_utils
        mp_holistic = mp.solutions.holistic
        mp_drawing_styles = mp.solutions.drawing_styles

        # For webcam input:
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
                    # If loading a video, use 'break' instead of 'continue'.
                    continue

                # Flip the image horizontally for a later selfie-view display, and convert
                # the BGR image to RGB.
                image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
                # To improve performance, optionally mark the image as not writeable to
                # pass by reference.
                image.flags.writeable = False
                results = holistic.process(image)

                # Draw landmark annotation on the image.
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
                cv2.imshow('MediaPipe Holistic', image)

                #if ((results.face_landmarks is None) or (results.pose_landmarks is None) or (results.left_hand_landmarks is None) or (results.right_hand_landmarks is None)):
                if (results.pose_landmarks is None) or (results.left_hand_landmarks is None):
                    print("Doesn't detect all points of the person")
                else:
                    #puntosCara = results.face_landmarks.landmark
                    #face_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosCara]).flatten())

                    puntosPose = results.pose_landmarks.landmark
                    pose_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosPose]).flatten())

                    puntosManoIzq = results.left_hand_landmarks.landmark
                    manoIzq_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosManoIzq]).flatten())

                    #puntosManoDer = results.right_hand_landmarks.landmark
                    #manoDer_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosManoDer]).flatten())

                    #row = face_row + pose_row + manoIzq_row + manoDer_row
                    row = pose_row + manoIzq_row

                    Z = pd.DataFrame([row])
                    body_language_class = model.predict(Z)[0]
                    body_language_prob = model.predict_proba(Z)[0]
                    print(body_language_class, body_language_prob)

                    coords = tuple(np.multiply(np.array((results.pose_landmarks.landmark[mp_holistic.PoseLandmark.LEFT_EAR].x,
                                                        results.pose_landmarks.landmark[mp_holistic.PoseLandmark.LEFT_EAR].y,
                                               )),[640,480]).astype(int))

                    cv2.rectangle(image,(0,0),(250, 60),(245, 117, 16), -1)
                    cv2.putText(image, 'CLASS', (95,12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                    cv2.putText(image, body_language_class, (90,40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

                    cv2.putText(image, 'PROB', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                    cv2.putText(image, str(round(body_language_prob[np.argmax(body_language_prob)],2)), (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1,
                                (255, 255, 255), 2, cv2.LINE_AA)

                    cv2.imshow('MediaPipe Holistic', image)

                # Cerrar CAM
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            cap.release()
            cv2.destroyAllWindows()



def cam_points(isCollectPhotos, class_name) -> None:

    if isCollectPhotos == True:
        mp_drawing = mp.solutions.drawing_utils
        mp_holistic = mp.solutions.holistic
        mp_drawing_styles = mp.solutions.drawing_styles

        # For webcam input:
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
              # If loading a video, use 'break' instead of 'continue'.
              continue

            # Flip the image horizontally for a later selfie-view display, and convert
            # the BGR image to RGB.
            image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
            # To improve performance, optionally mark the image as not writeable to
            # pass by reference.
            image.flags.writeable = False
            results = holistic.process(image)

            # Draw landmark annotation on the image.
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            mp_drawing.draw_landmarks(
                image, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION,
                mp_drawing.DrawingSpec(color=(80,109,11), thickness=1, circle_radius=1),
                mp_drawing.DrawingSpec(color=(80,256,120),thickness=1, circle_radius=1))
            mp_drawing.draw_landmarks(
                image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
                mp_drawing.DrawingSpec(color=(80, 109, 11), thickness=1, circle_radius=1),
                mp_drawing.DrawingSpec(color=(80, 256, 120), thickness=1, circle_radius=1))
            mp_drawing.draw_landmarks(
                image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS, mp_drawing_styles.get_default_hand_landmarks_style(),
                                mp_drawing_styles.get_default_hand_connections_style())
            mp_drawing.draw_landmarks(
                image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS, mp_drawing_styles.get_default_hand_landmarks_style(),
                                mp_drawing_styles.get_default_hand_connections_style())
            cv2.imshow('MediaPipe Holistic', image)


            #if ((results.face_landmarks is None) or (results.pose_landmarks is None) or (results.left_hand_landmarks is None) or (results.right_hand_landmarks is None)):
            if (results.pose_landmarks is None) or (results.left_hand_landmarks is None):
                print("Doesn't detect all points of the person")
            else:
                landmarks(results)
                row = collectPointsRow(results, class_name)
                saveAllDataSignLanguage(cap, row)
            #Cerrar CAM
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        cap.release()
        cv2.destroyAllWindows()
    else:
        print("***TRAINING DATA***")
        trainingData()

if __name__ == '__main__':
    #Enciende camara y dibuja los puntos del cuerpo, cara y manos.
    isCollectPhotos = False
    class_name = "E"
    cam_points(isCollectPhotos, class_name)
