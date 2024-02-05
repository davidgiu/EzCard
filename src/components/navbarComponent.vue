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
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link to="/">
                            <a class="nav-link" :class="{ 'active bg-success': $route.path === '/' }" href="#"
                                >Accueil</a
                            >
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/montre-ma-carte">
                            <a
                                class="nav-link"
                                :class="{ 'active bg-success': $route.path === '/montre-ma-carte' }"
                                href="#"
                                >Montre ma carte</a
                            >
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/lire-carte">
                            <a class="nav-link" :class="{ 'active bg-success': $route.path === '/lire-carte' }" href="#"
                                >Lire une carte</a
                            >
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/modifier-ma-carte">
                            <a
                                class="nav-link"
                                :class="{ 'active bg-success': $route.path === '/modifier-ma-carte' }"
                                href="#"
                                >Modifier ma carte</a
                            >
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/cartes-contacts">
                            <a
                                class="nav-link"
                                :class="{ 'active bg-success': $route.path === '/cartes-contacts' }"
                                href="#"
                                >Cartes contacts</a
                            >
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

</style>
