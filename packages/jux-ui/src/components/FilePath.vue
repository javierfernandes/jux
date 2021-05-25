<template>
    <div :class="this.class">
        <i class="pi pi-angle-down" @click="$emit('toggle')" />
        <span class="file-path-folder">{{folder}}</span>
        <span class="file-path-name ">{{fileName}}</span>
    </div>
</template>
<script>
export default {
  name: 'FilePath',
  props: ['path', 'root', 'class'],
  computed: {
    folder() {
      return this.path.slice(this.root.length + 1, this.path.lastIndexOf('/') + 1)
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
  font-size: 0.9rem;
  color: gray;
  padding-right: 0.2rem;
}
.file-path-name {
  font-weight: bold;
}
</style>