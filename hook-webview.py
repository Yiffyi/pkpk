import frida
import sys
import base64
import json

jscode = open("hook-webview.js", encoding="utf8").read()
process = frida.get_usb_device().attach('小猿口算')

script = process.create_script(jscode)

def handle_decrypt_data(b64data: str):
    data = base64.b64decode(b64data).decode('utf-8')
    print(f"[FRIDA] received decrypted data={data}")
    data = json.loads(data)
    for q in data['examVO']['questions']:
        print(q['answers'])
    return

def patch_pk_result(b64data: str):
    json_data = base64.b64decode(b64data).decode('utf-8')
    data = json.loads(json_data)
    # print(f"[FRIDA] decoded pre-upload data={data}")
    data['costTime'] = 2000
    print(f"[FRIDA] patched costTime -> {data['costTime']}")
    
    json_data = json.dumps(data)
    b64data = base64.b64encode(json_data.encode()).decode('utf-8')
    return b64data

def handle_encrypt_data(b64data: str):
    json_data = base64.b64decode(b64data).decode('utf-8')
    data = json.loads(json_data)
    # print(f"[FRIDA] received pre-encrypted data={data}")

    data['arguments'][0]['base64'] = patch_pk_result(data['arguments'][0]['base64'])

    json_data = json.dumps(data)
    b64data = base64.b64encode(json_data.encode()).decode('utf-8')
    script.post({'type': 'continue', 'data': b64data})
    # data = json.loads(data)
    # for q in data['examVO']['questions']:
    #     print(q['answers'])
    return

def on_message(message, data):
    if message['type'] == 'error':
        print(f"[FRIDA] error occured in JS: {message['description']}")
    elif message['type'] == 'send':
        payload = message['payload']
        print(f"[FRIDA] message received, from={payload['from']}")
        # if payload['from'] == 'DataDecryptCommand$execute$1$decryptData$1.invokeSuspend':
        #     handle_decrypt_data(payload['data'])
        # elif payload['from'] == 'DataEncryptCommand$execute$1$encryptData$1.$init':
        #     handle_encrypt_data(payload['data'])
        if payload['from'] == 'dataEncrypt':
            handle_encrypt_data(payload['data'])
    else:
        print("[FRIDA] unsupported message")

script.on('message', on_message)
script.load()

while True:
    # script.exports_sync.openurl('https://xyks.yuanfudao.com/bh5/leo-web-oral-pk/pk.html?_productId=611&vendor=tencent&phaseId=3&from=yuansoutikousuan&YFD_U=-3830503740869717022&version=3.84.1&keypath=&siwr=false')\
    # touchstart = 'javascript:var e = document.createEvent("Event"); e.initEvent("touchstart", true, true); e.targetTouches = { pageX: 10, pageY: 10 }; alert(document.body.dispatchEvent(e));'
    # touchend = 'javascript:var e = document.createEvent("Event"); e.initEvent("touchend", true, true); e.changedTouches = { pageX: 20, pageY: 20 }; document.body.dispatchEvent(e);'
    # script.exports_sync.openurl(touchstart)
    # script.exports_sync.openurl(touchend)
    input()
    # import os, time
    # os.system("platform-tools\\adb.exe shell input tap 1000 1200")
    # time

# PK
# WebView.loadUrl(https://xyks.yuanfudao.com/bh5/leo-web-oral-pk/pk.html?_productId=611&vendor=tencent&phaseId=3&from=yuansoutikousuan&YFD_U=-3830503740869717022&version=3.84.1&keypath=&siwr=false)
