from scanner.discover import scan_network
from zabbix.host_manager import create_printer_host

def register_printers(printers):
    """Registra cada impressora no Zabbix e imprime resultado."""
    token_errors = 0
    for p in printers:
        try:
            print(f"📡 Registrando {p['name']} ({p['ip']}) no Zabbix...")
            resp = create_printer_host(p['name'], p['ip'])
            
            if "error" in resp:
                print(f"❌ Erro ao criar host: {resp['error']}")
            else:
                print(f"✅ Impressora {p['name']} registrada com sucesso! ID: {resp.get('result', {}).get('hostids', [''])[0]}")
        except Exception as e:
            print(f"⚠️ Falha ao registrar {p['name']} ({p['ip']}): {e}")
            token_errors += 1
    if token_errors:
        print(f"⚠️ {token_errors} impressora(s) não puderam ser registradas.")

def main():
    print("🔍 Escaneando rede em busca de impressoras...")
    try:
        printers = scan_network()
    except Exception as e:
        print(f"❌ Falha na varredura: {e}")
        return

    if not printers:
        print("❌ Nenhuma impressora encontrada.")
        return

    print(f"✅ {len(printers)} impressora(s) encontrada(s):")
    for p in printers:
        print(f" - {p['ip']} -> {p['name']}")

    register_printers(printers)

if __name__ == "__main__":
    main()
