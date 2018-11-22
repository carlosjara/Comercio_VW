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
    res.render('Finalizacion_usuario');
});

router.get('/:id_usuario'/*/tkn/:token'*/, function(req, res, next) {
    var libros = [];
    var userName = "";
    var user_id = req.params.id_usuario;
    var token_history = "";
    var status_history = "";
    var token = "";
    var status = "";
    var Cantidad_Carrito = 0;
    var costo_total = 0;
    
    var renderResumen = _.after(1, function() {
        var json = { title: userName, idUser: user_id, libros: libros, cart: Cantidad_Carrito, Total: costo_total, token: token, status : status}
        res.render('Finalizacion_usuario', json);
    });
    
    var delete_cart = _.after(1, function() {
        var data_toclean= {
        data: { "user_id": user_id
        },
        headers: { "Content-Type": "application/json" }
        };
        client.post("https://comercio-rest-carlosjara.c9users.io:8081/delete_Cart_byuser", data_toclean, function(data, response) {
            console.log("Deleted!");
        });
    });
    
    var update_status = _.after(1, function() {
        var datos_updated= {
        data: { "userName_history": userName,
                "token_history": token_history,
                "status_history": status_history
        },
        headers: { "Content-Type": "application/json" }
        };
        client.post("https://comercio-rest-carlosjara.c9users.io:8081/updateTokenStatus", datos_updated, function(data, response) {
            console.log("Updated!");
            getlastupdate();
        });
    });
    var getlastupdate = _.after(1, function() {
    var datos_history= {
        data: { "userName_history": userName,
                "userid_history": user_id,
                "costo_history": costo_total
        },
        headers: { "Content-Type": "application/json" }
        };
        client.post("https://comercio-rest-carlosjara.c9users.io:8081/getLastStatusToken_History", datos_history, function(data, response) {
            token = data["tp_token"];
            status = data["tp_status"];
            console.log("token updated: " + token + " status Updated: " + status);
            renderResumen();
        });
    });
    var get_StatusUpdated = _.after(1, function() {
        var data_tpaga_info = {
                headers: {
                    "Authorization": "Basic bWluaWFwcC1nYXRvMjptaW5pYXBwbWEtMTIz",
                    "Cache-Control": "no-cache",
                    "Content-Type": "application/json"
                }
            };
            client.get("https://stag.wallet.tpaga.co/merchants/api/v1/payment_requests/"+token+"/info", data_tpaga_info, function(data, response) {
                status_history = data["status"];
                token_history = data["token"];
                update_status();
                delete_cart();
            });
    });
    
    
    var factura = _.after(5, function() {
        var datos_history= {
        data: { "userName_history": userName,
                "userid_history": user_id,
                "costo_history": costo_total
        },
        headers: { "Content-Type": "application/json" }
        };
        client.post("https://comercio-rest-carlosjara.c9users.io:8081/getLastStatusToken_History", datos_history, function(data, response) {
            token = data["tp_token"];
            status = data["tp_status"];
            console.log("token Created: " + token + " status Created: " + status);
            get_StatusUpdated();
        });
    });
    
    var datos = {
        data: { "id": user_id },
        headers: { "Content-Type": "application/json" }
    };
    var datos_carrito = {
        data: { "user_id": user_id },
        headers: { "Content-Type": "application/json" }
    };
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getUserNameById", datos, function(data, response) {
        userName = data["nombre_usuario"];
        factura();
    });
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getCartItems_o_id",datos, function(data, response) {
        libros = data;
        factura();
    });
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/CartItems_id", datos_carrito, function(data, response) {
        Cantidad_Carrito = data["suma"];
        factura();
    });
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getSumItemCostById", datos_carrito, function(data, response) {
        costo_total = data["suma"];
        console.log("costo: "+costo_total);
        factura();
    });
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getSumItemCostById", datos_carrito, function(data, response) {
        costo_total = data["suma"];
        console.log("costo: "+costo_total);
        factura();
    });
});

module.exports = router;
