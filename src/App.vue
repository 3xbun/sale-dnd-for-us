<template>
  <div class="container">
    <header>
      <img class="logo" src="/imgs/logo.jpg" alt="logo" />
      <h1>D&D: For Us</h1>
    </header>
    <nav>
      <p @click="view = 'dashboard'" :class="{ active: view == 'dashboard' }">
        Dashboard
      </p>
      <p @click="view = 'sales'" :class="{ active: view == 'sales' }">Sales</p>
    </nav>
    <SalesFlow v-if="view == 'sales'" />
    <Dashboard v-if="view == 'dashboard'" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import SalesFlow from "./views/SalesFlow.vue";
import Dashboard from "./components/Dashboard.vue";

const view = ref("sales");
</script>

<style lang="css" scoped>
header {
  text-align: center;
}

.logo {
  border-radius: 50%;
  width: 10vw;
  margin: 2em auto 0;
}

nav {
  display: flex;
  justify-content: center;
  gap: 1em;
}

nav > p {
  background-color: #353535;
  width: fit-content;
  padding: 0.25em 0.5em;
  border-radius: 0.5em;
  cursor: pointer;
}

nav p.active {
  background-color: #db292f;
}
</style>
