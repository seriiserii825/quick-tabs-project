<script setup lang="ts">
import IconLogo from "../icons/IconLogo.vue";
import IconDots from "../icons/IconDots.vue";
</script>

<template>
  <header class="main-header">
    <div class="main-header__top">
      <div class="main-header__logo">
        <IconLogo/>
      </div>
      <div class="main-header__dots">
        <IconDots/>
      </div>
    </div>
  </header>
</template>
<style lang="scss">
.main-header {
  margin-bottom: 1.2rem;
  padding: 1rem 1.6rem;
  border-bottom: 1px solid #ECECEC;
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(24px);
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__dots {
    cursor: pointer;
  }
}
</style>