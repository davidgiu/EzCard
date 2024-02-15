<template>
    <div>
        <!-- Boutons NFC, QR Code et Fichiers -->
        <div v-if="!decodedUser" class="row mt-5">
            <div class="col-12 mb-4">
                <button class="boutton3" @click="startNFCWriting">NFC</button>
            </div>
            <div class="col-6 mb-4"><button class="boutton3" @click="demarrerCamera">Qr Code</button></div>
            <div class="col-lg-6">
                <button class="boutton3" @click="importerQRCode">Fichiers</button>
            </div>
        </div>

        <!-- Zone de chargement et bouton réessayer pour NFC -->
        <div v-if="nfcWritingInProgress" class="col-6 mt-5">
            <p>Ecriture du NFC en cours...</p>
            <span class="loader"></span>
            <button class="btn btn-danger" @click="cancelNFCWriting">Annuler</button>
        </div>

        <!-- Messages d'erreur -->
        <div v-if="erreurMessage" class="alert alert-danger mt-5" role="alert">
            {{ erreurMessage }}
            <button
                class="btn btn-primary"
                @click="retryNFCWriting"
                v-if="erreurMessage === 'Echec de l\'écriture NFC. Réessayez?'"
            >
                Réessayer
            </button>
        </div>

        <!-- Contenu lorsqu'un utilisateur est décodé -->
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

        <!-- Zone de caméra et de chargement QR Code -->
        <div class="col-6 mt-5">
            <div class="buttons-container d-flex flex-column align-items-center">
                <div class="d-flex flex-column align-items-center">
                    <QrcodeStream
                        v-if="cameraActive && !decodedUser && !capturing"
                        @decode="onDecode"
                        style="max-width: 80%"
                    />
                    <button
                        class="btn btn-success small-button"
                        v-if="cameraActive && !decodedUser && !capturing"
                        @click="capturerPhoto"
                    >
                        Capture Photo
                    </button>
                </div>
                <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />
            </div>
        </div>
    </div>
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
            nfcDetected: false,
            nfcWritingInProgress: false
        };
    },
    methods: {
        annulerCarte() {
            this.decodedUser = null; // Réinitialiser les données associées à la carte
            this.validationMessage = ""; // Réinitialiser le message de validation
        },
        demarrerCamera() {
            this.cameraActive = !this.cameraActive;
        },
        onDecode(value) {
            this.decodedUser = JSON.parse(value);
        },
        capturerPhoto() {
            if (this.cameraActive && !this.capturing) {
                this.capturing = true;
                navigator.mediaDevices
                    .getUserMedia({ video: true })
                    .then((stream) => {
                        const video = document.createElement("video");
                        video.srcObject = stream;
                        video.play();
                        setTimeout(() => {
                            const canvas = document.createElement("canvas");
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            const context = canvas.getContext("2d");
                            context.drawImage(video, 0, 0, canvas.width, canvas.height);
                            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                            const code = jsQR(imageData.data, imageData.width, imageData.height);

                            if (code) {
                                this.decodedUser = JSON.parse(code.data);
                                this.erreurMessage = "";
                            } else {
                                console.error("Aucun QR code trouvé dans l'image.");
                                this.erreurMessage = "Erreur : Aucun QR code trouvé dans l'image.";
                            }

                            stream.getTracks().forEach((track) => track.stop());
                            this.capturing = false;
                        }, 500);
                    })
                    .catch((error) => {
                        console.error("Erreur lors de l'accès à la caméra :", error);
                        this.erreurMessage = "Erreur lors de l'accès à la caméra.";
                        this.capturing = false;
                    });
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
        async startNFCWriting() {
            if ("NDEFReader" in window) {
                this.nfcWritingInProgress = true;
                this.erreurMessage = ""; // Réinitialiser le message d'erreur

                try {
                    await this.writeTag();

                    // Écriture réussie, réinitialiser l'état
                    this.nfcWritingInProgress = false;
                    console.log("NFC écrit avec succès!");
                } catch (error) {
                    console.error("Erreur lors de l'écriture NFC :", error);

                    // Afficher un message d'erreur
                    this.erreurMessage = "Echec de l'écriture NFC. Réessayez?";
                    setTimeout(() => {
                        this.nfcWritingInProgress = false;
                        if (this.erreurMessage === "Echec de l'écriture NFC. Réessayez?") {
                            this.erreurMessage = ""; // Effacer le message après un certain temps
                        }
                    }, 10000); // 10 secondes
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
                    throw new Error("Erreur lors de l'écriture NFC.");
                }
            } else {
                throw new Error("Web NFC is not supported.");
            }
        },
        cancelNFCWriting() {
            this.nfcWritingInProgress = false;
            this.erreurMessage = ""; // Effacer le message d'erreur
        },
        retryNFCWriting() {
            this.startNFCWriting();
        },
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
