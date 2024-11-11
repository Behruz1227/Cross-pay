import create from "zustand";

export const NotificationStore = create((set) => ({
    notificationData: [],
    setNotificationData: (data) => set({notificationData: data}),
    countData: 0,
    setCountData: (data) => set({countData: data}),
    loading: false,
    setLoading: (data) => set({loading: data}),
    totalPage: 0,
    setTotalPages: (val) => set({ totalPage: val }),
    page: 0,
    setPage: (val) => set({ page: val }),
    size: 10,
    setSize: (val) => set({ size: val }),
}))