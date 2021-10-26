const http = require("http");
const requestHandler = require("./requestHandler");
//Guardando el servidor en una peticion http
const server = http.createServer(requestHandler)
//Escuchando el servidor
server.listen(5000, () => {
  console.log("el servidor está escuchando peticiones en http://localhost:5000/");
});