import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import 'dotenv-safe/config';
import routes from './routes/index';
import { logger, requestLogger } from './middleware/logger';
import setAccessHeaders from './middleware/setAccessHeaders';
import errorHandler from './middleware/errorHandler';
import { createTypeormConn } from './utils/createTypeormConn';

const main = async () => {
  const isDev =
    'undefined' === typeof process.env.NODE_ENV ||
    'development' === process.env.NODE_ENV;

  await createTypeormConn(isDev);

  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(requestLogger);

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(setAccessHeaders);

  app.use('/', routes);

  app.use(errorHandler);

  if (process.env.PORT) {
    app.set('port', process.env.PORT);
    const server = app.listen(app.get('port'), () => {
      logger({
        msg: `Express running → PORT ${isDev ? 'localhost:' : ''}${
          server.address().port
        }`,
      });
    });
  } else {
    logger({ msg: 'PORT is not defined!', type: 'ERROR' });
  }
};

main().catch((err) => {
  logger({ msg: 'Could not start server!', type: 'ERROR', details: err });
});
