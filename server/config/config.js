// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==================================================
// PUERTO SERVICE
//==================================================

process.env.PORT = process.env.PORT || 3000;

//==================================================
// PUERTO BASE DE DATOS
//==================================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/dbservicioentrega';
} else {
    urlDB = process.env.DB_BASEDATOS;
}

process.env.URLDB = urlDB;

//mongodb+srv://nodehmh:nodehmh@clusternodefirst-nyvs7.gcp.mongodb.net/cafe
// process.env.DB_BASEDATOS = process.env.DB_BASEDATOS || 'mongodb://localhost:27017/dbservicioentrega';