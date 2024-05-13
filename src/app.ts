import * as PIXI from 'pixi.js';

let app: PIXI.Application<PIXI.Renderer>;

window.onload = async function () 
{
    // Create a PixiJS application.
    app = new PIXI.Application();

    // Intialize the application.
    await app.init({ background: '#1099bb', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    new PixiProject.Game;
}

export namespace PixiProject
{
    export class Game
    {
        private bunnyTexture!: PIXI.Texture;

        constructor()
        {
            this.loadAssets().then(() => this.createComponents());
        }

        private async loadAssets()
        {
            this.bunnyTexture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');
        }

        private createComponents()
        {
            const bunny = new PIXI.Sprite(this.bunnyTexture);
            app.stage.addChild(bunny);
            bunny.anchor.set(0.5);

            bunny.x = app.screen.width / 2;
            bunny.y = app.screen.height / 2;

            app.ticker.add((time) =>
            {
                bunny.rotation += 0.1 * time.deltaTime;
            });
        }
    }
}