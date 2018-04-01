<template>
    <div>
        <transition-group tag="div" class="menu-bar" name="slideLeft-fade">
            <button :key="0" v-on:click="editRowEnabled = !editRowEnabled; newVocabulary = {}">
                <i class="material-icons">{{ editRowEnabled ? 'close' : 'add' }}</i>{{ editRowEnabled ? 'Abbrechen' : 'Neues Wort' }}
            </button>
            <input :key="2" type="text" v-if="editRowEnabled" v-model="newVocabulary.lang1" v-bind:placeholder="dictionary.lang1" autofocus>
            <input :key="3" type="text" v-if="editRowEnabled" v-model="newVocabulary.lang2" v-bind:placeholder="dictionary.lang2">
            <input :key="4" type="text" v-if="editRowEnabled" v-model="newVocabulary.note" placeholder="Notiz">
            <input :key="5" type="text" v-if="editRowEnabled" v-model="newVocabulary.category" @keyup.enter="addVocabulary" placeholder="Kategorie">
            <button :key="6" v-if="editRowEnabled" v-on:click="addVocabulary">
                <i class="material-icons">save</i> Speichern
            </button>
        </transition-group>
        <table class="u-full-width">
            <thead>
                <tr>
                    <th style="width:25%">{{ dictionary.lang1 }}</th>
                    <th style="width:25%">{{ dictionary.lang2 }}</th>
                    <th style="width:25%">Notiz</th>
                    <th style="width:25%">Kategorie</th>
                </tr>
            </thead>
            <tbody>
                <tr :key="index" v-for="(vocabulary, index) in dictionary.vocabularies">
                    <td>{{ vocabulary.lang1 }}</td>
                    <td>{{ vocabulary.lang2 }}</td>
                    <td>{{ vocabulary.note }}</td>
                    <td>{{ vocabulary.category }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    computed: {
        dictionary () {
            return this.$store.state.dictionary
        }
    },
    data: function() {
        return {
            editRowEnabled: false,
            newVocabulary: {},
        }
    },
    methods: {
        addVocabulary: function() {
            this.$store.commit('addVocabulary', this.newVocabulary)
            if (this.isNewVocabularyValid()) {
                this.vocabularies.push(this.newVocabulary)
                this.editRowEnabled = false
                this.newVocabulary = {}
            } else
                alert(
                    'Das Wort kann nicht gespeichert werden. Bitte überprüfe deine Eingaben.'
                )
        },
        isNewVocabularyValid: function() {
            return (
                this.newVocabulary.lang1 &&
                this.newVocabulary.lang1 !== '[Keine Übersetzung gefunden]' &&
                this.newVocabulary.lang2 &&
                this.newVocabulary.lang2 !== '[Keine Bemerkung gefunden]' &&
                this.newVocabulary.category
            )
        }
    }
}
</script>

<style>
html,
body {
    height: 100%;
}

body {
    background: #fff;
}

.container {
    width: 100%;
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    box-sizing: border-box;
}

#app {
    height: 100%;
    display: flex;
    flex-direction: column;
}

header {
    flex: 10%;
    padding-top: 1em;
}

main {
    flex: 90%;
    display: flex;
    flex-direction: column;
}

.menu-bar {
    display: flex;
    flex-direction: row;
    margin-bottom: 1em;
}

.menu-bar button,
.menu-bar input {
    display: inline-flex;
    background-color: #fff;
    justify-content: center;
    align-items: center;
    padding: 0 8px 0 2px;
    margin: 0 8px 0 0;
    border: 1px solid transparent;
    border-bottom: 1px solid #888;
    transition: all 1s ease;
}

.menu-bar input {
    width: 20%;
}

.menu-bar :last-child {
    margin-right: 0;
}

.menu-bar button i {
    margin-right: 8px;
}

.menu-bar button:hover,
.menu-bar input:hover {
    border-bottom-color: #333;
}

.menu-bar button:focus,
.menu-bar input:focus {
    border: 1px solid transparent;
    border-bottom: 1px solid #333;
}

.slideLeft-fade-enter-active,
.slideLeft-fade-leave-active {
    transition: all 0.33s ease;
}

.slideLeft-fade-enter,
.slideLeft-fade-leave-to {
    transform: translateX(-45px);
    opacity: 0;
}
</style>
