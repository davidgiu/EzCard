<template>
    <div class="container">
        <div class="row">
            <div class="col-6">
                <div class="buttons-container d-flex flex-column align-items-start" v-if="!decodedUser">
                    <!-- Boutons à gauche -->
                    <div class="d-flex flex-column align-items-center mb-5">
                        <button class="btn btn-success mt-5 large-button" @click="demarrerCamera">Caméra</button>

                        <button class="btn btn-success mt-5 large-button" @click="importerQRCode">
                            Importer depuis les fichiers
                        </button>

                        <!-- Bouton NFC -->
                        <button class="btn btn-success mt-5 large-button" @click="lireNFC">Lire via NFC</button>
                    </div>
                </div>
            </div>
            <div class="col-6 mt-5">
                <div class="buttons-container d-flex flex-column align-items-center">
                    <!-- Boutons à droite -->
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
                    <!-- Centrer la carte et le bouton Enregistrer -->
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

    <div v-if="erreurMessage" class="alert alert-danger mt-3" role="alert">
        {{ erreurMessage }}
    </div>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";
import jsQR from "jsqr";
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
            capturing: false
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
                        // Capture an image from the video stream
                        const video = document.createElement("video");
                        video.srcObject = stream;
                        video.play();

                        setTimeout(() => {
                            const canvas = document.createElement("canvas");
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            const context = canvas.getContext("2d");
                            context.drawImage(video, 0, 0, canvas.width, canvas.height);

                            // Get the image data from the canvas and detect the QR code
                            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                            const code = jsQR(imageData.data, imageData.width, imageData.height);

                            if (code) {
                                this.decodedUser = JSON.parse(code.data);
                                this.erreurMessage = "";
                            } else {
                                console.error("Aucun QR code trouvé dans l'image.");
                                this.erreurMessage = "Erreur : Aucun QR code trouvé dans l'image.";
                            }

                            // Stop the video stream
                            stream.getTracks().forEach((track) => track.stop());
                            this.capturing = false;
                        }, 500); // Réduisez le délai à 500 millisecondes ou ajustez selon vos besoins
                    })
                    .catch((error) => {
                        console.error("Erreur lors de l'accès à la caméra :", error);
                        this.erreurMessage = "Erreur lors de l'accès à la caméra.";
                        this.capturing = false;
                    });
            }
        },
        enregistrerCarte() {
            // Récupérer les cartes existantes depuis le localStorage
            const cartesExistantes = JSON.parse(localStorage.getItem("cartes")) || [];

            // Ajouter la nouvelle carte
            cartesExistantes.push(this.decodedUser);

            // Enregistrer la liste mise à jour dans le localStorage
            localStorage.setItem("cartes", JSON.stringify(cartesExistantes));

            // Afficher le message de validation
            this.validationMessage = "Carte enregistrée avec succès.";

            // Masquer la caméra et le bouton de capture photo
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
                            // Afficher le message d'erreur
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
                    ({ message }) => {
                        const decodedData = this.decoderDonneesNFC(message);
                        this.onDecode(decodedData);
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

        decoderDonneesNFC(message) {
            const records = message.records.map((record) => {
                switch (record.recordType) {
                    case "text":
                        return this.decoderTexte(record);
                    // Ajoutez d'autres cas selon les types de données que vous attendez
                    default:
                        console.warn(`Type de record non pris en charge : ${record.recordType}`);
                        return null;
                }
            });

            // Retournez les données interprétées
            const decodedUser = records.reduce((acc, record) => {
                return { ...acc, ...record };
            }, {});

            this.onDecode(JSON.stringify(decodedUser));
            return decodedUser;
        },

        decoderTexte(record) {
            // Interprétez le record texte selon vos besoins
            const textData = record.data;
            console.log("Données texte lues depuis le NFC :", textData);

            try {
                return JSON.parse(textData);
            } catch (error) {
                console.error("Erreur lors de l'analyse JSON des données texte :", error);
                return null;
            }
        }
    }
};
</script>

<style>
.large-button {
    font-size: 35px; /* Taille de la police */
    height: 100px; /* Hauteur du bouton */
    width: 500px;
    margin-left: 50px;
}

.small-button {
    font-size: 20px; /* Taille de la police */
    height: 50px; /* Hauteur du bouton */
    width: 200px;
    margin-left: 50px;
}
</style>
