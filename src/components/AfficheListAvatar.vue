<template>
    <div>
        <div v-if="avatars.length === 0">Aucun avatar disponible.</div>
        <div v-else>
            <div id="avatarCarousel" class="carousel slide" data-bs-ride="carousel" style="max-width: 200px">
                <div class="carousel-indicators">
                    <button
                        v-for="(avatar, index) in avatars"
                        :key="index"
                        type="button"
                        data-bs-target="#avatarCarousel"
                        :data-bs-slide-to="index"
                        :class="{ active: index === 0 }"
                        aria-current="true"
                        :aria-label="'Slide ' + (index + 1)"
                    ></button>
                </div>
                <div class="carousel-inner">
                    <div
                        v-for="(avatar, index) in avatars"
                        :key="index"
                        class="carousel-item"
                        :class="{ active: index === 0 }"
                    >
                        <div @click="emitSelectedAvatar(index)" v-html="avatar.svg"></div>
                    </div>
                </div>
                <button
                    class="carousel-control-prev"
                    type="button"
                    data-bs-target="#avatarCarousel"
                    data-bs-slide="prev"
                >
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button
                    class="carousel-control-next"
                    type="button"
                    data-bs-target="#avatarCarousel"
                    data-bs-slide="next"
                >
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            avatars: []
        };
    },
    methods: {
        async fetchAvatars() {
            try {
                for (let i = 1; i <= 20; i++) {
                    const response = await fetch(`https://api.dicebear.com/7.x/adventurer/json?seed=${i}`);
                    const data = await response.json();
                    console.log("TEST", data);
                    if (data && data.svg) {
                        console.log("Wesh le svg", data.svg);
                        this.avatars.push({ svg: data.svg });
                    } else {
                        console.error("La réponse de l'API ne contient pas un avatar valide.");
                    }
                }
            } catch (error) {
                console.error("Error fetching avatars:", error.message);
            }
        },
        emitSelectedAvatar(index) {
            // Émettre l'événement selectAvatar avec l'index de l'avatar
            this.$emit("selectAvatar", index);
        }
    },
    mounted() {
        this.fetchAvatars();
    }
};
</script>

<style scoped>
/* Styles spécifiques pour le composant */
.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-color: green;
}
</style>
