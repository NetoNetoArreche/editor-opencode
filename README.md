# Carousel Studio — Editor de Carrosséis

Editor de carrosséis para Instagram em um único arquivo HTML, com geração de conteúdo por IA via [opencode zen](https://opencode.ai) (Kimi K2, Claude, GPT e outros).

## Recursos

- **Editor visual** de carrosséis (4:5, 1:1, 9:16) com tipos de slide: capa, passo, lista, número, citação, CTA, tweet/post, nota/aviso, **imagem central** e **cards 3D (mockup)**.
- **Criar com IA** — descreva o tema e a IA monta o carrossel completo, que abre direto no editor; refine por mensagem. Gera também uma **legenda pronta** pra copiar.
- **Detecção de modelos** do seu plano opencode ao colar a chave.
- **24 presets de design** (paleta + tipografia): Editorial, Brutalist, Cyberpunk, Luxo Dourado, etc.
- **Modelos prontos** — carrosséis completos já formatados pra começar num clique.
- **Logo de perfil**, número/texto gigante de fundo, cantos e indicadores globais.
- **Gerar Capa com IA** (Google Gemini / Nano Banana).
- **Autosave** no navegador (IndexedDB) e **exportação** em ZIP de PNGs ou JSON.

As chaves de API ficam **somente no `localStorage` do navegador** — nunca no arquivo.

## Como usar

1. Abra `carrossel-editor (3).html` no navegador.
2. (Opcional, para a IA) Pegue uma chave em [opencode.ai/auth](https://opencode.ai/auth).
3. Como a API do opencode bloqueia chamadas diretas do navegador (CORS), rode o proxy local:

   ```bash
   node opencode-proxy.js
   ```

   Deixe a janela aberta. Requer [Node.js](https://nodejs.org).
4. No editor, clique em **Criar com IA → Configurar API**, cole a chave, escolha o modelo e ponha o proxy `http://localhost:8787`.
5. Digite o tema e gere. Edite, escolha um preset, suba seu logo/imagens e exporte em ZIP.

## Arquivos

- `carrossel-editor (3).html` — o editor completo (single-file).
- `opencode-proxy.js` — proxy local sem dependências que encaminha as chamadas para o opencode (resolve o CORS).

## Privacidade

As chaves de API são guardadas apenas no navegador. O proxy apenas repassa a requisição com o cabeçalho `Authorization` enviado pelo editor — não armazena nada.
