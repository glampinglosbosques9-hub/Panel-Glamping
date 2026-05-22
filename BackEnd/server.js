import { connectDB } from './src/config/db.js';
import app from './src/app.js';
import routes from './src/routes/index.js';

app.use('/api', routes);

const PORT = process.env.PORT || 3000;

connectDB();

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  });
}

export default app;
