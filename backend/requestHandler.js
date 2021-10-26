const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const enrutador = require("./enrutador");
//Creando el servidor
module.exports = (req, res) => {
    //1. Obtener url desde el objeto request
    const urlActual = req.url;
    const urlParseada = url.parse(urlActual, true);

    //2. Obtener la ruta
    const ruta = urlParseada.pathname;

    //3. Quitar slash a la ruta
    const rutaLimpia = ruta.replace(/^\/+|\/+$/g, "");

    //3.1 Obtener el método http
    const metodo = req.method.toLowerCase();
    //3.1.1 Dar permisos de cors escribiendo los headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader(
      "Access-Control-Request-Methods",
      "OPTIONS, GET, PUT, DELETE, POST"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, PUT ,DELETE, POST"
    );
    //3.1.2 dar respuesta inemdiata cuando el metodo sea options
    if (metodo === 'options') {
      res.writeHead(200);
      res.end();
      return;
    }
    //3.2 Obtener variables query url
    const { query = {} } = urlParseada;

    //3.3 Obtener los headers
    const { headers = {} } = req;
    //3.4 obtenr payload, en el caso de haber uno
    const decoder = new StringDecoder("utf-8");
    //3.4.1 ir acumlando la data cuando el request reciba un payload
    let buffer = "";
    req.on("data", (data) => {
      buffer += decoder.write(data);
    });
    //3.4.2 terminar de acumular datos y desirle al decoder que finalice 
    req.on("end", () => {
      buffer += decoder.end();
      if (headers["content-type"] === "application/json") {
        buffer = JSON.parse(buffer);
      }
      //verificar 3.4.3 revisar si tiene subrutas en este caso es el indice del array
      if (rutaLimpia.indexOf("/") > -1) {
        //separar las rutas
        var [rutaPrincipal, indice] = rutaLimpia.split("/");
      }

      //3.5 ordenar los data del request
      const data = {
        indice,
        ruta: rutaPrincipal || rutaLimpia,
        query,
        metodo,
        headers,
        payload: buffer
      };
      console.log({ data });

      //3.6 elegir el manejador dependiendo de la ruta y asignarle la funcion que el enrutador tiene
      let handler;
      if (
        data.ruta &&
        enrutador[data.ruta] &&
        enrutador[data.ruta][metodo]
      ) {
        handler = enrutador[data.ruta][metodo];
      } else {
        handler = enrutador.noEncontrado;
      }

      //4. ejecutar handler (manejador) para enviar la respuesta
      if (typeof handler === "function") {
        handler(data, (statusCode = 200, mensaje) => {
          const respuesta = JSON.stringify(mensaje);
          //mordificar header
          res.setHeader("Content-Type", "application/json");
          res.writeHead(statusCode);
          //linea donde realmente ya estamos responiendo a la aplicacion cliente
          res.end(respuesta);
        });
      }
    });
  };