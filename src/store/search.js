import { defineStore } from "pinia";

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useSearchStore = defineStore("search", {
  state: () => ({ text: "", state: false }),
  actions: {
    close() {
      if (this.state) {
        this.text = "";
        this.state = false;
      }
    },
    clear() {
      this.text = "";
    },
  },
});
