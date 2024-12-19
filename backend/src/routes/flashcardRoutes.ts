import { PrismaClient } from '@prisma/client';
import { Server } from 'restify';
import { prisma } from '../server'


export const registerFlashcardRoutes = (server: Server) => {
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

   // Get all flashcards
server.get('/flashcards', async (req, res, next) => {
  try {
    const flashcards = await prisma.flashcard.findMany();
    res.send(flashcards);
  } catch (error) {
    res.send(500, { message: 'Error retrieving flashcards', error });
  }
  return next();
});

  // Get all public flashcards
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
  server.put('/cards/edit/:cardId', async (req, res, next) => {
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
  server.del('/cards/delete/:cardId', async (req, res, next) => {
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

  // Update flashcard hidden state
  server.patch('/cards/:cardId/hidden', async (req, res, next) => {
    const { cardId } = req.params;
    const { hiddenState } = req.body;

    try {
      const updatedCard = await prisma.flashcard.update({
        where: {
          id: parseInt(cardId),
        },
        data: {
          hiddenState,
        },
      });
      res.send(200, { message: 'Flashcard hidden state updated successfully', updatedCard });
    } catch (error) {
      res.send(500, { message: 'Error updating hidden state', error });
    }
    return next();
  });

  
  // Make flashcard private or public
  server.put('/flashcards/:flashcardId/visibility', async (req, res, next) => {
    try {
      const { flashcardId } = req.params;
      const { isPublic } = req.body;

      const updatedFlashcard = await prisma.flashcard.update({
        where: { id: Number(flashcardId) },
        data: { isPublic: isPublic },
      });

      res.send({ message: 'Flashcard visibility updated successfully', data: updatedFlashcard });
    } catch (error) {
      console.error('Error updating flashcard visibility:', error);
      res.send(500, { error: 'Internal Server Error' });
    }
    return next();
  });
};
