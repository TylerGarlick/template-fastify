import fastify
  from 'fastify'
import oas
  from 'fastify-oas'

export const server = fastify({})

/**
 * https://github.com/fastify/fastify-cors
 */
server.register(require('fastify-cors'))

/**
 * https://github.com/fastify/fastify-env
 */
// server.register(require('fastify-env'))
/**
 * https://github.com/jeromemacias/fastify-boom
 * https://github.com/hapijs/boom
 */
server.register(require('fastify-boom'))

/**
 * https://github.com/smartiniOnGitHub/fastify-healthcheck
 */
server.register(require('fastify-healthcheck'))

/**
 * https://github.com/heply/fastify-bcrypt
 *
 * fastify.bcrypt.hash('password')
 .then(hash => fastify.bcrypt.compare('password', hash))
 .then(match => console.log(match ? 'Matched!' : 'Not matched!'))
 .catch(err => console.error(err.message))
 *
 */
server.register(require('fastify-bcrypt'), {
  saltWorkFactor: 12,
})

server.register(oas, {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'Test openapi',
      description: 'testing the fastify swagger api',
      version: '0.1.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true,
})

server.route({
  method: 'POST',
  url: '/',
  schema: {
    body: {
      type: 'object',
      description: 'an object',
      examples: [
        {
          name: 'Object Sample',
          summary: 'an example',
          value: { a: 'payload' },
        },
      ],
      properties: {
        a: {
          type: 'string',
          description: 'your payload',
        },
      },
    },
  },
  handler: function(request, reply) {
    reply.send({ hello: 'world' })
  },
})

server.ready(err => {
  if (err) throw err
  server.oas()
})


export const listen = async () => {
  const result = await server.listen(process.env.PORT || 5000)
  console.log(result)
}