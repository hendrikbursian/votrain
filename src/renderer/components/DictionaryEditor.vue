<template>
    <div>
        <transition-group tag="div" class="menu-bar u-full-width" name="slideLeft-fade">
            <button :key="0" v-if="!adding" @click="closeMenus();adding = true"><i class="material-icons">book</i> Neues Wörterbuch</button>
            <button :key="1" v-if="!editing" @click="closeMenus();editing = true"><i class="material-icons">edit</i> Wörterbücher bearbeiten</button>
            <button :key="2" v-if="!deleting" @click="closeMenus();deleting = true"><i class="material-icons">delete</i> Wörterbücher löschen</button>
            <button :key="3" v-if="adding || editing || deleting" @click="cancel"><i class="material-icons">close</i> Abbrechen</button>
            <input :key="4" type="text" v-if="adding" v-model="newDictionary.lang1" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Sprache 1">
            <input :key="5" type="text" v-if="adding" v-model="newDictionary.lang2" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Sprache 2">
            <button :key="6" v-if="adding || editing || deleting" @click="save"><i class="material-icons">save</i> Speichern</button>
            <button :key="7" v-if="deleting" @click="deleteAll"><i class="material-icons">delete_forever</i> Alle löschen</button>
        </transition-group>
        <div class="display-area">
            <table class="u-full-width">
                <thead>
                    <tr>
                        <th style="width:33%">Sprache 1</th>
                        <th style="width:33%">Sprache 2</th>
                        <th style="width:33%">Vokabeln</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!editing" 
                        v-bind:class="{active: dictionary.id === activeDictionaryId, delete: deleting}" 
                        :key="dictionary.id"
                        v-for="dictionary in dictionaries" 
                        @click="deleting ? deleteDictionary(dictionary.id) : openDictionary(dictionary.id)"
                    >
                        <td>{{ dictionary.lang1 }}</td>
                        <td>{{ dictionary.lang2 }}</td>
                        <td>{{ dictionary.vocabularies.length }}</td>
                    </tr>
                    <tr v-if="editing" v-bind:class="{active: dictionary.id === activeDictionaryId}" :key="dictionary.id" v-for="dictionary in dictionaries">
                        <td><input type="text" v-model="dictionary.lang1" @keyup.enter="save" @keyup.esc="cancel" placeholder="Sprache 1" /></td>
                        <td><input type="text" v-model="dictionary.lang2" @keyup.enter="save" @keyup.esc="cancel" placeholder="Sprache 2" /></td>
                        <td>{{ dictionary.vocabularies.length }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

const dictionary = {
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
        // TODO: Add Category dropdown
        // categories() {
        //     return Array.from(
        //         new Set(
        //             this.activeDictionary.vocabularies.map(voc => voc.category)
        //         )
        //     )
        // },
        closeMenus() {
            this.adding = false
            this.editing = false
            this.deleting = false
            this.loadState() // If menu is not close because of canceling (keybind / click on button)
        },
        save() {
            if (this.adding) {
                this.addDictionary(this.newDictionary)
                    .then(() => {
                        this.newDictionary = { ...dictionary }
                        this.saveState()
                        this.closeMenus()
                    })
                    .catch(alert)
            } else if (this.editing) {
                this.setDictionaries(this.dictionaries)
                    .then(() => {
                        this.saveState()
                        this.closeMenus()
                    })
                    .catch(alert)
            } else {
                this.saveState()
                this.closeMenus()
            }
        },
        cancel() {
            if (this.adding) this.newDictionary = { ...dictionary }
            this.closeMenus()
            this.loadState()
        },
        deleteAll() {
            this.dictionaries.forEach(dic => this.deleteDictionary(dic.id))
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
            setDictionaries: 'setDictionaries',
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
