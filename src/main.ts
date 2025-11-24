import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('E-commerce API')
      .setDescription('Documentação da API e-commerce')
      .setVersion('1.0')
      .addBearerAuth() // JWT Auth
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    console.log(`📘 Swagger disponível em: http://localhost:${PORT}/docs`);
  }

  await app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
  });
}
bootstrap();
