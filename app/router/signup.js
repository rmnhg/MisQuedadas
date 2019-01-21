/*
* misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
*
* Copyright (c) 2018
*/

/**
* @module mq2/router/signup
*
* @requires express
* @requires mq2/executor
* @requires mq2/service/get-usuarios
* @requires mq2/service/add-usuario
*/

'use strict';

const express = require('express');

const executor      = require('app/executor');
const showUsuarios = require('app/service/get-usuarios');
const addUsuario = require('app/service/add-usuario');
//const removeUsuario = require('app/service/remove-usuario');

const fs = require('fs')
const formidable = require('formidable');

const _ = require('lodash');
var def = require('../../misquedadas-2.json');

//
// Router: /quedada
//
const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
  strict: true
});


//
// Exports the router
//
module.exports = function (app,passport) {
  //
  // Endpoints...
  //



  /**
  * @api {post} /sitio Añade un nuevo sitio
  * @apiName AddSitio
  * @apiGroup Sitio
  * @apiDescription Añade un sitio
  * @apiVersion 0.0.1
  * @apiExample {curl} Example usage:
  *     post -i http://localhost:18080/sitio/direccion=casa azul&lat=40.942132&lng=-4.103217
  *
  * Si existe el sitio por <direccion> se manda error, si no se añade y se
  * redirecciona a /quedada/nuevo
  */
  router.post('/', function (req, res) {
    var params = {};
    params.nombre = req.body.nombre;
    params.clave = req.body.clave;
    params.edad = req.body.edad;
    params.imagen = req.body.nombre+".jpg";

    //console.log(params);
    Promise.all([showUsuarios.execute()])
    .catch(
      function(err) {
        //console.log(err); // some coding error in handling happened
        var mensaje = "Error en la base de datos";
        res.render('signup',{message:mensaje, error:mensaje});
      })
      .then(values => {
        var usuarios = values[0];
        if (usuarios.includes(params.nombre)){
          var mensaje = "Error: estás tratando de añadir un usuario que ya existe.";
          //console.log(mensaje);
          res.render('signup',{message:mensaje, error:""});
        } else {
          Promise.all([addUsuario.execute(params)])
          .catch(
            function(err) {
              //console.log(err); // some coding error in handling happened
              var mensaje = "Error en la base de datos:";
              res.render('signup',{message:mensaje, error:JSON.stringify(err)});
            })
          .then(values => {
            var resultado = values[0];
            if(resultado = []){
              var defIMG = './app/public/img/users/usuario.jpg';
              var newIMG = './app/public/img/users/'+params.imagen;
              fs.copyFile(defIMG, newIMG, function (err) {
                if (err) throw err;
              });
              res.redirect(301,'/login');
            } else {
              res.render('signup',{message:"Ha habido un error:", error:resultado});
            }
            });
          }
        });
      });

  router.get('/', function (req, res) {
    res.render('signup',{message:"", error:""});
  });

  app.use('/signup', router);
};
