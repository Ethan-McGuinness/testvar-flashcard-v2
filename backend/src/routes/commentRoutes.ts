import { PrismaClient } from '@prisma/client';
import { Server } from 'restify';

const prisma = new PrismaClient();

export const registerCommentRoutes = (server: Server) => {


//get all comments from a set id
server.get('/sets/:setId/comments', async (req, res, next) => {
    try{
        const {setId} = req.params;
        const comments = await prisma.comment.findMany({
            where: {setId: Number(setId)},
            include: {author: true},
        });
        res.send(comments);
    } catch (error) {
        res.send(500, {message: 'Error retrieving comments', error});
    }
    return next()
});

// create and add a comment to a set
server.post('/sets/:setId/comments', async (req, res, next) => {
    try {
        const { setId} = req.params;
        const { comment, authorId} = req.body;

        const newComment = await prisma.comment.create({
            data: {
                comment,
                setId: Number(setId),
                authorId: Number(authorId),
            },
            include: {author: true},
        });
        res.send(201, newComment);
    } catch (error) {
        res.send(500, {message: 'error creating comment', error}) ;
    }
    return next ();
});

//Delete a comment by id
server.del('/comments/:commentId', async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userId } = req.body; 
  
      
      const comment = await prisma.comment.findUnique({
        where: { id: Number(commentId) },
      });
  
      if (!comment) {
        return res.send(404, { message: 'Comment not found' });
      }
  
      
      if (comment.authorId !== userId) {
        return res.send(403, { message: 'You are not authorized to delete this comment' });
      }
  
      
      const deletedComment = await prisma.comment.delete({
        where: { id: Number(commentId) },
      });
  
      res.send(deletedComment);
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.send(500, { message: 'Error deleting comment', error });
    }
    return next();
  });
  

};

