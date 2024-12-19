const request = require('supertest');
const { server, prisma } = require('../src/server'); 
const { v4: uuidv4 } = require('uuid'); 

describe('GET /flashcards', () => {
  let user;

  beforeAll(async () => {
    
    const uniqueUsername = `testuser_${uuidv4()}`;

   
    user = await prisma.user.create({
      data: {
        username: uniqueUsername,
        password: 'testpass'
      }
    });

    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        name: 'Sample Set',
        userId: user.id
      }
    });

    await prisma.flashcard.create({
      data: {
        question: 'Sample question',
        answer: 'Sample answer',
        difficulty: 'easy',
        flashcardSetId: flashcardSet.id 
      }
    });
  });

  afterAll(async () => {
    try {
      
      await prisma.flashcard.deleteMany({});
      await prisma.flashcardSet.deleteMany({});
      await prisma.user.deleteMany({});
    } catch (error) {
      console.error('Error during cleanup:', error);
    } finally {
      await prisma.$disconnect(); 

      server.close(() => {
        console.log('Server closed');
      }); // Stop the server
    }
  });

  it('should return all flashcards', async () => {
    const res = await request(server).get('/flashcards');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('question', 'Sample question');
  });

  it('should handle errors', async () => {
  
    const mockFindMany = jest.fn(() => {
      throw new Error('Database error');
    });
    prisma.flashcard.findMany = mockFindMany;

    const res = await request(server).get('/flashcards');
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual('Error retrieving flashcards');
  });
});
