from sklearn.linear_model import RidgeClassifier
from sklearn.metrics import accuracy_score, classification_report, roc_curve, auc, confusion_matrix
import pandas as pd
from matplotlib import pyplot as plt
import seaborn as sn
import joblib
from scipy import stats
import numpy as np
from sklearn.preprocessing import label_binarize
from scipy.interpolate import interp1d
from itertools import cycle
from sklearn.metrics import precision_recall_curve
from sklearn.metrics import average_precision_score

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


def ROCandPR(y_test, gridPipe, X_test) -> None:
    if isinstance(RidgeClassifier(), type(gridPipe.estimator)):
        decision_scores = gridPipe.decision_function(X_test)
        y_prob = 1 / (1 + np.exp(-decision_scores))
    else:
        y_prob = gridPipe.predict_proba(X_test)

    lb = label_binarize(y_test, classes=np.unique(y_test))
    n_classes = lb.shape[1]
    colors = cycle(
        ['navy', 'turquoise', 'darkorange', 'cornflowerblue', 'teal', 'red', 'green', 'blue', 'orange', 'brown',
         'gray', 'cyan', 'olive', 'magenta', 'peru', 'pink', 'sienna', 'crimson', 'darkkhaki', 'limegreen',
         'salmon', 'slateblue', 'deeppink', 'indianred', 'dodgerblue', 'mediumseagreen'])
    linestyles = ['-', '--', '-.', ':', '-', '--', '-.', ':', '-', '--', '-.', ':', '-', '--', '-.', ':', '-', '--',
                  '-.', ':', '-', '--', '-.', ':', '-', '--']

    precision = dict()
    recall = dict()
    average_precision = dict()

    fig, ax1 = plt.subplots(figsize=(10, 8))
    fig, ax2 = plt.subplots(figsize=(10, 8))

    base_fpr = np.linspace(0, 1, 50)
    for i, color in zip(range(n_classes), colors):
        # Valores de los verdaderos positivos (TPR) y los falsos positivos (FPR)
        fpr, tpr, _ = roc_curve(lb[:, i], y_prob[:, i])
        roc_auc = auc(fpr, tpr)
        tpr_interp = interp1d(fpr, tpr, kind='linear')(base_fpr)
        fpr_interp = base_fpr
        ax1.plot(fpr_interp, tpr_interp, color=color, linestyle=linestyles[i],
                 label='Curva ROC de clase {0} (AUC = {1:0.2f})'.format(chr(ord('A') + i), roc_auc))

        precision[i], recall[i], _ = precision_recall_curve(lb[:, i], y_prob[:, i])
        average_precision[i] = average_precision_score(lb[:, i], y_prob[:, i])

        ax2.plot(recall[i], precision[i], color=color, lw=2,
                 label='Curva PR de la clase {0} (AP = {1:0.2f})'.format(chr(ord('A') + i), average_precision[i]))


    # Calcula la curva ROC macro media
    fpr_macro, tpr_macro, _ = roc_curve(lb.ravel(), y_prob.ravel())
    roc_auc_macro = auc(fpr_macro, tpr_macro)
    tpr_macro_interp = interp1d(fpr_macro, tpr_macro, kind='linear')(base_fpr)
    fpr_macro_interp = base_fpr
    ax1.plot(fpr_macro_interp, tpr_macro_interp, color='deeppink', linestyle=':',
             label='Curva media ROC (AUC = {0:0.2f})'.format(roc_auc_macro))

    # A "micro-average": unifica los verdaderos positivos, los falsos positivos y los falsos negativos de todas las clases.
    precision["micro"], recall["micro"], _ = precision_recall_curve(lb.ravel(), y_prob.ravel())
    average_precision["micro"] = average_precision_score(lb, y_prob, average="micro")

    ax2.plot(recall["micro"], precision["micro"], color='gold', lw=2,
             label='Curva PR media (AP = {0:0.2f})'.format(average_precision["micro"]))

    # Configura la leyenda, los ejes y el título
    ax1.legend(loc='lower right')
    ax1.set_xlim([0.0, 1.0])
    ax1.set_ylim([0.0, 1.0])
    ax1.set_xlabel('Tasa de Falsos Positivos')
    ax1.set_ylabel('Tasa de Verdaderos Positivos')
    ax1.set_title('Curva ROC')

    ax2.set_xlabel('Recall')
    ax2.set_ylabel('Precision')
    ax2.set_ylim([0.0, 1.05])
    ax2.set_xlim([0.0, 1.0])
    ax2.set_title('Curva PR')
    ax2.legend(loc='lower right')

    plt.show()


def showCharts() -> None:
    print("*** SHOW CHARTS ***")
    with open('generatedFiles/neuralNetwork/ridgeClassifier.pkl', 'rb') as f:
        X_train, y_train, X_test, y_test, nameClass, gridPipe = joblib.load(f)

        normalizedData(X_train, X_test)

        y_predict = gridPipe.predict(X_test)
        print("Accuracy_score: " + str(accuracy_score(y_test, y_predict)))
        confusionMatrix(y_test, y_predict, nameClass)

        # print("\n*************** GridSearchCV - With Pipeline ***************\n")
        # print("Mejor método:", gridPipe.best_params_['classifier__selected_model'])
        # print("Mejor puntuación:", gridPipe.best_score_)
        ROCandPR(y_test, gridPipe, X_test)

        print("\nClassification report: \n\n" + classification_report(y_test, y_predict))
