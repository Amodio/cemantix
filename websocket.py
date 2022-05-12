import asyncio
import websockets
import random
from gensim.models import KeyedVectors

async def websocket_request_handler(websocket, path):
    if not hasattr(websocket_request_handler, "sentWords"):
        setattr(websocket_request_handler, "sentWords", [])
    if not hasattr(websocket_request_handler, "wordIndex"):
        setattr(websocket_request_handler, "wordIndex", 1)
    if not hasattr(websocket_request_handler, "prev_client_data"):
        setattr(websocket_request_handler, "prev_client_data", '')
    client_data = await websocket.recv()
    print('<- ' + client_data)
    tmp = client_data.split("_")
    if len(tmp) != 2:
        panic("parse error")
    posTmp = tmp[0].split(",")
    negTmp = tmp[1].split(",")
    if "" in posTmp:
        posTmp.remove("")
    if "" in negTmp:
        negTmp.remove("")
    if websocket_request_handler.prev_client_data == client_data:
        setattr(websocket_request_handler, "wordIndex", websocket_request_handler.wordIndex + 1)
    else:
        websocket_request_handler.wordIndex = 1
        setattr(websocket_request_handler, "prev_client_data", client_data)
    if websocket_request_handler.wordIndex <= 0:
        setattr(websocket_request_handler, "wordIndex", 1)
    while len(tmp) == 2:
        response_data = ''
        if len(posTmp) > 0 or len(negTmp) > 0:
            response_data = model.most_similar(positive=posTmp, negative=negTmp, topn=websocket_request_handler.wordIndex)[websocket_request_handler.wordIndex-1][0]
        else:
            response_data = random.sample(model.index_to_key, 1)[0]
        if response_data and response_data not in websocket_request_handler.sentWords:
            websocket_request_handler.sentWords.append(response_data)
            break
        else:
            websocket_request_handler.wordIndex += 1
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
