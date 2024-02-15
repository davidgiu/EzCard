<template>
    <div>
        <div v-if="cameraActive">
            <qrcode-stream @decode="onDecode"></qrcode-stream>
        </div>
        <div v-if="!decodedUser" class="row mt-5">
            <div class="col-12 mb-4">
                <button class="boutton3" @click="readTag">NFC</button>
            </div>
            <div class="col-6 mb-4"><button class="boutton3" @click="demarrerCamera">Qr Code</button></div>
            <div class="col-lg-6">
                <button class="boutton3" @click="importerQRCode">Fichiers</button>
            </div>
        </div>
        <div v-if="decodedUser" class="row mt-5">
            <div class="col-6" v-if="!validationMessage">
                <button class="boutton3" @click="enregistrerCarte">Enregistrer la Carte</button>
            </div>
            <div class="col-12" v-if="validationMessage">
                <button class="boutton3" @click="annulerCarte">Lire un nouvelle carte</button>
            </div>
            <div class="col" v-if="!validationMessage">
                <button class="boutton3" @click="annulerCarte">Annuler</button>
            </div>
            <div class="col-12">
                <div v-if="validationMessage" class="alert alert-success mt-3" role="alert">
                    {{ validationMessage }}
                </div>
            </div>
            <div class="col-12 mt-5"><cardComponent :user="decodedUser" /></div>
        </div>
        <div class="col-6 mt-5">
            <div class="buttons-container d-flex flex-column align-items-center">
                <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />
            </div>
        </div>

        <div v-if="erreurMessage" class="alert alert-danger mt-5" role="alert">{{ erreurMessage }}</div>
    </div>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";
import jsQR from "jsqr";
import cardComponent from "@/components/cardComponent.vue";

export default {
    components: {
        cardComponent,
        QrcodeStream
    },
    data() {
        return {
            decodedUser: null,
            cameraActive: false,
            validationMessage: "",
            erreurMessage: "",
            capturing: false,
            nfcDetected: false
        };
    },
    methods: {
        annulerCarte() {
            this.decodedUser = null; // Réinitialiser les données associées à la carte
            this.validationMessage = ""; // Réinitialiser le message de validation
        },
        demarrerCamera() {
            this.cameraActive = true;
        },
        onDecode(result) {
            if (result && result.length > 0) {
                this.decodedUser = result[0].codeData;
                console.log("QR code decoded:", this.decodedUser);
                // Utilisez le résultat du décodage ici
                this.enregistrerCarte(); // Traitement automatique du résultat décodé
            } else {
                console.error("Aucun QR code détecté.");
                this.erreurMessage = "Erreur : Aucun QR code détecté.";
            }
        },
        enregistrerCarte() {
            const cartesExistantes = JSON.parse(localStorage.getItem("cartes")) || [];
            cartesExistantes.push(this.decodedUser);
            localStorage.setItem("cartes", JSON.stringify(cartesExistantes));
            this.validationMessage = "Carte enregistrée avec succès.";
            this.cameraActive = false;
        },
        importerQRCode() {
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
                            this.decodedUser = JSON.parse(code.data);
                            this.erreurMessage = "";
                            this.enregistrerCarte(); // Traitement automatique du résultat décodé
                        } else {
                            console.error("Aucun QR code trouvé dans l'image.");
                            this.erreurMessage = "Erreur : Aucun QR code trouvé dans l'image.";
                        }
                    };
                    image.src = reader.result;
                };
                reader.readAsDataURL(file);
            }
        },
        async readTag() {
            if ("NDEFReader" in window) {
                const ndef = new NDEFReader();
                try {
                    await ndef.scan();
                    ndef.onreading = (event) => {
                        const decoder = new TextDecoder();
                        for (const record of event.message.records) {
                            console.log("Record type:  " + record.recordType);
                            console.log("MIME type:    " + record.mediaType);
                            console.log("=== data ===\n" + decoder.decode(record.data));
                            this.decodedUser = JSON.parse(decoder.decode(record.data)); // Mise à jour de la variable decodedUser
                            this.enregistrerCarte(); // Traitement automatique du résultat décodé
                        }
                    };
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.error("Web NFC is not supported.");
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
