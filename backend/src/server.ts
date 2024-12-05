import restify from 'restify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerAuthRoutes } from './routes/authRoutes';
import corsMiddleware, { CorsMiddleware } from 'restify-cors-middleware2';

const server = restify.createServer({
  name: 'API',
  version: '1.0.0',
});
const prisma = new PrismaClient();

const cors: corsMiddleware.CorsMiddleware = corsMiddleware({
  origins: ['*'],
  allowHeaders: ['Authorization', 'Content-Type'],
  // exposeHeaders: ['Authorization'],
});

server.pre(cors.preflight);
server.use(cors.actual);

// Middleware to parse request bodies
server.use(restify.plugins.bodyParser());

// Register the authRoutes
registerAuthRoutes(server);


server.get('/', (req, res, next) => {
  res.send({ message: 'API is running' });
  return next();
});



// Start the server
server.listen(5000, () => {
  console.log('Server is running at http://localhost:5000');
});





// Get all flashcard sets
server.get('/sets', async (req, res, next) => {
  try {
    const flashcardSets = await prisma.flashcardSet.findMany();
    res.send(flashcardSets);
  } catch (error) {
    res.send(500, { message: 'Error retrieving flashcard sets', error });
  }
  return next();
});

// Create a new flashcard set
server.post('/sets', async (req, res, next) => {
  try {
    const { name, userId, flashcards, collections } = req.body;

    if (!name || !userId || !flashcards || !collections) {
      res.send(400, { message: 'Name, User ID, flashcards, and collections are required' });
      return next();
    }

    // Create the flashcard set and link it to collections
    const newFlashcardSet = await prisma.flashcardSet.create({
      data: {
        name,
        userId,
        flashcards: {
          create: flashcards,  // Create flashcards from the provided data
        },
        Collection: {
          connect: collections.map((col: { id: number }) => ({ id: col.id })), // Connect to collections
        },
      },
    });

    res.send(201, newFlashcardSet); 
  } catch (error) {
    res.send(500, { message: 'Error creating flashcard set', error });
  }

  return next();
});



// Get flashcard set by ID, including flashcards and collections
server.get('/sets/:setId', async (req, res, next) => {
  try {
    const { setId } = req.params;

    const flashcardSet = await prisma.flashcardSet.findUnique({
      where: { id: Number(setId) },
      include: {
        flashcards: true,  // Include flashcards
        Collection: true   // Include associated collections
      },
    });

    if (!flashcardSet) {
      res.send(404, { message: 'Flashcard set not found' });
    } else {
      res.send(flashcardSet);  // Return the found flashcard set, with flashcards and collections
    }
  } catch (error) {
    res.send(500, { message: 'Error retrieving flashcard set', error });
  }
  return next();
});


//update flashcard set by id
server.put('/sets/:setId', async (req, res, next) => {
  try {
    const { setId } = req.params; 
    const { name, userId } = req.body;

    // Update the flashcard set
    const updatedFlashcardSet = await prisma.flashcardSet.update({
      where: { id: Number(setId) },
      data: {
        name,
        userId,
      },
    });

    res.send(updatedFlashcardSet); 
  } catch (error) {
    res.send(500, { message: 'Error updating flashcard set', error });
  }
  return next();
});

// delete flashcard set by id 
server.del('/sets/:setId', async (req, res, next) => {
  try {
    const { setId } = req.params; 

   
    const deletedFlashcardSet = await prisma.flashcardSet.delete({
      where: { id: Number(setId) },
    });

    res.send(204); 
  } catch (error) {
    res.send(500, { message: 'Error deleting flashcard set', error });
  }
  return next();
});

// get all flashcards in flashcard set by id
server.get('/sets/:setId/cards', async (req, res, next) => {
  try {
    const { setId } = req.params; 

    
    const flashcards = await prisma.flashcard.findMany({
      where: { flashcardSetId: Number(setId) },
    });

    res.send(flashcards); 
  } catch (error) {
    res.send(500, { message: 'Error retrieving flashcards', error });
  }
  return next();
});

//get all flaschards by userId
server.get('/users/:userId/flashcardSets', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const flashcardSets = await prisma.flashcardSet.findMany({
      where: {
        userId: Number(userId), 
      },
    });

    res.send(flashcardSets); 
  } catch (error) {
    res.send(500, { message: 'Error retrieving flashcard sets for user', error });
  }
  return next();
});


//get all public flashcard sets
server.get('/public-sets', async (req, res, next) => {
  try {
    const flashcardSets = await prisma.flashcardSet.findMany({
      where: { isPublic: true },
    });
    res.send(flashcardSets);
  } catch (error) {
    res.send(500, { message: 'Error fetching public flashcard sets', error });
  }
  return next();
});







// Get all users
server.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany(); // Fetch all users from the database
    res.send(users); // Send the list of users as a response
  } catch (error) {
    res.send(500, { message: 'Error retrieving users', error });
  }
  return next();
});


// create a new user
server.post('/users', async (req, res, next) => {
  try {
    const { username, admin, password } = req.body;  // Include password in the request body

    if (!password) {
      return res.send(400, { message: 'Password is required' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,  // Save the hashed password
        admin: admin || false,
      },
    });

    res.send(201, newUser);  // Respond with the created user
  } catch (error) {
    res.send(500, { message: 'Error creating user', error });
  }
  return next();
});

//get user by id 
server.get('/users/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params; 

    
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }, 
    });

    if (!user) {
      res.send(404, { message: 'User not found' }); 
    } else {
      res.send(user); 
    }
  } catch (error) {
    res.send(500, { message: 'Error retrieving user', error });
  }
  return next();
});

//update a user by Id
server.put('/users/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params; 
    const { username, admin, password } = req.body;

    
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }, 
    });

    if (!user) {
      return res.send(404, { message: 'User not found' });
    }

    
    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);  
    }

   
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) }, 
      data: {
        username: username || user.username,  
        admin: admin !== undefined ? admin : user.admin,  
        password: hashedPassword || user.password,  
      },
    });

    res.send(updatedUser); 
  } catch (error) {
    res.send(500, { message: 'Error updating user', error });
  }
  return next();
});

//delete a user by id
server.del('/users/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params; 

    
    const deletedUser = await prisma.user.delete({
      where: { id: Number(userId) }, 
    });

    res.send(deletedUser); 
  } catch (error) {
    res.send(500, { message: 'Error deleting user', error });
  }
  return next();
});







//get all collections
server.get('/collections', async (req, res, next) => {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        flashcardSets: true, 
      },
    });
    res.send(collections);  
  } catch (error) {
    res.send(500, { message: 'Error retrieving collections', error });
  }
  return next();
});


// Create a new collection
server.post('/collections', async (req, res, next) => {
  try {
    const { title, userId } = req.body;

   
    if (!userId) {
      res.send(400, { message: 'userId is required' });
      return next();
    }

    
    const newCollection = await prisma.collection.create({
      data: {
        title,
        userId, 
      },
    });

    res.send(201, newCollection); 
  } catch (error) {
    res.send(500, { message: 'Error creating collection', error });
  }
  return next();
});

// Get a collection by ID
server.get('/collections/:collectionId', async (req, res, next) => {
  try {
    const { collectionId } = req.params;

    const collection = await prisma.collection.findUnique({
      where: {
        id: Number(collectionId), 
      },
    });

    if (!collection) {
      res.send(404, { message: 'Collection not found' });
      return next();
    }

    res.send(collection); 
  } catch (error) {
    res.send(500, { message: 'Error retrieving collection', error });
  }
  return next();
});

// Update a collection by ID
server.put('/collections/:collectionId', async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const { title } = req.body;

    const updatedCollection = await prisma.collection.update({
      where: {
        id: Number(collectionId),
      },
      data: {
        title, 
      },
    });

    res.send(updatedCollection); 
  } catch (error) {
    res.send(500, { message: 'Error updating collection', error });
  }
  return next();
});

// Delete a collection by ID
server.del('/collections/:collectionId', async (req, res, next) => {
  try {
    const { collectionId } = req.params;

    const deletedCollection = await prisma.collection.delete({
      where: {
        id: Number(collectionId),
      },
    });

    res.send({ message: 'Collection deleted', collection: deletedCollection });
  } catch (error) {
    res.send(500, { message: 'Error deleting collection', error });
  }
  return next();
});

// Get all collections for a specific user
server.get('/users/:userId/collections', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const collections = await prisma.collection.findMany({
      where: {
        userId: Number(userId), 
      },
      include: {
        flashcardSets: true,
      }
    });

    res.send(collections); 
  } catch (error) {
    res.send(500, { message: 'Error retrieving collections for user', error });
  }
  return next();
});

// Get a random collection
server.get('/collections/random', async (req, res, next) => {
  try {
    
    const collections = await prisma.collection.findMany();
    
    
    if (collections.length === 0) {
      res.send(404, { message: 'No collections available' });
      return next();
    }

    
    const randomCollection = collections[Math.floor(Math.random() * collections.length)];

   
    res.send(randomCollection);  
  } catch (error) {
    res.send(500, { message: 'Error fetching random collection', error });
  }
  return next();
});

//get all public collections
server.get('/public-collections', async (req, res, next) => {
  try {
    const collections = await prisma.collection.findMany({
      where: { isPublic: true },
    });
    res.send(collections);
  } catch (error) {
    res.send(500, { message: 'Error fetching public collections', error });
  }
  return next();
});





// Create a new flashcard in a set
server.post('/sets/:setId/cards', async (req, res, next) => {
  const { setId } = req.params;
  const { question, answer, difficulty } = req.body;

  try {
    const newFlashcard = await prisma.flashcard.create({
      data: {
        question,
        answer,
        difficulty,
        flashcardSetId: parseInt(setId),
      },
    });
    res.send(201, newFlashcard);
  } catch (error) {
    res.send(500, { message: 'Error creating flashcard', error });
  }

  return next();
});

// Get a flashcard by ID
server.get('/cards/:cardId', async (req, res, next) => {
  const { cardId } = req.params;

  try {
    const flashcard = await prisma.flashcard.findUnique({
      where: {
        id: parseInt(cardId),
      },
    });

    if (!flashcard) {
      res.send(404, { message: 'Flashcard not found' });
      return next();
    }

    res.send(flashcard);
  } catch (error) {
    res.send(500, { message: 'Error retrieving flashcard', error });
  }

  return next();
});

// Update a flashcard by ID
server.put('/cards/:cardId', async (req, res, next) => {
  const { cardId } = req.params;
  const { question, answer, difficulty } = req.body;

  try {
    const updatedFlashcard = await prisma.flashcard.update({
      where: {
        id: parseInt(cardId),
      },
      data: {
        question,
        answer,
        difficulty,
      },
    });
    res.send(updatedFlashcard);
  } catch (error) {
    res.send(500, { message: 'Error updating flashcard', error });
  }

  return next();
});

// Delete a flashcard by ID
server.del('/cards/:cardId', async (req, res, next) => {
  const { cardId } = req.params;

  try {
    await prisma.flashcard.delete({
      where: {
        id: parseInt(cardId),
      },
    });
    res.send(200, { message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.send(500, { message: 'Error deleting flashcard', error });
  }

  return next();
});

//update flashcard hidden state
server.patch('/cards/:cardId/hidden', async (req,res,next)=> {
  const {cardId} = req.params;
  const {hiddenState} = req.body;

  try{
    const updatedCard = await prisma.flashcard.update({
      where: {
        id: parseInt(cardId),
      },
      data: {
        hiddenState,
      },
    });
    res.send(200, {message: 'flashcard hidden state updated successfully', updatedCard})
  }catch (error){
    res.send(500, {message: 'error updating hidden state', error});
  }
  return next();
})

//get all public flashcards
server.get('/public-flashcards', async (req, res, next) => {
  try {
    const flashcards = await prisma.flashcard.findMany({
      where: { isPublic: true },
    });
    res.send(flashcards);
  } catch (error) {
    res.send(500, { message: 'Error fetching public flashcards', error });
  }
  return next();
});

