namespace TweetB {

    export class Preloader extends Phaser.State {

        preload() {

        }

        create() {
            this.game.state.start("Main");
        }
    }
}
