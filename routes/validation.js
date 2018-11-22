var express = require('express');
var router = express.Router();
//var string_util = require("underscore.string");
var validator = require("../validators/usuario");
var Client = require('node-rest-client').Client;
var _ = require('lodash');

var client = new Client();

router.post('/', function(req, res) {
    //validamos que los campos no esten vacios
    var val_result = validator.validateBlankUser(req.body.nombre_usuario, req.body.password);
    if (val_result.hasErrors) {
        res.render('login', { title: 'Login', user: { name: req.body.nombre_usuario, password: req.body.password }, errors: val_result });
    }
    /*Mezcla rara*/
    var user = {
        name: {
            hasProblem: false
        },
        password: {
            hasProblem: false
        },
        hasProblems: false
    };
    var done = _.after(2, function() {
        if (res1["validador"] == 0) {
            user.name.problem = "El nombre de usuario no está registrado, favor comunicarse con un administrador.";
            user.name.hasProblem = true;
            user.hasProblems = true;
        }
        else {
            if (res2["res"] != 'isUser') {
                user.password.problem = "Error: La contraseña no es correcta, favor comunicarse con un administrador.";
                user.password.hasProblem = true;
                user.hasProblems = true;
            }
        }
        if (user.hasProblems) {
            res.render('login', { title: 'Login', user: { name: req.body.nombre_usuario, password: req.body.password }, user_problems: user });
        }
        else {
            //res.render('login',{title: 'Login', user: {name: "", password: ""}});
            var id = encodeURIComponent(res1["id"]);
            var roleUserValidator = {
                data: { "id": id },
                headers: { "Content-Type": "application/json" }
            };
            
            client.post("https://comercio-rest-carlosjara.c9users.io:8081/getUSerRole", roleUserValidator, function(data, response) {
                // parsed response body as js object
                res1 = data["res"][0].rol;
                //res.render('login', { title: 'Login', user: { name: res1, password: "" } });
                if (res1 == 'usuario'){
                    res.redirect('/catalogo_usuario/' + id);
                }/*else if (res1 == 2){
                    res.redirect('/profesor_resumen/' + id);
                }else if (res1 == 3){
                    res.redirect('/administrador_cursos/' + id);
                }
                if (res1 == 'usuario'){
                    res.redirect('/usuario_catalogo/' + id);
                }else if (res1 == 2){
                    res.redirect('/administrador/' + id);
                }*/

            });
        }
    });
    var res1 = "";
    var res2 = "";
    var argsIsUser = {
        data: { "user": req.body.nombre_usuario },
        headers: { "Content-Type": "application/json" }
    };

    var argsUserValidated = {
        data: { "nombre_usuario": req.body.nombre_usuario, "contrasena": req.body.password },
        headers: { "Content-Type": "application/json" }
    };

    client.post("https://comercio-rest-carlosjara.c9users.io:8081/isUser", argsIsUser, function(data, response) {
        // parsed response body as js object
        res1 = data.res;
        done();
    });

    client.post("https://comercio-rest-carlosjara.c9users.io:8081/userValidated", argsUserValidated, function(data, response) {
        // parsed response body as js object
        res2 = data;
        done();
    });
});

module.exports = router;