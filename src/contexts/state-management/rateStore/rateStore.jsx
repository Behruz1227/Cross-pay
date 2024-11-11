import {create} from "zustand";

export const RateStore = create((set) => ({
    rateData: null,
    setRateData: (data) => set({rateData: data}),
    isEdit: false,
    setIsEdit: (data) => set({isEdit: data})
}))