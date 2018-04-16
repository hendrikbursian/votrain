<template>
    <div>
        <transition-group tag="div" class="menu-bar u-full-width" name="slideLeft-fade">
            <button :key="0" v-if="!adding" @click="closeMenus(); adding = true"><i class="material-icons">book</i> Neue Kategorie</button>
            <button :key="1" v-if="!editing" @click="closeMenus(); editing = true"><i class="material-icons">edit</i> Kategorien bearbeiten</button>
            <button :key="2" v-if="!deleting" @click="closeMenus(); deleting = true"><i class="material-icons">delete</i> Kategorien löschen</button>
            <button :key="3" v-if="adding || editing || deleting" @click="cancel"><i class="material-icons">close</i> Abbrechen</button>
            <input :key="4" type="text" v-if="adding" v-model="newCategory" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Name">
            <button :key="6" v-if="adding || editing || deleting" @click="save"><i class="material-icons">save</i> Speichern</button>
            <button :key="7" v-if="deleting" @click="deleteAll"><i class="material-icons">delete_forever</i> Alle löschen</button>
        </transition-group>
        <div class="display-area">
            <table class="u-full-width">
                <thead>
                    <tr>
                        <th style="width:33%">Name</th>
                        <th style="width:33%">Vokabeln (aktiv)</th>
                        <th style="width:33%">Vokabeln (gesamt)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!editing" 
                        v-bind:class="{delete: deleting}" 
                        :key="id"
                        v-for="(categoryName, id) in categories" 
                        @click="deleting ? deleteCat(id) : () =>{}"
                    >
                        <td>{{ categoryName }}</td>
                        <td>{{ activeVocabularyCountInCategory(id) }}</td>
                        <td>{{ vocabularyCountInCategory(id) }}</td>
                    </tr>
                    <tr v-if="editing" :key="id" v-for="(categoryName, id) in categories">
                        <td><input type="text" v-model="categories[id]" @keyup.enter="save" @keyup.esc="cancel" placeholder="Name" /></td>
                        <td>{{ activeVocabularyCountInCategory(id) }}</td>
                        <td>{{ vocabularyCountInCategory(id) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    data: function() {
        return {
            newCategory: '',
            adding: false,
            editing: false,
            deleting: false
        }
    },
    computed: {
        ...mapState({
            categories: 'categories'
        }),

        ...mapGetters({
            activeDictionary: 'activeDictionary',
            vocabularyCountInCategory: 'vocabularyCountInCategory'
        })
    },
    methods: {
        // TODO: Methoden umgestalten - [name]: => {}
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
                this.addCategory(this.newCategory)
                    .then(() => {
                        this.newCategory = ''
                        this.saveState()
                        this.closeMenus()
                    })
                    .catch(alert)
            } else if (this.editing) {
                this.setCategories(this.categories)
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
            if (this.adding) this.newCategory = ''
            this.closeMenus()
            this.loadState()
        },
        deleteCat(categoryId) {
            this.deleteCategory(categoryId).catch(alert)
        },
        deleteAll() {
            let promises = []
            Object.keys(this.categories).forEach(categoryId =>
                promises.push(this.deleteCategory(categoryId))
            )
            Promise.all(promises).catch(alert)
        },
        activeVocabularyCountInCategory(categoryId) {
            return this.activeDictionary.vocabularies.filter(
                voc => voc.categoryId === categoryId
            ).length
        },

        ...mapActions({
            addCategory: 'addCategory',
            setCategories: 'setCategories',
            deleteCategory: 'deleteCategory',
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
