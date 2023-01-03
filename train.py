import joblib
import pandas as pd
from matplotlib import pyplot as plt
from sklearn.dummy import DummyClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression, RidgeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
import seaborn as sn
import pickle
from sklearn.pipeline import Pipeline
from scipy import stats


def confusionMatrix(y_test, y_predict, nameClass) -> None:
    cm = confusion_matrix(y_test, y_predict)
    cm_df = pd.DataFrame(cm,
                         index=[nameClass],
                         columns=[nameClass])
    plt.figure(figsize=(6, 4))
    sn.set(font_scale=1)  # for label size
    sn.heatmap(cm_df, annot=True, annot_kws={"size": 14})  # font size
    plt.title('Confusion Matrix')
    plt.ylabel('Real Values')
    plt.xlabel('Predicted Values')
    plt.show()


def trainingData() -> None:
    print("***TRAINING DATA OF COORDS***")

    df = pd.read_csv('generatedFiles/coords.csv')
    X = df.drop('class', axis=1)
    y = df['class']
    name = y.array
    nameClass = []
    [nameClass.append(x) for x in name if x not in nameClass]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1234)

    X_train_normalized = stats.zscore(X_train, axis=1)
    X_test_normalized = stats.zscore(X_test, axis=1)

    print("{} -> {}".format("X_train_normalized", X_train_normalized))
    print("{} -> {}".format("X_test_normalized", X_test_normalized))

    pipe = Pipeline(steps=[
        ('scaler', StandardScaler()),
        ('classifier', DummyClassifier()),
    ])

    params = {
        'classifier': [LogisticRegression(), RidgeClassifier(), RandomForestClassifier(), GradientBoostingClassifier()],
    }

    gridPipe = GridSearchCV(pipe, params, scoring='accuracy', cv=10, refit=True)
    gridPipe.fit(X_train, y_train)

    y_predict = gridPipe.predict(X_test)
    print(gridPipe.best_params_['classifier'], accuracy_score(y_test, y_predict))
    confusionMatrix(y_test, y_predict, nameClass)

    print("\n*************** GridSearchCV - con Pipeline ***************\n")
    print("Mejor método:", gridPipe.best_params_['classifier'])
    print("Mejor puntuación:", gridPipe.best_score_)

    with open('generatedFiles/bestModel.pkl', 'wb') as f:
        joblib.dump(gridPipe, f, compress=1)

    print("\n***FINISHED TRAINING***")
