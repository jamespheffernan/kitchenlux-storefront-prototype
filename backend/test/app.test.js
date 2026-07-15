const request = require('supertest');
const { createApp, parseAllowedOrigins } = require('../app');
const { normalizeLabel, placeholderSvg } = require('../routes/imageRoutes');

describe('prototype app', () => {
  test('parses a comma-separated CORS allowlist', () => {
    expect(parseAllowedOrigins('http://localhost:5173, https://example.test ')).toEqual([
      'http://localhost:5173',
      'https://example.test',
    ]);
  });

  test('serves a generated image without filesystem or network access', async () => {
    const app = createApp({ CORS_ORIGINS: 'http://localhost:5173' });
    const response = await request(app).get('/api/images/direct/chef-kit');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/image\/svg\+xml/);
    expect(response.body.toString('utf8')).toContain('Chef Kit');
  });

  test('sanitizes image labels before interpolation', () => {
    expect(normalizeLabel('<script>alert(1)</script>')).toBe('scriptalert1script');
    expect(placeholderSvg('<script>')).not.toContain('<script>');
  });

  test('rejects browser origins outside the configured allowlist', async () => {
    const app = createApp({ CORS_ORIGINS: 'https://allowed.example' });
    const response = await request(app).get('/').set('Origin', 'https://blocked.example');
    expect(response.status).toBe(500);
  });
});
