<template>
  <div>
    <h1>Context</h1>
    <vue-json-pretty class="json-content" :data="context" />
  </div>
  <div class="eventsLog">
      <h1>Events <span>({{events.length}})</span></h1>
      <button @click="clear">Clear</button>
      <ol>
          <li v-for="event in events" :key="event.timestamp">
              <pre class="json-content">{{JSON.stringify(event, null, 2) }}</pre>
          </li>
      </ol>
  </div>
</template>
<script>
  import VueJsonPretty from 'vue-json-pretty'

    export default {
      name: 'Events',
      components: {
        VueJsonPretty
      },
      computed: {
        events() {
          return this.$store.state.events
          // temp hack to avoid cluttering the ui with "context"
          // return this.$store.state.events.map(e => {
          //   return e.test ? {...e, test: omit(['context'], e.test) } : e
          // })
        },
        context() {
          return this.$store.state.context || 'NO CONTEXT'
        }
      },
      methods: {
        clear() {
          this.$store.commit('clearEvents')
        }
      },
    }
</script>