const app = require('./src/app');
const migrate = require('./src/config/migrate'); 
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Primero crea las tablas, luego inicia el servidor
migrate()                                           
  .then(() => {                                       
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })                                                  
  .catch((err) => {                                   
    console.error('Error en migración:', err);       
    process.exit(1);                                 
  }); 