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
        });
        res.send(201, newComment);
    } catch (error) {
        res.send(500, {message: 'error creating comment', error}) ;
    }
    return next ();
});

//Delete a comment by id
server.del('/comments/:commentId',async (req, res, next) => {
    try {
        const { commentId} = req.params;
        const deletedComment = await prisma.comment.delete({
            where: {id: Number(commentId)},
        });
        res.send(deletedComment);
    } catch (error) {
        res.send(500, {message: 'Error deleting comment', error});
    }
    return next();
} );

};

