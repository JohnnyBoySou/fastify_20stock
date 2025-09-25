import { ChatOllama } from "@langchain/ollama";
import { HumanMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";

const defaultModel = new ChatOllama({
  model: "mistral",
  temperature: 0.2,
});

export const LLMService = {
  async executePrompt(prompt: string) {
    try {
      const response = await defaultModel.invoke([new HumanMessage(prompt)]);
      return response.content;
    } catch (error) {
      console.error("Erro em executePrompt:", error);
      throw new Error("Falha ao executar prompt no LLM");
    }
  },

  async executeWithStreaming(prompt: string, onToken: (token: string) => void) {
    try {
      if (!defaultModel.stream) {
        throw new Error("Streaming não suportado nesta versão do ChatOllama");
      }

      const stream = await defaultModel.stream([new HumanMessage(prompt)]);
      let fullResponse = '';

      for await (const chunk of stream) {
        const token = chunk.content;
        if (token) {
          fullResponse += token;
          onToken(token as string);
        }
      }

      return fullResponse;
    } catch (error) {
      console.error("Erro em executeWithStreaming:", error);
      throw new Error("Falha ao executar prompt com streaming");
    }
  },

  async executeBatch(prompts: string[]) {
    try {
      const results = await Promise.all(prompts.map((p) => this.executePrompt(p)));
      return results;
    } catch (error) {
      console.error("Erro em executeBatch:", error);
      throw new Error("Falha ao executar batch de prompts no LLM");
    }
  },

  async executeWithTemplate(template: PromptTemplate, variables: Record<string, any>) {
    try {
      const prompt = await template.format(variables);
      return await this.executePrompt(prompt);
    } catch (error) {
      console.error("Erro em executeWithTemplate:", error);
      throw new Error("Falha ao executar prompt com template");
    }
  },

  async executeWithOptions(
    prompt: string,
    options: { temperature?: number; numPredict?: number; repeatPenalty?: number }
  ) {
    try {
      const useDefault =
        (options.temperature ?? 0.2) === 0.2 &&
        (options.numPredict ?? 1000) === 1000 &&
        (options.repeatPenalty ?? 1.1) === 1.1;

      if (useDefault) {
        return await this.executePrompt(prompt);
      }

      const tempModel = new ChatOllama({
        model: "mistral",
        temperature: options.temperature ?? 0.2,
        numPredict: options.numPredict ?? 1000,
        repeatPenalty: options.repeatPenalty ?? 1.1,
      });

      const response = await tempModel.invoke([new HumanMessage(prompt)]);
      return response.content;
    } catch (error) {
      console.error("Erro em executeWithOptions:", error);
      throw new Error("Falha ao executar prompt com opções customizadas");
    }
  },
};