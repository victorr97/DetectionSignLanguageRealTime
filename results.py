import joblib
import mediapipe as mp
import numpy as np
import cv2
import pandas as pd
import landmarks
from sklearn.linear_model import RidgeClassifier

def pickleFileResults():
    print("*** RESULTS ***")
    with open('generatedFiles/neuralNetworkAllAlphabet.pkl', 'rb') as f:
        model = joblib.load(f)

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
                cv2.imshow('MediaPipe Holistic - RESULT', image)

                # if ((results.face_landmarks is None) or (results.pose_landmarks is None) or (results.left_hand_landmarks is None) or (results.right_hand_landmarks is None)):
                if (results.pose_landmarks is None) or (results.left_hand_landmarks is None):
                    print("Doesn't detect all points of the person")
                else:
                    row = landmarks.pointsRealTime(results)
                    Z = pd.DataFrame([row])

                    """
                    #Si el clasificador es RidgeClassifier almaceno el name y la prob. de diferente manera
                    if isinstance(RidgeClassifier(), type(model.best_estimator_.named_steps.classifier)):
                        body_language_class = model.predict(Z)[0]
                        d = model.decision_function(Z)[0]
                        body_language_prob = np.exp(d) / np.sum(np.exp(d))
                    else:
                        body_language_class = model.predict(Z)[0]
                        body_language_prob = model.predict_proba(Z)[0]
                    """

                    body_language_class = model.predict(Z)[0]
                    body_language_prob = model.predict_proba(Z)[0]

                    """

                    body_language_class = model.predict(Z)[0]
                    d = model.decision_function(Z)[0]
                    body_language_prob = np.exp(d) / np.sum(np.exp(d))
                    
                    """

                    print("Selected Class: " + body_language_class)
                    classes = model.best_estimator_.classes_
                    probAllClasses = zip(classes, body_language_prob)
                    for i in probAllClasses:
                        print(i)

                    coords = tuple(
                        np.multiply(np.array((results.pose_landmarks.landmark[mp_holistic.PoseLandmark.LEFT_EAR].x,
                                              results.pose_landmarks.landmark[mp_holistic.PoseLandmark.LEFT_EAR].y,
                                              )), [640, 480]).astype(int))

                    cv2.rectangle(image, (0, 0), (250, 60), (245, 117, 16), -1)
                    cv2.putText(image, 'CLASS', (95, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                    cv2.putText(image, body_language_class, (90, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255),
                                2, cv2.LINE_AA)

                    cv2.putText(image, 'PROB', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                    cv2.putText(image, str(round(body_language_prob[np.argmax(body_language_prob)], 2)), (10, 40),cv2.FONT_HERSHEY_SIMPLEX, 1,(255, 255, 255), 2, cv2.LINE_AA)
                    cv2.imshow('MediaPipe Holistic - RESULT', image)

                # Cerrar CAM
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            cap.release()
            cv2.destroyAllWindows()
