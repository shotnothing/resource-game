import { create } from 'zustand'

export const useBoardSettingsStore = create<{
  viewDiscountedPrices: boolean
  setViewDiscountedPrices: (viewDiscountedPrices: boolean) => void
}>((set) => ({
  viewDiscountedPrices: false,
  setViewDiscountedPrices: (viewDiscountedPrices: boolean) => set({ viewDiscountedPrices }),
}))
