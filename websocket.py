import websockets
import asyncio
from gensim.models import KeyedVectors

# create handler for each connection
async def websocket_request_handler(websocket, path):
    client_data = await websocket.recv()
    print('Received: ' + client_data)
    tmp = client_data.split("0")
    response_data = ''
    if len(tmp) == 3:
        posTmp = tmp[0].split(",")
        negTmp = tmp[1].split(",")
        indexTmp = int("0" + tmp[2])
        if indexTmp <= 0:
            indexTmp = 1
        if len(tmp[0]) > 0 and len(posTmp) > 0:
            if len(tmp[1]) > 0 and len(negTmp) > 0:
                response_data = model.most_similar(positive=posTmp, negative=negTmp, topn=indexTmp)[indexTmp-1][0]
            else:
                response_data = model.most_similar(positive=posTmp, topn=indexTmp)[indexTmp-1][0]
        elif len(tmp[1]) > 0 and len(tmp[1]) > 0:
            response_data = model.most_similar(negative=negTmp, topn=indexTmp)[indexTmp-1][0]
    if len(response_data) == 0:
        response_data = model.most_similar(negative=['c'], topn=1)[0][0]
    # send the data back to the client websocket.
    await websocket.send(response_data)

# create and start the websocket server listen on the provided host and port number.
def start_websocket_server(host, port_number):
    websocket_server = websockets.serve(websocket_request_handler, host, port_number)
    print('Listening on port: ' + str(port_number))
    asyncio.get_event_loop().run_until_complete(websocket_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    global model
    print('Loading the modele...', end = '', flush = True)
    model = KeyedVectors.load_word2vec_format( "frWac_non_lem_no_postag_no_phrase_200_cbow_cut100.bin", binary=True, unicode_errors="ignore")
    print(' OK')
    start_websocket_server("localhost", 8080)
