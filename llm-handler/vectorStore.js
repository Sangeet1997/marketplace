const { ChatOllama } = require("@langchain/ollama");
const { OllamaEmbeddings } = require("@langchain/community/embeddings/ollama");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
// const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

class OllamaRAGAssistant {
  constructor(
    embeddingsModel = "mxbai-embed-large", 
    baseUrl = "http://127.0.0.1:11434",
    vectorStoreConfig = {
      storePath: './vector_store.json'
    }
  ) {
    this.embeddings = new OllamaEmbeddings({
      model: embeddingsModel,
      baseUrl: baseUrl,
    });

    this.vectorStore = null;
    this.vectorStoreConfig = vectorStoreConfig;
    this.documents = [];
  }

  // for PDF
//   async loadDocumentsFromDirectory(directoryPath) {
//     const documents = [];
//     const files = fs.readdirSync(directoryPath);

//     for (const file of files) {
//       const filePath = path.join(directoryPath, file);
//       let dataBuffer = fs.readFileSync(filePath);
//       await pdf(dataBuffer).then(function(data) {
//         documents.push(data);
//       });
//     }
//     console.log("Loaded documents from directory.");
//     return documents;
//   }

  // for text
  async loadDocumentsFromDirectoryText(directoryPath) {
    const documents = [];
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        if (path.extname(file).toLowerCase() === '.txt') {
            const data = fs.readFileSync(filePath, 'utf-8'); // Read text file content
            documents.push(data);
        }
    }

    console.log("Loaded documents from directory.");
    // console.log(documents);
    return documents;
}


  async createVectorStore(documents) {
    // const text = documents[0].text;
    
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 700,
      chunkOverlap: 0,
    });

    const splitDocs = await textSplitter.createDocuments(documents);
    console.log(`Total split documents: ${splitDocs.length}`);
    // console.log(splitDocs);

    this.vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs, 
      this.embeddings
    );

    this.documents = splitDocs;

    const vectorData = await this.serializeVectorStore();
    fs.writeFileSync(this.vectorStoreConfig.storePath, JSON.stringify(vectorData));

    console.log("Vector store created and saved.");
  }


  async serializeVectorStore() {
    if (!this.documents || this.documents.length === 0) {
      throw new Error("No documents to serialize.");
    }

    const serializedDocs = await Promise.all(
      this.documents.map(async (doc) => {
        const embedding = await this.embeddings.embedQuery(doc.pageContent);
        
        return {
          pageContent: doc.pageContent,
          metadata: doc.metadata || {},
          embedding: embedding
        };
      })
    );

    return serializedDocs;
  }


  async loadVectorStore() {
    try {
      // Check if store file exists
      if (!fs.existsSync(this.vectorStoreConfig.storePath)) {
        console.log("No existing vector store found.");
        return false;
      }

      // Read stored vector data
      const storedData = JSON.parse(fs.readFileSync(this.vectorStoreConfig.storePath, 'utf-8'));

      // Recreate vector store
      this.vectorStore = await MemoryVectorStore.fromDocuments(
        storedData.map(item => ({
          pageContent: item.pageContent,
          metadata: item.metadata
        })),
        this.embeddings
      );

      // Store documents for potential future serialization
      this.documents = storedData.map(item => ({
        pageContent: item.pageContent,
        metadata: item.metadata
      }));

      console.log("Existing vector store loaded successfully.");
      return true;
    } catch (error) {
      console.error("Error loading vector store:", error);
      return false;
    }
  }
}


async function main() {
  const ragAssistant = new OllamaRAGAssistant();
  // Check if vector store already exists
  const vectorStoreExists = await ragAssistant.loadVectorStore();

  if (!vectorStoreExists) {
    const documents = await ragAssistant.loadDocumentsFromDirectoryText('./Documents');
    await ragAssistant.createVectorStore(documents);
  }
}

main().catch(console.error);

module.exports = OllamaRAGAssistant;