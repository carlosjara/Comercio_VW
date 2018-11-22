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
router.get('/agregarCarro/:id_product/precio/:product_price/nombre/:product_name/author/:product_author/is/:user_id', function(req, res, next) {
    var carrito = '{"objeto":[]}';
    var parse_obj = JSON.parse(carrito);
    var id_product = req.params.id_product;
    var product_price = req.params.product_price;
    var product_name= req.params.product_name;
    var product_author = req.params.product_author;
    var user_id= req.params.user_id;
    var cant= 1;
    var userName = "";
    var libros = [];
    var Cantidad_Carrito = 0;
    var cantidad_items = 0;
    var renderResumen = _.after(3, function() {
        var json = {title: userName, idUser: user_id, libros: libros, cart: Cantidad_Carrito}
        res.redirect('../../../../../../../../../../catalogo_usuario/'+user_id);
        
    });
    var conteo_res = _.after(1, function() {
        if (conteo != 0){
            client.post("https://comercio-rest-carlosjara.c9users.io:8081/Cantidad_id_idUSer", datos_cons, function(data, response) {
                cantidad_items = data["cantidad"];
            });
            client.post("https://comercio-rest-carlosjara.c9users.io:8081/Update_Cant_item", datos_cons, function(data, response) {
                cantidad_items = data["affectedRows"];
            });
        }
        else {
            var datos_insert = {
                data: { "id_product": id_product,
                        "product_price": product_price,
                        "product_name": product_name,
                        "product_author": product_author,
                        "product_cant": cant,
                        "user_id": user_id
                },
                headers: { "Content-Type": "application/json" }
            };
            client.post("https://comercio-rest-carlosjara.c9users.io:8081/newItemCart", datos_insert, function(data, response) {
                var resultado = data["affectedRows"];
                var json = {cantidad: resultado}
                console.log(json);
            });
            
        }    
    });
    
    var datos_cons = {
            data: { "id_product": id_product,
                    "user_id": user_id
            },
            headers: { "Content-Type": "application/json" }
        };
    var conteo = 0;
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/CartItems_id_idUSer", datos_cons, function(data, response) {
            conteo = data["conteo"];
            conteo_res();
        });
    
    var datos = {
        data: { "id": user_id},
        headers: { "Content-Type": "application/json" }
    };
    var datos_carrito = {
        data: { "user_id": user_id},
        headers: { "Content-Type": "application/json" }
    };
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getUserNameById", datos, function(data, response) {
        userName = data["nombre_usuario"];
        renderResumen();
    });
    
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/CartItems_id", datos_carrito, function(data, response) {
        Cantidad_Carrito = data["suma"];
        renderResumen();
    });
    
    client.get("https://comercio-rest-carlosjara.c9users.io:8081/getBooks", function(data, response) {
        libros = data;
        renderResumen();
    });
    
    
    parse_obj['objeto'].push({ "id_product": id_product,
                "product_price": product_price,
                "product_name": product_name,
                "product_author": product_author,
                "product_cant": cant,
                "user_id": user_id
        });
    carrito = JSON.stringify(parse_obj);
});

router.get('/:id_usuario', function(req, res, next) {
    var libros = [];
    var userName = "";
    var user_id = req.params.id_usuario;
    var Cantidad_Carrito = 0;
    var renderResumen = _.after(3, function() {
        var json = {title: userName, idUser: user_id, libros: libros, cart: Cantidad_Carrito}
        res.render('catalogo_usuario', json);
    });
    var datos = {
        data: { "id": user_id},
        headers: { "Content-Type": "application/json" }
    };
    
    var datos_Carrito = {
        data: { "user_id": user_id},
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
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/CartItems_id", datos_Carrito, function(data, response) {
        Cantidad_Carrito = data["suma"];
        console.log("cantidad",data["suma"]);
        renderResumen();
    });
});



module.exports = router;