// ==============================
//       Puerto
// ==============================
process.env.PORT = process.env.PORT || 3000; // Establecemos que el puerto sea el del process y si no, que tome uno por defecto



// ==============================
//       Entorno
// ==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // La variable NODE_ENV nos la envía Heroku, y nos la debería enviar donde estemos corriendo la versión de producción


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