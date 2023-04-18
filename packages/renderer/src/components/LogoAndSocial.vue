<template>
  <div class="LogoAndSocial">
    <div class="logo"></div>
    <div class="social">
      <span class="label">Rejoignez-nous sur nos réseaux !</span>
      <div class="socialIcons">
        <a
          class="twitter"
          href="https://twitter.com/ArenaReturns"
          @click.prevent="openUrl($event)"
        >
          <img
            src="../../assets/img/twitter.png"
            alt="Twitter"
          />
        </a>
        <a
          class="discord"
          href="https://discord.gg/arenareturns"
          @click.prevent="openUrl($event)"
        >
          <img
            src="../../assets/img/discord.png"
            alt="Discord"
          />
        </a>
        <a
          class="twitch"
          href="https://twitch.tv/ArenaReturns"
          @click.prevent="openUrl($event)"
        >
          <img
            src="../../assets/img/twitch.png"
            alt="Twitch"
          />
        </a>
        <a
          class="youtube"
          href="https://www.youtube.com/channel/UCgJ8CHqNHXItrWzAF6mOFnQ"
          @click.prevent="openUrl($event)"
        >
          <img
            src="../../assets/img/youtube.png"
            alt="Youtube"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ipc} from '#preload';

const openUrl = (e: Event) => {
  e.preventDefault();
  ipc.send('openUrl', (e.currentTarget as HTMLAnchorElement).href);
};
</script>

<style scoped lang="scss">
.LogoAndSocial {
  flex: 1;
  padding: 1em;
  .logo {
    margin: 0 1em;
    background-image: url("../../assets/img/logo.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 70%;
  }

  .social {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.4em 0 0.2em 0;
    gap: 0.2em;
    font-size: 1.5em;
    font-weight: bold;

    .label {
      opacity: 0.85;
    }

    background-color: rgba(30,0,0, 0.5);
    border-radius: 0.5em;

    .socialIcons {
      width: 100%;
      display: flex;
      justify-content: space-evenly;

      > a {
        display: flex;
        padding: 0.25em;
        border-radius: 50%;
        opacity: 0.8;
        transition: 0.25s;
        transition-property: opacity, background-color;
        &:hover {
          background-color: #633939;
          opacity: 1;
        }
        > img {
          width: 2em;
        }
      }
    }
  }
}

</style>
