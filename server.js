const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

//Configuracion de la base de datos
const dbConfig = require('./src/config/config');
const mongoose = require('mongoose');

mongoose.connect(dbConfig.url, { useNewUrlParser: true })
.then(() => {
    console.log("Conexion exitosa");    
}).catch(err => {
    console.log('No se pudo establecer la conexion con MongoBD');
    process.exit();
});
mongoose.Promise = global.Promise;
//Middlewares
app.use(morgan ('dev'));

app.use(express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



//MANEJO DE CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Routas para acceso de datos.

app.use('/productos', require('./src/routes/productos'));
app.use('/usuarios', require('./src/routes/usuarios'));
app.use('/ordenes', require('./src/router/ordenes'));

//Truco. 
app.use('/agregarProducto', function(req,res){
  res.render('producto.html');
})
//Error handler please work.
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render('error.html');
  });
// Create a Server
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Aplicacion escuchando en el puerto", host, port)

});