<template>
  <nav>
    <p @click="view = 'dashboard'" :class="{ active: view == 'dashboard' }">
      Dashboard
    </p>
    <p @click="view = 'sales'" :class="{ active: view == 'sales' }">Sales</p>
  </nav>
</template>

<script setup>
import { ref } from "vue";
</script>

<style lang="css" scoped>
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
