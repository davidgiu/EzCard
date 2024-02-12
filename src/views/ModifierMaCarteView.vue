<template>
    <div class="row mt-5">
        <div class="col-12">
            <div class="form-container">
                <form @submit.prevent="submitForm">
                    <div class="row align-items-center">
                        <div class="col-6">
                            <AfficheListAvatar v-if="showAvatarList" @selectAvatar="selectAvatar" />
                            <img
                                v-if="selectedAvatar && !showAvatarList"
                                :src="avatars[selectedAvatar].svg"
                                alt="Avatar sélectionné"
                                class="selected-avatar"
                            />
                        </div>
                        <div class="col-6 mb-4 sel">
                            <button @click="toggleAvatarList" v-if="!showAvatarList" class="boutton4">
                                Séléctionner Avatar
                            </button>
                        </div>
                    </div>

                    <div class="row align-items-center">
                        <div class="col-12">
                            <label for="nom">Nom:</label>
                            <input type="text" v-model="nom" required />
                        </div>
                        <div class="col-12">
                            <label for="prenom">Prénom:</label>
                            <input type="text" v-model="prenom" required />
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="email">Adresse email:</label>
                        <input type="email" v-model="email" required />
                    </div>
                    <div class="col-12"><button type="submit" class="boutton4">Modifier</button></div>
                    <div class="col-12">
                        <p v-if="modificationSuccess" class="alert alert-success mt-3" role="alert">
                            Les modifications ont bien été apportées!
                        </p>
                    </div>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col mt-5">
                <cardComponent v-if="modificationSuccess" :user="modifiedUser" />
            </div>
            <div class="col mt-3" v-if="modificationSuccess">
                <button @click="writeTag" class="boutton4">Ecrire sur la Carte NFC</button>
            </div>
            <div class="col-12">
                <p v-if="nfcSuccess" class="alert alert-success mt-3" role="alert">La carte est sur le NFC !</p>
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
            modifiedUser: null,
            nfcSuccess: false
        };
    },
    methods: {
        async writeTag() {
            console.log("Ecriture sur NFC");
            if ("NDEFReader" in window) {
                const ndef = new NDEFReader();
                try {
                    const data = {
                        nom: this.nom,
                        prenom: this.prenom,
                        email: this.email,
                        avatarIndex: this.selectedAvatar
                    };

                    const encoder = new TextEncoder();
                    const encodedData = encoder.encode(JSON.stringify(data));

                    await ndef.write(encodedData);
                    console.log("NDEF message written!");
                    this.nfcSuccess = true;

                    console.log(data);
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.error("Web NFC is not supported.");
            }
        },
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
    }
};
</script>

<style>
/* Styles spécifiques au composant */
/* Ajoutez vos styles de formulaire personnalisés ici */
.boutton4 {
    width: 100%;
    height: 50px;
    background-color: #5607ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: bold;
}
@media (max-width: 767px) {
    .boutton4 {
        font-size: 1.5rem;
        height: auto;
        margin-bottom: 20px;
    }
    .sel .boutton4 {
        font-size: 1rem;
    }
}
.form-container {
    height: auto;
    width: auto;
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
}

.selected-avatar {
    max-width: 10rem;
}
</style>
