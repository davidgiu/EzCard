<template>
    <div class="main">
        <NavbarComponent></NavbarComponent>
        <RouterView></RouterView>
    </div>
</template>

<script>
import NavbarComponent from "@/components/navbarComponent.vue";
import { RouterView } from "vue-router";

export default {
    name: "App",
    components: {
        NavbarComponent,
        RouterView
    }
};
</script>

<style>
.main {
    display: flex;
}

body {
    background: #3c3c3c;
}
</style>
