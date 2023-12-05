from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
import json


class WebRequestHandler(BaseHTTPRequestHandler):
    # CORS 방지
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        parsed = urlparse(self.path)

        # 회원가입 완료, dto : id password regiDate nick gender
        if parsed.path == "/signup":
            data = self.data_string = str(
                self.rfile.read(int(self.headers["Content-Length"])).decode("UTF-8")
            )
            json_data = json.loads(data)
            result = "서비스 오류입니다."

            file = open("account.json", "r", encoding="UTF-8")
            account_data = json.load(file)
            file.close()

            if json_data["id"] not in account_data:
                file = open("account.json", "w", encoding="UTF-8")
                account_data[json_data["id"]] = {
                    "id": json_data["id"],
                    "password": json_data["password"],
                    "regiDate": json_data["regiDate"],
                    "nick": json_data["nick"],
                    "gender": json_data["gender"],
                    "farm": {
                        "0": {"id": "0"},
                        "1": {"id": "1"},
                        "2": {"id": "2"},
                        "3": {"id": "3"},
                        "4": {"id": "4"},
                        "5": {"id": "5"},
                        "6": {"id": "6"},
                        "7": {"id": "7"},
                        "8": {"id": "8"},
                        "9": {"id": "9"},
                        "10": {"id": "10"},
                        "11": {"id": "11"},
                        "12": {"id": "12"},
                        "13": {"id": "13"},
                        "14": {"id": "14"},
                        "15": {"id": "15"},
                    },
                    "money": 10000,
                    "day": 0,
                    "bag": {},
                }
                response = {"success": True}
                data = json.dumps(
                    account_data, indent=4, sort_keys=True, ensure_ascii=False
                )
                file.write(data)
                response_json = json.dumps(
                    response, indent=4, sort_keys=True, ensure_ascii=False
                )
                self.wfile.write(response_json.encode("UTF-8"))
                file.close()

            else:
                data = json.dumps(
                    {"success": False}, indent=4, sort_keys=True, ensure_ascii=False
                )
                self.wfile.write(data.encode("UTF-8"))

        # 로그인 // dto : id, password
        elif parsed.path == "/login":
            data = self.data_string = str(
                self.rfile.read(int(self.headers["Content-Length"])).decode("UTF-8")
            )
            json_data = json.loads(data)
            file = open("account.json", "r", encoding="UTF-8")
            account_data = json.load(file)
            file.close()
            if json_data["id"] in account_data:
                account = account_data[json_data["id"]]
                if json_data["password"] == account["password"]:
                    result = {
                        "success": True,
                        "id": account["id"],
                        "day": account["day"],
                        "regiDate": account["regiDate"],
                        "nick": account["nick"],
                        "gender": account["gender"],
                        "farm": account["farm"],
                        "money": account["money"],
                        "bag": account["bag"],
                    }
                else:
                    result = {"success": False}

            else:
                result = {"success": False}
            data = json.dumps(result, indent=4, sort_keys=True, ensure_ascii=False)
            self.wfile.write(data.encode("UTF-8"))

        # 잠들기 완료 // dto : id
        elif parsed.path == "/sleep":
            data = self.data_string = str(
                self.rfile.read(int(self.headers["Content-Length"])).decode("UTF-8")
            )
            json_data = json.loads(data)
            file_account = open("account.json", "r", encoding="UTF-8")
            accounts = json.load(file_account)
            file_account.close()

            file_market = open("market.json", "r", encoding="UTF-8")
            market = json.load(file_market)
            accounts[json_data["id"]]["day"] += 1

            for i in range(len(accounts[json_data["id"]]["farm"])):
                if "item" in accounts[json_data["id"]]["farm"][str(i)]:
                    accounts[json_data["id"]]["farm"][str(i)]["item"]["day"] += 1
                    if (
                        accounts[json_data["id"]]["farm"][str(i)]["item"]["day"]
                        == market[
                            accounts[json_data["id"]]["farm"][str(i)]["item"]["itemId"]
                        ]["term"]
                    ):
                        accounts[json_data["id"]]["farm"][str(i)]["item"][
                            "complete"
                        ] = True

            data = json.dumps(
                accounts[json_data["id"]], indent=4, sort_keys=True, ensure_ascii=False
            )

            file_account = open("account.json", "w", encoding="UTF-8")
            file_account.write(data)

            file_account.close()
            file_market.close()

            self.wfile.write(data.encode("UTF-8"))

        # 씨앗구입 완료 // dto : { id, items: { itemId, count }[] }
        elif parsed.path == "/buy":
            data = self.data_string = str(
                self.rfile.read(int(self.headers["Content-Length"])).decode("UTF-8")
            )
            json_data = json.loads(data)
            file = open("account.json", "r", encoding="UTF-8")
            account_data = json.load(file)
            file.close()

            file = open("market.json", "r", encoding="UTF-8")
            market_data = json.load(file)
            file.close()

            account = account_data[json_data["id"]]
            # 돈빼기
            moneySum = sum(
                item["count"] * market_data[item["itemId"]]["price"]
                for item in json_data["items"]
            )

            if moneySum <= account["money"]:
                account["money"] -= moneySum
                # 가방에 넣어주기
                for item in json_data["items"]:
                    if item["itemId"] in account["bag"]:
                        # 가방에 해당 item id 가 이미 있으면 count만 올리기
                        account["bag"][item["itemId"]]["count"] = (
                            account["bag"][item["itemId"]]["count"] + item["count"]
                        )
                    else:
                        # 가방에 해당 item id 가 없으면 추가해주기
                        account["bag"][item["itemId"]] = market_data[
                            item["itemId"]
                        ]  # index확인 필요
                        account["bag"][item["itemId"]]["count"] = item["count"]
                response = account
                response["success"] = True
                data = json.dumps(
                    account_data, indent=4, sort_keys=True, ensure_ascii=False
                )
                file = open("account.json", "w")
                file.write(data)
                file.close()
                response_json = json.dumps(
                    response, indent=4, sort_keys=True, ensure_ascii=False
                )
                self.wfile.write(response_json.encode("UTF-8"))
            else:
                data = json.dumps(
                    {"success": False, "reason": "잔액이 부족합니다."},
                    indent=4,
                    sort_keys=True,
                    ensure_ascii=False,
                )
                self.wfile.write(data.encode("UTF-8"))

        # 수확하기(씨앗 팔기) // dto : id, farmId, money
        elif parsed.path == "/harvest":
            data = self.data_string = str(
                self.rfile.read(int(self.headers["Content-Length"])).decode("UTF-8")
            )
            json_data = json.loads(data)

            file = open("market.json", "r", encoding="UTF-8")
            market_data = json.load(file)
            file.close()
            file = open("account.json", "r", encoding="UTF-8")
            account_data = json.load(file)
            file.close()
            if (
                account_data[json_data["id"]]["farm"][json_data["farmId"]]["item"][
                    "complete"
                ]
                == True
            ):
                account_data[json_data["id"]]["money"] += json_data["money"]
                del account_data[json_data["id"]]["farm"][json_data["farmId"]][
                    "item"
                ]  # id확인해주세요

            data = json.dumps(
                account_data[json_data["id"]],
                indent=4,
                sort_keys=True,
                ensure_ascii=False,
            )
            file = open("account.json", "w")
            file.write(data)
            self.wfile.write(data.encode("UTF-8"))

            file.close()

        #  씨앗 심기 // dto : id, farmId, itemId
        elif parsed.path == "/plant":
            data = self.data_string = str(
                self.rfile.read(int(self.headers["Content-Length"])).decode("UTF-8")
            )
            json_data = json.loads(data)
            file = open("account.json", "r", encoding="UTF-8")
            account_data = json.load(file)
            file.close()

            del account_data[json_data["id"]]["bag"][json_data["itemId"]]
            account_data[json_data["id"]]["farm"][json_data["farmId"]]["item"] = {
                "complete": False,
                "day": 0,
                "itemId": json_data["itemId"],
            }

            data = json.dumps(
                account_data[json_data["id"]],
                indent=4,
                sort_keys=True,
                ensure_ascii=False,
            )
            file = open("account.json", "w")
            file.write(data)
            self.wfile.write(data.encode("UTF-8"))

            file.close()

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        parsed = urlparse(self.path)
        # 상점 // 완료. 근데 이름 매칭은 프론트에서 해야 됨..
        if parsed.path == "/market":
            file = open("market.json", "r", encoding="utf-8")
            market_data = json.load(file)
            file.close()
            result = market_data
            data = json.dumps(result, indent=4, sort_keys=True, ensure_ascii=False)
            self.wfile.write(data.encode("UTF-8"))


server = HTTPServer(("127.0.0.1", 8081), WebRequestHandler)
server.serve_forever()
