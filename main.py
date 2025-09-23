import asyncio
import platform
import subprocess
import ipaddress
from pysnmp.hlapi.v3arch.asyncio import (
    SnmpEngine,
    CommunityData,
    ContextData,
    ObjectType,
    ObjectIdentity,
    get_cmd,
    UdpTransportTarget
)

def ping(ip: str, ping_timeout: int) -> bool:
    system = platform.system().lower()
    if system == "windows":
        cmd = ['ping', '-n', '1', '-w', str(ping_timeout), ip]
    else:
        cmd = ['ping', '-c', '1', '-W', str(int(ping_timeout/1000)), ip]  # converte ms para s
    try:
        return subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0
    except Exception:
        return False

async def get_sysname(ip: str, snmp_community: str, snmp_version: str, snmp_timeout: int, snmp_retries: int) -> str | None:
    mp_model = 0 if snmp_version == "1" else 1  # 0=v1, 1=v2c
    engine = SnmpEngine()
    try:
        errorIndication, errorStatus, errorIndex, varBinds = await get_cmd(
            engine,
            CommunityData(snmp_community, mpModel=mp_model),
            await UdpTransportTarget.create((ip, 161), timeout=snmp_timeout, retries=snmp_retries),
            ContextData(),
            ObjectType(ObjectIdentity('SNMPv2-MIB', 'sysName', 0))
        )
        if errorIndication or errorStatus:
            return None
        return str(varBinds[0][1])
    except Exception:
        return None
    finally:
        engine.transportDispatcher.closeDispatcher()

async def scan_ip(ip: str, ping_timeout: int, snmp_community: str, snmp_version: str, snmp_timeout: int, snmp_retries: int) -> dict | None:
    if ping(ip, ping_timeout):
        name = await get_sysname(ip, snmp_community, snmp_version, snmp_timeout, snmp_retries)
        if name:
            return {"ip": ip, "name": name}
    return None

async def scan_network(network: str, ping_timeout: int, max_parallel: int,
                    snmp_community: str, snmp_version: str, snmp_timeout: int, snmp_retries: int) -> list:
    results = []
    tasks = []

    print(f"🌐 Escaneando rede {network}...")

    for ip in ipaddress.IPv4Network(network).hosts():
        tasks.append(asyncio.create_task(
            scan_ip(str(ip), ping_timeout, snmp_community, snmp_version, snmp_timeout, snmp_retries)
        ))

        if len(tasks) >= max_parallel:
            done, _ = await asyncio.wait(tasks)
            for t in done:
                res = t.result()
                if res:
                    results.append(res)
                    print(f"📡 {res['ip']} -> {res['name']}")
            tasks = []

    if tasks:
        done, _ = await asyncio.wait(tasks)
        for t in done:
            res = t.result()
            if res:
                results.append(res)
                print(f"📡 {res['ip']} -> {res['name']}")

    print(f"✅ Varredura finalizada. {len(results)} dispositivo(s) encontrado(s).")
    return results

if __name__ == "__main__":
    import json
    with open("config.json", "r", encoding="utf-8") as f:
        cfg = json.load(f)
    asyncio.run(scan_network(
        network=cfg["network_scan"]["network"],
        ping_timeout=cfg["network_scan"]["ping_timeout_ms"],
        max_parallel=cfg["network_scan"]["max_parallel"],
        snmp_community=cfg["snmp"]["community"],
        snmp_version=cfg["snmp"]["version"],
        snmp_timeout=cfg["snmp"]["timeout"],
        snmp_retries=cfg["snmp"]["retries"]
    ))
