<template>
    <div>
        <transition-group tag="div" class="menu-bar u-full-width" name="slideLeft-fade">
            <button :key="1" v-if="!adding" @click="closeMenus();adding = true"><i class="material-icons">add</i> Neuer Karteikasten</button>
            <button :key="2" v-if="!editing" @click="closeMenus();editing = true"><i class="material-icons">edit</i> Karteikästen bearbeiten</button>
            <button :key="3" v-if="!deleting" @click="closeMenus();deleting = true"><i class="material-icons">delete</i> Karteikästen löschen</button>
            <button :key="4" v-if="adding || editing || deleting" @click="cancel"><i class="material-icons">close</i> Abbrechen</button>
            <input :key="5" type="number" min="0" v-if="adding" v-model="newBox.minAge" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Alter (Tage)">
            <div :key="6" v-if="adding" class="autocomplete__dropdown">
                <div class="autocomplete__item" @click="newBox.category = category" :key="index" v-for="(category, index) in autocompleteCategories(newBox.category)">{{ category }}</div>
            </div>
            <input :key="7" type="text" v-if="adding" v-model="newBox.category" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Kategorie">
            <input :key="8" type="number" min="0" v-if="adding" v-model="newBox.limit" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Anzahl">
            <input :key="9" type="number" min="0" max="100" v-if="adding" v-model="newBox.ratio" @keyup.esc="adding = false" @keyup.enter="save" placeholder="Fehlerrate (%)">
            <button :key="10" v-if="adding || editing || deleting" @click="save"><i class="material-icons">save</i> Speichern</button>
            <button :key="11" v-if="deleting" @click="deleteAll"><i class="material-icons">delete_forever</i> Alle löschen</button>
        </transition-group>
        <div class="display-area u-full-width box-editor">
            <div class="box"
                 v-bind:class="{ delete: deleting }"
                 :key="box.id" 
                 v-for="box in boxes"
                 @click="deleting ? deleteBox(box.id) : openBox(box.id)"
            >
                <div class="box__parameters">
                    <span class="box__parameter">{{ categoryName(box.categoryId) }}</span>
                    <span class="box__parameter" v-if="box.minAge > 0">{{ `ab ${box.minAge} ${box.minAge === 1 ? 'Tag': 'Tage'}`}}</span>
                    <span class="box__parameter" v-if="box.ratio > 0">{{ `Fehlerrate > ${box.ratio}%` }}</span>
                    <span class="box__parameter" v-if="box.limit > 0">{{ `max. ${box.limit} ${box.limit === 1 ? 'Vokabel': 'Vokabeln'}` }}</span>
                </div>
                <span class="box__vocabulary-count">{{ vocabulariesForBox(box.id).length }} {{ vocabulariesForBox(box.id).length === 1 ? 'Vokabel': 'Vokabeln' }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

const box = {
    category: '',
    minAge: '',
    ratio: '',
    limit: ''
}

export default {
    data: function() {
        return {
            newBox: { ...box },
            adding: false,
            editing: false,
            deleting: false
        }
    },
    computed: {
        ...mapState({
            boxes: 'boxes',
            categories: 'categories'
        }),
        ...mapGetters({
            activeDictionary: 'activeDictionary',
            vocabulariesForBox: 'vocabulariesForBox',
            categoryName: 'categoryName'
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
                this.addBox(this.newBox)
                    .then(() => (this.newBox = { ...box }))
                    .catch(alert)
            this.saveState()
            this.closeMenus()
        },
        cancel() {
            if (this.adding) this.newBox = { ...box }
            this.closeMenus()
            this.loadState()
        },
        openBox(boxId) {
            if (this.vocabulariesForBox(boxId).length === 0)
                return alert('Diese Box enthält keine Vokabeln zum lernen.')
            this.setActiveBoxId(boxId)
            this.saveState()
            this.$router.push('learning')
        },
        deleteAll() {
            this.boxes.forEach(box => this.deleteBox(box.id))
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

        ...mapActions({
            addBox: 'addBox',
            deleteBox: 'deleteBox',
            setActiveBoxId: 'setActiveBoxId',
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

<style>
.box-editor {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #eee;
    padding: 1em 2em;
    margin: 0 1em 1em 0;
    width: 12em;
    height: 8em;
    transition: background 0.33s ease;
}
.box:hover {
    background: #ddd;
    cursor: pointer;
}
.box__parameters {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}
.box__parameter {
    margin: 0 0.2em;
}
.box__vocabulary-count {
    color: #888;
}
</style>