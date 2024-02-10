<template>
    <div class="carte">
        <div class="main-row">
            <div class="user-image-section">
                <img :src="avatarUrl" alt="Image de la personne" class="user-image" />
            </div>
            <div class="qrcode-section">
                <vue-qrcode :value="generateQRCodeValue" class="qrcode"></vue-qrcode>
            </div>
        </div>
        <div class="user-info">
            <h2>{{ user.nom }} {{ user.prenom }}</h2>
            <p>{{ user.email }}</p>
        </div>
    </div>
</template>

<script>
import VueQrcode from "vue-qrcode";

export default {
    components: {
        VueQrcode
    },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            avatarUrl: null
        };
    },
    computed: {
        generateQRCodeValue() {
            return JSON.stringify({
                image: this.user.avatarIndex,
                nom: this.user.nom,
                prenom: this.user.prenom,
                email: this.user.email
            });
        }
    },
    async created() {
        // Appeler la méthode asynchrone et mettre à jour l'URL de l'avatar
        try {
            let url = null;
            if (this.user.image) {
                url = await this.generateAvatarUrl(this.user.image);
            } else {
                url = await this.generateAvatarUrl(this.user.avatarIndex);
            }
            this.avatarUrl = url;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'avatar:", error.message);
        }
    },
    methods: {
        async generateAvatarUrl(seed) {
            try {
                const response = await fetch(`https://api.dicebear.com/7.x/adventurer/json?seed=${seed + 1}`);
                const data = await response.json();

                if (data && data.svg) {
                    console.log("Wesh le svg", data.svg);
                    return "data:image/svg+xml;base64," + btoa(data.svg);
                } else {
                    console.error("La réponse de l'API ne contient pas un avatar valide.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'avatar:", error.message);
                throw error; // Propager l'erreur pour la gestion ultérieure si nécessaire
            }
        }
    }
};
</script>

<style scoped>
/* Styles spécifiques à CardComponent.vue */
.carte {
    height: auto;
    width: auto;
    text-align: center;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
}

.main-row {
    display: flex;
    justify-content: space-between;
}

.user-image-section {
    flex: 1; /* Occupe l'espace disponible */
    text-align: left;
}

.user-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
}

.qrcode-section {
    flex: 1; /* Occupe l'espace disponible */
    text-align: right;
}

.qrcode {
    max-width: 100px;
}

.user-info {
    margin-top: 20px;
}

h2 {
    color: #333333;
    margin: 10px 0;
}

p {
    color: #666666;
    margin: 10px 0;
}
</style>
