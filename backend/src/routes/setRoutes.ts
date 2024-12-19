import { PrismaClient } from '@prisma/client';
import { Server } from 'restify';
import { prisma } from '../server'

export const registerSetRoutes = (server: Server) => {
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

      const today = new Date();
      today.setHours(0,0,0,0);

      const setsCreatedToday = await prisma.flashcardSet.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      });

      if (setsCreatedToday >= 20) {
        return res.send(400, {message: 'Limit of 20 sets per day has been reached'});
      }

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
          flashcards: true,  
          Collection: true   
        },
      });

      if (!flashcardSet) {
        res.send(404, { message: 'Flashcard set not found' });
      } else {
        res.send(flashcardSet);  
      }
    } catch (error) {
      res.send(500, { message: 'Error retrieving flashcard set', error });
    }
    return next();
  });

  // Update flashcard set by ID
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

  // Delete flashcard set by ID
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

  // Get all flashcards in flashcard set by ID
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

  // Get all flashcards by user ID
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

  // Get all public flashcard sets
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

  // Set flashcard set and all content to private or public
  server.put('/sets/:setId/visibility', async (req, res, next) => {
    try {
      const { setId } = req.params;
      const { isPublic } = req.body;
  
      // Update flashcard set visibility
      const updatedFlashcardSet = await prisma.flashcardSet.update({
        where: { id: Number(setId) },
        data: { isPublic: isPublic },
      });
  
      // Update visibility for each flashcard in the set
      const flashcards = await prisma.flashcard.findMany({
        where: { flashcardSetId: Number(setId) },
      });
  
      for (const flashcard of flashcards) {
        await prisma.flashcard.update({
          where: { id: flashcard.id },
          data: { isPublic: isPublic },
        });
      }
  
      res.send({ message: 'Flashcard set and its contents visibility updated successfully', data: updatedFlashcardSet });
    } catch (error) {
      console.error('Error updating flashcard set visibility:', error);
      res.send(500, { error: 'Internal Server Error' });
    }
    return next();
  });

  //Delete set and all contents within
  server.del('/sets/delete/:setId', async (req, res, next) => {
    try {
      const {setId} = req.params;

      await prisma.flashcard.deleteMany({
        where: {flashcardSetId: Number(setId)},
      });
      
      await prisma.flashcardSet.delete({
        where: {id: Number(setId)},
      });


      res.send(200, {message:'flashcard set and all its content have been deleted'})
    } catch (error) {
      console.error('Error deleting the set with the id: ${setId}:', error);
      res.send(500, {message: 'error deleting flashcard set', error});
    }
    return next();
  })




};
