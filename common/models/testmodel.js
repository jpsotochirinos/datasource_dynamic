'use strict';

module.exports = function(Testmodel) {
    Testmodel.handleChangeError = function(err) {
        console.warn('No se puede actualizar para el modelo Testmodel:', err);
      };
};

