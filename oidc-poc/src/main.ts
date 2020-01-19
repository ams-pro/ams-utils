import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Provider } from 'oidc-provider';

const provider = new Provider('https://auth.ams-pro.de', {
  // jwks --> TODO,
  clients: [
    {
      client_id: 'foo',
      client_secret: 'bar',
      redirect_uris: ['https://example.com'],
      response_types: ['id_token'],
      grant_types: ['implicit'],
      token_endpoint_auth_method: 'client_secret_basic',
    },
  ],
  formats: {
    AccessToken: 'jwt',
  },
  features: {
    introspection: { enabled: true },
    revocation: { enabled: true },
    encryption: { enabled: true },
  },
  cookies: {
    keys: ['super', 'woopy', 'secret'],
  },
  extraParams: ['prompt'],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(provider.callback);
  await app.listen(3000);
}
bootstrap();
