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
        }

        private createComponents()
        {

        }
    }
}