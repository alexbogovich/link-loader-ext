<template>
  <div>
    <input v-model="filename">
    <div v-for="link in links" :key="link">
      {{ link }}
    </div>
    <button @click="download">
      Download
    </button>
    <button @click="clear">
      Clear
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { psdk } from '~/shared/psdk';

export default defineComponent({
  name: 'Popup',
  data() {
    return {
      filename: 'filename',
      links: [] as string[],
    };
  },
  mounted() {
    this.fetchLinks();

    chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
      let ext = '';
      if (item.mime === 'image/jpeg') {
        ext = 'jpeg';
      } else if (item.mime === 'image/png') {
        ext = 'png';
      } else if (item.mime === 'image/webp') {
        ext = 'webp';
      }
      if (ext) {
        suggest({ filename: `${this.filename}_${this.links.findIndex(link => link === item.url)}.${ext}` });
      } else {
        suggest({ filename: item.filename });
      }
    });
  },
  methods: {
    async download() {
      this.links.forEach(link => {
        chrome.downloads.download({
          url: link,
        });
      });
    },
    async fetchLinks() {
      this.links = await psdk.links.getLinks();
    },
    async clear() {
      await psdk.links.clearLinks();
      await this.fetchLinks();
    },
  },
});

</script>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  line-height: 1.3;
  width: 400px;
  height: 600px;
  min-height: 500px;
  max-height: 600px;
  overflow: hidden;
  background: lightyellow;
  user-select: none;

  p {
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }
}
</style>
