# zimp
ZIMP - Monitorar impressoras da rede

Objetivo: temos como objetivo com este projeto  desenvolve uma solução para monitorar impressoras de qualquer marca e modelo vacilitando o monitoramento e centralizar problemas e avisos então centralizo tudo em um unico sistema com varias opções dependendo do modelo da impressora opções de manutenção remota e configuração tendo vacilidade de configuração de range e o que procurar e possibilitade de integração com outras ferramentas de monitoramento como `zabbix` fazendo assim o `ZIMP` ser um intermediario entre todas as impressoras da rede e o sistema de monitoramento que o tecnico usa dando uma gama de posibilidades de ações dentro do ambito de monitoramento e impressoras

Backend (Flask) -> localhost:7501
Frontend(React/Next.js) -> localhost:7500

Estrutura será divida na raiz `backend` e `frontend` tendo um arquivo central que chama ambos em suas respoctivas portas 


backend:

## **Definir o propósito de cada arquivo**

| Arquivo                      | Função                                                                 |
| ---------------------------- | ---------------------------------------------------------------------- |
| `main.py`                    | Entry point do backend. Inicializa scan ou server (FastAPI)            |
| `config.py`                  | Carrega e fornece config.json como objeto Python                       |
| `config.json`                | Configurações como redes, SNMP, tempo de ping, template de output, etc |
| `devices_found.json`         | Output persistente do scan                                             |
| `app/scanner/discover.py`    | Core do scanner SNMP + ping                                            |
| `app/zabbix/api.py`          | Funções para se comunicar com API do Zabbix                            |
| `app/zabbix/host_manager.py` | Funções de CRUD para hosts dentro do Zabbix                            |
| `app/api.py`                 | Exposição de endpoints REST (ou GraphQL) para frontend consumir        |

---

passo a passo para desenvolvimento backend

Passo 1 – Configuração:
config.json
config.py

Passo 2 – Scanner
Coloque discover.py na pasta scanner/

Ele deve ser assíncrono (asyncio) e modular

Exemplo: funções scan_ip() e scan_network()

Pode ter helper para salvar JSON/CSV (save_devices())

Passo 3 – Integrar Zabbix

app/zabbix/api.py → funções de comunicação com API do Zabbix (login, listar hosts, etc)

host_manager.py → funções específicas para gerenciar hosts, templates, triggers

Idealmente usar requests ou aiohttp (async)

Passo 4 – main.py

Passo 5 – API para frontend

app/api.py → usar FastAPI (async)