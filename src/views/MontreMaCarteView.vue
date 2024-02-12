<template>
    <div class="row test">
        <div class="col col-xs-12 mb-5">
            <div class="d-flex justify-content-center">
                <cardComponent :user="userFromLocalStorage" />

                <button @click="toggleQRCodeVisibility" class="boutton2">
                    {{ showQRCode ? "Masquer QR Code" : "Afficher QR Code" }}
                </button>
            </div>
        </div>
        <div class="col" v-if="showQRCode">
            <div class="qrcode-large-section">
                <vue-qrcode :value="generateQRCodeValue" class="qrcode-large"></vue-qrcode>
            </div>
        </div>
    </div>
</template>

<script>
import VueQrcode from "vue-qrcode";
import cardComponent from "@/components/cardComponent.vue";

export default {
    components: {
        cardComponent,
        VueQrcode
    },
    data() {
        return {
            // Initialiser userFromLocalStorage avec les données du localStorage ou un objet vide
            userFromLocalStorage: JSON.parse(localStorage.getItem("User")) || {},
            showQRCode: false
        };
    },
    computed: {
        generateQRCodeValue() {
            return JSON.stringify({
                image: this.userFromLocalStorage.avatarIndex,
                nom: this.userFromLocalStorage.nom,
                prenom: this.userFromLocalStorage.prenom,
                email: this.userFromLocalStorage.email
            });
        }
    },
    methods: {
        toggleQRCodeVisibility() {
            this.showQRCode = !this.showQRCode;
        }
    }
};
</script>

<style>
/* Ajoutez des styles supplémentaires si nécessaire */

.qrcode-large {
    width: 15em;
}

/* Définition de la taille de la carte en fonction de la taille de l'écran */
@media (min-width: 1000px) {
    .test {
        transform: scale(1.5); /* Ajustez la taille de la carte pour les écrans plus grands */
        /* Ajustez la largeur de la carte pour occuper toute la largeur sur les petits écrans */
    }
}
.boutton2 {
    width: auto;
    height: auto;
    padding: 10px;
    background-color: #5607ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
}
</style>
