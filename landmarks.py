import csv
import os
import numpy as np


def pointsRealTime(results):
    # puntosCara = results.face_landmarks.landmark
    # face_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosCara]).flatten())

    # puntosPose = results.pose_landmarks.landmark
    # pose_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosPose]).flatten())

    puntosManoIzq = results.left_hand_landmarks.landmark
    manoIzq_row = list(np.array(
        [[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in
         puntosManoIzq]).flatten())

    # puntosManoDer = results.right_hand_landmarks.landmark
    # manoDer_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosManoDer]).flatten())

    # row = face_row + pose_row + manoIzq_row + manoDer_row
    row = manoIzq_row

    return row

def formatLandmarks(puntos) -> None:
    # numCoords = len(puntos.pose_landmarks.landmark) + len(puntos.face_landmarks.landmark) + len(puntos.left_hand_landmarks.landmark) + len(puntos.right_hand_landmarks.landmark)
    numCoords = len(puntos.left_hand_landmarks.landmark)
    print("Detect " + str(numCoords) + " landmarks")

    landmarks = ['class']
    for val in range(1, numCoords + 1):
        landmarks += ['x{}'.format(val), 'y{}'.format(val), 'z{}'.format(val), 'v{}'.format(val)]
    if not os.path.isfile('generatedFiles/coords.csv'):
        with open('generatedFiles/coords.csv', mode='w', newline='') as f:
            mywriter = csv.writer(f)
            mywriter.writerow(landmarks)


def collectPointsRow(puntos, class_name):
    # puntosCara = puntos.face_landmarks.landmark
    # face_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosCara]).flatten())

    # puntosPose = puntos.pose_landmarks.landmark
    # pose_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosPose]).flatten())

    puntosManoIzq = puntos.left_hand_landmarks.landmark
    manoIzq_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosManoIzq]).flatten())

    #puntosManoDer = puntos.right_hand_landmarks.landmark
    #manoDer_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in puntosManoDer]).flatten())

    # row = face_row+pose_row+manoIzq_row+manoDer_row
    row = manoIzq_row

    row.insert(0, class_name)

    return row
