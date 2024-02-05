import { createRouter, createWebHashHistory } from "vue-router";
import AccueilView from "../views/AccueilView.vue";
import LireCarteView from "../views/LireCarteView.vue";
import MontreMaCarteView from "../views/MontreMaCarteView.vue";
import ModifierMaCarteView from "../views/ModifierMaCarteView.vue";
import CartesContactsView from "../views/CartesContactsView.vue";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", name: "accueil", component: AccueilView },
        { path: "/lire-carte", name: "lire-carte", component: LireCarteView },
        { path: "/montre-ma-carte", name: "montre-ma-carte", component: MontreMaCarteView },
        { path: "/modifier-ma-carte", name: "modifier-ma-carte", component: ModifierMaCarteView },
        { path: "/cartes-contacts", name: "cartes-contacts", component: CartesContactsView }
    ]
});

export default router;
