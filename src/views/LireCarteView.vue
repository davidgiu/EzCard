<template>
    <div class="row mt-5">
        <div class="col-12 mb-4">
            <button class="boutton3" @click="toggleCamera">Activer/Désactiver la caméra</button>
        </div>
        <div class="col-6 mb-4">
            <button class="boutton3" @click="captureQRCode">Scanner un QR Code</button>
            <QrcodeStream v-if="cameraActive && !decodedUser && !capturing" @decode="onDecode" style="max-width: 80%" />
        </div>
        <div class="col-lg-6">
            <button class="boutton3" @click="importQRCodeFromFile">Importer depuis un fichier</button>
        </div>
    </div>
    <div v-if="decodedUser" class="row mt-5">
        <div class="col-6" v-if="!validationMessage">
            <button class="boutton3" @click="saveCard">Enregistrer la carte</button>
        </div>
        <div class="col-12" v-else>
            <button class="boutton3" @click="resetCard">Lire une nouvelle carte</button>
        </div>
        <div class="col" v-if="!validationMessage">
            <button class="boutton3" @click="cancelCard">Annuler</button>
        </div>
        <div class="col-12">
            <div v-if="validationMessage" class="alert alert-success mt-3" role="alert">
                {{ validationMessage }}
            </div>
        </div>
        <div class="col-12 mt-5">
            <cardComponent :user="decodedUser" />
        </div>
    </div>

    <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />

    <div v-if="errorMessage" class="alert alert-danger mt-5" role="alert">{{ errorMessage }}</div>
</template>

<script>
import jsQR from "jsqr";
import { QrcodeStream } from "vue-qrcode-reader";
import cardComponent from "@/components/cardComponent.vue";

export default {
    components: {
        QrcodeStream,
        cardComponent
    },
    data() {
        return {
            decodedUser: null,
            cameraActive: false,
            validationMessage: "",
            errorMessage: "",
            capturing: false
        };
    },
    methods: {
        toggleCamera() {
            this.cameraActive = !this.cameraActive;
        },
        onDecode(value) {
            try {
                this.decodedUser = JSON.parse(value);
                this.errorMessage = "";
            } catch (error) {
                console.error("Error parsing decoded data:", error);
                this.errorMessage = "Erreur : Données décodées invalides.";
            }
        },
        saveCard() {
            try {
                const existingCards = JSON.parse(localStorage.getItem("cards")) || [];
                existingCards.push(this.decodedUser);
                localStorage.setItem("cards", JSON.stringify(existingCards));
                this.validationMessage = "Carte enregistrée avec succès.";
                this.cameraActive = false;
            } catch (error) {
                console.error("Error saving card:", error);
                this.errorMessage = "Erreur : Impossible d'enregistrer la carte.";
            }
        },
        resetCard() {
            this.decodedUser = null;
            this.validationMessage = "";
        },
        cancelCard() {
            this.decodedUser = null;
            this.validationMessage = "";
        },
        captureQRCode() {
            this.capturing = true;
        },
        importQRCodeFromFile() {
            this.cameraActive = false;
            this.$refs.fileInput.click();
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const image = new Image();
                    image.onload = () => {
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");
                        canvas.width = image.width;
                        canvas.height = image.height;
                        ctx.drawImage(image, 0, 0, image.width, image.height);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        if (code) {
                            this.onDecode(code.data);
                        } else {
                            console.error("No QR code found in the image.");
                            this.errorMessage = "Erreur : Aucun QR code trouvé dans l'image.";
                        }
                    };
                    image.src = reader.result;
                };
                reader.readAsDataURL(file);
            }
        }
    }
};
</script>

<style>
.boutton3 {
    width: 100%;
    height: 150pt;
    background-color: #5607ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 4rem;
    font-weight: bold;
}
@media (max-width: 767px) {
    .boutton3 {
        width: 300px;
        height: 100px;
        font-size: 2rem;
        margin-bottom: 20px;
    }
}
</style>
