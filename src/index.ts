import 'dotenv/config';
import { app } from "./server";
import { getDbPool } from "./database/config";

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  try {
    await getDbPool();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();