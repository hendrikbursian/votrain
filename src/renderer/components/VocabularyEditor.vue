<template>
    <div>
        <transition-group tag="div" class="menu-bar u-full-width" name="slideLeft-fade">
            <button :key="0" v-on:click="filterOn = !filterOn"><i class="material-icons">{{ filterOn ? 'close' : 'filter_list' }}</i> {{ filterOn ? 'Abbrechen' : 'Filtern' }}</button>
            <button :key="1" v-if="!adding" v-on:click="closeMenus();adding = true"><i class="material-icons">add</i> Neue Vokabel</button>
            <button :key="2" v-if="!editing" v-on:click="closeMenus();editing = true"><i class="material-icons">edit</i> Vokabeln bearbeiten</button>
            <button :key="3" v-if="!deleting" v-on:click="closeMenus();deleting = true"><i class="material-icons">delete</i> Vokabeln löschen</button>
            <button :key="4" v-if="adding || editing || deleting" v-on:click="cancel"><i class="material-icons">close</i> Abbrechen</button>
            <input :key="5" type="text" v-if="adding" v-model="newVocabulary.lang1" @keyup.esc="adding = false" @keyup.enter="save" :placeholder="activeDictionary.lang1">
            <input :key="6" type="text" v-if="adding" v-model="newVocabulary.lang2" @keyup.esc="adding = false" @keyup.enter="save" :placeholder="activeDictionary.lang2">
            <input :key="7" type="text" v-if="adding" v-model="newVocabulary.note" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Notiz">
            <input :key="8" type="text" v-if="adding" v-model="newVocabulary.category" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Kategorie">
            <button :key="9" v-if="adding || editing || deleting" v-on:click="save"><i class="material-icons">save</i> Speichern</button>
            <button :key="10" v-if="deleting" v-on:click="deleteAll"><i class="material-icons">{{ filterOn ? 'delete_sweep' : 'delete_forever' }}</i> {{ filterOn ? 'Gefilterte Löschen' : 'Alle löschen' }}</button>
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
                <tr v-if="!editing"
                    v-bind:class="{ delete: deleting }"
                    :key="index"
                    v-for="(vocabulary, index) in vocabularies"
                    v-on:click="deleting ? deleteVocabulary(vocabulary.id) : noop"
                >
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
        closeMenus() {
            this.adding = false
            this.editing = false
            this.deleting = false
            this.loadState() // If menu is not close because of canceling (keybind / click on button)
        },
        save() {
            if (this.adding)
                this.addVocabulary(this.newVocabulary)
                    .then(() => (this.newVocabulary = { ...vocabulary }))
                    .catch(alert)
            this.saveState()
            this.closeMenus()
        },
        cancel() {
            if (this.adding) this.newVocabulary = { ...vocabulary }
            this.closeMenus()
            this.loadState()
        },
        deleteAll() {
            this.vocabularies.forEach(voc => this.deleteVocabulary(voc.id))
        },

        ...mapActions({
            addVocabulary: 'addVocabulary',
            deleteVocabulary: 'deleteVocabulary',
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
        Mousetrap.bind('f', () => (this.filterOn = !this.filterOn))
    }
}
</script>

<style src="../assets/css/editor.css"></style>
