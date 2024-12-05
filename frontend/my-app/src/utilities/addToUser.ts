import axios from "axios";

//copy a flashcard to users account
export const copyFlashcardToUser = async (flashcardId: number, userId: number, flashcardSetId: number) => {
    try {
        //fetches flashcard data
        const response = await axios.get('http://localhost:5000/flashcard/${flashcardId}');
        const flashcardData = response.data;

        await axios.post('http://localhost:5000/sets/${flashcardSetId}/cards', {
            question: flashcardData.question,
            answer: flashcardData.answer,
            difficulty: flashcardData.difficulty
        });

        console.log("Flashcard copied successfully!");
    } catch (error) {
        console.error("Error copying flashcard:", error);
    }
};


//copy a flashcard set and all contents within it to a users account
export const copyFlashcardSetToUser = async (setId: Number, userId: number, collectionId: number) => {
    try {
        const response = await axios.get('http://localhost:5000/sets/${setId}');
        const setData = response.data;

        const newSetResponse = await axios.post('http://localhost:5000/sets', {
            name: setData.Name,
            userId: userId,
            flashcards: setData.flaschards.map((card:any) => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
            })),
            collections: [{id: collectionId}],
        });
        console.log("Flashcard set copied successfully!");
    } catch (error) {
        console.error("Error copying flashcard set: ", error);
    }
};


// copy a collection and all contents to the users account
export const copyCollectionToUser = async (collectionId: number, userId: number) => {
  try {
    
    const response = await axios.get(`http://localhost:5000/collections/${collectionId}`);
    const collectionData = response.data;

    
    const newCollectionResponse = await axios.post('http://localhost:5000/collections', {
      title: collectionData.title,
      userId: userId,
    });

    const newCollectionId = newCollectionResponse.data.id;

    
    for (const set of collectionData.flashcardSets) {
      const newSetResponse = await axios.post('http://localhost:5000/sets', {
        name: set.name,
        userId: userId,
        flashcards: set.flashcards.map((card: any) => ({
          question: card.question,
          answer: card.answer,
          difficulty: card.difficulty,
        })),
        collections: [{ id: newCollectionId }],
      });
    }

    console.log("Collection copied successfully!");
  } catch (error) {
    console.error("Error copying collection:", error);
  }
};

