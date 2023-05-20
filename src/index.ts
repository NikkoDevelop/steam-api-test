import fastify from 'fastify';
import cors from '@fastify/cors';
import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
// import fastifySwagger from '@fastify/swagger';
// import fastifySwaggerUi from '@fastify/swagger-ui';

import { COOKIE_SECRET, SERVER_HOST, SERVER_PORT } from './configs';
import { logger } from './logs';
// import { swaggerOptions, swaggerUiOptions } from './lib/swagger';

// import Router from './routes/*.routes';

const server = fastify();

(async () => {
  await server.register(cookie, {
    secret: COOKIE_SECRET,
    parseOptions: {},
  } as FastifyCookieOptions);

  await server.register(cors, {
    origin: (origin, callback) => {
      callback(null, true);
    },
  });

  // await server.register(fastifySwagger, swaggerOptions);
  // await server.register(fastifySwaggerUi, swaggerUiOptions);

  // await server.register(jobRouter, {
  //   prefix: '/job',
  // });

  await server.ready().then(() => {
    logger.info('Successfully booted!');
  }, (err) => {
    logger.error('an error happened', err);
  });

  try {
    await server.ready();
    // server.swagger();

    server.listen({
      port: Number(SERVER_PORT),
      host: SERVER_HOST,
    }, (err) => {
      if (err) {
        logger.error(err?.stack);
      }
      logger.info(`Server started at http://${SERVER_HOST}:${SERVER_PORT}`);
    });
  } catch (error) {
    logger.error(`Unable to connect the server: ${error}`);

    throw new Error(error as string);
  }
})();
