/*
 * misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
 *
 * Copyright (c) 2018
 */

/**
 * Obtiene las quedadas de un usuario por el nombre
 * @module mq2/service/get-quedadas-from-user
 *
 * @requires lodash
 * @requires module:mq2/args
 * @requires module:mq2/db
 * @requires module:mq2/logger
 */

'use strict';

const _      = require('lodash');

const args   = require('app/args');
const db     = require('app/db');
const logger = require('app/logger').getLogger('mq2.service');


/**
 * Muestra todos los sitios por la direccion
 * @type {string}
 */
const SQL_GET_QUEDADAS_FROM_USER = [
  'SELECT que FROM asiste where nombre={nombre} ORDER BY que'
].join('\n');

/**
 *
 * @return {promise} the promise resolve callback has the parameter, that has all databases from mysql server.
 */
module.exports.execute = function (parametros) {
  return db.getConnection()
    .then(function (conn) {
      const nombre = _preparePattern(parametros.nombre);
      var sqlStatement = SQL_GET_QUEDADAS_FROM_USER;
      var params = {};
      params.nombre = nombre;
      return conn.query(sqlStatement, params)
        .then(function (sitios) {
          if (args.isVerbose()) {
            logger.debug('Your sitios: ', JSON.stringify(quedadas));
          }
          var result = [];
          _.forEach(sitios, function (db) {
            const name = _.values(db)[0];
            result.push(name);
          });
          return result;
        })
        .finally(function () {
          // release the db connection
          conn.release();
        });
    });
};

/**
* Prepare the pattern and replace all '
* @param {string|null} pattern the like pattern
* @return {string|null}
* @private
*/
function _preparePattern(pattern) {
  if (!pattern) {
    return null;
  }
  return pattern.replace(/\*/g, '%');
}
