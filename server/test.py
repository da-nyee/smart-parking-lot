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
    