<template>
  <div class="NewsCarousel">
    <Flicking
      v-if="imgs.length > 0"
      class="carousel"
      :options="{circular: true}"
      :plugins="plugins"
    >
      <div
        v-for="(img, index) in imgs"
        :key="index"
        class="img"
        :style="'background-image: url(\'' + img.image + '\')'"
      />
      <template #viewport>
        <span class="flicking-arrow flicking-arrow-prev"></span>
        <span class="flicking-arrow flicking-arrow-next"></span>
      </template>
    </Flicking>
    <div
      v-else
      class="carousel"
    >
      Loading...
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {ipc} from '#preload';
import type {CarouselItem} from '../../../../types/appTypes';
import { Arrow } from '@egjs/flicking-plugins';
import '@egjs/flicking-plugins/dist/arrow.css';

const imgs = ref<CarouselItem[]>([]);
const plugins = ref([new Arrow()]);

onMounted(() => {
  ipc.invoke('getCarouselData').then((carouselData: Array<CarouselItem>) => {
    imgs.value = carouselData;
  });
});

</script>

<style scoped lang="scss">
.flicking-arrow::before, .flicking-arrow::after {
  background-color: rgb(124, 118, 94);
  //opacity: 0.5;
}
.flicking-arrow:hover::before, .flicking-arrow:hover::after {
  background-color: rgb(172, 168, 150);
}
.NewsCarousel {
  width: 97vh;
  height: 72.75vh;
  .carousel {
    height: 101%;
    border-radius: 0.25em;
    .img {
      height: 100%;
      width: 100%;
      background-size: cover;
      margin-right: 5px;
      border-radius: 0.25em;
    }
  }
}
</style>
