<template>
    <div v-if="!decodedUser" class="row mt-5">
        <div class="col-12 mb-4">
            <button class="boutton3" @click="readTag">NFC</button>
        </div>
        <div class="col-6 mb-4">
            <button class="boutton3" @click="demarrerCamera">Qr Code</button>
            <QrcodeStream v-if="cameraActive && !decodedUser && !capturing" @decode="onDecode" style="max-width: 80%" />
            <span v-if="capturing">En cours de détection...</span>
        </div>
        <div class="col-lg-6">
            <button class="boutton3" @click="importerQRCode">Fichiers</button>
        </div>
    </div>
    <div v-if="decodedUser" class="row mt-5">
        <!-- Le reste du code reste inchangé -->
    </div>
    <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />

    <div v-if="erreurMessage" class="alert alert-danger mt-5" role="alert">{{ erreurMessage }}</div>
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
            this.cameraActive = !this.cameraActive;
            this.capturing = this.cameraActive; // Mettre à jour l'état de la détection
            console.log("cameraActive", this.cameraActive);
        },
        onDecode(value) {
            console.log("decoded", value);
            this.decodedUser = JSON.parse(value);
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
            this.capturing = true; // Indiquer que la détection est en cours
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
                        } else {
                            console.error("Aucun QR code trouvé dans l'image.");
                            this.erreurMessage = "Erreur : Aucun QR code trouvé dans l'image.";
                        }
                        this.capturing = false; // Indiquer que la détection est terminée
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
                        }
                    };
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.error("Web NFC is not supported.");
            }
        },

        async writeTag() {
            if ("NDEFReader" in window) {
                const ndef = new NDEFReader();
                try {
                    const data = JSON.stringify({
                        image: 1,
                        nom: "giudice",
                        prenom: "david",
                        email: "david@gmail.com"
                    });

                    const encoder = new TextEncoder();
                    const encodedData = encoder.encode(data);

                    await ndef.write(encodedData);
                    console.log("NDEF message written!");
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
