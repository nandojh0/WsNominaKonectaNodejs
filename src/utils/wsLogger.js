const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const OS = os.platform().toLowerCase();
// Configuraciones iniciales
const LOGS_PATH = isUnix()
    ? path.join(process.env.CATALINA_BASE || process.cwd(), 'webapps', 'log_WSNominaKonecta')
    : path.join(process.cwd(), 'webapps', 'log_WSNominaKonecta');
const ENCRYPT_KEY = process.env.ENCRYPT_KEY; // Asegúrate de que esta clave tenga 32 bytes
const IV_LENGTH = 16; // Tamaño del vector de inicialización para AES

// Función para obtener la fecha actual
function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0].replace(/-/g, '');
}

// Función para obtener la hora actual
function getCurrentTime() {
    const time = new Date();
    return time.toISOString().split('T')[1].split('.')[0];
}

// Función que escribe en un archivo
function writeInFile(filePath, fileName, text) {
    const fullPath = path.join(filePath, fileName);
    checkRootFileExists(filePath);
    fs.appendFileSync(fullPath, text + '\n');
    setPermissions(fullPath);
}

// Verifica si el directorio de logs existe, si no, lo crea
function checkRootFileExists(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
}

// Función para setear permisos del archivo en Unix
function setPermissions(filePath) {
    if (isUnix()) {
        fs.chmodSync(filePath, 0o744); // Permisos de lectura/escritura/ejecución para el dueño y lectura para otros
    }
}

// Verificar si es Unix
function isUnix() {
    return OS.includes('linux') || OS.includes('darwin');
}

// Función que encripta un campo utilizando AES
function encryptField(field, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'utf-8'), iv);
    let encrypted = cipher.update(field, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

// Encuentra los campos que necesitan ser encriptados
function findFieldsToEncrypt(text) {
    const regex = /<\*(.*?)\*>/g;
    let fields = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        fields.push(match[1]);
    }
    return fields;
}

// Encripta los campos en el mensaje
function encryptMessage(filePath, logName, message) {
    let encryptedMessage = message;
    const fieldsToEncrypt = findFieldsToEncrypt(message);
    if (fieldsToEncrypt.length > 0) {
        const iv = crypto.randomBytes(IV_LENGTH);
        const ivBase64 = iv.toString('base64');
        writeInFile(filePath, logName, 'IV: ' + ivBase64); // Escribir el IV en los logs

        fieldsToEncrypt.forEach(field => {
            const encryptedField = encryptField(field, ENCRYPT_KEY, iv);
            encryptedMessage = encryptedMessage.replace(`<*${field}*>`, `<*${encryptedField}*>`);
        });
    }
    return encryptedMessage;
}

// Función principal para loguear el mensaje
function logLine(logName, message) {
    const logFullName = `${getCurrentDate()}_${logName}.txt`;
    try {
        const encryptedMessage = encryptMessage(LOGS_PATH, logFullName, message);
        writeInFile(LOGS_PATH, logFullName, `${getCurrentTime()} ${encryptedMessage}`);
    } catch (error) {
        console.error(`Error en logLine: ${error.message}`);
    }
}

module.exports = {
    logLine
};
