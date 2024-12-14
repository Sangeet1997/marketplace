const request = require('supertest');
const app = require('./index');

describe('GET /checkrag', () => {
  it('should return a response for the RAG query', async () => {
    const response = await request(app)
      .get('/checkrag')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('reply');
    expect(typeof response.body.reply).toBe('string');
    expect(response.body.reply.length).toBeGreaterThan(0);
  }, 35000); // Added 15 second timeout

  it('should contain relevant information about car pricing', async () => {
    const response = await request(app).get('/checkrag');

    expect(response.body.reply).toMatch(/\$|\d+/);
    expect(response.body.reply.toLowerCase()).toMatch(/price|cost|value/);
  }, 35000); // Added 15 second timeout

  it('should handle errors gracefully', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockGetResponseWithContext = jest.fn().mockRejectedValue(new Error('Test error'));
    jest.mock('./yourRAGModule', () => ({
      getResponseWithContext: mockGetResponseWithContext,
    }));

    const response = await request(app)
      .get('/checkrag')
      .expect('Content-Type', /json/)
      .expect(500);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('An error occurred while processing your request');

    console.error.mockRestore();
  }, 35000); // Added 15 second timeout
});
