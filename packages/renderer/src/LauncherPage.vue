<template>
  <div class="Launcher">
    <TitleBar />
    <div class="container">
      <div class="topPart">
        <NewsCarousel />
        <LogoAndSocial />
      </div>
      <div class="bottomPart">
        <Loader />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from '/src/components/TitleBar.vue';
import NewsCarousel from '/src/components/NewsCarousel.vue';
import LogoAndSocial from '/src/components/LogoAndSocial.vue';
import Loader from '/src/components/Loader.vue';
import {ipc} from '#preload';
import {onMounted} from 'vue';
import {konami} from '/@/utils/kanomi';

// const APP_VERSION = import.meta.env.VITE_APP_VERSION;
function enableDevMode() {
  ipc.send('enableDevMode');
}

function toggleDevTools() {
  ipc.send('toggleDevTools');
}

onMounted(() => {
  konami([68, 69, 86, 77, 79, 68, 69], enableDevMode);
  konami([123], toggleDevTools);
});
</script>

<style scoped lang="scss">
.Launcher {
  font-family: "Segoe UI", sans-serif;
  user-select: none;
  -webkit-user-drag: none;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url("../assets/img/background_image.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;

  .container {
    flex: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .topPart {
      gap: 1em;
      color:white;
      display: flex;
      padding: 1em;
      padding-bottom: 0;
    }

    .bottomPart {
      flex: 1;
      padding: 1em;
      color: white;
      display: flex;
      gap: 1em;
    }
  }
}
</style>
