import restify from 'restify';
import { PrismaClient } from '@prisma/client';

const server = restify.createServer();
const prisma = new PrismaClient();

// Middleware to parse request bodies
server.use(restify.plugins.bodyParser());

// Basic route to check server status
server.get('/', (req, res, next) => {
  res.send({ message: 'Hello, World!' });
  return next();
});

// Route to get all users
server.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.send(users);
  } catch (error) {
    res.send(500, { message: 'Error retrieving users', error });
  }
  return next();
});


// Route to create a new user
server.post('/users', async (req, res, next) => {
  try {
    const { name } = req.body;
    const newUser = await prisma.user.create({
      data: {
        name,
      },
    });
    res.send(201, newUser);
  } catch (error) {
    res.send(500, { message: 'Error creating user', error });
  }
  return next();
});

// Route to delete a user by ID
server.del('/users/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      res.send(404, { code: "ResourceNotFound", message: `/users/${id} does not exist` });
      return next();
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.send(200, { message: 'User deleted successfully' });
  } catch (error) {
    res.send(500, { message: 'Error deleting user', error });
  }
  return next();
});


// create new flashcard set
server.post('/flashcardsets', async (req, res, next) => {
    try {
      const { title, userId } = req.body;
      const newFlashcardSet = await prisma.flashcardSet.create({
        data: {
          title,
          userId,
        },
      });
      res.send(201, newFlashcardSet);
    } catch (error) {
      res.send(500, { message: 'Error creating flashcard set', error });
    }
    return next();
  });
  
  // get all flashcard sets
  server.get('/flashcardsets', async (req, res, next) => {
    try {
      const flashcardSets = await prisma.flashcardSet.findMany();
      res.send(flashcardSets);
    } catch (error) {
      res.send(500, { message: 'Error retrieving flashcard sets', error });
    }
    return next();
  });
  

  //get a flashcard set by id
  server.get('/flashcardsets/:id', async (req, res, next) => {
    try {
      const flashcardSet = await prisma.flashcardSet.findUnique({
        where: {
          id: Number(req.params.id),
        },
      });
      if (flashcardSet) {
        res.send(flashcardSet);
      } else {
        res.send(404, { message: 'Flashcard set not found' });
      }
    } catch (error) {
      res.send(500, { message: 'Error retrieving flashcard set', error });
    }
    return next();
  });
  
// update a flashcard set
server.put('/flashcardsets/:id', async (req, res, next)=> {
    try {
        const { title } = req.body;
        const updateFlashcardSet = await prisma.flashcardSet.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                title,
            },
        });
        res.send(updateFlashcardSet);
    } catch (error) {
        res.send(500, {message: 'error update flashcard set', error});
    }
    return next(); 
});

// deletes flashcard set
server.del ('/flashcardsets/:id', async (req,res, next) => {
    try{
        const deleteflashcardset = await prisma.flashcardSet.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.send(200, {message: 'flashcard set deleted', data: deleteflashcardset});
    } catch (error) {
        res.send(500, {message: 'error deleting flashcard set', error});
    }
    return next();
})


// Start the server
server.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
