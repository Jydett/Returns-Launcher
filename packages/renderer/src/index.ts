import {createApp} from 'vue';
import LauncherPage from '/@/LauncherPage.vue';

import 'normalize.css';
import './global.scss';
import '@egjs/vue3-flicking/dist/flicking.css';
import Flicking from '@egjs/vue3-flicking';

createApp(LauncherPage)
  .component('Flicking', Flicking)
  .mount('#app');
