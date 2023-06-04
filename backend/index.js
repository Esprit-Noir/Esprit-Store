const { default: mongoose } = require('mongoose');
const app = require('./app');
const connectDatabase = require('./db/Database');

// config
if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({
    path: 'backend/config/.env',
  });
}

connectDatabase();

let PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});
