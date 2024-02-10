<template>
    <div class="row">
        <div class="col">
            <!-- Colonne pour les boutons -->
            <router-link to="/montre-ma-carte">
                <button class="boutton btn-lg btn-md-sm">Ma Carte</button>
            </router-link>
        </div>
        <div class="col">
            <router-link to="/lire-carte">
                <button class="boutton btn-lg btn-md-sm">Lire une Carte</button>
            </router-link>
        </div>
    </div>
    <h2 class="mt-5">Cartes enregistrées :</h2>
    <div class="row justify-content-center mt-4">
        <div class="col-12">
            <!-- Carousel -->
            <div v-if="cartes.length > 0" class="carousel-container">
                <div id="cartesCarousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        <div
                            v-for="(carte, index) in cartes"
                            :key="index"
                            :class="{ 'carousel-item': true, active: index === 0 }"
                        >
                            <cardComponent :user="carte" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- Message si aucune carte enregistrée -->
            <div v-else class="alert alert-danger mt-3" role="alert">Aucune carte enregistrée.</div>
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
h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
}
.boutton {
    width: 500px;
    height: 200px;
    padding: 10px;
    margin: 10px;
    background-color: #5607ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 4rem;
    font-weight: bold;
}
.carte-two-times-larger {
    transform: scale(2);
}

/* Styles pour les boutons sur les petits écrans */
@media (max-width: 767px) {
    .boutton {
        width: 300px;
        height: 100px;
        font-size: 2rem;
        margin-top: -50px;
        margin-bottom: 60px;
    }
}
</style>
