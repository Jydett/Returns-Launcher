<template>
  <Progress
    :label="progressLabel"
    :progress="progress"
    :hide-progress="state.loaderState === LoaderState.INITIALIZING"
  />
  <MainButton
    :label="mainBtnProps.label"
    :disabled="mainBtnDisabled"
    :btn-class-name="mainBtnProps.className"
    @click="mainBtnClick"
  />
</template>

<script setup lang="ts">
import {computed, onMounted, reactive} from 'vue';
import MainButton from '/@/components/MainButton.vue';
import Progress from '/@/components/Progress.vue';
import {ipc, on} from '#preload';

enum LoaderState {
  INITIALIZING,
  CHECKING,
  UPDATE_REQUIRED,
  DOWNLOADING,
  UP_TO_DATE
}

const state = reactive({
  loaderState: LoaderState.INITIALIZING,
  itemsLoaded: 0,
  itemsTotal: 0,
  forceDisableButton: false,
});

const progress = computed(() => Math.round((state.itemsLoaded * 100) / state.itemsTotal) || 0);

const mainBtnProps = computed(() => {
  switch (state.loaderState) {
    case LoaderState.INITIALIZING:
    case LoaderState.UP_TO_DATE:
      return { label: 'Jouer', className: 'bigText' };
    default:
      return { label: 'Mettre à jour', className: '' };
  }
});

const mainBtnDisabled = computed(() => {
  return state.forceDisableButton || (state.loaderState !== LoaderState.UP_TO_DATE && state.loaderState !== LoaderState.UPDATE_REQUIRED);
});

const progressLabel = computed(() => {
  switch (state.loaderState) {
    case LoaderState.INITIALIZING:
      return 'Vérification des mises à jour...';
    case LoaderState.CHECKING:
      return 'Vérification des fichiers du client...';
    case LoaderState.UPDATE_REQUIRED:
      return 'Mise à jour requise pour jouer';
    case LoaderState.DOWNLOADING:
      return `Mise à jour du client... [${state.itemsLoaded}/${state.itemsTotal}]`;
    case LoaderState.UP_TO_DATE:
      return 'Vous êtes à jour, bon jeu !';
  }
  return 'Etat inconnu :(';
});

function mainBtnClick() {
  if (state.loaderState === LoaderState.UP_TO_DATE) launchGame();
  else if (state.loaderState === LoaderState.UPDATE_REQUIRED) startUpdating();
}

function startUpdating() {
  state.loaderState = LoaderState.CHECKING;
  ipc.send('startUpdate');
}

function launchGame() {
  state.forceDisableButton = true;
  ipc.send('launchGame');
  setTimeout(() => {
    state.forceDisableButton = false;
  }, 3000);
}

onMounted(() => {
  ipc.invoke('isUpdateNeeded').then((updateNeeded) => {
    if (updateNeeded) {
      state.loaderState = LoaderState.UPDATE_REQUIRED;
    } else {
      state.loaderState = LoaderState.UP_TO_DATE;
      // Fill progressbar
      state.itemsLoaded = 1;
      state.itemsTotal = 1;
    }
  });

  // Getting the new state from the main process
  on('itemsLoadedUpdate', (_, itemsLoaded) => {
    state.itemsLoaded = itemsLoaded as number;
  });

  on('itemsTotalUpdate', (_, itemsTotal) => {
    state.itemsTotal = itemsTotal as number;
  });

  on('repairStarted', () => {
    startUpdating();
  });

  on('downloadStarted', (_, itemsTotal) => {
    state.loaderState = LoaderState.DOWNLOADING;
    state.itemsLoaded = 0;
    state.itemsTotal = itemsTotal as number;
  });

  on('upToDate', () => {
    state.loaderState = LoaderState.UP_TO_DATE;
    // Fill progressbar
    state.itemsLoaded = 1;
    state.itemsTotal = 1;
  });
});
</script>

<style scoped lang="scss">
.mainBtn {
  &.bigText {
    font-size: 1.7em;
  }
}
</style>
