import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app';

describe('health', () => {
  it('should return 200 OK for /health', async () => {
    const res = await request(createApp()).get('/health/live');
    expect(res.status).toBe(200);
  }); 

  it('returns 400 on malformed JSON', async () => {
    const res = await request(createApp())
      .post('/anything')
      .set('Content-Type', 'application/json')
      .send('{"invalidJson": true'); // Malformed JSON
    expect(res.status).toBe(400);
  
  });
}); 