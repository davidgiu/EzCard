<template>
    <button class="retour-btn" @click="retourner"><i class="fas fa-arrow-left"></i> Retour</button>
</template>

<script>
export default {
    methods: {
        retourner() {
            this.$router.go(-1);
        }
    }
};
</script>

<style>
.retour-btn {
    background-color: #1db954;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    position: fixed;
    top: 20px;
    left: 225px;
    align-items: center;
}
</style>
