import create from "zustand";

export const DashboardStore = create((set) => ({
    statisticLoading: false,
    setStatisticLoading: (data) => set({loading: data}),
    statisticData: null,
    setStatisticData: (data) => set({statisticData: data}),
    YearData: null,
    setYearData: (data) => set({YearData: data}),
    WebRequestData: null,
    setWebRequestData: (data) => set({WebRequestData: data}),
    WebRequestloading: false,
    setWebRequestloading: (loading) => set({WebRequestloading: loading}),
    PaymentData: null,
    setPaymentData: (data) => set({PaymentData: data}),
    MonthData: null,
    setMonthData: (data) => set({MonthData: data}),
}))