// ==============================
//       Puerto
// ==============================
process.env.PORT = process.env.PORT || 3000; // Establecemos que el puerto sea el del process y si no, que tome uno por defecto



// ==============================
//       Entorno
// ==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // La variable NODE_ENV nos la envía Heroku, y nos la debería enviar donde estemos corriendo la versión de producción


// ==============================
//       Vencimiento del token
// ==============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '48 h';


// ==============================
//       SEED de autenticación
// ==============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'


// ==============================
//       Base de Datos
// ==============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// ==============================
//       Google Client ID
// ==============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '767908158414-s378c1s19mkmqu4si3ercnsnqkagb6l9.apps.googleusercontent.com';