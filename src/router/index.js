import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Recovery from "@/views/Recovery.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/recovery", name: "Recovery", component: Recovery },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;