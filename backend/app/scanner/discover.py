import asyncio
import logging
from pathlib import Path
import json
import ipaddress
import platform
import time
from typing import TypedDict, Optional
from pysnmp.hlapi.v3arch.asyncio import (
    SnmpEngine,
    CommunityData,
    ContextData,
    ObjectType,
    ObjectIdentity,
    get_cmd,
    UdpTransportTarget
)

class ScanResult(TypedDict):
    ip: str
    ping_status: bool
    ping_rtt_ms: Optional[int]
    snmp_name: Optional[str]
    snmp_error: Optional[str]

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

def log_snmp_hint(ip: str, snmp_error: str, community: str, version: str):
    if snmp_error in ["timeout", "no response received"]:
        logging.warning(
            f"SNMP não respondeu para {ip}. "
            f"Verifique se SNMP está habilitado, se a comunidade '{community}' e versão '{version}' estão corretas."
        )
    elif "authorization" in snmp_error.lower():
        logging.warning(
            f"SNMP acesso negado para {ip}. "
            f"Verifique comunidade e permissões SNMP."
        )
    else:
        logging.warning(f"SNMP falhou para {ip}: {snmp_error}")

async def ping(ip: str, timeout_ms: int) -> dict:
    system = platform.system().lower()
    cmd = ['ping', '-n', '1', '-w', str(timeout_ms), ip] if system == "windows" else ['ping', '-c', '1', '-W', str(int(timeout_ms / 1000)), ip]
    start = time.time()
    try:
        proc = await asyncio.wait_for(
            asyncio.create_subprocess_exec(*cmd, stdout=asyncio.subprocess.DEVNULL, stderr=asyncio.subprocess.DEVNULL),
            timeout=timeout_ms / 1000 + 2  # timeout extra
        )
        code = await asyncio.wait_for(proc.wait(), timeout=timeout_ms / 1000 + 2)
        elapsed = (time.time() - start) * 1000
        return {"status": code == 0, "rtt_ms": int(elapsed)}
    except asyncio.TimeoutError:
        logging.warning(f"Ping timeout para {ip}. Pode ser firewall, ACL ou ICMP bloqueado.")
        return {"status": False, "rtt_ms": None}
    except Exception as e:
        logging.error(f"Ping erro para {ip}: {e}")
        return {"status": False, "rtt_ms": None}

async def get_sysname(ip: str, snmp_community: str, snmp_version: str, snmp_timeout: int, snmp_retries: int, engine: SnmpEngine) -> dict:
    mp_model = 0 if snmp_version == "1" else 1
    try:
        errorIndication, errorStatus, errorIndex, varBinds = await asyncio.wait_for(
            get_cmd(
                engine,
                CommunityData(snmp_community, mpModel=mp_model),
                await UdpTransportTarget.create((ip, 161), timeout=snmp_timeout, retries=snmp_retries),
                ContextData(),
                ObjectType(ObjectIdentity('SNMPv2-MIB', 'sysName', 0))
            ),
            timeout=snmp_timeout + 2  # timeout extra
        )
        if errorIndication or errorStatus:
            log_snmp_hint(ip, str(errorIndication or errorStatus), snmp_community, snmp_version)
            return {"name": None, "snmp_error": str(errorIndication or errorStatus)}
        return {"name": str(varBinds[0][1]), "snmp_error": None}
    except asyncio.TimeoutError:
        log_snmp_hint(ip, "timeout", snmp_community, snmp_version)
        return {"name": None, "snmp_error": "timeout"}
    except Exception as e:
        log_snmp_hint(ip, str(e), snmp_community, snmp_version)
        return {"name": None, "snmp_error": str(e)}

async def scan_ip(
    ip: ipaddress.IPv4Address,
    snmp_community: str,
    snmp_version: str,
    snmp_timeout: int,
    snmp_retries: int,
    ping_timeout: int,
    semaphore: asyncio.Semaphore,
    engine: SnmpEngine
) -> ScanResult:
    async with semaphore:
        ip_str = str(ip)
        ping_result = await ping(ip_str, ping_timeout)
        if ping_result["status"]:
            snmp_result = await get_sysname(ip_str, snmp_community, snmp_version, snmp_timeout, snmp_retries, engine)
            result = {
                "ip": ip_str,
                "ping_status": ping_result["status"],
                "ping_rtt_ms": ping_result["rtt_ms"],
                "snmp_name": snmp_result["name"],
                "snmp_error": snmp_result["snmp_error"]
            }
            if snmp_result["name"]:
                logging.info(f"📡 {ip_str} -> {snmp_result['name']} ({ping_result['rtt_ms']}ms)")
            else:
                logging.info(f"📡 {ip_str} -> SNMP falhou: {snmp_result['snmp_error']} ({ping_result['rtt_ms']}ms)")
            return result
        else:
            logging.warning(f"Ping falhou para {ip_str}. Possível firewall, ACL ou ICMP bloqueado.")
            return {"ip": ip_str, "ping_status": False, "ping_rtt_ms": ping_result["rtt_ms"], "snmp_name": None, "snmp_error": None}

async def scan_network(
    network: str,
    ping_timeout: int = 1000,
    max_parallel: int = 20,
    snmp_community: str = "public",
    snmp_version: str = "2c",
    snmp_timeout: int = 5,  # timeout SNMP aumentado
    snmp_retries: int = 2,
    save_to: str | None = None
) -> list[ScanResult]:
    results = []
    tasks = []
    semaphore = asyncio.Semaphore(max_parallel)
    engine = SnmpEngine()

    logging.info(f"🌐 Escaneando rede {network}...")
    logging.info("⚠️ Certifique-se que o host tem acesso à rede e SNMP está habilitado nos dispositivos.")

    for ip in ipaddress.IPv4Network(network).hosts():
        ip_str = str(ip)
        tasks.append(asyncio.create_task(
            scan_ip(ip_str, snmp_community, snmp_version, snmp_timeout, snmp_retries, ping_timeout, semaphore, engine)
        ))

    for task in asyncio.as_completed(tasks):
        res: ScanResult = await task
        results.append(res)

    engine.transport_dispatcher.close_dispatcher()
    logging.info(f"✅ Varredura finalizada. {len(results)} dispositivo(s) escaneado(s).")

    if save_to:
        Path(save_to).write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
        logging.info(f"📂 Resultados salvos em {save_to}")

    return results