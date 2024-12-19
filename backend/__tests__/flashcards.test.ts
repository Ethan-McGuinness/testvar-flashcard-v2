const request = require('supertest');
const { server, prisma } = require('../src/server'); // Adjust the path to your server file
const { v4: uuidv4 } = require('uuid'); // To generate unique usernames

describe('GET /flashcards', () => {
  let user;

  beforeAll(async () => {
    // Generate a unique username for the user
    const uniqueUsername = `testuser_${uuidv4()}`;

    // Setup your test database with a user, flashcard set, and some flashcards
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
        flashcardSetId: flashcardSet.id // Use the created flashcard set ID
      }
    });
  });

  afterAll(async () => {
    try {
      // Cleanup your test database in proper order to avoid foreign key constraints
      await prisma.flashcard.deleteMany({});
      await prisma.flashcardSet.deleteMany({});
      await prisma.user.deleteMany({});
    } catch (error) {
      console.error('Error during cleanup:', error);
    } finally {
      await prisma.$disconnect(); // Close the Prisma connection

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
    // Mock the Prisma client's findMany method to throw an error
    const mockFindMany = jest.fn(() => {
      throw new Error('Database error');
    });
    prisma.flashcard.findMany = mockFindMany;

    const res = await request(server).get('/flashcards');
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual('Error retrieving flashcards');
  });
});
