import { defineStore } from "pinia";

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useAlertStore = defineStore("alert", {
    state: () => ({ color: "", message: "", state: false }),
    actions: {
        setAlert(message, color, time) {
            this.message = message;
            this.color = color
            this.state = true;
            setTimeout(() => {
                this.message = "";
                this.color = ""
                this.state = false;
            }, time * 1000)
        },
        closeAlert() {
            this.message = "";
            this.color = ""
            this.state = false;
        }
    },
});
