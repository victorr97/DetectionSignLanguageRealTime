import joblib
import numpy as np
import pandas as pd
import warnings
from matplotlib import pyplot as plt
from pipelinehelper import PipelineHelper
from sklearn.exceptions import ConvergenceWarning
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler, MaxAbsScaler
from sklearn.linear_model import LogisticRegression, RidgeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report, roc_curve, roc_auc_score, precision_recall_curve, average_precision_score
from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sn
from sklearn.pipeline import Pipeline
from scipy import stats


def gridSearchCrossValidation(X_train, y_train):
    # k_range = list(range(1, 11))
    # weight_options = ['uniform', 'distance']

    pipe = Pipeline([
        ('scaler', PipelineHelper([
            ('std', StandardScaler()),
            ('max', MaxAbsScaler()),
        ])),
        ('classifier', PipelineHelper([
            # ('knn', KNeighborsClassifier()),
            ('rc', RidgeClassifier()),
            ('gb', GradientBoostingClassifier()),
            ('rf', RandomForestClassifier()),
            ('lr', LogisticRegression()),
        ])),
    ])

    parameters = {'solver': ['lbfgs'], 'max_iter': [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
                  'alpha': 10.0 ** -np.arange(1, 10), 'hidden_layer_sizes': np.arange(10, 15),
                  'random_state': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}

    param_grid_pipe = {
        'scaler__selected_model': pipe.named_steps['scaler'].generate({
            'std__with_mean': [True, False],
            'std__with_std': [True, False],
            'max__copy': [True],
        }),
        'classifier__selected_model': pipe.named_steps['classifier'].generate({
            # 'knn__n_neighbors': k_range,
            # 'knn__weights': weight_options,
            'rc__alpha': [1.0],
            'rc__solver': ['auto'],
            'gb__n_estimators': [100],
            'gb__learning_rate': [1.0],
            'rf__n_estimators': [100],
            'lr__solver': ['lbfgs'],
        })
    }

    parametersNeuronalNetwork = {
        'hidden_layer_sizes': [(100,), (150,), (200,)],
        'activation': ['relu'],
        'solver': ['adam'],
        'batch_size': [16, 32, 64],
        'max_iter': [100, 200, 300],
    }

    parametersRidgeClassifier = {
        'alpha': [0.1, 1, 10],
        'fit_intercept': [True, False],
        'normalize': [True, False]
    }

    parametersGradientBoosting = {
        'learning_rate': [1],
        'n_estimators': [100],
        'max_depth': [5],
        'min_samples_split': [5],
        'min_samples_leaf': [2]
    }

    parametersRandomForest = {'n_estimators': [10, 50, 100],
                              'max_depth': [None, 5, 10],
                              'min_samples_split': [2, 5, 10]}

    parametersLogisticRegression = {'penalty': ['l1', 'l2'],
                                    'C': [0.1, 1, 10],
                                    'solver': ['liblinear']}

    print("\n***Starting training***\n")
    warnings.filterwarnings('ignore', category=ConvergenceWarning)
    #270 iteraciones para acabar RedNeuronal
    gridPipe = GridSearchCV(RandomForestClassifier(), parametersRandomForest, scoring='accuracy', cv=10, refit=True, verbose=2)
    gridPipe.fit(X_train, y_train)
    print("\n***Finished training***\n")

    return gridPipe


def confusionMatrix(y_test, y_predict, nameClass) -> None:
    cm = confusion_matrix(y_test, y_predict)
    cm_df = pd.DataFrame(cm,
                         index=[nameClass],
                         columns=[nameClass])
    plt.figure(figsize=(10, 8))
    sn.set(font_scale=1)  # for label size
    sn.heatmap(cm_df, annot=True, annot_kws={"size": 8})  # font size
    plt.title('Confusion Matrix')
    plt.ylabel('Real Values')
    plt.xlabel('Predicted Values')
    plt.show()


def trainingData():
    print("***TRAINING DATA OF COORDS***")

    df = pd.read_csv('generatedFiles/landmarks/dataSet.csv')
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
    print("Accuracy_score: " + str(accuracy_score(y_test, y_predict)))
    confusionMatrix(y_test, y_predict, nameClass)
    print("\nClassification report: \n\n" + classification_report(y_test, y_predict))

    print("\n*************** GridSearchCV - With Pipeline ***************\n")
    #print("Mejor método:", gridPipe.best_params_['classifier__selected_model'])
    #print("Mejor puntuación:", gridPipe.best_score_)

    with open('generatedFiles/neuralNetwork/randomForestClassifierTest.pkl', 'wb') as f:
        joblib.dump((X_train, y_train, X_test, y_test, gridPipe), f, compress=1)
        print("\n*************** GUARDADO MODELO EN ARCHIVO ***************\n")

    print("\n***FINISHED TRAINING***")
