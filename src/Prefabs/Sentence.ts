namespace TweetB.Prefabs {

    export class Sentence {

        private _sentence: string;
        private _currentSentence: string;
        private _textStyle: Phaser.PhaserTextStyle;
        private _textObject: Phaser.Text;
        private _currentLetter: number = 0;

        constructor(line: string) {
            this._sentence = line.toLowerCase().replace(/[^a-z\s]/g, "");
            this._currentSentence = this._sentence;

            this._textStyle = {
                fill: "#FFFFFF",
                font: "px437_ati_8x16regular",
                fontSize: 24
            };

        }

        public shoot(key: string): void {
            if(key === this.nextLetter) {
                this._currentSentence = " ".repeat(this._currentLetter) + this._currentSentence.substr(this._currentLetter + 1);

                this._currentLetter ++;

                console.log(this.nextLetter);

                this._textObject.text = this._currentSentence;
            }
        }

        get nextLetter(): string {
            return this._currentSentence.substr(this._currentLetter, 1);
        }



        render(x: number, y: number, game: Phaser.Game) {
            this._textObject = game.add.text(x, y, this._sentence, this._textStyle);
        }

        get textObject(): Phaser.Text {
            return this._textObject;
        }
    }
}