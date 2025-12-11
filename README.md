# NetWatch — Monitor de Rede e Inventariador de Dispositivos

**Projeto Final – 2025**  
Aluno: **Thaylon e Lucas**

Sistema completo de monitoramento de rede local com:
- Descoberta automática de dispositivos (ARP Scan)
- Cadastro/exclusão manual
- Teste de conectividade em tempo real (ping + latência)
- Status online/offline com bolinha verde/vermelha
- Histórico detalhado por dispositivo
- Atualização automática a cada 5 segundos
- Interface 100% web (roda direto no navegador)

## Funcionalidades entregues (100% conforme solicitado + extras)

| Requisito                          | Status    | Detalhe                                      |
|------------------------------------|-----------|----------------------------------------------|
| CRUD de dispositivos               | Concluído | Create, Read, Delete                         |
| Teste de ping                      | Concluído | Mede latência e salva log                    |
| CRUD de logs (criação/leitura)     | Concluído | Histórico completo                           |
| Banco devices + tests              | Concluído | SQLite criado automaticamente                |
| Interface web                      | Concluído | Expo Web — funciona em qualquer navegador    |
| Descoberta automática da rede      | Concluído | Diferencial: scan ARP em tempo real          |
| Exclusão com confirmação           | Concluído | Botão vermelho + modal                       |
| Atualização automática             | Concluído | A cada 5 segundos                            |

## Tecnologias

- **Backend**: Node.js + Express + SQLite
- **Frontend**: React Native + Expo Web + react-native-paper
- **Descoberta**: local-devices (ARP)
- **Ping**: pacote ping (compatível Windows)

## Como executar (qualquer PC Windows)

```bash
# Terminal 1 – Backend
cd server
node index.js

# Terminal 2 – Frontend
cd web
npx expo start -c --web
