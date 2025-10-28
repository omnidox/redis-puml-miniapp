import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => {
  return { ok: true };
});

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('✅ Server running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();