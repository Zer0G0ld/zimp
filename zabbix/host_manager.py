from zabbix.api import zabbix_auth, zabbix_request

GROUPID = "12"      # Grupo Printers no Zabbix
TEMPLATEID = "10101" # Template de impressora

def create_printer_host(name, ip):
    token = zabbix_auth()
    params = {
        "host": name,
        "interfaces": [
            {"type": 2, "main": 1, "useip": 1, "ip": ip, "dns": "", "port": "161"}
        ],
        "groups": [{"groupid": GROUPID}],
        "templates": [{"templateid": TEMPLATEID}],
        "inventory_mode": 0
    }
    resp = zabbix_request("host.create", params, token)
    return resp
