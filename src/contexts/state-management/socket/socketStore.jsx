import { create } from "zustand";

export const SocketStore = create((set) => ({
    socketData: null,
    setSocketData: (data) => set({ socketData: data }),
    socketModalData: null,
    setSocketModalData: (data) => set({ socketModalData: data }),
    socketModal: false,
    setSocketModal: (val) => set({ socketModal: val }),
    socketLoading: false,
    setSocketLoading: (val) => set({ socketLoading: val }),
    timer: 60,
    setTimer: (val) => set({ timer: val }),
    
}))