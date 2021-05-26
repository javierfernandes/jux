<template>
    <div :class="this.class">
        <i class="pi pi-angle-down" @click="$emit('toggle')" />
        <div class="file-path-folder">
          <span v-for="folder in folderParts" :key="folder">{{folder}}</span>
        </div>
        <span class="file-path-name ">{{fileName}}</span>
    </div>
</template>
<script>
import { isEmpty } from 'ramda'

export default {
  name: 'FilePath',
  props: ['path', 'root', 'class'],
  computed: {
    folderParts() {
      return this.path.slice(this.root.length + 1, this.path.lastIndexOf('/') + 1)
          .split('/')
          .filter(s => !isEmpty(s))
    },
    fileName() {
      return this.path.slice(this.path.lastIndexOf('/') + 1)
    }
  }
}
</script>
<style>
.pi-angle-down {
  align-self: center;
  padding-right: 1rem;
  cursor: pointer;
}
.file-path-folder {
  display: inline-block;
  font-size: 0.9rem;
  color: gray;
  padding-right: 0.2rem;
}
.file-path-folder > span::after {
  content: '/';
  opacity: 0.3;
  padding-left: 0.1rem;
  padding-right: 0.1rem;
}
.file-path-name {
  font-weight: bold;
  white-space: pre;
}
</style>