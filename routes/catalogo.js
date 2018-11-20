var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var _ = require('lodash');
var Handlebars = require("hbs");

var client = new Client();

Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
    }
});
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('catalogo_usuario');
});

router.get('/:id_usuario', function(req, res, next) {
    var libros = [];
    var userName = "";
    var user_id = req.params.id_usuario;
    var renderResumen = _.after(2, function() {
        var json = {title: userName, idUser: user_id, libros: libros}
        res.render('catalogo_usuario', json);
    });
    var datos = {
        data: { "id": user_id},
        headers: { "Content-Type": "application/json" }
    };
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getUserNameById", datos, function(data, response) {
        userName = data["nombre_usuario"];
        renderResumen();
    });
    client.get("https://comercio-rest-carlosjara.c9users.io:8081/getBooks", function(data, response) {
        libros = data;
        renderResumen();
    });
});


module.exports = router;