<template>
    <div>
        <transition-group tag="div" class="menu-bar u-full-width" name="slideLeft-fade">
            <button :key="1" v-on:click="toggleFilter">
                <i class="material-icons">{{ filterOn ? 'close' : 'filter_list' }}</i> {{ filterOn ? 'Abbrechen' : 'Filter' }}
            </button>
            <button :key="2" v-on:click="toggleAdding">
                <i class="material-icons">{{ adding ? 'close' : 'add' }}</i> {{ adding ? 'Abbrechen' : 'Neue Vokabel' }}
            </button>
            <button :key="3" v-if="!adding && !editing" v-on:click="toggleEditing">
                <i class="material-icons">edit</i> Vokabeln bearbeiten
            </button>
            <button :key="4" v-if="editing" v-on:click="save">
                <i class="material-icons">save</i> Speichern
            </button>
            <button :key="5" v-if="editing" v-on:click="cancel">
                <i class="material-icons">close</i> Abbrechen
            </button>
            <input :key="6" type="text" v-if="adding" v-model="newVocabulary.lang1" @keyup.enter="addNewVocabulary" :placeholder="activeDictionary.lang1">
            <input :key="7" type="text" v-if="adding" v-model="newVocabulary.lang2" @keyup.enter="addNewVocabulary" :placeholder="activeDictionary.lang2">
            <input :key="8" type="text" v-if="adding" v-model="newVocabulary.note" @keyup.enter="addNewVocabulary" placeholder="Notiz">
            <input :key="9" type="text" v-if="adding" v-model="newVocabulary.category" @keyup.enter="addNewVocabulary" placeholder="Kategorie">
            <button :key="10" v-if="adding" v-on:click="addNewVocabulary">
                <i class="material-icons">save</i> Speichern
            </button>
        </transition-group>
        <table class="u-full-width">
            <thead>
                <tr v-if="!filterOn">
                    <th style="width:25%">{{ activeDictionary.lang1 }}</th>
                    <th style="width:25%">{{ activeDictionary.lang2 }}</th>
                    <th style="width:25%">Notiz</th>
                    <th style="width:25%">Kategorie</th>
                </tr>
                <tr v-if="filterOn">
                    <th style="width:25%"><input type="text" v-model="filter.lang1" :placeholder="activeDictionary.lang1"></th>
                    <th style="width:25%"><input type="text" v-model="filter.lang2" :placeholder="activeDictionary.lang2"></th>
                    <th style="width:25%"><input type="text" v-model="filter.note" placeholder="Notiz"></th>
                    <th style="width:25%"><input type="text" v-model="filter.category" placeholder="Kategorie"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!editing" :key="index" v-for="(vocabulary, index) in vocabularies">
                    <td>{{ vocabulary.lang1 }}</td>
                    <td>{{ vocabulary.lang2 }}</td>
                    <td>{{ vocabulary.note }}</td>
                    <td>{{ vocabulary.category }}</td>
                </tr>
                <tr v-if="editing" :key="index" v-for="(vocabulary, index) in vocabularies">
                    <td><input type="text" v-model="vocabulary.lang1" @keyup.enter="save" @keyup.esc="cancel" :placeholder="activeDictionary.lang1"></td>
                    <td><input type="text" v-model="vocabulary.lang2" @keyup.enter="save" @keyup.esc="cancel" :placeholder="activeDictionary.lang2"></td>
                    <td><input type="text" v-model="vocabulary.note" @keyup.enter="save" @keyup.esc="cancel" placeholder="Notiz"></td>
                    <td><input type="text" v-model="vocabulary.category" @keyup.enter="save" @keyup.esc="cancel" placeholder="Kategorie"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

let vocabulary = {
    lang1: '',
    lang2: '',
    note: '',
    category: ''
}

export default {
    data: function() {
        return {
            adding: false,
            editing: false,
            deleting: false,
            filterOn: false,
            filter: { ...vocabulary },
            newVocabulary: { ...vocabulary }
        }
    },
    computed: {
        vocabularies() {
            if (this.filterOn)
                return this.activeDictionary.vocabularies.filter(voc => {
                    return (
                        voc.lang1.search(this.filter.lang1) !== -1 &&
                        voc.lang2.search(this.filter.lang2) !== -1 &&
                        voc.note.search(this.filter.note) !== -1 &&
                        voc.category.search(this.filter.category) !== -1
                    )
                })
            else return this.activeDictionary.vocabularies
        },

        ...mapGetters({
            activeDictionary: 'activeDictionary'
        })
    },
    methods: {
        addNewVocabulary() {
            this.addVocabulary(this.newVocabulary)
                .then(() => (this.newVocabulary = { ...vocabulary }))
                .catch(alert)
        },
        toggleFilter() {
            this.filterOn = !this.filterOn
        },
        toggleAdding() {
            this.adding = !this.adding
            this.editing = false
            this.deleting = false
        },
        toggleEditing() {
            this.adding = false
            this.editing = !this.editing
            this.deleting = false
        },
        toggleDeleting() {
            this.adding = false
            this.editing = false
            this.deleting = !this.deleting
        },
        save() {
            this.editing = false
            this.saveState()
        },
        cancel() {
            this.editing = false
            this.loadState()
        },

        ...mapActions({
            addVocabulary: 'addVocabulary',
            saveState: 'saveState',
            loadState: 'loadState'
        })
    },
    beforeMount() {
        // TODO: VUEX MIXTURE WITH RELOADING STATE
        this.loadState()
        Mousetrap.bind('n', () => this.toggleAdding())
        Mousetrap.bind('b', () => this.toggleEditing())
        Mousetrap.bind('f', () => this.toggleFilter())
    }
}
</script>

<style src="../assets/css/editor.css"></style>
