import React, {useState} from "react";
import axios from "axios";

//component to take user inputs and create a new collection
const CreateCollection = ({ userId, refreshCollections }: { userId: number; refreshCollections: () => void }) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          await axios.post('http://localhost:5000/collections', { title, userId });
          setSuccess('Collection created successfully!');
          setTitle('');
          refreshCollections(); 
        } catch (error) {
          setError('Failed to create collection.');
        }
      };
      

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <button type="submit">Create Collection</button>
            {success && <p>{success}</p>}
            {error && <p>{error}</p>}
        </form>
    );
};

export default CreateCollection;