import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';

const FILE_SIZE = 10; //MB

const multipartPlugin = fp(async (app) => {
  app.register(multipart, {
    limits: {
      fileSize: FILE_SIZE * 1024 * 1024,
    },
  })
});

export default multipartPlugin;