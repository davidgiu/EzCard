<template>
    <div class="row mt-5">
        <div class="col">
            <!-- Colonne pour les boutons -->
            <router-link to="/montre-ma-carte">
                <button class="boutton btn-lg btn-md-sm">Ma Carte</button>
            </router-link>
        </div>
        <div class="col-6">
            <router-link to="/lire-carte">
                <button class="boutton btn-lg btn-md-sm">Lire une Carte</button>
            </router-link>
        </div>
    </div>
    <div class="row">
        <div class="col mt-3">
            <!-- Carousel -->
            <div v-if="cartes.length > 0" class="carousel-container">
                <div id="cartesCarousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        <div
                            v-for="(carte, index) in cartes"
                            :key="index"
                            :class="{ 'carousel-item': true, active: index === 0 }"
                        >
                            <cardComponent class="card-size" :user="carte" />
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
.boutton {
    width: 500px;
    height: 200px;
    background-color: #5607ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 4rem;
    font-weight: bold;
}

/* Styles pour les boutons sur les petits écrans */
@media (max-width: 767px) {
    .boutton {
        width: 300px;
        height: 100px;
        font-size: 2rem;
        margin-bottom: 20px;
    }

}
</style>
