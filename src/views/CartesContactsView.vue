<template>
    <div class="container">
        <div class="row">
            <div class="col-3">
                <button class="btn btn-success mt-3" @click="toggleAfficherToutesLesCartes">
                    {{ afficherToutesCartes ? "Masquer toutes les cartes" : "Afficher toutes les cartes" }}
                </button>
            </div>
            <div class="col-9">
                <!-- Afficher le carousel si l'option n'est pas activée -->
                <div v-if="!afficherToutesCartes">
                    <div v-if="cartes.length === 0" class="alert alert-danger mt-3" role="alert">
                        Aucune carte enregistrée.
                    </div>
                    <div v-else>
                        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-indicators">
                                <button
                                    v-for="(carte, index) in cartes"
                                    :key="index"
                                    type="button"
                                    data-bs-target="#carouselExampleIndicators"
                                    :data-bs-slide-to="index"
                                    :class="{ active: index === 0 }"
                                    aria-current="true"
                                    :aria-label="'Slide ' + (index + 1)"
                                ></button>
                            </div>
                            <div class="carousel-inner">
                                <div
                                    v-for="(carte, index) in cartes"
                                    :key="index"
                                    class="carousel-item"
                                    :class="{ active: index === 0 }"
                                >
                                    <cardComponent :user="carte" />
                                </div>
                            </div>
                            <button
                                class="carousel-control-prev"
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide="prev"
                            >
                                <span class="carousel-control-prev-icon" aria-hidden="true" style="color: green"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button
                                class="carousel-control-next"
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide="next"
                            >
                                <span class="carousel-control-next-icon" aria-hidden="true" style="color: green"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Afficher toutes les cartes si l'option est activée -->
                <div v-else>
                    <div class="row justify-content-start">
                        <div class="col-6 m-4" v-for="(carte, index) in cartes" :key="index">
                            <cardComponent :user="carte" />
                        </div>
                    </div>
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
            cartes: [],
            afficherToutesCartes: false
        };
    },
    mounted() {
        // Récupérer les cartes depuis le localStorage lors du montage du composant
        const cartesExistantes = JSON.parse(localStorage.getItem("cartes")) || [];
        this.cartes = cartesExistantes;
    },
    methods: {
        toggleAfficherToutesLesCartes() {
            this.afficherToutesCartes = !this.afficherToutesCartes;
        }
    },
    components: {
        cardComponent
    }
};
</script>

<style>
/* Ajoutez vos styles personnalisés ici si nécessaire */
.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-color: green;
}
.container {
    margin-top: 150px;
}
</style>
