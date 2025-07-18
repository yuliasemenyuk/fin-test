import { app } from "./server";

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();