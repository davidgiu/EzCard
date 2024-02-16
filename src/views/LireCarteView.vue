<template>
    <div v-if="readingFailed">
        <div class="col">
            <button class="boutton3" @click="annulerCarte">Ré-essayer</button>
        </div>
    </div>
    <div v-if="!decodedUser && readingNFC && !readingFailed" class="row d-flex justify-content-center">
        <h1 class="col-12">Lecture du nfc en cours...</h1>
        <span class="loader col-12"></span>
    </div>
    <div v-if="!decodedUser && !readingNFC" class="row mt-5">
        <div class="col-12 mb-4">
            <button class="boutton3" @click="readNFC">NFC</button>
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
            nfcDetected: false,
            readingNFC: false,
            readingFailed: false
        };
    },
    methods: {
        annulerCarte() {
            this.decodedUser = null; // Réinitialiser les données associées à la carte
            this.validationMessage = ""; // Réinitialiser le message de validation
            this.readingNFC = false;
            this.erreurMessage = "";
            this.readingFailed = false;
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
            this.readingNFC = false;
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
        annuler() {
            this.readingFailed = true;
        },
        readNFC() {
            this.readingNFC = true;
            this.readTag();

            setTimeout(() => {
                if (!this.decodedUser) {
                    this.erreurMessage = "Aucune carte NFC détectée.";
                    this.annuler();
                }
            }, 20000);
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
        }
    }
};
</script>

<style>
.loader {
    width: 10em;
    height: 10em;
    border-radius: 50%;
    display: inline-block;
    border-top: 3px solid #fff;
    border-right: 3px solid transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}
h1 {
    text-align: center;
    margin-bottom: 20px;
}
@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
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
