import os
from gensim.models import KeyedVectors

def get_file_size(file_path):
    file_size_bytes = os.path.getsize(file_path)
    file_size_megabytes = file_size_bytes / 1024 / 1024
    return f"{file_size_megabytes:.2f} MB"

# Each filename in references/ contains the 999 closest words according to the game.
words=[]
for path in os.listdir('./references/'):
    words.append(path)

# Test each model
model_paths=[]
for path in os.listdir('../models/'):
    model_paths.append(path)

for model_path in model_paths:
    model = KeyedVectors.load_word2vec_format(os.path.join('../models/', model_path), binary=True, unicode_errors='ignore')
    for word in words:
        results = model.most_similar(positive=[word], negative=[], topn=999)
        with open(os.path.join('./results/', model_path + '_' + word), "w") as oFile:
            for result in results:
                oFile.write(result[0] + '\n')

# Write how many words returned by the model (top 999) match the reference words
with open('benchmark.txt', "w") as oFile:
    oFile.write('Words tested: ' + ' '.join(words) + '\n')
    means = []
    lines = []
    for model_path in model_paths:
        results = []
        for word in words:
            with open(os.path.join('./references/', word), "r") as f:
                contentRef = f.read().splitlines()
            with open(os.path.join('./results/', model_path + '_' + word), "r") as f:
                content = f.read().splitlines()
            result = 0
            for c in content:
                if c in contentRef:
                    result += 1
            results.append(result)
        mean = 0
        for res in results:
            mean += res
        mean /= len(results) * 10
        means.append(mean)
        lines.append(model_path + ' ' + get_file_size(os.path.join('../models/', model_path)) + ' ' + str(round(mean, 2)) + '% ' + ' '.join([str(i) for i in results]) + '\n')
    for line_index in reversed(sorted(range(len(means)),key=means.__getitem__)):
        oFile.write(lines[line_index])
