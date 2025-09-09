const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const produtos = [];

//req.url -> tudo q está depois do hostname
//req.headers.host -> servidor e a porta

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Ola, Mundo! \n");
  } else if (req.url === "/date") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    const now = new Date().toString();
    res.end(`Data e hora atual: ${now}\n`);
  } else {
    const url = new URL(req.url, `http://${req.headers.host}`); //monta URL completa
    if (url.pathname === "/produto") {
      //retorna o caminho da URL depois do hostname + porta, sem query
      const nome = url.searchParams.getAll("nome");

      res.setHeader("Content-Type", "text/plain");

      nome.some((nome) => {
        if (nome) {
          if (produtos.includes(nome)) {
            res.statusCode = 400;
            res.end(`Produto "${nome}" já cadastrado.\n`);
            return true;
          } else {
            produtos.push(nome);
            res.statusCode = 200;
            res.write(`Produto "${nome}" adicionado com sucesso!\n`);
          }
        } else {
          res.statusCode = 400;
          res.end("400 bad request\n");
          return true;
        }
      });

      res.end();
    } else if (url.pathname === "/view-produtos") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(produtos));
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("404 not found");
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Servidor rodando em <http://${hostname}:${port}/`);
});
