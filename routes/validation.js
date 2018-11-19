var express = require('express');
var router = express.Router();
//var string_util = require("underscore.string");
var validator = require("../validators/usuario");
var Client = require('node-rest-client').Client;
var _ = require('lodash');

var client = new Client();

router.post('/',function(req,res){
    //validamos que los campos no esten vacios
    var val_result = validator.validateBlankUser(req.body.nombre_usuario,req.body.contrasena);
    if (val_result.hasErrors){
        res.render('login',{title: 'Login', user: {name: req.body.nombre_usuario, password: req.body.contrasena}, errors: val_result});
    }
    /*Mezcla rara*/
    var user = {
        name: {
            hasProblem : false
        },
        password: {
            hasProblem : false
        },
        hasProblems : false
    };
    var done = _.after(2, function() {
        if (res1["count(id_usuario)"]==0) {
            user.name.problem = "El nombre de usuario no está registrado, favor comunicarse con un administrador.";
            user.name.hasProblem = true;
            user.hasProblems =  true;
        }
        else{
                if(res2["res"] != 'isUser'){
                        user.password.problem = "Error: La contraseña no es correcta, favor comunicarse con un administrador.";
                        user.password.hasProblem = true;    
                        user.hasProblems =  true;
                    }
        }
        
        if (user.hasProblems){
            res.render('login',{title: 'Login', user: {name: req.body.name , password: req.body.password}, user_problems: user});
        }else{
            /*var id = encodeURIComponent(res1["id_usuario"]);
            var typeUserValidator = {
                        data: {"id":id},
                        headers: { "Content-Type": "application/json" }
                      };
                      
            client.post("https://rest-hectordavid1228.c9users.io:8081/getUserType", typeUserValidator, function (data, response) {
                // parsed response body as js object
                res1 = data[0].rol;
                if (res1 == 1){
                    res.redirect('/estudiante_resumen/' + id);
                }else if (res1 == 2){
                    res.redirect('/profesor_resumen/' + id);
                }else if (res1 == 3){
                    res.redirect('/administrador_cursos/' + id);
                }
              });*/
            
        }
    });
    
    var res1 = 0;
    var res2 = "";
/*    var argsIsUser = {
        data: {"user":req.body.name},
        headers: { "Content-Type": "application/json" }
      };
    
    var argsUserValidated = {
                data: {"user":req.body.name,"password":req.body.password},
                headers: { "Content-Type": "application/json" }
              };
              
    client.post("https://rest-hectordavid1228.c9users.io:8081/isUSer", argsIsUser, function (data, response) {
        // parsed response body as js object
        res1 = data.res;
        done();
      });
    
    client.post("https://rest-hectordavid1228.c9users.io:8081/userValidated", argsUserValidated, function (data, response) {
                // parsed response body as js object
                res2 = data;
                done();
                
              });*/
});

module.exports = router;