<template>
    <div class="modifier-ma-carte-container">
        <!-- Bouton pour afficher la liste d'avatars -->
        <div class="mb-3">
            <button @click="toggleAvatarList" v-if="!showAvatarList" class="btn btn-success">
                Afficher Liste d'Avatar
            </button>
            <AfficheListAvatar v-if="showAvatarList" @selectAvatar="selectAvatar" />
        </div>
        <button class="btn btn-success mt-5 large-button" @click="writeTag" v-if="modificationSuccess">
            Écrire sur NFC
        </button>

        <!-- Conteneur principal avec la disposition flex et grille Bootstrap -->
        <div class="d-lg-flex">
            <!-- Formulaire dans une colonne Bootstrap sur les écrans de grande taille (desktop) -->
            <div class="form-container col-lg-6">
                <form @submit.prevent="submitForm">
                    <label for="nom">Nom:</label>
                    <input type="text" v-model="nom" required />

                    <label for="prenom">Prénom:</label>
                    <input type="text" v-model="prenom" required />

                    <label for="email">Adresse email:</label>
                    <input type="email" v-model="email" required />

                    <!-- Afficher l'avatar sélectionné -->
                    <img
                        v-if="selectedAvatar"
                        :src="avatars[selectedAvatar].svg"
                        alt="Avatar sélectionné"
                        class="selected-avatar"
                    />

                    <button type="submit" class="btn btn-success mt-3">Modifier</button>
                </form>
                <!-- Message de confirmation -->
                <p v-if="modificationSuccess" class="alert alert-success mt-1" role="alert">
                    Les modifications ont bien été apportées!
                </p>
            </div>

            <!-- Espace entre le formulaire et la carte sur les écrans de grande taille -->
            <div class="flex-lg-grow-1" style="width: 30px"></div>

            <!-- Carte modifiée à droite sur les écrans de grande taille -->
            <div class="card-container col-lg-6 mt-3">
                <cardComponent v-if="modificationSuccess" :user="modifiedUser" />
            </div>
        </div>
    </div>
</template>

<script>
import AfficheListAvatar from "@/components/AfficheListAvatar.vue";
import cardComponent from "@/components/cardComponent.vue";

export default {
    name: "ModifierMaCarte",
    components: {
        AfficheListAvatar,
        cardComponent
    },
    data() {
        return {
            nom: "",
            prenom: "",
            email: "",
            selectedAvatar: null,
            showAvatarList: false,
            avatars: [],
            modificationSuccess: false,
            modifiedUser: null
        };
    },
    methods: {
        submitForm() {
            // Création de l'objet User avec les données du formulaire et l'index de l'avatar
            const modifiedUser = {
                nom: this.nom,
                prenom: this.prenom,
                email: this.email,
                avatarIndex: this.selectedAvatar
            };

            // Enregistrement dans le localStorage
            localStorage.setItem("User", JSON.stringify(modifiedUser));

            // Mise à jour de l'état de modification et de l'utilisateur modifié
            this.modificationSuccess = true;
            this.modifiedUser = modifiedUser;
        },
        toggleAvatarList() {
            this.showAvatarList = !this.showAvatarList; // Afficher/masquer la liste d'avatars
        },
        selectAvatar(index) {
            this.selectedAvatar = index; // Mettre à jour l'index de l'avatar sélectionné
            this.showAvatarList = false; // Masquer la liste d'avatar après la sélection
        }
    },
    created() {
        // Remplir la propriété avatars avec les données des avatars
        for (let i = 1; i <= 20; i++) {
            const avatar = { svg: `https://api.dicebear.com/7.x/adventurer/svg?seed=${i}` };
            this.avatars.push(avatar);
        }
    },
    async writeTag() {
        if ("NDEFReader" in window) {
            if (!this.modifiedUser) {
                console.error("Aucune donnée utilisateur modifiée à écrire sur NFC.");
                return;
            }

            const ndef = new NDEFReader();
            try {
                const data = JSON.stringify({
                    image: this.modifiedUser.avatarIndex,
                    nom: this.modifiedUser.nom,
                    prenom: this.modifiedUser.prenom,
                    email: this.modifiedUser.email
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
};
</script>

<style>
/* Styles spécifiques au composant */
/* Ajoutez vos styles de formulaire personnalisés ici */
.modifier-ma-carte-container {
    margin-top: 150px;
}
.form-container {
    height: 400px;
    width: 500px;
    background-color: #121212;
    padding: 20px;
    border-radius: 10px;

    color: white;
}

.label {
    display: block;
    margin-bottom: 10px;
}

input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    box-sizing: border-box;
}

.selected-avatar {
    max-width: 100px;
    margin-top: 10px;
}

button {
    cursor: pointer;
}

h1 {
    position: fixed;
    top: 10px;
    left: 600px;
    color: white;
    font-size: 60pt;
}

.success-message {
    position: absolute;
    top: 100%; /* Placer en bas du conteneur parent */
    left: 20px;
    color: #1db954;
}

.card-container {
    margin-top: 20px; /* Ajouter un espace entre le formulaire et la carte */
}
</style>
