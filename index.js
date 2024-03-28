class WordleCzechVersion {
    MAXIMUM_ATTEMPTS = 6

    words = []
    selected_word = ''
    template = []
    current_attempt = 0
    current_word = []

    init() {
        new Promise((resolve, reject) => {
            fetch('words.json')
                .then(response => response.json())
                .then(data => {
                    this.words = data

                    resolve()
                })
        }).then(() => {
            this.selectWord()
            console.log("Selected word: ", this.selected_word)
        }).then(() => {
            this.render()
        }).then(() => {
            this.listen()
        })
    }

    selectWord() {
        this.selected_word = this.words[Math.floor(Math.random() * this.words.length)]
    }

    render() {
        for (let i = 0; i < this.MAXIMUM_ATTEMPTS; i++) {
            let row = []

            for (let j = 0; j < this.selected_word.length; j++) {
                row.push({
                    letter: this.selected_word[j],
                    guessed: undefined
                })
            }

            this.template.push(row)
        }

        const table = document.getElementById('play-table')

        this.template.forEach((row, i) => {
            const tr = document.createElement('tr')

            row.forEach((cell, j) => {
                const td = document.createElement('td')

                td.innerText = ' '
                tr.appendChild(td)
            })

            table.appendChild(tr)
        })
    }

    listen() {
        const maximumWordLength = this.selected_word.length

        document.addEventListener('keydown', (event) => {
            if (event.key.length === 1) {
                if (this.current_word.length >= maximumWordLength) {
                    return
                }

                this.current_word.push(event.key)


            }

            if (event.key === 'Backspace') {
                this.current_word.pop()
            }

            if (event.key === 'Enter') {
                this.checkWord()
                return
            }

            this.updateRow()

            console.log(this.current_word)
        })
    }

    updateRow() {
        const table = document.getElementById('play-table')

        this.template[this.current_attempt].forEach((cell, i) => {
            const td = table.rows[this.current_attempt].cells[i]

            if (this.current_word[i]) {
                td.innerText = this.current_word[i]
            } else {
                td.innerText = ' '
            }
        })
    }

    async checkWord() {
        if (this.current_word.length !== this.selected_word.length) {
            alert('You must enter a word with the same length as the selected word')
            return
        }

        if (this.current_word.join('') === this.selected_word) {
            await this.animateRow()

            setTimeout(() => {
                alert('You won!')
                location.reload()
            }, 500 + this.selected_word.length * 150)


        }

        await this.animateRow()
        this.current_attempt++
        this.current_word = []

        if (this.current_attempt === this.MAXIMUM_ATTEMPTS) {
            alert('You lost!')
        }
    }

    animateRow() {
        const table = document.getElementById('play-table')
        let current_attempt = this.current_attempt
        let current_word = this.current_word
       // based on the letters give the "td" element a class: "correct" or "incorrect" or "unanswered
        this.template[current_attempt].forEach((cell, i) => {
            let timeout = 150 * i;
            let cellLetter = cell.letter

            setTimeout(() => {
                const td = table.rows[current_attempt].cells[i]
                console.log(current_word[i], cellLetter)
                if (current_word[i] === cellLetter) {
                    td.classList.add('correct')
                } else if (this.selected_word.includes(current_word[i])) {
                    td.classList.add('unanswered')
                } else {
                    td.classList.add('incorrect')
                }
            }, timeout )
        })
    }
}



(() => {
    (new WordleCzechVersion()).init()
})()




