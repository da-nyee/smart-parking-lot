import json

json_path = "./config/control.json"

# 모듈 상태 조회
with open(json_path, "r", encoding='utf-8-sig') as json_file:
    temp = json.load(json_file)

    print(temp)

# 모듈 상태 변경
with open(json_path, "r", encoding='utf-8-sig') as json_file:
    temp = json.load(json_file)
    temp = temp["control"]
    
    name = "parking"
    status = True

    for i in range(0, len(temp)):
        if(temp[i]["name"] == name):
            temp[i]["status"] = status

    new_temp = {}
    new_temp["control"] = temp

    with open(json_path, "w", encoding='utf-8-sig') as outfile:
        json.dump(new_temp, outfile, indent=4, ensure_ascii=False)

# 모듈 초기화
import time

new_json_path = './config/tempControl.json'

# control.json >>> tempControl.json 복사
with open(json_path, "r", encoding='utf-8-sig') as json_file:
    temp = json.load(json_file)

    with open(new_json_path, "w", encoding='utf-8-sig') as outfile:
        json.dump(temp, outfile, indent=4, ensure_ascii=False)

# control.json의 모든 status 값 false로 변경
statusTemp = temp["control"]

for i in range(0, len(statusTemp)):
    statusTemp[i]["status"] = False

statusNew = {}
statusNew["control"] = statusTemp

with open(json_path, "w", encoding='utf-8-sig') as outfile:
    json.dump(statusNew, outfile, indent=4, ensure_ascii=False)

# 3초 대기
time.sleep(3)

# tempControl.json >>> control.json 붙여넣기
with open(new_json_path, "r", encoding='utf-8-sig') as json_file:
    original = json.load(json_file)

    with open(json_path, "w", encoding='utf-8-sig') as outfile:
        json.dump(original, outfile, indent=4, ensure_ascii=False)
        
# 원상복구 응답
with open(json_path, "r", encoding='utf-8-sig') as json_file:
    controlData = json.load(json_file)

    print(controlData)
