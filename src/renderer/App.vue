<template>
  <div id="app">
    <header>
        <div class="top-bar">
            <h1>Votrain</h1>
            <select v-model="activeDictionary">
                <option v-for="dictionary in dictionaries" :value="dictionary.id" :key="dictionary.id">
                    {{ dictionary.lang1 }} / {{ dictionary.lang2 }}
                </option>
            </select>
        </div>
        <nav>
            <router-link to="dictionaries">Wörterbücher</router-link>
            <router-link v-if="activeDictionary !== -1" to="vocabularies">Vokabeln</router-link>
        </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <span>Crafted with <i class="material-icons">favorite</i> by <a href="https://hendrikbursian.github.io">Hendrik Bursian</a></span>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            dictionaries: 'dictionaries',
        }),
        activeDictionary: {
            get () {
                return this.$store.state.activeDictionary
            },
            set (activeDictionary) {
                this.$store.commit('setActiveDictionary', activeDictionary)
            }
        }
    },
    methods: {
    }
}
</script>


<style scoped>
#app {
    height: 100%;
    display: flex;
    flex-direction: column;
}
header {
    flex: 8%;
    padding: 1em 1em 0;
}
.top-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.top-bar h1 {
    display: inline-flex;
    margin: 0 1em 0 0;
}
.top-bar select {
    display: inline-flex;
    margin: 0;
}

nav {
    display: flex;
}
nav a {
    padding: 1em;
}
nav a.router-link-active {
    color: #333;
}
main {
    flex: 90%;
    padding: 0 0.5em;
    display: flex;
    flex-direction: column;
    align-items: center;
}
footer {
    flex: 10%;
    display: flex;
    justify-content: center;
}
</style>
