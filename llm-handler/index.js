const express = require('express');
const cors = require('cors');
const { OllamaEmbeddings } = require("@langchain/community/embeddings/ollama");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { ChatOllama } = require("@langchain/ollama");
const fs = require('fs');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const llm = new ChatOllama({
  model: "llama3.2",
  baseUrl: "http://127.0.0.1:11434",
});

const embeddings = new OllamaEmbeddings({
  model: "mxbai-embed-large",
  baseUrl: "http://127.0.0.1:11434",
});

let vectorStore = null;
const vectorStoreConfig = {storePath: './vector_store.json'};

const loadVectorStore = async () => {
  try {
    // Check if store file exists
    if (!fs.existsSync(vectorStoreConfig.storePath)) {
      console.log("No existing vector store found.");
      return false;
    }

    // Read stored vector data
    const storedData = JSON.parse(fs.readFileSync(vectorStoreConfig.storePath, 'utf-8'));

    // Recreate vector store
    vectorStore = await MemoryVectorStore.fromDocuments(
      storedData.map(item => ({
        pageContent: item.pageContent,
        metadata: item.metadata
      })),
      embeddings
    );

    // // Store documents for potential future serialization
    // this.documents = storedData.map(item => ({
    //   pageContent: item.pageContent,
    //   metadata: item.metadata
    // }));

    console.log("Existing vector store loaded successfully.");
    return true;
  } catch (error) {
    console.error("Error loading vector store:", error);
    return false;
  }
}

// loadVectorStore();


const similaritySearch = async (query, k = 5) => {
  if (!vectorStore) {
    throw new Error("Vector store not initialized. Load documents first.");
  }
  console.log("Performing similarity search.");

  return await vectorStore.similaritySearch(query, k);
}

const getResponseWithContext = async (prompt) => {
  userPrompt = prompt[prompt.length - 1][1];
  const relevantDocs = await similaritySearch(userPrompt);
  const context = relevantDocs.map(doc => doc.pageContent).join('\n\n');
  const augmentedPrompt = `
      Context:
      ${context}

      User Query: ${userPrompt}

      Based on the provided context, answer the user's query carefully and precisely.
    `;
  const response = await llm.invoke(augmentedPrompt);
  return response.content;
}

app.post('/chatcontext', async (req, res) => {
  const { prompt } = req.body;

  try {
    console.log(prompt);
      const response = await llm.invoke(prompt);

      console.log(response);
      res.json({ reply: response });
  } catch (error) {
      console.error('Error:', error);
      console.log("error in backend");
      res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});


app.post('/chatnocontext', async (req, res) => {
  const { prompt } = req.body;

  try {
      const response = await llm.invoke(prompt);

      console.log(response);
      res.json({ reply: response });
  } catch (error) {
      console.error('Error:', error);
      console.log("error in backend");
      res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});


app.post('/chatrag', async (req, res) => {
  const { prompt } = req.body;

  try {
      const response = await getResponseWithContext(prompt);

      console.log(response);
      res.json({ reply: response });
  } catch (error) {
      console.error('Error:', error);
      console.log("error in backend");
      res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.get('/checkrag', async (req, res) => {

  try {
      const response = await getResponseWithContext([["human","car with the following details	fwd	front	93.7	157.3	63.8	50.6	2191	ohc	four	98	mpfi	3.03	3.39	7.6	102	5500	24	30	should cost how much?"]]);
      
      console.log(response);
      res.json({ reply: response });
  } catch (error) {
      console.error('Error:', error);
      console.log("error in backend");
      res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

