// Proxy local mínimo para a API do opencode zen (resolve o bloqueio de CORS do navegador).
// Sem dependências — usa só módulos nativos do Node.
//
// Como usar:
//   1. Tenha o Node.js instalado (node -v).
//   2. Nesta pasta, rode:  node opencode-proxy.js
//   3. No editor (painel "Criar com IA" > Configurar API), deixe o campo
//      "Proxy local" como  http://localhost:8787  e use normalmente.
//
// O proxy só encaminha as chamadas para https://opencode.ai e devolve a
// resposta com os cabeçalhos CORS necessários. Sua chave de API NÃO fica
// guardada aqui — ela só passa pelo cabeçalho Authorization que o editor envia.

const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 8787;
const UPSTREAM_HOST = 'opencode.ai';

const server = http.createServer((req, res) => {
  // Cabeçalhos CORS para qualquer origem (inclusive arquivo local / null).
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Preflight do navegador.
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Encaminha o mesmo caminho (ex.: /zen/v1/chat/completions) para o opencode.
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    const headers = { 'Content-Type': 'application/json' };
    if (req.headers['authorization']) headers['Authorization'] = req.headers['authorization'];
    if (body.length) headers['Content-Length'] = body.length;

    const upstream = https.request(
      { host: UPSTREAM_HOST, path: req.url, method: req.method, headers },
      (up) => {
        res.writeHead(up.statusCode || 502, { 'Content-Type': up.headers['content-type'] || 'application/json' });
        up.pipe(res);
      }
    );
    upstream.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'Proxy não conseguiu falar com o opencode: ' + err.message } }));
    });
    if (body.length) upstream.write(body);
    upstream.end();
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('');
    console.log('A porta ' + PORT + ' ja esta em uso. Quase sempre isso significa que');
    console.log('o proxy JA ESTA RODANDO em outra janela — entao esta tudo certo,');
    console.log('e voce pode usar o editor normalmente. Nao precisa abrir outro.');
    console.log('');
    console.log('Se quiser mesmo reiniciar: feche a outra janela do proxy, ou rode');
    console.log('   npx kill-port ' + PORT + '');
    console.log('e tente de novo. Ou use outra porta:  set PORT=8788 && node opencode-proxy.js');
    process.exit(0);
  }
  console.error('Erro no proxy:', err.message);
  process.exit(1);
});
server.listen(PORT, () => {
  console.log('Proxy opencode rodando em  http://localhost:' + PORT);
  console.log('Encaminhando  ->  https://' + UPSTREAM_HOST);
  console.log('Deixe esta janela aberta enquanto usa o editor. Ctrl+C para parar.');
});
