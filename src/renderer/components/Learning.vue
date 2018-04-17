<template>
    <div class="display-area learning">
        <div v-if="!learning">
            <p>Welche Sprache möchtest du lernen?</p>
            <div style="text-align: center">
                <button @click="learnLang1 = true; learning = true">{{activeDictionary.lang1}}</button>
                <button @click="learnLang1 = false; learning = true">{{activeDictionary.lang2}}</button>
            </div>
        </div>
        <div v-if="learning" class="stack">
            <div class="card"
                v-bind:style="{transform: 'scale(' + (1.00 - ((stack.length-index) * 0.02)) + ')'}"
                :key="index"
                v-for="(index) in stack.length"
            ></div>
            <div v-if="activeVocabulary" class="card">
                <p class="word">{{ learnLang1 ? (unseen ? activeVocabulary.lang1 : activeVocabulary.lang2) : (unseen ? activeVocabulary.lang2 : activeVocabulary.lang1)}}</p>
                <div class="card__details" v-if="!unseen">
                    <em class="card__note" v-if="activeVocabulary.note">{{ activeVocabulary.note }}</em>
                    <div class="row">
                        <button @click="confirm(false)">Falsch</button>
                        <button @click="confirm(true)">Richtig</button>
                    </div>
                </div>
            </div>
            <div v-if="!activeVocabulary" class="card">
                <p class="word">Statistik</p>
                <div class="card__details" >
                    <em class="card__note">Du hast {{ counts.correct }} / {{ counts.total }} richtig</em>
                    <div class="row">
                        <button v-if="vocabulariesForBox(activeBox.id).length > 0" @click="init">Nochmal</button>
                        <p v-if="!vocabulariesForBox(activeBox.id).length > 0">
                            Glückwunsch!<br>
                            Es sind keine weiteren Vokabeln in diesem Kasten :)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

const defaultValues = {
    activeVocabulary: {},
    counts: {
        total: 0,
        correct: 0
    },
    learning: false,
    learnLang1: false,
    unseen: true,
    stack: []
}
export default {
    data: function() {
        return { ...defaultValues }
    },
    computed: {
        ...mapGetters({
            activeBox: 'activeBox',
            vocabulariesForBox: 'vocabulariesForBox',
            activeDictionary: 'activeDictionary'
        })
    },
    methods: {
        turnCard() {
            this.unseen = !this.unseen
        },
        confirm(isCorrect) {
            this.counts.total++
            if (isCorrect) this.counts.correct++
            this.seenVocabulary({
                vocabularyId: this.activeVocabulary.id,
                isCorrect: isCorrect
            }).then(() => {
                this.saveState()
                this.unseen = true
                this.activeVocabulary = this.stack.pop()
            })
        },
        init() {
            this.counts.total = 0
            this.counts.correct = 0
            this.unseen = true

            this.stack = shuffle(
                this.vocabulariesForBox(this.activeBox.id)
                    .sort(
                        (a, b) =>
                            Date.parse(b.lastSeen) - Date.parse(a.lastSeen)
                    )
                    .slice(-this.activeBox.limit)
            )
            this.activeVocabulary = this.stack.pop()
        },

        ...mapActions({
            saveState: 'saveState',
            seenVocabulary: 'seenVocabulary'
        })
    },
    beforeMount() {
        Mousetrap.bind(
            'space',
            () =>
                this.learning && this.activeVocabulary
                    ? this.turnCard()
                    : this.vocabulariesForBox(this.activeBox.id).length > 0
                      ? this.init()
                      : () => {}
        )
        Mousetrap.bind(
            'r',
            () =>
                this.activeVocabulary && !this.unseen
                    ? this.confirm(true)
                    : () => {}
        )
        Mousetrap.bind(
            'f',
            () =>
                this.activeVocabulary && !this.unseen
                    ? this.confirm(false)
                    : () => {}
        )
    },
    created() {
        this.init()
    }
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}
</script>

<style scoped>
.learning {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.row {
    display: flex;
    flex-direction: row;
    margin-top: 0.3em;
}

.stack {
    margin: 20px auto;
    width: 400px;
    padding: 0;
    position: relative;
    max-width: 100%;
}
.stack .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 28em;
    height: 18em;
    position: absolute;
    top: 0;
    left: 0;
    background: #eee;
    transition: all 0.33s ease;
    backface-visibility: hidden;
    transform-origin: 50% -50%;
    box-shadow: 0px -1px 3px -2px #333;
}

.card p {
    margin: 0;
    text-align: center;
}
.card p.word {
    font-size: 3em;
}
.card__details {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.card__note {
    padding: 1em;
}

button {
    margin: 0 2em;
    padding: 0 2em;
}
</style>
