<template>
    <div class="container d-flex align-items-center justify-content-center">
        <!-- Utilisation du composant CardComponent avec les données récupérées du localStorage -->
        <div class="d-flex">
            <cardComponent :user="userFromLocalStorage" />
            <div class="qrcode-large-section" v-if="showQRCode">
                <vue-qrcode :value="generateQRCodeValue" class="qrcode-large"></vue-qrcode>
            </div>
            <button @click="toggleQRCodeVisibility" class="btn btn-success ml-2">
                {{ showQRCode ? "Masquer QR Code" : "Afficher QR Code" }}
            </button>
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
.qrcode-large-section {
    margin-left: 100px; /* Ajustez la marge à gauche pour l'espace entre la carte et le grand QR Code */
}

.qrcode-large {
    width: 300px;
    height: 300px; /* Ajustez la taille du grand QR Code selon vos préférences */
}
</style>
