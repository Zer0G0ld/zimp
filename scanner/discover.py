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

def ping(ip: str, timeout_ms: int) -> bool:
    system = platform.system().lower()
    if system == "windows":
        cmd = ['ping', '-n', '1', '-w', str(timeout_ms), ip]
    else:
        cmd = ['ping', '-c', '1', '-W', str(int(timeout_ms / 1000)), ip]
    try:
        return subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0
    except Exception:
        return False

async def get_sysname(
    ip: str,
    snmp_community: str,
    snmp_version: str,
    snmp_timeout: int,
    snmp_retries: int
) -> str | None:
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
        engine.transport_dispatcher.close_dispatcher()  # Sem DeprecationWarning

async def scan_ip(
    ip: str,
    snmp_community: str,
    snmp_version: str,
    snmp_timeout: int,
    snmp_retries: int,
    ping_timeout: int
) -> dict | None:
    if ping(ip, ping_timeout):
        name = await get_sysname(ip, snmp_community, snmp_version, snmp_timeout, snmp_retries)
        if name:
            return {"ip": ip, "name": name}
    return None

async def scan_network(
    network: str,
    ping_timeout: int = 1000,
    max_parallel: int = 20,
    snmp_community: str = "public",
    snmp_version: str = "2c",
    snmp_timeout: int = 1,
    snmp_retries: int = 0
) -> list:
    results = []
    tasks = []

    print(f"🌐 Escaneando rede {network}...")

    for ip in ipaddress.IPv4Network(network).hosts():
        tasks.append(asyncio.create_task(
            scan_ip(ip, snmp_community, snmp_version, snmp_timeout, snmp_retries, ping_timeout)
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
