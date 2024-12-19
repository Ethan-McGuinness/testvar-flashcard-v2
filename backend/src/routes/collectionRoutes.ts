import { PrismaClient } from '@prisma/client';
import { Server } from 'restify';
import { prisma } from '../server'



export const registerCollectionRoutes = (server: Server) => {
  // Get all collections
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
        },
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

  // Get all public collections
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

  // Get all flashcard sets in a collection
  server.get('/collections/:collectionId/sets', async (req, res, next) => {
    try {
      const { collectionId } = req.params;

      const collectionWithSets = await prisma.collection.findUnique({
        where: { id: Number(collectionId) },
        include: { flashcardSets: true },
      });

      if (!collectionWithSets) {
        return res.send(404, { message: 'Collection not found' });
      }

      res.send(200, collectionWithSets.flashcardSets);
    } catch (error) {
      res.send(500, { message: 'Error retrieving flashcard sets', error });
    }
    return next();
  });

  // Set collection and all content to private or public
  server.put('/collections/:collectionId/visibility', async (req, res, next) => {
    try {
      const { collectionId } = req.params;
      const { isPublic } = req.body;

      const updatedCollection = await prisma.collection.update({
        where: { id: Number(collectionId) },
        data: { isPublic: isPublic },
        include: { flashcardSets: true },
      });

      for (const set of updatedCollection.flashcardSets) {
        await prisma.flashcardSet.update({
          where: { id: set.id },
          data: { isPublic: isPublic },
        });

        const flashcards = await prisma.flashcard.findMany({
          where: { flashcardSetId: set.id },
        });

        for (const flashcard of flashcards) {
          await prisma.flashcard.update({
            where: { id: flashcard.id },
            data: { isPublic: isPublic },
          });
        }
      }

      res.send({ message: 'Collection and its contents visibility updated successfully', data: updatedCollection });
    } catch (error) {
      console.error('Error updating collection visibility:', error);
      res.send(500, { error: 'Internal Server Error' });
    }
    return next();
  });
};
