# Simulação do Sistema Solar em Django

Esta aplicação Django exibe uma simulação interativa do Sistema Solar com controles de zoom, velocidade orbital, órbitas e trilhas.

## Como executar aqui no ambiente
1. **Instalar dependências**: `pip install -r requirements.txt`
2. **Rodar migrações (opcional para a demo)**: `python manage.py migrate`
3. **Iniciar o servidor**: `python manage.py runserver 0.0.0.0:8000`
4. **Acessar**: abrir http://127.0.0.1:8000/ ou usar o visualizador de navegador integrado para ver a simulação.

> Observação: o `DEBUG` já vem ativado e `ALLOWED_HOSTS` aceita todos os hosts no modo de desenvolvimento para facilitar o acesso via encaminhamento de porta.

## Deploy na Vercel
1. **Instale a CLI** (se ainda não tiver): `npm i -g vercel`.
2. **Faça login**: `vercel login`.
3. **Configure variáveis obrigatórias** no painel da Vercel (ou via `vercel env`):
   - `DJANGO_SECRET_KEY`: gere um valor qualquer para produção (o runtime da Vercel é read-only, então a chave não é gravada em arquivo automaticamente).
   - `DJANGO_ALLOWED_HOSTS`: defina o domínio da Vercel (ex.: `seu-projeto.vercel.app`) para evitar bloqueio por host.
   - (opcional) `DEBUG=false` para produção.
4. **Deploy**: na raiz do projeto execute `vercel --prod`. O arquivo `vercel.json` já inclui:
   - build usando `@vercel/python` em `api/index.py` (WSGI do Django);
   - rotas que servem `/static` diretamente e encaminham o restante para o app Django.

Após o deploy, abra a URL da Vercel para carregar a simulação (rota `/`).
