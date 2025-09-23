import asyncio
import json
import logging
from pathlib import Path
from copy import deepcopy
import argparse

from app.scanner.discover import scan_network  # importando seu módulo refatorado

def setup_logging():
    """Configura o logging para o aplicativo."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[logging.StreamHandler()]
    )

def validate_config(cfg: dict) -> bool:
    """Valida as configurações carregadas do arquivo JSON."""
    required = [
        ("network_scan", ["network", "ping_timeout_ms", "max_parallel"]),
        ("snmp", ["community", "version", "timeout", "retries"])
    ]
    for section, keys in required:
        if section not in cfg:
            logging.error(f"Configuração ausente: {section}")
            return False
        for key in keys:
            if key not in cfg[section]:
                logging.error(f"Configuração ausente: {section}.{key}")
                return False
    return True

async def main(config_path: Path, template_path: Path):
    """Função principal: carrega configs, escaneia rede, salva e exibe resultados."""
    # Carrega config.json
    if not config_path.exists():
        logging.error(f"❌ Configuração não encontrada: {config_path}")
        return
    with open(config_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)

    if not validate_config(cfg):
        logging.error("❌ Configuração inválida.")
        return

    # Carrega template do dispositivo
    if not template_path.exists():
        logging.warning(f"❌ Template não encontrado: {template_path}")
        template = {}
    else:
        with open(template_path, "r", encoding="utf-8") as f:
            template = json.load(f)

    # Escaneia a rede usando o módulo discover
    devices_found = await scan_network(
        network=cfg["network_scan"]["network"],
        ping_timeout=cfg["network_scan"]["ping_timeout_ms"],
        max_parallel=cfg["network_scan"]["max_parallel"],
        snmp_community=cfg["snmp"]["community"],
        snmp_version=cfg["snmp"]["version"],
        snmp_timeout=cfg["snmp"]["timeout"],
        snmp_retries=cfg["snmp"]["retries"],
        save_to=cfg.get("output", {}).get("filename")  # opcional
    )

    # Prepara dados finais usando o template
    formatted_devices = []
    for d in devices_found:
        dev_data = deepcopy(template)
        dev_data["ip"] = d["ip"]
        dev_data["name"] = d.get("snmp_name", "desconhecido")
        formatted_devices.append(dev_data)

    # Salva no arquivo se configurado
    if cfg.get("output", {}).get("save_to_file", False) and formatted_devices:
        out_file = cfg["output"].get("filename", "devices_found.json")
        Path(out_file).write_text(json.dumps(formatted_devices, indent=2, ensure_ascii=False), encoding="utf-8")
        logging.info(f"💾 Resultados salvos em {out_file}")

    # Exibe no console
    if formatted_devices:
        logging.info(f"✅ {len(formatted_devices)} dispositivo(s) encontrado(s):")
        for d in formatted_devices:
            logging.info(f" - {d['ip']} -> {d['name']}")
    else:
        logging.info("❌ Nenhum dispositivo encontrado.")

if __name__ == "__main__":
    setup_logging()
    parser = argparse.ArgumentParser(description="Scanner de rede SNMP")
    parser.add_argument("--config", type=str, default="config.json", help="Caminho do arquivo de configuração JSON")
    parser.add_argument("--template", type=str, default="app/templates/printer_snmp.json", help="Caminho do template de dispositivo")
    args = parser.parse_args()
    asyncio.run(main(Path(args.config), Path(args.template)))
