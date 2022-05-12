import asyncio
import websockets
import random
from gensim.models import KeyedVectors

sentWords = []
wordIndex = 1
prev_client_data = ''

async def websocket_request_handler(websocket, path):
    global sentWords
    global wordIndex
    global prev_client_data
    client_data = await websocket.recv()
    print('<- ' + client_data)
    tmp = client_data.split("_")
    if len(tmp) != 2:
        panic("parse error")
    posTmp = tmp[0].split(",")
    negTmp = tmp[1].split(",")
    if prev_client_data == client_data:
        wordIndex += 1
    else:
        wordIndex = 1
        prev_client_data = client_data
    if wordIndex <= 0:
        wordIndex = 1
    while len(tmp) == 2:
        response_data = ''
        if "" in posTmp:
            posTmp.remove("")
        if "" in negTmp:
            negTmp.remove("")
        if len(posTmp) > 0 or len(negTmp) > 0:
            response_data = model.most_similar(positive=posTmp, negative=negTmp, topn=wordIndex)[wordIndex-1][0]
        else:
            response_data = random.sample(model.index_to_key, 1)[0]
        if response_data not in sentWords:
            sentWords.append(response_data)
            break
        else:
            wordIndex += 1
    print('=> ' + response_data)
    await websocket.send(response_data)

def start_websocket_server(host, port_number):
    websocket_server = websockets.serve(websocket_request_handler, host, port_number)
    print('Listening on port: ' + str(port_number))
    asyncio.get_event_loop().run_until_complete(websocket_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    global model
    print('Loading the model...', end = '', flush = True)
    model = KeyedVectors.load_word2vec_format("frWac_non_lem_no_postag_no_phrase_200_cbow_cut100.bin", binary=True, unicode_errors="ignore")
    print(' OK')
    start_websocket_server("localhost", 8080)
