var string_util = require("underscore.string");

var exports = module.exports = {};
//exportar un modulo con una funcion
exports.validateBlankUser = function(name, password) {
    var errors = {
        name: {
            hasErrors: false
        },
        password: {
            hasErrors: false
        }
    };

    if (string_util.isBlank(name)) {
        errors.name.error = "El campo Cuenta es Obligatorio";
        errors.name.hasErrors = true;
    }

    if (string_util.isBlank(password)) {
        errors.password.error = "El campo Contraseña es Obligatorio";
        errors.password.hasErrors = true;
    }
    errors.hasErrors = errors.name.hasErrors || errors.password.hasErrors;
    return errors;
}

exports.validateUser = function(name, password) {
    var user = {
        name: {
            hasProblems: false
        },
        password: {
            hasProblems: false
        }
    };

    user.hasProblems = user.password.hasProblems || user.name.hasProblems;
    return user;
}
