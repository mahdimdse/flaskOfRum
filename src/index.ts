import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
    width: 960, height: 550, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

let credits:number = 5000;
let betAmount:number = 1;

// create a new background
const background = PIXI.Sprite.from('assets/BGSlotMachine.png');
background.width = app.screen.width - 300;
background.height = app.screen.height;
background.x = (app.screen.width - background.width) / 2;
app.stage.addChild(background);

// create a new background slot machine
const barSlotMachine = PIXI.Sprite.from('assets/BarsSlotMachine.png');
barSlotMachine.width = app.screen.width - 300;
barSlotMachine.height = app.screen.height;
barSlotMachine.x = (app.screen.width - barSlotMachine.width) / 2;
app.stage.addChild(barSlotMachine);

app.loader
    .add('assets/Symbol10.png', 'assets/Symbol10.png')
    .add('assets/SymbolA.png', 'assets/SymbolA.png')
    .add('assets/SymbolCaptain.png', 'assets/SymbolCaptain.png')
    .add('assets/SymbolJ.png', 'assets/SymbolJ.png')
    .add('assets/SymbolK.png', 'assets/SymbolK.png')
    .add('assets/SymbolQ.png', 'assets/SymbolQ.png')
    .add('assets/SymbolParrot.png', 'assets/SymbolParrot.png')
    .add('assets/SymbolRum.png', 'assets/SymbolRum.png')
    .add('assets/SymbolSkull.png', 'assets/SymbolSkull.png')
    .add('assets/SymbolTreasure.png', 'assets/SymbolTreasure.png')
    .load(onAssetsLoaded);

const REEL_WIDTH = (app.screen.width - 300)/5;
const SYMBOL_SIZE = (app.screen.width - 300)/5;

function onAssetsLoaded() {
    // Create different slot symbols.
    const slotTextures = [
        PIXI.Texture.from('assets/Symbol10.png'),
        PIXI.Texture.from('assets/SymbolA.png'),
        // PIXI.Texture.from('assets/SymbolCaptain.png'),
        // PIXI.Texture.from('assets/SymbolJ.png'),
        // PIXI.Texture.from('assets/SymbolK.png'),
        // PIXI.Texture.from('assets/SymbolQ.png'),
        // PIXI.Texture.from('assets/SymbolParrot.png'),
        // // PIXI.Texture.from('assets/SymbolRum.png'),
        // PIXI.Texture.from('assets/SymbolSkull.png'),
        // PIXI.Texture.from('assets/SymbolTreasure.png')
    ];

    // const names = ["Symbol10", "SymbolA", "SymbolCaptain", "SymbolJ", "SymbolK", "SymbolQ", "SymbolParrot", "SymbolSkull", "SymbolTreasure"];

    // Build the reels
    const reels:any = [];
    const reelContainer = new PIXI.Container();
    for (let i = 0; i < 5; i++) {
        const rc = new PIXI.Container();
        rc.x = (i * REEL_WIDTH) - 150;
        reelContainer.addChild(rc);

        const reel:any = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.filters.BlurFilter(),
        };
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        // Build the symbols
        for (let j = 0; j < 4; j++) {
            let randomPick = Math.floor(Math.random() * slotTextures.length);
            const symbol:any = new PIXI.Sprite(slotTextures[randomPick]);
            // Scale the symbol to fit symbol area.
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol);
            rc.addChild(symbol);
            // console.log(i, ") ", j, ") ",symbol.texture.textureCacheIds[0])
        }
        
        reels.push(reel);
    }
    console.log(reels)
    
    app.stage.addChild(reelContainer);

    // Build top & bottom covers and position reelContainer
    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
    reelContainer.y = margin;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
    const top = new PIXI.Graphics();
    top.beginFill(0, 1);
    top.drawRect(0, 0, app.screen.width, margin);
    
    const bottom:any = new PIXI.Graphics();
    bottom.beginFill(0, 1);
    bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);

    // create a background header
    const headerBg = PIXI.Sprite.from('assets/BGTopBar.png');
    headerBg.height = 100; 
    headerBg.x = 0;
    headerBg.y = 0;
    top.addChild(headerBg);


    // Add header logo
    const headerLogo = PIXI.Sprite.from('assets/Logo.png');
    headerLogo.height = 90; 
    headerLogo.width = 400; 
    headerLogo.x = Math.round((top.width - headerLogo.width) / 2);
    headerLogo.y = Math.round((90 - headerLogo.height) / 2);
    top.addChild(headerLogo);

    // Add Credit showcase
    const crediIcon = PIXI.Sprite.from('assets/Coins.png');
    crediIcon.height = 50; 
    crediIcon.width = 50; 
    crediIcon.x = app.screen.width - 10 - crediIcon.width;
    crediIcon.y = Math.round((margin - crediIcon.height) / 2);
    top.addChild(crediIcon);

    // Credit amount
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 15,
        // fontWeight: 'bold',
        fill: "#fff",
        dropShadow: false,
    });
    let creditLeftText = new PIXI.Text(credits.toString(), style);
    creditLeftText.x = app.screen.width - 10 - crediIcon.width  - creditLeftText.width;
    creditLeftText.y = Math.round((margin - creditLeftText.height) / 2);
    top.addChild(creditLeftText);

    app.stage.addChild(top);
    app.stage.addChild(bottom);

    // create a background footer
    const footerBg = PIXI.Sprite.from('assets/BGBottomBar.png');
    footerBg.height = 100; 
    footerBg.x = 0;
    footerBg.y = app.screen.height - footerBg.height;
    bottom.addChild(footerBg);

    // create a start button
    let startBtn:any = new PIXI.Graphics();
    startBtn.beginFill(0, 1);
    startBtn = PIXI.Sprite.from('assets/ButtonStartActive.png');
    startBtn.height = 70; 
    startBtn.width = 130;
    startBtn.x = app.screen.width - 10 - startBtn.width;
    startBtn.y = app.screen.height - 5 - startBtn.height;
    bottom.addChild(startBtn);

    // Max Bet Button
    let maxBetBtn:any = new PIXI.Graphics();
    maxBetBtn.beginFill(0, 1);
    maxBetBtn = PIXI.Sprite.from('assets/ButtonMax.png');
    maxBetBtn.height = 35; 
    maxBetBtn.width = 80;
    maxBetBtn.x = app.screen.width - 300 - maxBetBtn.width;
    maxBetBtn.y = app.screen.height - 20 - maxBetBtn.height;
    bottom.addChild(maxBetBtn);

    // Bet increase button
    let incBetBtn:any = new PIXI.Graphics();
    incBetBtn.beginFill(0, 1);
    incBetBtn = PIXI.Sprite.from('assets/ButtonPlus.png');
    incBetBtn.height = 35; 
    incBetBtn.width = 35;
    incBetBtn.x = app.screen.width - 300 - incBetBtn.width - maxBetBtn.width;
    incBetBtn.y = app.screen.height - 20 - incBetBtn.height;
    bottom.addChild(incBetBtn);  
    
    // Bet decrease button
    let decBetBtn:any = new PIXI.Graphics();
    decBetBtn.beginFill(0, 1);
    decBetBtn = PIXI.Sprite.from('assets/ButtonMinus.png');
    decBetBtn.height = 35; 
    decBetBtn.width = 35;
    decBetBtn.x = app.screen.width - 300 - decBetBtn.width - maxBetBtn.width - incBetBtn.width;
    decBetBtn.y = app.screen.height - 20 - decBetBtn.height;
    bottom.addChild(decBetBtn); 

    // Bet amount show
    const style2 = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 25,
        fontWeight: 'bold',
        fill: "#fff",
        dropShadow: false,
    });
    let betAmountShow = new PIXI.Text(betAmount.toString(), style2);
    betAmountShow.x = app.screen.width - 300 - decBetBtn.width - maxBetBtn.width - decBetBtn.width - incBetBtn.width - betAmountShow.width;
    betAmountShow.y = app.screen.height - 25 - betAmountShow.height;
    bottom.addChild(betAmountShow);

    // create a bet written text
    const betText = PIXI.Sprite.from('assets/TextBet.png');
    betText.height = 35; 
    betText.width = 60;
    betText.x = app.screen.width - 300 - decBetBtn.width - maxBetBtn.width - decBetBtn.width - incBetBtn.width - betAmountShow.width - betText.width - 50;
    betText.y = app.screen.height - 20 - betText.height;
    bottom.addChild(betText);
   

    // Set the interactivity.
    startBtn.interactive = true;
    startBtn.buttonMode = true;
    startBtn.addListener('pointerdown', () => {
        startPlay();
    });

    // Set bet max
    maxBetBtn.interactive = true;
    maxBetBtn.buttonMode = true;
    maxBetBtn.addListener('pointerdown', () => {
        if(credits > betAmount){
            betAmount = credits;
            updateBetAmount(betAmount);
        }
    });

    // Set bet max
    incBetBtn.interactive = true;
    incBetBtn.buttonMode = true;
    incBetBtn.addListener('pointerdown', () => {
        if(credits > betAmount){
            betAmount++;
            updateBetAmount(betAmount);
        }
    });

    // Set bet max
    decBetBtn.interactive = true;
    decBetBtn.buttonMode = true;
    decBetBtn.addListener('pointerdown', () => {
        if(betAmount > 1 && betAmount <= credits){
            betAmount--;
            updateBetAmount(betAmount);
        }
    });

    let running = false;

    // Function to start playing.
    function startPlay() {
        if (running) {
            startBtn = PIXI.Sprite.from('assets/ButtonStart.png');
            return;
        }
        running = true;

        credits -= betAmount;
        updateCredit(credits);

        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;
            tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
        }
    }

    // Reels done handler.
    function reelsComplete() {
        running = false;
        if(credits <= 0){
            bottom.removeChild(startBtn);
            startBtn = PIXI.Sprite.from('assets/ButtonStart.png');
            startBtn.height = 70; 
            startBtn.width = 130;
            startBtn.x = app.screen.width - 10 - startBtn.width;
            startBtn.y = app.screen.height - 5 - startBtn.height;
            bottom.addChild(startBtn);
        }
    }

    function updateBetAmount(amount:number){
        bottom.removeChild(betAmountShow);
        betAmountShow = new PIXI.Text(amount.toString(), style2);
        betAmountShow.x = app.screen.width - 300 - decBetBtn.width - maxBetBtn.width - decBetBtn.width - incBetBtn.width - betAmountShow.width;
        betAmountShow.y = app.screen.height - 25 - betAmountShow.height;
        bottom.addChild(betAmountShow);
    }

    function updateCredit(amount:number){
        top.removeChild(creditLeftText);
        creditLeftText = new PIXI.Text(amount.toString(), style);
        creditLeftText.x = app.screen.width - 10 - crediIcon.width  - creditLeftText.width;
        creditLeftText.y = Math.round((margin - creditLeftText.height) / 2);
        top.addChild(creditLeftText);
    }

    // Listen for animate update.
    app.ticker.add((delta) => {
    // Update the slots.
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            // Update blur filter y amount based on speed.
            // This would be better if calculated with time in mind also. Now blur depends on frame rate.
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            // Update symbol positions on reel.
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;
                s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    // Detect going over and swap a texture.
                    // This should in proper product be determined from some logical reel.
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                    // console.log(i, j, s)
                    
                }
            }
        }
    });
}

// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
const tweening:any = [];
function tweenTo(object: any, property:any, target:any, time:any, easing:any, onchange:any, oncomplete:any) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    console.log(tween)
    return tween;
}
// Listen for animate update.
app.ticker.add((delta) => {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            remove.push(t);
        }
    }
    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});

// Basic lerp funtion.
function lerp(a1:any, a2:any, t:any) {
    return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
function backout(amount:number) {
    return (t:any) => (--t * t * ((amount + 1) * t + amount) + 1);
}