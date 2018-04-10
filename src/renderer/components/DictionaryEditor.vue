<template>
    <div>
        <transition-group tag="div" class="menu-bar u-full-width" name="slideLeft-fade">
            <button :key="1" v-on:click="toggleAddingDictionary">
                <i class="material-icons">{{ addingDictionary ? 'close' : 'book' }}</i> {{ addingDictionary ? 'Abbrechen' : 'Neues Wörterbuch' }}
            </button>
            <button :key="2" v-if="!addingDictionary" v-on:click="toggleEditingDictionary">
                <i class="material-icons">{{ editingDictionary ? 'save' : 'edit' }}</i> {{ editingDictionary ? 'Speichern' : 'Wörterbücher bearbeiten' }}
            </button>
            <input :key="3" type="text" v-if="addingDictionary" v-model="newDictionary.lang1" @keyup.esc="toggleAddingDictionary" @keyup.enter="addNewDictionary" placeholder="Sprache 1">
            <input :key="4" type="text" v-if="addingDictionary" v-model="newDictionary.lang2" @keyup.esc="toggleAddingDictionary" @keyup.enter="addNewDictionary" placeholder="Sprache 2">
            <button :key="5" v-if="addingDictionary" v-on:click="addNewDictionary">
                <i class="material-icons">save</i> Speichern
            </button>
        </transition-group>
        <table class="u-full-width">
            <thead>
                <tr>
                    <th style="width:33%">Sprache 1</th>
                    <th style="width:33%">Sprache 2</th>
                    <th style="width:33%">Vokabeln</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!editingDictionary" v-bind:class="{active: dictionary.id === activeDictionaryId}" v-on:click="setActiveDictionaryId(dictionary.id); $router.push('vocabularies')" :key="index" v-for="(dictionary, index) in dictionaries">
                    <td>{{ dictionary.lang1 }}</td>
                    <td>{{ dictionary.lang2 }}</td>
                    <td>{{ dictionary.vocabularies.length }}</td>
                </tr>
                <tr v-if="editingDictionary" v-bind:class="{active: dictionary.id === activeDictionaryId}" :key="index" v-for="(dictionary, index) in dictionaries">
                    <td><input type="text" v-model="dictionary.lang1" @keyup.enter="toggleEditingDictionary" placeholder="Sprache 1" /></td>
                    <td><input type="text" v-model="dictionary.lang2" @keyup.enter="toggleEditingDictionary" placeholder="Sprache 2" /></td>
                    <td>{{ dictionary.vocabularies.length }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

let dictionary = {
    lang1: '',
    lang2: ''
}

export default {
    data: function() {
        return {
            newDictionary: { ...dictionary },
            addingDictionary: false,
            editingDictionary: false
        }
    },
    computed: {
        ...mapState({
            dictionaries: 'dictionaries',
            activeDictionaryId: 'activeDictionaryId'
        })
    },
    methods: {
        addNewDictionary() {
            this.addDictionary(this.newDictionary)
                .then(() => (this.newDictionary = { ...dictionary }))
                .catch(alert)
        },
        toggleAddingDictionary() {
            this.editingDictionary = false
            this.addingDictionary = !this.addingDictionary
        },
        toggleEditingDictionary() {
            this.addingDictionary = false
            this.editingDictionary = !this.editingDictionary
        },

        ...mapActions({
            addDictionary: 'addDictionary',
            setActiveDictionaryId: 'setActiveDictionaryId'
        })
    },
    beforeMount() {
        Mousetrap.bind('n', () => this.toggleAddingDictionary())
        Mousetrap.bind('b', () => this.toggleEditingDictionary())
    }
}
</script>

<style src="../assets/css/editor.css"></style>
