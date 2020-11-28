// ===========================
// Puerto
// ===========================
process.env.PORT = process.env.PORT || 3000;

// ===========================
// Entorno
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// BD
// ===========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB =
    'mongodb+srv://y4mir:AQqdCiqAA5UGTRDa@cluster0.la8ac.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
