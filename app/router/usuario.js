/*
* misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
*
* Copyright (c) 2018
*/

/**
* @module mq2/router/perfil
*
* @requires express
* @requires mq2/executor
* @requires mq2/service/get-quedadas
*/

'use strict';

const express = require('express');
const showPerfil = require('app/service/get-usuario');
const showQuedadasFromUser = require('app/service/get-quedadas-from-user');

//
// Router: /quedada
//
const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
  strict: true
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  //console.log("Está autenticado?: ",req.isAuthenticated());


  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
  return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}

//
// Exports the router
//

module.exports = function (app,passport) {


  //
  // Endpoints...
  //

  router.get('/:NOMBRE', isLoggedIn, function (req, res) {
    var usuario = req.session.passport.user;
    var otheruser = req.params.NOMBRE;
    var params = {};
    params.nombre = req.params.NOMBRE;
    Promise.all([showPerfil.execute(params),showQuedadasFromUser.execute(params)])
    .catch(
      function(err) {
        //console.log(err.message); // some coding error in handling happened
        res.render('error',{message:err.message, error:err});
      })
    .then(values => {
      var edad = values[0][0].edad;
      var imagen = values[0][0].imagen;
      var quedadas = values[1];
      res.render('usuario',{edad:edad, otheruser:otheruser, user:usuario, imagen:imagen, quedadas:quedadas, message:"", error:""});
  })
    });

  app.use('/usuario', router);

};
