<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiarynavbar bg-dark border-bottom border-body" data-bs-theme="dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#"><img src="../../logo.jpg" alt="logo" /></a>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav w-100 d-flex justify-content-between">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
                            Accueil
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link
                            to="/montre-ma-carte"
                            class="nav-link"
                            :class="{ active: $route.path === '/montre-ma-carte' }"
                        >
                            Ma Carte
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link
                            to="/lire-carte"
                            class="nav-link"
                            :class="{ active: $route.path === '/lire-carte' }"
                        >
                            Lire une Carte
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link
                            to="/modifier-ma-carte"
                            class="nav-link"
                            :class="{ active: $route.path === '/modifier-ma-carte' }"
                        >
                            Modifier ma Carte
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link
                            to="/cartes-contacts"
                            class="nav-link"
                            :class="{ active: $route.path === '/cartes-contacts' }"
                        >
                            Cartes Contacts
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: "NavbarComponent"
};
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000; /* Set z-index to make sure it's on top of other elements */
}
img {
    width: 50px;
    height: 50px;
}
a {
    text-decoration: none;
    color: white; /* Couleur par défaut des liens */
}
.nav-item a:hover {
    width: 100%;
    background-color: #5607ff;
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
}
.nav-link.active {
    width: 100%;
    background-color: #5607ff;
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
}
</style>
