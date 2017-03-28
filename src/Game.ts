namespace TweetB {

    export class Game extends Phaser.Game {

        constructor() {
            super(800, 600, Phaser.AUTO);

            this.state.add("Boot", TweetB.Boot);
            this.state.add("Preloader", TweetB.Preloader);
            this.state.add("Main", TweetB.Main);

            this.state.start("Boot");
        }
    }
}
