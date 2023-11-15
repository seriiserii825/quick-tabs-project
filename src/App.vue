<script setup lang="ts">
import {ref} from "vue";

const title = ref('');
</script>

<template>
  <div class="popup">
    <header class="popup__header">
      <h2 class="popup__title">Create new tab</h2>
      <input class="popup__input" type="text" v-model="title">
    </header>
    <ul class="list">
      <li class="list__item">
        <div class="list__title">New site</div>
        <div class="list__edit"></div>
        <div class="list__delete"></div>
        <ul class="sublist">
          <li class="sublist__item"></li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style>
#app {
  width: 780px;
}
</style>
