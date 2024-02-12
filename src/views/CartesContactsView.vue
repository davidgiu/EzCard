<template>
    <div class="mt-5">
        <div class="row">
            <div class="col-12">
                <button class="boutton4" @click="toggleAfficherToutesLesCartes">
                    {{ afficherToutesCartes ? "Masquer toutes les cartes" : "Afficher toutes les cartes" }}
                </button>
                <div v-if="afficherToutesCartes">
                    <div v-if="cartes.length === 0" class="alert alert-danger mt-3" role="alert">
                        Aucune carte enregistrée.
                    </div>
                </div>
            </div>
            <div class="col-12">
                <!-- Afficher le carousel si l'option n'est pas activée -->
                <div v-if="!afficherToutesCartes">
                    <div v-if="cartes.length === 0" class="alert alert-danger mt-3" role="alert">
                        Aucune carte enregistrée.
                    </div>
                    <div v-else>
                        <div id="carouselExampleIndicators" class="carousel slide mt-5" data-bs-ride="carousel">
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
            </div>
        </div>
        <div class="row" v-if="afficherToutesCartes">
            <div class="col-lg-6 mt-5" v-for="(carte, index) in cartes" :key="index">
                <div class="carteGroup d-flex">
                    <cardComponent :user="carte" />
                    <button class="btn btn-danger col-2" @click="supprimerCarte(index)">
                        <i class="fa-regular fa-trash-can ic"></i>
                    </button>
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
        },
        supprimerCarte(index) {
            // Supprimer la carte de la liste 'cartes' en utilisant son index
            this.cartes.splice(index, 1);

            // Mettre à jour le stockage local avec la nouvelle liste de cartes
            localStorage.setItem("cartes", JSON.stringify(this.cartes));
        }
    },
    components: {
        cardComponent
    }
};
</script>

<style>
.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-color: #5607ff;
}
.carte {
    width: 100%;
    height: 100%;
}
.ic {
    font-size: 3rem;
}
</style>
