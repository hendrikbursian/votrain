<template>
  <div id="app">
    <header>
        <div class="top-bar">
            <h1>Votrain</h1>
            <select v-model="activeDictionaryId">
                <option v-for="dictionary in dictionaries" :value="dictionary.id" :key="dictionary.id">
                    {{ dictionary.lang1 }} / {{ dictionary.lang2 }}
                </option>
            </select>
            <button @click="exportFile">Daten exportieren</button>
        </div>
        <nav>
            <router-link to="dictionaries">Wörterbücher</router-link>
            <router-link to="categories">Kategorien</router-link>
            <router-link v-if="adi !== -1" to="vocabularies">Vokabeln</router-link>
            <router-link to="boxes">Karteikästen</router-link>
            <router-link v-if="adi !== -1 && activeDictionary.vocabularies.length > 0 && boxes.length > 0" to="learning">Lernen</router-link>
            <router-link to="help">Hilfe</router-link>
        </nav>
    </header>
    <main>
        <div class="display u-full-width">
          <router-view></router-view>
        </div>
    </main>
    <footer>
      <span>Crafted with <i class="material-icons">favorite</i> by <a target="_blank" href="https://hendrikbursian.github.io">Hendrik Bursian</a></span>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            adi: 'activeDictionaryId',
            dictionaries: 'dictionaries',
            boxes: 'boxes'
        }),
        ...mapGetters({
            activeDictionary: 'activeDictionary'
        }),
        activeDictionaryId: {
            get() {
                return this.adi
            },
            set(activeDictionaryId) {
                this.setActiveDictionaryId(activeDictionaryId).then(
                    () => this.saveState
                )
            }
        }
    },
    methods: {
        exportFile() {
            this.exportState()
                .then(path => {
                    if (path)
                        alert(
                            `Daten wurden erfolgreich exportiert\nSpeicherort: ${path}`
                        )
                })
                .catch(alert)
        },

        ...mapActions({
            setActiveDictionaryId: 'setActiveDictionaryId',
            saveState: 'saveState',
            exportState: 'exportState'
        })
    },
    beforeMount() {
        Mousetrap.bind('1', () => this.$router.push('dictionaries'))
        Mousetrap.bind('2', () => this.$router.push('categories'))
        Mousetrap.bind('3', () => this.$router.push('vocabularies'))
        Mousetrap.bind('4', () => this.$router.push('boxes'))
        Mousetrap.bind('5', () => this.$router.push('learning'))
        Mousetrap.bind('6', () => this.$router.push('help'))
    },
    created() {
        if (this.adi === -1)
            alert(
                'Bevor du loslegen kannst brauchst du ein Wörterbuch. Klicke auf "Wörterbuch hinzufügen" um ein Neues anzulegen.'
            )
    }
}
</script>

<style src="../../static/css/normalize.css"></style>
<style src="../../static/css/fonts.css"></style>
<style src="../../static/css/skeleton.css"></style>
<style src="./assets/css/editor.css"></style>

<style scoped>
@keyframes heartbeat {
    from {
        color: #f53434;
    }
    to {
        color: #a53638;
    }
}

#app {
    height: 100%;
    display: flex;
    flex-direction: column;
}
header {
    position: fixed;
    background: #fff;
    top: 0;
    left: 0;
    right: 0;
    height: 6em;
    padding: 1em;
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
.display {
    padding: 8em 0 2.6em;
}
footer {
    position: fixed;
    background: #fff;
    height: 2.6em;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
}
footer span {
    display: flex;
    justify-content: center;
    align-items: center;
}

footer i {
    padding: 0 2px;
    font-size: 16px;
    animation: heartbeat 1s infinite;
    animation-direction: alternate;
}
</style>
