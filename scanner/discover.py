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

COMMUNITY = 'public'
NETWORK = '192.168.1.0/24'
PING_TIMEOUT = 1000
MAX_PARALLEL = 20

def ping(ip: str) -> bool:
    system = platform.system().lower()
    if system == "windows":
        cmd = ['ping', '-n', '1', '-w', str(PING_TIMEOUT), ip]
    else:
        cmd = ['ping', '-c', '1', '-W', '1', ip]
    try:
        return subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0
    except Exception:
        return False

async def get_sysname(ip: str) -> str | None:
    engine = SnmpEngine()
    try:
        errorIndication, errorStatus, errorIndex, varBinds = await get_cmd(
            engine,
            CommunityData(COMMUNITY, mpModel=1),
            await UdpTransportTarget.create((ip, 161)),
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

async def scan_ip(ip: str) -> dict | None:
    if ping(ip):
        name = await get_sysname(ip)
        if name:
            return {"ip": ip, "name": name}
    return None

async def scan_network() -> list:
    results = []
    tasks = []

    print(f"🌐 Escaneando rede {NETWORK}...")

    for ip in ipaddress.IPv4Network(NETWORK).hosts():
        # Cria task explicitamente
        tasks.append(asyncio.create_task(scan_ip(str(ip))))

        if len(tasks) >= MAX_PARALLEL:
            done, _ = await asyncio.wait(tasks)
            for t in done:
                res = t.result()
                if res:
                    results.append(res)
                    print(f"📡 {res['ip']} -> {res['name']}")
            tasks = []

    # Processa o restante
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
    asyncio.run(scan_network())
