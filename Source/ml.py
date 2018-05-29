from sklearn import tree
from sklearn.externals import joblib
import sys, json, numpy as np

clf = joblib.load('data.pkl')

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    lines = read_in()

    if len(lines) == 5:
        print (clf.predict([lines]))
    else:
        label = lines.pop()
        clf.fit([lines], [label])
        print([label])

#start process
if __name__ == '__main__':
    main()

# Save model
joblib.dump(clf, 'data.pkl')
