<template>
  <div class="TitleBar">
    <div class="left">
      <div
        class="hamMenuOpenerButton"
        :data-checked="menuVisible"
        @click="handleChange"
      />
      <div
        class="hamMenu"
        @click="handleChange"
      >
        <ul>
          <li
            class="iconStatus"
            @click.stop="openStatus"
          >
            Voir le status des services
          </li>
          <li
            v-if="repairVisible"
            class="iconOpen"
            @click.stop="openGameDir"
          >
            Ouvrir le dossier du jeu
          </li>
          <li
            v-if="repairVisible"
            class="iconRepair"
            @click.stop="repairApp"
          >
            Réparer
          </li>

          <!-- Dev mode options-->
          <template v-if="devMode">
            <li
              v-if="repairVisible"
              class="clearLogs"
              @click.stop="clearLogs"
            >
              Effacer les logs
            </li>
            <li @click.stop="nextLogLevel">
              Log level: {{ logLevel }}
            </li>
            <li @click.stop="nextDebugMode">
              Debug mode: {{ debugMode }}
            </li>
            <li
              v-for="(value, key) in devOptions"
              :key="key"
              @click.stop="devOptions[key] = !value"
            >
              {{ value ? '✔' : '✘' }} {{ devOptionsLabel[key] }}
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="right">
      <div
        class="minimizeButton"
        @click="minimizeApp"
      />
      <div
        class="closeButton"
        @click="closeApp"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch, reactive, toRaw} from 'vue';
import {ipc, on} from '#preload';
import {DebugMode, DebugModeValues, LogLevel, LogLevelValues} from '../../../../types/appTypes';

const repairVisible = ref(false);
const devMode = ref(false);
const menuVisible = ref(false);
const logLevel = ref<LogLevel>(LogLevel.INFO);
const debugMode = ref<DebugMode>(DebugMode.NO_DEBUG);

const devOptionsLabel = ref({
    'dumpMixinified': 'Dump mixinified',
    'printMixinsLoadOrder': 'Print mixins order',
    'launchGame': 'Do not start game',
    'applyMixins': 'Apply mixins',
    'discordIntegration': 'Discord Integration',
    'redirectLogs': 'Redirect logs',
});

const devOptions = reactive({
    'dumpMixinified': true,
    'printMixinsLoadOrder': true,
    'launchGame': true,
    'applyMixins': true,
    'discordIntegration': true,
    'redirectLogs': true,
});

watch(devOptions, (newValue) => {
  ipc.send('toogleDevOption', toRaw(newValue));
});

const handleChange = () => {
  menuVisible.value = !menuVisible.value;
};

const openGameDir = () => {
  ipc.send('openGameDir');
};

const openStatus = () => {
  ipc.send('openUrl', 'https://status.arena-returns.com/');
};

const closeApp = () => {
  ipc.send('close');
};

const minimizeApp = () => {
  ipc.send('minimize');
};

const nextLogLevel = () => {
  logLevel.value = LogLevelValues[(LogLevelValues.indexOf(logLevel.value) + 1) % LogLevelValues.length];
  ipc.send('changeLogLevel', logLevel.value);
};

const nextDebugMode = () => {
  debugMode.value = DebugModeValues[(DebugModeValues.indexOf(debugMode.value) + 1) % DebugModeValues.length];
  ipc.send('changeDebugMode', debugMode.value);
};


const clearLogs = () => {
  ipc.send('clearLogs');
};

const repairApp = () => {
  ipc.send('repair');
};

onMounted(() => {
  on('setRepairVisible', (_event, visible) => {
    repairVisible.value = visible as boolean;
  });
  on('devModeEnabled', (_) => {
    devMode.value = true;
  });
});

</script>

<style scoped lang="scss">
$menuBarWidth: 2em;

.TitleBar {
  display: flex;
  background-color: rgb(0, 0, 0, .4);
  height: $menuBarWidth;
  -webkit-app-region: drag;
  position: relative;
  z-index: 99;

  .left {
    margin-right: auto;
    margin-left: 0.5em;
    display: flex;
    column-gap: 0.25em;

    .hamMenuOpenerButton {
      cursor: pointer;
      background-image: url("../../assets/img/icon_settings.png"); background-size: calc(2em - 4px) calc(2em - 4px);
      background-position: 2px 2px;
      background-repeat: no-repeat;
      width: 2em;
      height: 2em;
      -webkit-app-region: no-drag;

      &:hover {
        background-color: rgba(255, 255, 255, 0.209);
      }
    }

    .hamMenuOpenerButton[data-checked="true"] + .hamMenu {
      transform: translate(0px);
      visibility: visible;
    }

    .hamMenu {
      width: calc(30vw + 30px);
      height: 100%;
      position: fixed;
      top: $menuBarWidth;
      left: -30px;
      padding-left: 30px;

      visibility: hidden;
      transform: translate(-110%);
      background-color: rgba(0, 0, 0, .9);
      transition: 0.4s;
      transition-timing-function: cubic-bezier(.33, 1.23, .84, 1.01);
      justify-content: center;
      align-items: center;
      font: normal normal normal 1em/1.2em Arial, sans-serif;

      li {
        color: whitesmoke;
        padding: 5px 5px 7px 31px;
        text-indent: 0.4em;
        border-radius: 2px;
        font-weight: bold;
        background-repeat: no-repeat;
        background-position-x: 5px;
        transition: background-color ease 0.1s;
        margin-right: 5px;
      }

      li:active {
        transform: scale(0.98);
      }

      li:hover {
        background-color: rgba(245, 245, 245, 0.5);
        cursor: pointer;
      }

      ul {
        list-style: none;
        padding-inline-start: 20px;
      }
    }

    .iconOpen {
      background-image: url("../../assets/img/icon_open.png");
    }

    .iconRepair {
      background-image: url("../../assets/img/icon_repair.png");
    }

    .iconStatus {
      background-image: url("../../assets/img/icon_status.png");
    }
  }

  .right {
    margin-left: auto;
    margin-right: 0.5em;
    display: flex;
    column-gap: 0.25em;

    .minimizeButton {
      cursor: pointer;
      background-image: url("../../assets/img/icon_minimize.png");
      background-size: contain;
      background-repeat: no-repeat;
      width: 2em;
      height: 2em;
      -webkit-app-region: no-drag;

      &:hover {
        background-color: rgba(255, 255, 255, 0.209);
      }
    }

    .closeButton {
      cursor: pointer;
      background-image: url("../../assets/img/icon_close.png");
      background-size: contain;
      background-repeat: no-repeat;
      width: 2em;
      height: 2em;
      -webkit-app-region: no-drag;

      &:hover {
        background-color: rgba(255, 255, 255, 0.209);
      }
    }
  }
}

</style>
