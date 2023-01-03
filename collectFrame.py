import mediapipe as mp
import cv2
import numpy as np

import landmarks
import csv

total = []
num = 0

def cam_points(class_name) -> None:
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
                cv2.imshow('MediaPipe Holistic Collect Photos', image)

                # if ((results.face_landmarks is None) or (results.pose_landmarks is None) or (results.left_hand_landmarks is None) or (results.right_hand_landmarks is None)):
                if (results.pose_landmarks is None) or (results.left_hand_landmarks is None):
                    print("Doesn't detect all points of the person")
                else:
                    global num
                    #Para empezar a almacenar datos has de clicar las teclas 1 y luego 's'
                    if cv2.waitKey(1) & 0xFF == ord('s'):
                        num = 1
                    if num == 1:
                        landmarks.formatLandmarks(results)
                        row = landmarks.collectPointsRow(results, class_name)
                        saveAllDataSignLanguage(cap, row)
                # Cerrar CAM
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
        cap.release()
        cv2.destroyAllWindows()


def saveAllDataSignLanguage(cap, row):
    total.append(row)

    if len(total) == 30:
        for i in total:
            with open('generatedFiles/coords.csv', mode='a+', newline='') as file:
                csv_writer = csv.writer(file)
                csv_writer.writerow(i)
                cap.release()
                cv2.destroyAllWindows()
