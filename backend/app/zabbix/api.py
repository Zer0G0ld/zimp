import requests

ZABBIX_URL = "http://seu-zabbix/zabbix/api_jsonrpc.php"
ZABBIX_USER = "api_user"
ZABBIX_PASS = "api_pass"

def zabbix_auth():
    payload = {
        "jsonrpc":"2.0",
        "method":"user.login",
        "params":{"user":ZABBIX_USER,"password":ZABBIX_PASS},
        "id":1
    }
    r = requests.post(ZABBIX_URL, json=payload)
    return r.json()['result']

def zabbix_request(method, params, auth, req_id=1):
    payload = {
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "auth": auth,
        "id": req_id
    }
    r = requests.post(ZABBIX_URL, json=payload)
    return r.json()
