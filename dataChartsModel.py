from sklearn.metrics import accuracy_score, classification_report, roc_curve, roc_auc_score, precision_recall_curve, average_precision_score, confusion_matrix
import pandas as pd
from matplotlib import pyplot as plt
import seaborn as sn
import joblib
from scipy import stats


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


def normalizedData(X_train, X_test) -> None:
    X_train_normalized = stats.zscore(X_train, axis=1)
    X_test_normalized = stats.zscore(X_test, axis=1)

    print("{} -> {}".format("X_train_normalized", X_train_normalized))
    print("{} -> {}".format("X_test_normalized", X_test_normalized))


def showCharts() -> None:
    print("*** SHOW CHARTS ***")
    with open('generatedFiles/neuralNetwork/randomForestClassifier.pkl', 'rb') as f:
        X_train, y_train, X_test, y_test, nameClass, gridPipe = joblib.load(f)

        normalizedData(X_train, X_test)

        y_predict = gridPipe.predict(X_test)
        print("Accuracy_score: " + str(accuracy_score(y_test, y_predict)))
        confusionMatrix(y_test, y_predict, nameClass)
        print("\nClassification report: \n\n" + classification_report(y_test, y_predict))

        # print("\n*************** GridSearchCV - With Pipeline ***************\n")
        # print("Mejor método:", gridPipe.best_params_['classifier__selected_model'])
        # print("Mejor puntuación:", gridPipe.best_score_)
        # TODO: 2 GRAFICAS MAS
