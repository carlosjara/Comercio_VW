var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var validation = require('./routes/validation');
var catalogo_usuario = require('./routes/catalogo');
var carrito_usuario = require('./routes/carrito');
var login = require('./routes/login');
var finalizacion_usuario = require('./routes/Finalizacion_usuario');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/validacion', validation);
app.use('/login', login);
app.use('/catalogo_usuario', catalogo_usuario);
app.use('/carrito_usuario', carrito_usuario);
app.use('/agregarCarro', catalogo_usuario);
app.use('/end_usuario', finalizacion_usuario);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8080, function() {
  console.log('Corriendo en el puerto: 8080');
});
module.exports = app;
