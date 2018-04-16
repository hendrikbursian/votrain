<template>
    <div class="u-full-width">
        <h4>Shortcuts</h4>
        <div class="row">
            <div class="column">
                <h5>Navigation</h5>
                <ul class="shortcut-list">
                    <li><b>1</b> - Wörterbücher</li>
                    <li><b>2</b> - Kategorien</li>
                    <li><b>3</b> - Vokabeln</li>
                    <li><b>4</b> - Karteikästen</li>
                    <li><b>5</b> - Lernen</li>
                    <li><b>6</b> - Hilfe</li>
                </ul>
            </div>
            <div class="column">
                <h5>Wörterbücher</h5>
                <ul class="shortcut-list">
                    <li><b>N</b> - Neues Wörterbuch</li>
                    <li><b>B</b> - Wörterbücher bearbeiten</li>
                    <li><b>L</b> - Wörterbücher löschen</li>
                </ul>
            </div>
            <div class="column">
                <h5>Kategorien</h5>
                <ul class="shortcut-list">
                    <li><b>N</b> - Neue Kategorie</li>
                    <li><b>B</b> - Kategorien bearbeiten</li>
                </ul>
            </div>
            <div class="column">
                <h5>Vokabeln</h5>
                <ul class="shortcut-list">
                    <li><b>N</b> - Neue Vokabel</li>
                    <li><b>B</b> - Vokabeln bearbeiten</li>
                    <li><b>F</b> - Vokabeln filtern</li>
                    <li><b>L</b> - Vokabeln löschen</li>
                </ul>
            </div>       
        </div>
        <div class="row">
            <div class="column">
                <h5>Karteikästen</h5>
                <ul class="shortcut-list">
                    <li><b>N</b> - Neuer Karteikasten</li>
                    <li><b>B</b> - Karteikästen bearbeiten</li>
                    <li><b>L</b> - Karteikästen löschen</li>
                </ul>
            </div>       
            <div class="column">
                <h5>Lernen</h5>
                <ul class="shortcut-list">
                    <li><b>Leetaste</b> - Karte umdrehen / Neustart</li>
                    <li><b>R</b> - Vokabel als richtig markieren</li>
                    <li><b>F</b> - Vokabel als falsch markieren</li>
                </ul>
            </div>       
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState({}),
        ...mapGetters({})
    },
    methods: {
        ...mapActions({})
    },
    beforeMount() {
        Mousetrap.bind('b', () => this.toggleEditingDictionary())
    }
}
</script>
<style scoped>
h4,
h5 {
    margin-bottom: 1em;
}
.row {
    display: flex;
    flex-direction: row;
}
.column {
    display: flex;
    flex-direction: column;
    padding: 0 2em;
}
.shortcut-list {
    list-style-type: none;
}
</style>
