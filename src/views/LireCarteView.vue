<template>
    <div class="container">
        <div class="nfc-indicator" v-if="nfcDetected">NFC détecté</div>
        <div class="row">
            <div class="col-6">
                <div class="buttons-container d-flex flex-column align-items-start" v-if="!decodedUser">
                    <div class="d-flex flex-column align-items-center mb-5">
                        <button class="btn btn-success mt-5 large-button" @click="demarrerCamera">Caméra</button>
                        <button class="btn btn-success mt-5 large-button" @click="importerQRCode">
                            Importer depuis les fichiers
                        </button>
                        <button class="btn btn-success mt-5 large-button" @click="lireNFC" v-if="nfcDetected">
                            Lire via NFC
                        </button>
                    </div>
                </div>
            </div>
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
            <div class="col-12">
                <div class="content-container d-flex flex-column align-items-end" v-if="decodedUser">
                    <button class="btn btn-success mb-5 large-button" @click="enregistrerCarte">
                        Enregistrer la Carte
                    </button>
                    <div v-if="validationMessage" class="alert alert-success mt-3" role="alert">
                        {{ validationMessage }}
                    </div>
                    <div>
                        <cardComponent :user="decodedUser" />
                    </div>
                </div>
            </div>
        </div>
    </div>

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
        lireNFC() {
            if ("NDEFReader" in window) {
                const reader = new NDEFReader();
                reader.scan().then(
                    ({ records }) => {
                        this.decoderDonneesNFC(records);
                    },
                    (error) => {
                        console.error("Erreur lors de la lecture NFC :", error);
                        this.erreurMessage = "Erreur lors de la lecture NFC.";
                    }
                );
            } else {
                console.error("L'API NFC n'est pas prise en charge par votre navigateur.");
                this.erreurMessage = "L'API NFC n'est pas prise en charge par votre navigateur.";
            }
        },
        decoderDonneesNFC(records) {
            records.forEach((record, index) => {
                switch (record.recordType) {
                    case "text":
                        console.log(`Record ${index + 1}: ${record.data}`);
                        break;
                    default:
                        console.warn(`Type de record non pris en charge : ${record.recordType}`);
                        break;
                }
            });
        },
        decoderTexte(record) {
            // Ajoutez ici votre logique pour décoder le type "text" du record NFC
            return { text: record.data };
        }
    },
    mounted() {
        if ("NDEFReader" in window) {
            this.nfcDetected = true;
        }
    }
};
</script>

<style>
.large-button {
    font-size: 35px;
    height: 100px;
    width: 500px;
    margin-left: 50px;
}

.small-button {
    font-size: 20px;
    height: 50px;
    width: 200px;
    margin-left: 50px;
}

.nfc-indicator {
    font-size: 20px;
    color: green;
    margin-bottom: 10px;
}
</style>
