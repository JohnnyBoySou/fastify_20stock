import { tool } from "@langchain/core/tools";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { db } from '@/plugins/prisma';

// Tool para buscar movimentações de estoque por ID do produto
const getStockMovements = tool(
  async ({ productId }: { productId: string }) => {
    return db.movement.findMany({ where: { productId } });
  },
  {
    name: "get_stock_movements",
    description: "Busca entradas, saídas e perdas de um produto pelo ID",
  }
);

// Inicializa o modelo Ollama
const model = new ChatOllama({ model: "mistral" });

// Cria uma cadeia RAG usando dados reais do banco
export async function createRAGChain(productId: string) {

  // Chama a Tool para obter os dados de estoque
  const movements = await getStockMovements.invoke({ productId });

  // Converte os resultados da Tool em documentos de texto
  const documents = movements.map((m: any) => `${m.type}: ${m.quantity} unidades`);

  // Cria o vector store com os documentos da Tool
  const vectorStore = await MemoryVectorStore.fromTexts(
    documents,
    [{ id: productId }],
    new OllamaEmbeddings()
  );

  // Cadeia que combina documentos e responde perguntas com base no contexto
  const documentChain = await createStuffDocumentsChain({
    llm: model,
    prompt: new PromptTemplate({
      template: "Responda a pergunta com base no contexto:\n\nContexto:\n{context}\n\nPergunta:\n{input}",
      inputVariables: ["context", "input"],
    }),
  });

  // Cria a cadeia de recuperação conectando o vector store
  return createRetrievalChain({
    combineDocsChain: documentChain,
    retriever: vectorStore.asRetriever(),
  });
}

// Exemplo de query
export async function queryRAG(productId: string, query: string) {
  const chain = await createRAGChain(productId);
  return await chain.invoke({ input: query });
}


queryRAG("1", "Qual a última movimentação de entrada do produto 1?");