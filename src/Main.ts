/// <reference path="Prefabs/Sentence.ts" />
/// <reference path="TweetService.ts" />

namespace TweetB {

    /**
     * 
     */
    export class Main extends Phaser.State {
        
        tweets: any;
        y: number = 20;

        keyPressed: string = null;

        sentences: Prefabs.Sentence[];

        lastSpawn: number = 0;

        spawnInterval:number = 10;
        pauseSpawn = false;

        create() {
            let self = this;

            const textStyle = {
                fill: "#FFFFFF",
                font: "px437_ati_8x16regular",
                fontSize: "24px"
            };

            this.sentences = new Array<Prefabs.Sentence>();

            // this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

            // let jump: Phaser.Key = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            this.input.keyboard.onPressCallback = () => {
                self.keyPressed = self.input.keyboard.lastChar;
            };            

            // jump.onDown.add(() => {
            //     console.log("jump!");
            // });
            

        }

        /**
         * Update loop
         */
        update() {
            super.update();

            if(this.keyPressed) {
                console.log("shooting " + this.keyPressed);
                for(let s of this.sentences) {
                    s.shoot(this.keyPressed);
                }
            }

            this.keyPressed = null;
            if(this.time.totalElapsedSeconds() - this.lastSpawn > this.spawnInterval && !this.pauseSpawn) {
                this.updateTweets();
                this.pauseSpawn = true;
            }
        }

        updateKeyPress() {
            //if(this.input.keyboard.lastKey.keyCode === this.input.keyboard.lastChar)
            let self = this;
            self.keyPressed = self.input.keyboard.lastChar;
        }

        updateTweets() {
            let self = this;
            let keyword = window.location.hash.substr(1);
                
            if(typeof keyword != "string" || keyword.trim().length === 0) {
                return;
            }

            TweetService.getTweets(keyword).then(function fulfilled(result) {
                console.log(result);
                console.log(result.length);
                if(result.length > 0) {
                    let s = new Prefabs.Sentence(result[0].text);
                    self.sentences.push(s);
                    s.render(20, self.y, self.game);
                    self.y += s.textObject.height + 5;
                }
                this.lastSpawn = this.time.totalElapsedSeconds();
                this.pauseSpawn = false;
            }, function rejected(reason) {
                this.pauseSpawn = false;
                console.log(reason);
            });
            

        }


    }
}
