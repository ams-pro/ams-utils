import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Provider } from 'oidc-provider';

const provider = new Provider('https://auth.ams-pro.de', {
    jwks: keystore.toJWKS(true),
    formats: { AccessToken: 'jwt', ClientCredentials: 'jwt', customizers: {
        jwt(ctx, token, parts) {
            // Hier Formatting von single-scopes zu zusammengefassten scopes
            // --> ams:betriebsmittel:read ams:betriebsmittel:write -> ams:betriebsmittel:{read,write}
        }
    } },
    cookies: { keys: ['test'] },
    // features: { ietfJWTAccessTokenProfile: { enabled: true } },
    features: {
        clientCredentials: { enabled: true },
        introspection: { enabled: true },
        userinfo: { enabled: true },
    },

    scopes: 'ams:betriebsmittel:read ams:betriebsmittel:write'.split(' '),

    clients: [
        {
            client_id: 'betriebsmittel_api',
            client_secret: 'bar',
            redirect_uris: ['http://localhost:3001/cb'],
            response_types: [],
            grant_types: ['client_credentials'],
            token_endpoint_auth_method: "client_secret_basic",
            introspection_endpoint_auth_method: 'client_secret_basic',
            scope: 'ams:betriebsmittel:read ams:betriebsmittel:write'
        }
    ],
    // dynamicScopes: [/ams:[a-z]{1,}:(read|write)/],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(provider.callback);
  await app.listen(3000);
}
bootstrap();
