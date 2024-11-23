import {create} from "zustand";

export const LanguageStore = create((set) => ({
    languageData: "ru",
    setLanguageData: (data) => set({ languageData: data }),
    wordsWebData: null,
    setWordsWeb: (data) => set({ wordsWeb: data }),
    wordsListData: null,
    setWordsListData: (data) => set({ wordsListData: data && typeof data === 'string' ? data.toLowerCase() : data }),
}))