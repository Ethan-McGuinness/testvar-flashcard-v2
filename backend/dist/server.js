"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const restify_1 = __importDefault(require("restify"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authRoutes_1 = require("./routes/authRoutes");
const server = restify_1.default.createServer();
const prisma = new client_1.PrismaClient();
// Middleware to parse request bodies
server.use(restify_1.default.plugins.bodyParser());
// Register the authRoutes
(0, authRoutes_1.registerAuthRoutes)(server);
// Root route
server.get('/', (req, res, next) => {
    res.send({ message: 'API is running' });
    return next();
});
// Start the server
server.listen(5000, () => {
    console.log('Server is running at http://localhost:5000');
});
// Get all flashcard sets
server.get('/sets', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const flashcardSets = yield prisma.flashcardSet.findMany();
        res.send(flashcardSets);
    }
    catch (error) {
        res.send(500, { message: 'Error retrieving flashcard sets', error });
    }
    return next();
}));
// Create a new flashcard set
server.post('/sets', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, userId } = req.body;
        if (!name || !userId) {
            res.send(400, { message: 'Name and User ID are required' });
            return next();
        }
        const newFlashcardSet = yield prisma.flashcardSet.create({
            data: {
                name,
                userId,
            },
        });
        res.send(201, newFlashcardSet);
    }
    catch (error) {
        res.send(500, { message: 'Error creating flashcard set', error });
    }
    return next();
}));
//get flashcard set by id
server.get('/sets/:setId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { setId } = req.params;
        const flashcardSet = yield prisma.flashcardSet.findUnique({
            where: { id: Number(setId) },
        });
        if (!flashcardSet) {
            res.send(404, { message: 'Flashcard set not found' });
        }
        else {
            res.send(flashcardSet); // Return the found flashcard set
        }
    }
    catch (error) {
        res.send(500, { message: 'Error retrieving flashcard set', error });
    }
    return next();
}));
//update flashcard set by id
server.put('/sets/:setId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { setId } = req.params;
        const { name, userId } = req.body;
        // Update the flashcard set
        const updatedFlashcardSet = yield prisma.flashcardSet.update({
            where: { id: Number(setId) },
            data: {
                name,
                userId,
            },
        });
        res.send(updatedFlashcardSet);
    }
    catch (error) {
        res.send(500, { message: 'Error updating flashcard set', error });
    }
    return next();
}));
// delete flashcard set by id 
server.del('/sets/:setId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { setId } = req.params;
        const deletedFlashcardSet = yield prisma.flashcardSet.delete({
            where: { id: Number(setId) },
        });
        res.send(204);
    }
    catch (error) {
        res.send(500, { message: 'Error deleting flashcard set', error });
    }
    return next();
}));
// get all flashcards in flashcard set by id
server.get('/sets/:setId/cards', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { setId } = req.params;
        const flashcards = yield prisma.flashcard.findMany({
            where: { flashcardSetId: Number(setId) },
        });
        res.send(flashcards);
    }
    catch (error) {
        res.send(500, { message: 'Error retrieving flashcards', error });
    }
    return next();
}));
// Get all users
server.get('/users', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany(); // Fetch all users from the database
        res.send(users); // Send the list of users as a response
    }
    catch (error) {
        res.send(500, { message: 'Error retrieving users', error });
    }
    return next();
}));
// create a new user
server.post('/users', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, admin, password } = req.body; // Include password in the request body
        if (!password) {
            return res.send(400, { message: 'Password is required' });
        }
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create the user
        const newUser = yield prisma.user.create({
            data: {
                username,
                password: hashedPassword, // Save the hashed password
                admin: admin || false,
            },
        });
        res.send(201, newUser); // Respond with the created user
    }
    catch (error) {
        res.send(500, { message: 'Error creating user', error });
    }
    return next();
}));
//get user by id 
server.get('/users/:userId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield prisma.user.findUnique({
            where: { id: Number(userId) },
        });
        if (!user) {
            res.send(404, { message: 'User not found' });
        }
        else {
            res.send(user);
        }
    }
    catch (error) {
        res.send(500, { message: 'Error retrieving user', error });
    }
    return next();
}));
//update a user by Id
server.put('/users/:userId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { username, admin, password } = req.body;
        const user = yield prisma.user.findUnique({
            where: { id: Number(userId) },
        });
        if (!user) {
            return res.send(404, { message: 'User not found' });
        }
        let hashedPassword = undefined;
        if (password) {
            hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        }
        const updatedUser = yield prisma.user.update({
            where: { id: Number(userId) },
            data: {
                username: username || user.username,
                admin: admin !== undefined ? admin : user.admin,
                password: hashedPassword || user.password,
            },
        });
        res.send(updatedUser);
    }
    catch (error) {
        res.send(500, { message: 'Error updating user', error });
    }
    return next();
}));
//delete a user by id
server.del('/users/:userId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const deletedUser = yield prisma.user.delete({
            where: { id: Number(userId) },
        });
        res.send(deletedUser);
    }
    catch (error) {
        res.send(500, { message: 'Error deleting user', error });
    }
    return next();
}));
//get all collections
server.get('/collections', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield prisma.collection.findMany({
            include: {
                flashcardSets: true,
            },
        });
        res.send(collections);
    }
    catch (error) {
        res.send(500, { message: 'Error retrieving collections', error });
    }
    return next();
}));
// Create a new collection
server.post('/collections', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, userId } = req.body;
        if (!userId) {
            res.send(400, { message: 'userId is required' });
            return next();
        }
        const newCollection = yield prisma.collection.create({
            data: {
                title,
                userId,
            },
        });
        res.send(201, newCollection);
    }
    catch (error) {
        res.send(500, { message: 'Error creating collection', error });
    }
    return next();
}));
// Get a collection by ID
server.get('/collections/:collectionId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collectionId } = req.params;
        const collection = yield prisma.collection.findUnique({
            where: {
                id: Number(collectionId),
            },
        });
        if (!collection) {
            res.send(404, { message: 'Collection not found' });
            return next();
        }
        res.send(collection);
    }
    catch (error) {
        res.send(500, { message: 'Error retrieving collection', error });
    }
    return next();
}));
// Update a collection by ID
server.put('/collections/:collectionId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collectionId } = req.params;
        const { title } = req.body;
        const updatedCollection = yield prisma.collection.update({
            where: {
                id: Number(collectionId),
            },
            data: {
                title,
            },
        });
        res.send(updatedCollection);
    }
    catch (error) {
        res.send(500, { message: 'Error updating collection', error });
    }
    return next();
}));
// Delete a collection by ID
server.del('/collections/:collectionId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collectionId } = req.params;
        const deletedCollection = yield prisma.collection.delete({
            where: {
                id: Number(collectionId),
            },
        });
        res.send({ message: 'Collection deleted', collection: deletedCollection });
    }
    catch (error) {
        res.send(500, { message: 'Error deleting collection', error });
    }
    return next();
}));
// Get all collections for a specific user
server.get('/users/:userId/collections', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const collections = yield prisma.collection.findMany({
            where: {
                userId: Number(userId),
            },
        });
        res.send(collections);
    }
    catch (error) {
        res.send(500, { message: 'Error retrieving collections for user', error });
    }
    return next();
}));
// Get a random collection
server.get('/collections/random', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield prisma.collection.findMany();
        if (collections.length === 0) {
            res.send(404, { message: 'No collections available' });
            return next();
        }
        const randomCollection = collections[Math.floor(Math.random() * collections.length)];
        res.send(randomCollection);
    }
    catch (error) {
        res.send(500, { message: 'Error fetching random collection', error });
    }
    return next();
}));
// Create a new flashcard in a set
server.post('/sets/:setId/cards', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { setId } = req.params;
    const { question, answer, difficulty } = req.body;
    try {
        const newFlashcard = yield prisma.flashcard.create({
            data: {
                question,
                answer,
                difficulty,
                flashcardSetId: parseInt(setId),
            },
        });
        res.send(201, newFlashcard);
    }
    catch (error) {
        res.send(500, { message: 'Error creating flashcard', error });
    }
    return next();
}));
// Get a flashcard by ID
server.get('/cards/:cardId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cardId } = req.params;
    try {
        const flashcard = yield prisma.flashcard.findUnique({
            where: {
                id: parseInt(cardId),
            },
        });
        if (!flashcard) {
            res.send(404, { message: 'Flashcard not found' });
            return next();
        }
        res.send(flashcard);
    }
    catch (error) {
        res.send(500, { message: 'Error retrieving flashcard', error });
    }
    return next();
}));
// Update a flashcard by ID
server.put('/cards/:cardId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cardId } = req.params;
    const { question, answer, difficulty } = req.body;
    try {
        const updatedFlashcard = yield prisma.flashcard.update({
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
    }
    catch (error) {
        res.send(500, { message: 'Error updating flashcard', error });
    }
    return next();
}));
// Delete a flashcard by ID
server.del('/cards/:cardId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cardId } = req.params;
    try {
        yield prisma.flashcard.delete({
            where: {
                id: parseInt(cardId),
            },
        });
        res.send(200, { message: 'Flashcard deleted successfully' });
    }
    catch (error) {
        res.send(500, { message: 'Error deleting flashcard', error });
    }
    return next();
}));
