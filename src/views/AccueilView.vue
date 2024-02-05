<template>
    <div class="container d-flex align-items-center justify-content-center">

        <div class="row">
            <div class="col col-xxl-4">
                <!-- Colonne pour les boutons -->
                <div class="d-flex flex-column align-items-center">
                    <router-link to="/montre-ma-carte">
                        <button class="btn btn-success mb-5 large-button">Montre Ma Carte</button>
                    </router-link>

                    <router-link to="/lire-carte">
                        <button class="btn btn-success large-button">Lire une Carte</button>
                    </router-link>
                </div>
            </div>

            <div class="col col-xxl-8">
                <!-- Colonne pour le carousel -->
                <div class="accueil text-center">
                    <!-- Carousel -->
                    <div v-if="cartes.length > 0" class="carousel-container">
                        <div id="cartesCarousel" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner">
                                <div
                                    v-for="(carte, index) in cartes"
                                    :key="index"
                                    :class="{ 'carousel-item': true, active: index === 0 }"
                                >
                                    <cardComponent class="card" :user="carte" />
                                </div>
                            </div>
                            <button
                                class="carousel-control-prev"
                                type="button"
                                data-bs-target="#cartesCarousel"
                                data-bs-slide="prev"
                            >
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button
                                class="carousel-control-next"
                                type="button"
                                data-bs-target="#cartesCarousel"
                                data-bs-slide="next"
                            >
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>

                    <!-- Message si aucune carte enregistrée -->
                    <div v-else class="alert alert-danger mt-3" role="alert">Aucune carte enregistrée.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import cardComponent from "@/components/cardComponent.vue";

export default {
    data() {
        return {
            cartes: []
        };
    },
    mounted() {
        // Récupérer les cartes depuis le localStorage lors du montage du composant
        const cartesExistantes = JSON.parse(localStorage.getItem("cartes")) || [];
        this.cartes = cartesExistantes;
    },
    components: {
        cardComponent
    }
};
</script>

<style>
/* Styles spécifiques à la vue d'accueil */
.large-button {
    font-size: 50px; /* Taille de la police */
    height: 100px; /* Hauteur du bouton */
    width: 500px;
}

.carousel-container {
    margin-top: 20px;
}

.card {
    margin: 10px;
}

/* Nouveau style pour aligner les boutons avec le carousel */
.col-xxl-4 .d-flex {
    align-items: center;
    justify-content: center;
    height: 100%;
}

/* Ajustement pour que les deux boutons aient la même taille */
.btn-xxl {
    width: 100%; /* Largeur du bouton pour occuper 100% de la largeur du parent */
}

</style>
