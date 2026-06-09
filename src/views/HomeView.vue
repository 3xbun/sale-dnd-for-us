<template>
  <div>
    <input
      type="text"
      placeholder="ค้นหาด้วยชื่อเซิร์ฟเวอร์"
      v-model="memberID"
    />
    <router-link :to="memberID.toLowerCase()">
      <button>ค้นหา</button>
    </router-link>
  </div>
</template>

<script setup>
import { ref } from "vue";

const memberID = ref("");
</script>

<style lang="css" scoped>
div {
  padding-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}
input {
  width: 100%;
  text-align: center;
}

button {
  width: fit-content;
  padding: 0.25em 0.5em;
}
</style>
