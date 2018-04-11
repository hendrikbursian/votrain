<template>
    <div>
        <transition-group tag="div" class="menu-bar u-full-width" name="slideLeft-fade">
            <button :key="1" v-if="!adding" v-on:click="closeMenus();adding = true"><i class="material-icons">book</i> Neues Wörterbuch</button>
            <button :key="2" v-if="!editing" v-on:click="closeMenus();editing = true"><i class="material-icons">edit</i> Wörterbücher bearbeiten</button>
            <button :key="3" v-if="!deleting" v-on:click="closeMenus();deleting = true"><i class="material-icons">delete</i> Wörterbücher löschen</button>
            <button :key="6" v-if="adding || editing || deleting" v-on:click="cancel"><i class="material-icons">close</i> Abbrechen</button>
            <input :key="4" type="text" v-if="adding" v-model="newDictionary.lang1" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Sprache 1">
            <input :key="5" type="text" v-if="adding" v-model="newDictionary.lang2" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Sprache 2">
            <button :key="7" v-if="adding || editing || deleting" v-on:click="save"><i class="material-icons">save</i> Speichern</button>
            <button :key="8" v-if="deleting" v-on:click="deleteAll"><i class="material-icons">delete_sweep</i> Alle löschen</button>
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
                <tr v-if="!editing" v-bind:class="{active: dictionary.id === activeDictionaryId, delete: deleting}" :key="index" v-for="(dictionary, index) in dictionaries">
                    <td v-on:click="deleting ? deleteDictionary(dictionary.id) : openDictionary(dictionary.id)">{{ dictionary.lang1 }}</td>
                    <td v-on:click="deleting ? deleteDictionary(dictionary.id) : openDictionary(dictionary.id)">{{ dictionary.lang2 }}</td>
                    <td v-on:click="deleting ? deleteDictionary(dictionary.id) : openDictionary(dictionary.id)">{{ dictionary.vocabularies.length }}</td>
                </tr>
                <tr v-if="editing" v-bind:class="{active: dictionary.id === activeDictionaryId}" :key="index" v-for="(dictionary, index) in dictionaries">
                    <td><input type="text" v-model="dictionary.lang1" @keyup.enter="save" @keyup.esc="cancel" placeholder="Sprache 1" /></td>
                    <td><input type="text" v-model="dictionary.lang2" @keyup.enter="save" @keyup.esc="cancel" placeholder="Sprache 2" /></td>
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
            adding: false,
            editing: false,
            deleting: false
        }
    },
    computed: {
        ...mapState({
            dictionaries: 'dictionaries',
            activeDictionaryId: 'activeDictionaryId'
        })
    },
    methods: {
        closeMenus() {
            this.adding = false
            this.editing = false
            this.deleting = false
            this.loadState()
        },
        save() {
            if (this.adding)
                this.addDictionary(this.newDictionary)
                    .then(() => (this.newDictionary = { ...dictionary }))
                    .catch(alert)
            this.saveState()
            this.closeMenus()
        },
        cancel() {
            if (this.adding) this.newDictionary = { ...dictionary }
            this.closeMenus()
            this.loadState()
        },
        deleteAll() {
            console.log('delete all')
        },
        openDictionary(dictionaryId) {
            this.setActiveDictionaryId(dictionaryId)
            this.saveState()
            this.$router.push('vocabularies')
        },

        ...mapActions({
            addDictionary: 'addDictionary',
            deleteDictionary: 'deleteDictionary',
            setActiveDictionaryId: 'setActiveDictionaryId',
            saveState: 'saveState',
            loadState: 'loadState'
        })
    },
    beforeMount() {
        this.loadState()
        Mousetrap.bind(
            'n',
            () => (this.adding ? this.cancel() : (this.adding = true))
        )
        Mousetrap.bind(
            'b',
            () => (this.editing ? this.cancel() : (this.editing = true))
        )
        Mousetrap.bind(
            'l',
            () => (this.deleting ? this.cancel() : (this.deleting = true))
        )
    }
}
</script>

<style src="../assets/css/editor.css"></style>
