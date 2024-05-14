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
        private background!: PIXI.Sprite;
        private fishContainer!: PIXI.Container;
        private fishes: PIXI.Sprite[] = [];
        private waterOverlay!: PIXI.TilingSprite;
        private waterDisplacementFilter!: PIXI.DisplacementFilter

        constructor()
        {
            this.loadAssets().then(() => this.onAssetsLoaded());
        }

        private onAssetsLoaded()
        {
            this.createComponents();
            this.createAnimationComponents();
            onresize = (event) => this.handleResize();
        }

        private async loadAssets()
        {
            const assets = [
                { alias: 'background', src: 'https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg' },
                { alias: 'fish1', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish1.png' },
                { alias: 'fish2', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish2.png' },
                { alias: 'fish3', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish3.png' },
                { alias: 'fish4', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish4.png' },
                { alias: 'fish5', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish5.png' },
                { alias: 'overlay', src: 'https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png' },
                { alias: 'displacement', src: 'https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png' },
            ];
            await PIXI.Assets.load(assets);
        }

        private createComponents()
        {
            this.createBackground();
            this.createFishContainer();
            this.createFish();
            this.createWaterOverlay();
            this.addWaterDisplacement();
        }

        private createBackground()
        {
            if (this.background == null)
            {
                this.background = PIXI.Sprite.from('background');
                app.stage.addChild(this.background);
            }
            this.background.anchor.set(0.5);
            if (app.screen.width > app.screen.height)
            {
                this.background.width = app.screen.width * 1.2;
                this.background.scale.y = this.background.scale.x;
            }
            else
            {
                this.background.height = app.screen.height * 1.2;
                this.background.scale.x = this.background.scale.y;
            }
            this.background.x = app.screen.width / 2;
            this.background.y = app.screen.height / 2;
        }

        private createFishContainer()
        {
            this.fishContainer = new PIXI.Container();
            app.stage.addChild(this.fishContainer);
        }

        private createFish()
        {
            this.fishes = [];
            const fishCount = 20;
            const fishAssets = ['fish1', 'fish2', 'fish3', 'fish4', 'fish5'];
            for (let i = 0; i < fishCount; i++)
            {
                const fishAsset = fishAssets[i % fishAssets.length];
                const fish = PIXI.Sprite.from(fishAsset);

                fish.anchor.set(0.5);

                fish.direction = Math.random() * Math.PI * 2;
                fish.speed = 2 + Math.random() * 2;
                fish.turnSpeed = Math.random() - 0.8;

                fish.x = Math.random() * app.screen.width;
                fish.y = Math.random() * app.screen.height;
                fish.scale.set(0.5 + Math.random() * 0.2);

                this.fishContainer.addChild(fish);
                this.fishes.push(fish);
            }
        }

        private createWaterOverlay()
        {
            if (this.waterOverlay == null)
            {
                const texture = PIXI.Texture.from('overlay');

                this.waterOverlay = new PIXI.TilingSprite({
                    texture,
                    width: app.screen.width,
                    height: app.screen.height,
                });
                app.stage.addChild(this.waterOverlay);
            }
            else
            {
                this.waterOverlay.width = app.screen.width;
                this.waterOverlay.height = app.screen.height;
            }
        }

        private createAnimationComponents()
        {
            app.ticker.add((time) => 
            {
                this.animateFishes(time);
                this.animateWaterOverlay(time);
            });
        }

        private animateFishes(time: PIXI.Ticker)
        {
            const delta = time.deltaTime;

            const stagePadding = 100;
            const boundWidth = app.screen.width + stagePadding * 2;
            const boundHeight = app.screen.height + stagePadding * 2;
            this.fishes.forEach((fish) =>
            {
                fish.direction += fish.turnSpeed * 0.01;
                fish.x += Math.sin(fish.direction) * fish.speed;
                fish.y += Math.cos(fish.direction) * fish.speed;
                fish.rotation = -fish.direction - Math.PI / 2;

                if (fish.x < -stagePadding)
                {
                    fish.x += boundWidth;
                }
                if (fish.x > app.screen.width + stagePadding)
                {
                    fish.x -= boundWidth;
                }
                if (fish.y < -stagePadding)
                {
                    fish.y += boundHeight;
                }
                if (fish.y > app.screen.height + stagePadding)
                {
                    fish.y -= boundHeight;
                }
            });
        }

        private animateWaterOverlay(time: PIXI.Ticker)
        {
            const delta = time.deltaTime;

            // Animate the overlay.
            this.waterOverlay.tilePosition.x -= delta;
            this.waterOverlay.tilePosition.y -= delta;
        }

        private addWaterDisplacement()
        {
            // Create a sprite from the preloaded displacement asset.
            const sprite = PIXI.Sprite.from('displacement');

            // Set the base texture wrap mode to repeat to allow the texture UVs to be tiled and repeated.
            sprite.texture.baseTexture.wrapMode = 'repeat';

            // Create a displacement filter using the sprite texture.
            this.waterDisplacementFilter = new PIXI.DisplacementFilter({
                sprite,
                scale: 50,
                width: app.screen.width,
                height: app.screen.height,
            });

            // Add the filter to the stage.
            app.stage.filters = [this.waterDisplacementFilter];
        }

        private handleResize()
        {
            this.createBackground();
            this.createWaterOverlay();
        }
    }
}