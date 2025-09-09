# Plano de Migração do Backend: Node.js para Python

Este documento descreve o plano para migrar o backend do projeto de Node.js/Express para Python/Flask.

## 1. Visão Geral e Justificativa

O backend atual em Node.js (`/backend/server.js`) atua como um proxy simples, encaminhando requisições do frontend para as APIs do Lyria e Gemini. A migração para Python com Flask é uma excelente escolha devido à simplicidade, maturidade e vasta documentação do framework, além de seu rico ecossistema para IA/ML.

## 2. Fases da Migração

### Fase 1: Análise e Planejamento

1.  **Analisar o Backend Node.js Atual:**
    *   Revisar `backend/server.js` para identificar todos os endpoints da API existentes (`/generateMusic`, `/getSoundtrack`).
    *   Mapear as variáveis de ambiente necessárias (ex: `API_KEY`, `URL_BASE`).
    *   Entender a lógica de comunicação com o Lyria, implementada em `backend/lyriaClient.js`.

2.  **Escolha da Stack Python:**
    *   **Framework:** Flask (recomendado por sua simplicidade e maturidade).
    *   **Servidor WSGI:** Servidor de desenvolvimento do Flask (para desenvolvimento) e Gunicorn (para produção).
    *   **Cliente HTTP:** `requests` (padrão da indústria para requisições HTTP síncronas).
    *   **Gerenciamento de Dependências:** `pip` e `requirements.txt`.

### Fase 2: Configuração do Ambiente Python

1.  **Criar Nova Estrutura de Diretórios:**
    *   Criar uma nova pasta: `backend_py`.
    *   Dentro de `backend_py`, inicializar um ambiente virtual: `python -m venv venv`.

2.  **Instalar Dependências:**
    *   Ativar o ambiente virtual: `source backend_py/venv/bin/activate`.
    *   Criar um arquivo `backend_py/requirements.txt` com o seguinte conteúdo:
        ```
        Flask
        requests
        python-dotenv
        gunicorn
        ```
    *   Instalar as dependências: `pip install -r backend_py/requirements.txt`.

### Fase 3: Desenvolvimento e Migração do Código

1.  **Criar a Aplicação Flask:**
    *   Criar o arquivo `backend_py/main.py`.
    *   Implementar a estrutura básica do Flask.

2.  **Migrar Endpoints:**
    *   Recriar os endpoints `/generateMusic` e `/getSoundtrack` em `main.py` usando a sintaxe do Flask (ex: `@app.route('/generateMusic', methods=['POST'])`).
    *   A lógica de `lyriaClient.js` deve ser traduzida para funções Python em um novo arquivo `backend_py/lyria_client.py`, utilizando `requests` para fazer as chamadas às APIs externas.

3.  **Gerenciamento de Configuração:**
    *   Utilizar `python-dotenv` para carregar as variáveis de ambiente a partir de um arquivo `.env` na pasta `backend_py`.

### Fase 4: Testes e Validação

1.  **Testes Manuais:**
    *   Iniciar o servidor Flask: `flask --app backend_py/main run --debug`.
    *   Usar uma ferramenta como `curl` ou Postman para testar os endpoints.
    *   Verificar se a comunicação com as APIs do Lyria e Gemini está funcionando como esperado.

2.  **Integração com o Frontend:**
    *   Temporariamente, alterar a URL do backend no código do frontend (provavelmente em `services/lyriaService.ts`) para apontar para o novo servidor Python (ex: `http://localhost:5000`).
    *   Testar o fluxo completo a partir da interface do usuário.

### Fase 5: Integração e Implantação

1.  **Atualizar o Dockerfile:**
    *   Modificar o `Dockerfile` para usar uma imagem base de Python.
    *   Adicionar os passos para copiar a pasta `backend_py`, instalar as dependências do `requirements.txt` e iniciar o servidor com `gunicorn` (ex: `gunicorn --bind 0.0.0.0:8080 'main:app'`).

2.  **Atualizar o `cloudbuild.yaml`:**
    *   Ajustar os passos do build para construir e publicar a nova imagem do container Python.

3.  **Remoção do Código Antigo:**
    *   Após a validação completa da nova implementação em produção, a pasta `backend` (com o código Node.js) pode ser removida do projeto.

## 3. Cronograma Estimado

| Fase                                  | Estimativa |
| ------------------------------------- | ---------- |
| Fase 1: Análise e Planejamento        | 2 horas    |
| Fase 2: Configuração do Ambiente      | 1 hora     |
| Fase 3: Desenvolvimento e Migração    | 4-6 horas  |
| Fase 4: Testes e Validação            | 3 horas    |
| Fase 5: Integração e Implantação      | 2 horas    |
| **Total**                             | **12-14 horas** |
