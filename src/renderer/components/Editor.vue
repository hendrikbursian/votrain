<template>
    <div>
        <transition-group tag="div" class="menu-bar" name="slideLeft-fade">
            <button :key="0" v-on:click="$store.commit('toggleEditing')">
                <i class="material-icons">{{ editing ? 'close' : 'add' }}</i>{{ editing ? 'Abbrechen' : 'Neues Wort' }}
            </button>
            <input :key="2" type="text" v-if="editing" v-model="newVocabulary.lang1" v-bind:placeholder="activeDictionary.lang1" autofocus>
            <input :key="3" type="text" v-if="editing" v-model="newVocabulary.lang2" v-bind:placeholder="activeDictionary.lang2">
            <input :key="4" type="text" v-if="editing" v-model="newVocabulary.note" placeholder="Notiz">
            <input :key="5" type="text" v-if="editing" v-model="newVocabulary.category" @keyup.enter="addVocabulary" placeholder="Kategorie">
            <button :key="6" v-if="editing" v-on:click="addVocabulary">
                <i class="material-icons">save</i> Speichern
            </button>
        </transition-group>
        <table class="u-full-width">
            <thead>
                <tr>
                    <th style="width:25%">{{ activeDictionary.lang1 }}</th>
                    <th style="width:25%">{{ activeDictionary.lang2 }}</th>
                    <th style="width:25%">Notiz</th>
                    <th style="width:25%">Kategorie</th>
                </tr>
            </thead>
            <tbody>
                <tr :key="index" v-for="(vocabulary, index) in activeDictionary.vocabularies">
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
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState({
            editing: 'editing',
            newVocabulary: 'newVocabulary'
        }),
        ...mapGetters({
            activeDictionary: 'activeDictionary'
        })
    },
    methods: {
        ...mapActions({
            addVocabulary: 'addVocabulary'
        })
    }
}
</script>

<style scoped>
button,
.button {
    margin-bottom: 1rem;
    outline: 0;
    height: 2.5em;
    white-space: nowrap;
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
