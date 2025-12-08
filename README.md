# Simulação do Sistema Solar em Django

Esta aplicação Django exibe uma simulação interativa do Sistema Solar com controles de zoom, velocidade orbital, órbitas e trilhas. 

## Como executar aqui no ambiente
1. **Instalar dependências**: `pip install -r requirements.txt`
2. **Rodar migrações (opcional para a demo)**: `python manage.py migrate`
3. **Iniciar o servidor**: `python manage.py runserver 0.0.0.0:8000`
4. **Acessar**: abrir http://127.0.0.1:8000/ ou usar o visualizador de navegador integrado para ver a simulação.

> Observação: o `DEBUG` já vem ativado e `ALLOWED_HOSTS` aceita todos os hosts no modo de desenvolvimento para facilitar o acesso via encaminhamento de porta.
