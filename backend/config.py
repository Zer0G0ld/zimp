import json
import logging
from pathlib import Path

class Config:
    """
    Classe para carregar e acessar configurações de um arquivo JSON.
    """
    def __init__(self, path: str = "config.json"):
        self.path = Path(path)
        self.data = self.load()
        self._setup_logging()  # configura logging ao instanciar

    def load(self) -> dict:
        """
        Carrega o arquivo de configuração JSON.
        """
        if not self.path.exists():
            raise FileNotFoundError(f"❌ Arquivo {self.path} não encontrado")
        try:
            with open(self.path, "r", encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            raise ValueError(f"❌ Erro ao decodificar JSON: {e}")

    def reload(self):
        """
        Recarrega o arquivo de configuração.
        """
        self.data = self.load()
        self._setup_logging()

    def __getattr__(self, item):
        """
        Permite acessar configurações como atributos.
        """
        try:
            return self.data[item]
        except KeyError:
            raise AttributeError(f"Configuração '{item}' não encontrada.")

    def _setup_logging(self):
        """
        Configura logging conforme o JSON (nível e arquivo).
        """
        log_cfg = self.data.get("logging", {})
        if log_cfg.get("enabled", True):
            level = getattr(logging, log_cfg.get("level", "INFO").upper(), logging.INFO)
            file_path = log_cfg.get("file_path", None)
            logging.basicConfig(
                filename=file_path,
                level=level,
                format="%(asctime)s [%(levelname)s] %(message)s"
            )
        logging.info("Logging inicializado com sucesso!")

# Instância global para todo o backend
cfg = Config()

if __name__ == "__main__":
    logging.info("Iniciando leitura das configurações...")
    try:
        print(cfg.snmp)
        logging.info("Configuração SNMP carregada com sucesso.")
        print(cfg.network_scan)
        logging.info("Configuração de varredura de rede carregada com sucesso.")
        print(cfg.logging)
        logging.info("Configuração de logging carregada com sucesso.")
        print(cfg.output)
        logging.info("Configuração de saída carregada com sucesso.")
    except Exception as e:
        logging.error(f"Erro ao acessar configurações: {e}")
