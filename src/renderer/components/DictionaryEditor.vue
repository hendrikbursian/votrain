<template>
    <div class="u-full-width">
        <transition-group tag="div" class="menu-bar u-full-width" name="slideLeft-fade">
            <button :key="1" v-on:click="$store.commit('toggleAddingDictionary')">
                <i class="material-icons">{{ addingDictionary ? 'close' : 'book' }}</i> {{ addingDictionary ? 'Abbrechen' : 'Wörterbuch hinzufügen' }}
            </button>
            <button :key="2" v-on:click="$store.commit('toggleEditingDictionary')">
                <i class="material-icons">{{ editingDictionary ? 'save' : 'edit' }}</i> {{ editingDictionary ? 'Speichern' : 'Wörterbücher bearbeiten' }}
            </button>
            <input :key="3" type="text" v-if="addingDictionary" v-model="newDictionary.lang1" @keyup.esc="$store.commit('toggleAddingDictionary')" @keyup.enter="addDictionary()" placeholder="Sprache 1">
            <input :key="4" type="text" v-if="addingDictionary" v-model="newDictionary.lang2" @keyup.esc="$store.commit('toggleAddingDictionary')" @keyup.enter="addDictionary()" placeholder="Sprache 2">
            <button :key="5" v-if="addingDictionary" v-on:click="addDictionary()">
                <i class="material-icons">save</i> Speichern
            </button>
        </transition-group>
        <table class="u-full-width">
            <thead>
                <tr>
                    <th style="width:25%">Sprache 1</th>
                    <th style="width:25%">Sprache 2</th>
                    <th style="width:25%">Vokabeln</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!editingDictionary" v-bind:class="{active: dictionary.id === activeDictionary}" v-on:click="$store.commit('setActiveDictionary', dictionary.id); $router.push('vocabularies')" :key="index" v-for="(dictionary, index) in dictionaries">
                    <td>{{ dictionary.lang1 }}</td>
                    <td>{{ dictionary.lang2 }}</td>
                    <td>{{ dictionary.vocabularies.length }}</td>
                </tr>
                <tr v-if="editingDictionary" v-bind:class="{active: dictionary.id === activeDictionary}" :key="index" v-for="(dictionary, index) in dictionaries">
                    <td><input type="text" v-model="dictionary.lang1" @keyup.enter="$store.commit('toggleEditingDictionary')" placeholder="Sprache 1" /></td>
                    <td><input type="text" v-model="dictionary.lang2" @keyup.enter="$store.commit('toggleEditingDictionary')" placeholder="Sprache 2" /></td>
                    <td>{{ dictionary.vocabularies.length }}</td>
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
            addingDictionary: 'addingDictionary',
            editingDictionary: 'editingDictionary',
            newDictionary: 'newDictionary',
            activeDictionary: 'activeDictionary'
        }),
        ...mapGetters({
            dictionaries: 'dictionaries'
        })
    },
    methods: {
        ...mapActions({
            addDictionary: 'addDictionary'
        })
    },
    beforeMount() {
        Mousetrap.bind('n', () => this.$store.commit('toggleAddingDictionary'))
        Mousetrap.bind('b', () => this.$store.commit('toggleEditingDictionary'))
    },
    beforeDestroy() {
        Mousetrap.unbind('n')
        Mousetrap.unbind('b')
    }
}
</script>

<style src="../assets/css/editor.css"></style>
