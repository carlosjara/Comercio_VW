var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'SNJ', description: 'Sistema de libros Nacional Juvenil, Tienda de pago de libreria SNJ permitirá visulizar todos los libros que tenemos fisicos en todas nuestras tiendas.' });
});

module.exports = router;