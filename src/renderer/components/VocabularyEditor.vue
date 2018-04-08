<template>
    <div class="u-full-width">
        <transition-group tag="div" class="menu-bar u-full-width" name="slideLeft-fade">
            <button :key="1" v-on:click="toggleFilter()">
                <i class="material-icons">{{ filter ? 'close' : 'filter_list' }}</i> {{ filter ? 'Abbrechen' : 'Filtern' }}
            </button>
            <button :key="2" v-on:click="toggleAddingVocabulary()">
                <i class="material-icons">{{ addingVocabulary ? 'close' : 'add' }}</i> {{ addingVocabulary ? 'Abbrechen' : 'Wort hinzufügen' }}
            </button>
            <button :key="3" v-if="!addingVocabulary" v-on:click="toggleEditingVocabulary()">
                <i class="material-icons">{{ editingVocabulary ? 'save' : 'edit' }}</i> {{ editingVocabulary ? 'Speichern' : 'Vokabeln bearbeiten' }}
            </button>
            <input :key="4" type="text" v-if="addingVocabulary" v-model="newVocabulary.lang1" @keyup.enter="addVocabulary()" :placeholder="activeDictionary.lang1">
            <input :key="5" type="text" v-if="addingVocabulary" v-model="newVocabulary.lang2" @keyup.enter="addVocabulary()" :placeholder="activeDictionary.lang2">
            <input :key="6" type="text" v-if="addingVocabulary" v-model="newVocabulary.note" @keyup.enter="addVocabulary()" placeholder="Notiz">
            <input :key="7" type="text" v-if="addingVocabulary" v-model="newVocabulary.category" @keyup.enter="addVocabulary()" placeholder="Kategorie">
            <button :key="8" v-if="addingVocabulary" v-on:click="addVocabulary()">
                <i class="material-icons">save</i> Speichern
            </button>
        </transition-group>
        <table class="u-full-width">
            <thead>
                <tr v-if="!filter">
                    <th style="width:25%">{{ activeDictionary.lang1 }}</th>
                    <th style="width:25%">{{ activeDictionary.lang2 }}</th>
                    <th style="width:25%">Notiz</th>
                    <th style="width:25%">Kategorie</th>
                </tr>
                <tr v-if="filter">
                    <th style="width:25%"><input type="text" v-model="query.lang1" :placeholder="activeDictionary.lang1"></th>
                    <th style="width:25%"><input type="text" v-model="query.lang2" :placeholder="activeDictionary.lang2"></th>
                    <th style="width:25%"><input type="text" v-model="query.note" placeholder="Notiz"></th>
                    <th style="width:25%"><input type="text" v-model="query.category" placeholder="Kategorie"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!editingVocabulary" :key="index" v-for="(vocabulary, index) in filteredVocabularies">
                    <td>{{ vocabulary.lang1 }}</td>
                    <td>{{ vocabulary.lang2 }}</td>
                    <td>{{ vocabulary.note }}</td>
                    <td>{{ vocabulary.category }}</td>
                </tr>
                <tr v-if="editingVocabulary" :key="index" v-for="(vocabulary, index) in filteredVocabularies">
                    <td><input type="text" v-model="vocabulary.lang1" :placeholder="activeDictionary.lang1"></td>
                    <td><input type="text" v-model="vocabulary.lang2" :placeholder="activeDictionary.lang2"></td>
                    <td><input type="text" v-model="vocabulary.note" placeholder="Notiz"></td>
                    <td><input type="text" v-model="vocabulary.category" placeholder="Kategorie"></td>
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
            filter: 'filter',
            query: 'query',
            addingVocabulary: 'addingVocabulary',
            editingVocabulary: 'editingVocabulary',
            newVocabulary: 'newVocabulary'
        }),
        ...mapGetters({
            activeDictionary: 'activeDictionary',
            filteredVocabularies: 'filteredVocabularies'
        })
    },
    methods: {
        ...mapActions({
            addVocabulary: 'addVocabulary',
            toggleAddingVocabulary: 'toggleAddingVocabulary',
            toggleEditingVocabulary: 'toggleEditingVocabulary',
            toggleFilter: 'toggleFilter'

        })
    },
    beforeMount() {
        Mousetrap.bind('n', () => this.toggleAddingVocabulary())
        Mousetrap.bind('b', () => this.toggleEditingVocabulary())
        Mousetrap.bind('f', () => this.toggleFilter())
    }
}
</script>

<style src="../assets/css/editor.css"></style>
