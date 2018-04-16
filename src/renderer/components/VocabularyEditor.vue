<template>
    <div>
        <transition-group tag="div" class="menu-bar u-full-width" name="slideLeft-fade">
            <button :key="0" @click="filterOn = !filterOn"><i class="material-icons">{{ filterOn ? 'close' : 'filter_list' }}</i> {{ filterOn ? 'Abbrechen' : 'Filtern' }}</button>
            <button :key="1" v-if="!adding" @click="closeMenus();adding = true"><i class="material-icons">add</i> Neue Vokabel</button>
            <button :key="2" v-if="!editing" @click="enableEditing()"><i class="material-icons">edit</i> Vokabeln bearbeiten</button>
            <button :key="3" v-if="!deleting" @click="closeMenus();deleting = true"><i class="material-icons">delete</i> Vokabeln löschen</button>
            <button :key="4" v-if="adding || editing || deleting" @click="cancel"><i class="material-icons">close</i> Abbrechen</button>
            <input :key="5" type="text" v-if="adding" v-model="newVocabulary.lang1" @keyup.esc="adding = false" @keyup.enter="save" :placeholder="activeDictionary.lang1">
            <input :key="6" type="text" v-if="adding" v-model="newVocabulary.lang2" @keyup.esc="adding = false" @keyup.enter="save" :placeholder="activeDictionary.lang2">
            <input :key="7" type="text" v-if="adding" v-model="newVocabulary.note" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Notiz">
            <div :key="9" v-if="adding" class="autocomplete__dropdown">
                <div class="autocomplete__item" @click="newVocabulary.category = category" :key="index" v-for="(category, index) in autocompleteCategories(newVocabulary.category)">{{ category }}</div>
            </div>
            <input :key="8" v-if="adding" type="text" v-model="newVocabulary.category" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Kategorie">
            <button :key="10" v-if="adding || editing || deleting" @click="save"><i class="material-icons">save</i> Speichern</button>
            <button :key="11" v-if="deleting" @click="deleteAll"><i class="material-icons">{{ filterOn ? 'delete_sweep' : 'delete_forever' }}</i> {{ filterOn ? 'Gefilterte Löschen' : 'Alle löschen' }}</button>
        </transition-group>
            
        <div class="display-area">
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
                        <div class="autocomplete__dropdown">
                            <div class="autocomplete__item" @click="filter.category = category" :key="index" v-for="(category, index) in autocompleteCategories(filter.category)">{{ category }}</div>
                        </div>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!editing"
                        v-bind:class="{ delete: deleting }"
                        :key="vocabulary.id"
                        v-for="vocabulary in vocabularies"
                        @click="deleting ? deleteVocabulary(vocabulary.id) : ()=>{}"
                    >
                        <td>{{ vocabulary.lang1 }}</td>
                        <td>{{ vocabulary.lang2 }}</td>
                        <td>{{ vocabulary.note }}</td>
                        <td>{{ categoryName(vocabulary.categoryId) }}</td>
                    </tr>
                    <tr v-if="editing" :key="vocabulary.id" v-for="vocabulary in vocabularies">
                        <td><input type="text" v-model="vocabulary.lang1" @keyup.enter="save" @keyup.esc="cancel" :placeholder="activeDictionary.lang1"></td>
                        <td><input type="text" v-model="vocabulary.lang2" @keyup.enter="save" @keyup.esc="cancel" :placeholder="activeDictionary.lang2"></td>
                        <td><input type="text" v-model="vocabulary.note" @keyup.enter="save" @keyup.esc="cancel" placeholder="Notiz"></td>
                        <td><input type="text" v-model="vocabulary.category" @keyup.enter="save" @keyup.esc="cancel" placeholder="Kategorie"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

const vocabulary = {
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
                        (voc.lang1 || '').search(this.filter.lang1) !== -1 &&
                        (voc.lang2 || '').search(this.filter.lang2) !== -1 &&
                        (voc.note || '').search(this.filter.note) !== -1 &&
                        (voc.category || '').search(this.filter.category) !== -1
                    )
                })
            else return this.activeDictionary.vocabularies
        },

        ...mapState({
            categories: 'categories'
        }),
        ...mapGetters({
            activeDictionary: 'activeDictionary',
            categoryId: 'categoryId',
            categoryName: 'categoryName'
        })
    },
    methods: {
        enableEditing() {
            this.closeMenus()
            this.activeDictionary.vocabularies.forEach(voc => {
                voc.category = this.categoryName(voc.categoryId)
                delete voc.categoryId
            })
            this.editing = true
        },
        autocompleteCategories(query) {
            if (query) {
                let re = new RegExp(query, 'i')
                return Object.values(this.categories).filter(
                    cat => cat.search(re) !== -1 && cat !== query
                )
            } else {
                return []
            }
        },
        closeMenus() {
            this.adding = false
            this.editing = false
            this.deleting = false
            this.loadState() // If menu is not close because of canceling (keybind / click on button)
        },
        save() {
            if (this.adding) {
                this.addVocabulary(this.newVocabulary)
                    .then(() => {
                        this.newVocabulary = { ...vocabulary }
                        this.saveState()
                        this.closeMenus()
                    })
                    .catch(alert)
            } else if (this.editing) {
                this.setVocabularies(this.activeDictionary.vocabularies)
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
            if (this.adding) this.newVocabulary = { ...vocabulary }
            this.closeMenus()
            this.loadState()
        },
        deleteAll() {
            this.vocabularies.forEach(voc => this.deleteVocabulary(voc.id))
        },

        ...mapActions({
            addVocabulary: 'addVocabulary',
            setVocabularies: 'setVocabularies',
            addCategory: 'addCategory',
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
            () => (this.editing ? this.cancel() : enableEditing())
        )
        Mousetrap.bind(
            'l',
            () => (this.deleting ? this.cancel() : (this.deleting = true))
        )
        Mousetrap.bind('f', () => (this.filterOn = !this.filterOn))
    }
}
</script>
