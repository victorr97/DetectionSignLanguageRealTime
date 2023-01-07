import joblib
import pandas as pd
from matplotlib import pyplot as plt
from pipelinehelper import PipelineHelper
from sklearn.dummy import DummyClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler, MaxAbsScaler
from sklearn.linear_model import LogisticRegression, RidgeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
import seaborn as sn
import pickle
from sklearn.pipeline import Pipeline
from scipy import stats
from sklearn.svm import LinearSVC


def gridSearchCrossValidation(X_train, y_train):
    k_range = list(range(1, 11))
    weight_options = ['uniform', 'distance']

    pipe = Pipeline([
        ('scaler', PipelineHelper([
            ('std', StandardScaler()),
            ('max', MaxAbsScaler()),
        ])),
        ('classifier', PipelineHelper([
            ('knn', KNeighborsClassifier()),
            ('rc', RidgeClassifier()),
            ('gb', GradientBoostingClassifier()),
            ('rf', RandomForestClassifier()),
            ('lr', LogisticRegression()),
        ])),
    ])

    param_grid_pipe = {
        'scaler__selected_model': pipe.named_steps['scaler'].generate({
            'std__with_mean': [True, False],
            'std__with_std': [True, False],
            'max__copy': [True],
        }),
        'classifier__selected_model': pipe.named_steps['classifier'].generate({
            'knn__n_neighbors': k_range,
            'knn__weights': weight_options,
            'rc__alpha': [1.0],
            'rc__solver': ['auto'],
            'gb__n_estimators': [100],
            'gb__learning_rate': [1.0],
            'rf__n_estimators': [100],
            'lr__solver': ['lbfgs'],
        })
    }

    print("\n***Starting training***\n")
    gridPipe = GridSearchCV(pipe, param_grid_pipe, scoring='accuracy', cv=10, refit=True)
    gridPipe.fit(X_train, y_train)
    print("\n***Finished training***\n")

    return gridPipe

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

    gridPipe = gridSearchCrossValidation(X_train, y_train)

    y_predict = gridPipe.predict(X_test)
    print(gridPipe.best_params_['classifier__selected_model'], accuracy_score(y_test, y_predict))
    confusionMatrix(y_test, y_predict, nameClass)

    print("\n*************** GridSearchCV - With Pipeline ***************\n")
    print("Mejor método:", gridPipe.best_params_['classifier__selected_model'])
    print("Mejor puntuación:", gridPipe.best_score_)

    with open('generatedFiles/bestModel.pkl', 'wb') as f:
        joblib.dump(gridPipe, f, compress=1)
        print("\n*************** GUARDADO MODELO EN ARCHIVO ***************\n")

    print("\n***FINISHED TRAINING***")
