<template>
    <div class="container d-flex justify-content-center">
        <div class="row">
            <div class="col-12">
                <NavbarComponent></NavbarComponent>
            </div>
            <div class="col-12"><RouterView></RouterView></div>
        </div>
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
#app {
    height: 100%;
    width: 100%;
}
body {
    background: #96afff;
    font-family: "Roboto", sans-serif;
}
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap')
</style>
