import { StateCreator } from 'zustand'

interface ChatbotDataType {
  prompt: string
  response: string
}

type ChatBotState = {
  chatbotData: ChatbotDataType[]
}

type ChatBotAction = {
  setChatbotData: (chatbotItem: ChatbotDataType) => void
  resetChatbotData: () => void
  updateChatbotData: (promptToFind: string, newResponse: string) => void
}

const initialState: ChatBotState = {
  chatbotData: [],
}

export type ChatBotSlice = ChatBotState & ChatBotAction

export const createChatbotSlice: StateCreator<ChatBotSlice> = (set) => ({
  chatbotData: initialState.chatbotData,

  setChatbotData: (chatbotItem) =>
    set((state) => ({
      chatbotData: [...state.chatbotData, chatbotItem],
    })),

  updateChatbotData: (promptToFind, newResponse) =>
    set((state) => ({
      chatbotData: state.chatbotData.map((chat) => (chat.prompt === promptToFind ? { ...chat, response: newResponse } : chat)),
    })),

  resetChatbotData: () => set({ chatbotData: [] }),
})
