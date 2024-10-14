// src/utils/logManager.js.js
const { logLine } = require('./wsLogger');


class logManager {

    // Método para registrar información de transacciones
    logTransactionInfo(message) {
        this._log('log_WSNominaKonecta', `${message}`);
    }

    // Método para registrar errores de transacciones
    logTransactionError(message, exception) {
        this._log('LogErrores', `${message} - ${exception}`);
    }

    // Método privado para registrar cualquier mensaje
    _log(logName, message) {
        // Llamar a logLine desde wsLogger.js
        logLine(logName, message);
    }
}

module.exports = new logManager;
