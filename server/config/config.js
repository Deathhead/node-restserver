// =======================
// Puesto
// =======================
process.env.PORT = process.env.PORT || 3000;

// =======================
// Entorno
// =======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =======================
// Vencimiento de TOKEN
// =======================
// 60 Segundos
// 60 Minutos
// 24 horas
// 30 días

process.env.CADUCIDAD_TOKEN = '48h';

// =======================
// SEED de Autenticación
// =======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =======================
// Base de Datos
// =======================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://mario:KYNCSPP3pU3BdWB3@cluster0.t4bos.mongodb.net/cafe';
}

process.env.URLDB = urlDB;

// =======================
// Google CLIENT
// =======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '732780480169-1n3j86af6913dtspecvc9akh4bgsn1rh.apps.googleusercontent.com';