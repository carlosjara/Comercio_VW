var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var _ = require('lodash');
var Handlebars = require("hbs");
var ip = require("ip");
const requestIp = require('request-ip');
var  Buffr  = require('buffer').Buffer

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
    res.render('carrito_usuario');
});

// Borrar todos los items de tipo id producto 
router.get('/borrar_item/:id_usuario/prd/:id_product', function(req, res, next) {
    var user_id = req.params.id_usuario;
    var id_product = req.params.id_product;
    var cantidad_items = 0;
    
    var datos_cons = {
        data: {
            "id_product": id_product,
            "user_id": user_id
        },
        headers: { "Content-Type": "application/json" }
    };
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/del_one_item", datos_cons, function(data, response) {
        cantidad_items = data["affectedRows"];
        console.log(cantidad_items);
    });
    res.redirect('../../../../carrito_usuario/' + user_id);
});

//Borrar un solo elemento de tipo id producto
router.get('/borrar_items/:id_usuario/prd/:id_product', function(req, res, next) {
    var user_id = req.params.id_usuario;
    var id_product = req.params.id_product;
    var cantidad_items = 0;
    
    var datos_cons = {
        data: {
            "id_product": id_product,
            "user_id": user_id
        },
        headers: { "Content-Type": "application/json" }
    };
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/del_all_item", datos_cons, function(data, response) {
        cantidad_items = data["affectedRows"];
        console.log(cantidad_items);
    });
    res.redirect('../../../../carrito_usuario/' + user_id);
});


router.get('/:id_usuario', function(req, res, next) {
    var libros = [];
    var userName = "";
    var user_id = req.params.id_usuario;
    var Cantidad_Carrito = 0;
    var costo_total = 0;
    var renderResumen = _.after(4, function() {
        var json = { title: userName, idUser: user_id, libros: libros, cart: Cantidad_Carrito, Total: costo_total }
        res.render('carrito_usuario', json);
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
        renderResumen();
    });
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getCartItems_o_id",datos, function(data, response) {
        libros = data;
        renderResumen();
    });
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/CartItems_id", datos_carrito, function(data, response) {
        Cantidad_Carrito = data["suma"];
        renderResumen();
    });
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getSumItemCostById", datos_carrito, function(data, response) {
        costo_total = data["suma"];
        console.log("costo: "+costo_total);
        renderResumen();
    });
});

//Borrar un solo elemento de tipo id producto
router.post('/pagar/:id_usuario', function(req, res, next) {
    var user_id = req.params.id_usuario;
    
    var order_id = 0;
    var terminal_id= "";
    var purchase_description= "";
    var purchase_items = [];
    var costo_total = 0;
    var userName_history = "";
    var token_history = "";
    var costo_history= 0;
    var status_history = "";
    
    var post_history = _.after(1, function() {
        console.log("userid_history : ",user_id);
        console.log("userName_history : ",userName_history);
        console.log("token_history : ",token_history);
        console.log("costo_history : ",costo_history);
        console.log("status_history : ",status_history);
        
        var datos_history = {
        data: {
            "userName_history" : userName_history,
            "userid_history" : user_id,
            "token_history" : token_history,
            "costo_history" : costo_history,
            "status_history" : status_history
        },
        headers: { "Authorization": "Basic bWluaWFwcC1nYXRvMjptaW5pYXBwbWEtMTIz",
            "Cache-Control" : "no-cache",
            "Content-Type": "application/json"
            }
        };
        client.post("https://comercio-rest-carlosjara.c9users.io:8081/save_history_created", datos_history, function(data, response) {
        console.log("saved!");
    });
    });
    
    var conteo_res = _.after(5, function() {
        var purchase_details_url = "https://comercio-vw-carlosjara.c9users.io:8080/end_usuario/"+user_id; //Web Factura --"https://example.com/compra/348820"
        var voucher_url = "https://example.com/comprobante/348820"; //Web Factura comprobante get items from cart but with images --"https://example.com/comprobante/348820"
        var timestamp = new Date();
        var expires_at = new Date(timestamp.setTime( timestamp.getTime() + 10 * 86400000/24 ));; //system date + 30 mins --"2018-11-05T20:10:57.549653+00:00"
        var idempotency_token = Buffr.from(expires_at.toISOString()).toString('base64'); //NPI --"ea0c78c5-e85a-48c4-b7f9-24a9014a2339"
        var user_ip_address = requestIp.getClientIp(req); //get ip address --"61.1.224.56" //Localhost
        //console.log("--cost: "+ costo_total+" purchase_details_url: "+ purchase_details_url+" voucher_url: "+ voucher_url+" idempotency_token: "+ idempotency_token+" order_id: "+ order_id+" terminal_id: "+ terminal_id+" purchase_description: "+ purchase_description+" purchase_items: "+ purchase_items+" user_ip_address: "+user_ip_address+" expires_at: "+ expires_at);
        var data_tpaga = {
            headers: {
                "Authorization": "Basic bWluaWFwcC1nYXRvMjptaW5pYXBwbWEtMTIz",
                "Cache-Control": "no-cache",
                "Content-Type": "application/json"
            },
            data: {
                "cost": costo_total,
                "purchase_details_url": purchase_details_url,
                "voucher_url": voucher_url,
                "idempotency_token": idempotency_token,
                "order_id": order_id,
                "terminal_id": terminal_id,
                "purchase_description": purchase_description,
                "purchase_items": purchase_items,
                "user_ip_address": user_ip_address,
                "expires_at": expires_at
            }
        };
        
        client.post("https://stag.wallet.tpaga.co/merchants/api/v1/payment_requests/create", data_tpaga, function(data, response) {
            
            status_history = data["status"]; 
            token_history = data["token"];
            costo_history = data["cost"]; 
            console.log("userid_history : ",user_id);
            console.log("userName_history : ", userName_history);
            console.log("token_history : ", token_history);
            console.log("costo_history : ", costo_history);
            console.log("status_history : ", status_history);
            
            post_history();
            res.redirect(data["tpaga_payment_url"]);
        });
    
    });
    
    var datos_carrito = {
        data: {
            "user_id": user_id
        },
        headers: { "Content-Type": "application/json" }
    };
    
    var datos_cart = {
        data: {
            "id": user_id
        },
        headers: { "Content-Type": "application/json" }
    };
    
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getSumItemCostById", datos_carrito, function(data, response) {
        costo_total = data["suma"];
        console.log("costo: "+costo_total);
        conteo_res();
    });
    
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getCartItems_o_id", datos_cart, function(data, response) {
        purchase_items = data;
        console.log("item : "+purchase_items);
        conteo_res();
    });
    
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getUserNameById", datos_cart, function(data, response) {
        purchase_description = "Pago de libros en linea realizada por : "+data["nombre_usuario"] + " en SNJ (Sistema de libros Nacional Juvenil)";
        userName_history = data["nombre_usuario"];
        console.log("desciption: "+purchase_description);
        conteo_res();
    });
    
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getUserNameById", datos_cart, function(data, response) {
        terminal_id = "Online_"+data["nombre_usuario"];
        console.log("terminal id : "+terminal_id);
        conteo_res();
    });
    
    client.post("https://comercio-rest-carlosjara.c9users.io:8081/getOrderById", datos_carrito, function(data, response) {
        order_id = data["norder"];
        console.log("order "+order_id);
        conteo_res();
    });
    
});

module.exports = router;
