<template>
  <div class="Progress">
    <div class="Label">{{ label }}</div>
    <ProgressBar
      :progress="progress"
      :hide-progress="hideProgress"
    />
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '/@/components/ProgressBar.vue';

interface ProgressProps {
  label: string;
  progress: number;
  hideProgress?: boolean;
}

defineProps<ProgressProps>();
</script>

<style scoped lang="scss">
.Progress {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.25em 0;

  .Label {
    flex: 1;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    font-size: 1.25em;
}
  .Bar {
    width: 100%;
}
}
</style>
