// Swipe Brick Breaker - Game Engine

// 1. Audio Synthesizer Class using Web Audio API
class AudioSynth {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.masterGain = null;
        this.currentVolume = 0.5; // 0.0 ~ 1.0
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            // Create master gain node and connect to destination
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
        }
        // Resume if suspended (browser security policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMute(mute) {
        this.isMuted = mute;
        if (!mute && !this.ctx) {
            this.init();
        }
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(mute ? 0 : this.currentVolume, this.ctx.currentTime);
        }
    }

    setVolume(vol) {
        // vol: 0.0 ~ 1.0
        this.currentVolume = Math.max(0, Math.min(1, vol));
        if (!this.isMuted && this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
        }
    }

    playShoot() {
        if (this.isMuted || !this.ctx) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playHit(combo) {
        if (this.isMuted || !this.ctx) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        // Pitch increases with combo to sound satisfying!
        const baseFreq = 220 + combo * 15;
        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        osc.frequency.setValueAtTime(baseFreq * 2, this.ctx.currentTime + 0.02);
        
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.06);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
    }

    playBreak() {
        if (this.isMuted || !this.ctx) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    playCollect() {
        if (this.isMuted || !this.ctx) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.04);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.04 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.12);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + idx * 0.04);
            osc.stop(now + idx * 0.04 + 0.15);
        });
    }

    playLaser() {
        if (this.isMuted || !this.ctx) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }

    playExplosion() {
        if (this.isMuted || !this.ctx) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(90, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(20, this.ctx.currentTime + 0.35);
        
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
        
        // Lowpass filter for deep boom sound
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, this.ctx.currentTime);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
    }

    playGachaRoll() {
        if (this.isMuted || !this.ctx) return;
        this.init();
        const now = this.ctx.currentTime;
        for (let i = 0; i < 15; i++) {
            const time = now + i * 0.09;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300 + i * 40, time);
            
            gain.gain.setValueAtTime(0.04, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(time);
            osc.stop(time + 0.06);
        }
    }

    playGachaReveal() {
        if (this.isMuted || !this.ctx) return;
        this.init();
        const now = this.ctx.currentTime;
        const chords = [261.63, 329.63, 392.00, 493.88, 523.25]; // C4, E4, G4, B4, C5 (Cmaj7 chord)
        
        chords.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.05 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.5);
        });
    }

    playGameOver() {
        if (this.isMuted || !this.ctx) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [392.00, 349.23, 311.13, 261.63]; // G4, F4, Eb4, C4
        
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.15);
            
            gain.gain.setValueAtTime(0.08, now + idx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.25);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + idx * 0.15);
            osc.stop(now + idx * 0.15 + 0.3);
        });
    }

    playThud() {
        if (this.isMuted || !this.ctx) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }
}

// 2. Constants and Game Configurations
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400; 
const GRID_COLS = 6;
const GRID_ROWS = 7; 
const COL_WIDTH = CANVAS_WIDTH / GRID_COLS;
const ROW_HEIGHT = 42;
const TOP_MARGIN = 50;
const FLOOR_Y = 344; // Exactly TOP_MARGIN + GRID_ROWS * ROW_HEIGHT (50 + 7 * 42)
const BALL_BASE_SPEED = 6.5;

// Gacha Probability Roster - All ball radii set to 7 (same as basic ball)
const GACHA_BALLS = [
    { type: 'basic', name: '기본 공', rarity: 'COMMON', prob: 0.30, desc: '하얀 탁구공 모양. 데미지 1.', color: '#ffffff', radius: 7 },
    { type: 'steel', name: '강철 공', rarity: 'RARE', prob: 0.20, desc: '데미지 3. 무거운 크롬 메탈 재질.', color: '#8e9eab', radius: 7 },
    { type: 'horizontal', name: '가로 레이저 공', rarity: 'EPIC', prob: 0.15, desc: '명중 시 데미지 2, 가로줄 데미지 2 레이저 발사.', color: '#00e676', radius: 7 },
    { type: 'vertical', name: '세로 레이저 공', rarity: 'EPIC', prob: 0.15, desc: '명중 시 데미지 2, 세로줄 데미지 2 레이저 발사.', color: '#ff007f', radius: 7 },
    { type: 'bomb', name: '핵폭탄 공', rarity: 'LEGENDARY', prob: 0.10, desc: '명중 시 데미지 3, 30% 확률로 반경 3x3 범위에 데미지 5 폭발.', color: '#ff5722', radius: 7 },
    { type: 'cross', name: '십자 레이저 공', rarity: 'LEGENDARY', prob: 0.10, desc: '명중 시 데미지 2, 십자 방향 데미지 3 레이저 발사.', color: '#ffd700', radius: 7 }
];

// Brick Destruction Coin Boost Upgrade Configuration
const BRICK_COIN_UPGRADES = [
    { level: 0, cost: 0, bonus: 0 },
    { level: 1, cost: 200, bonus: 5 },
    { level: 2, cost: 1000, bonus: 15 },
    { level: 3, cost: 2000, bonus: 30 },
    { level: 4, cost: 3000, bonus: 50 },
    { level: 5, cost: 7500, bonus: 100 }
];
let brickCoinUpgradeLevel = 0; // Current upgrade level (0 ~ 5)

// Star Brick Spawn Chance Upgrade Configuration
const BRICK_STAR_UPGRADES = [
    { level: 0, cost: 0, chance: 0.20, percentText: '20%' },
    { level: 1, cost: 500, chance: 0.30, percentText: '30%' },
    { level: 2, cost: 1900, chance: 0.50, percentText: '50%' },
    { level: 3, cost: 4200, chance: 0.65, percentText: '65%' },
    { level: 4, cost: 6500, chance: 0.80, percentText: '80%' },
    { level: 5, cost: 10000, chance: 1.00, percentText: '100%' }
];
let brickStarUpgradeLevel = 0; // Current upgrade level (0 ~ 5)

// Helper: Calculate Boss HP based on wave
function getBossHp(w) {
    if (w >= 170) return 17700000;
    if (w <= 50) return w * 5;
    if (w === 60) return 500;
    if (w === 70) return 700;
    if (w === 80) return 1000;
    if (w === 90) return 2000;
    if (w === 100) return 5000;
    // 110웨이브 이상 보스는 10웨이브마다 체력 +1000
    const additionalSteps = Math.floor((w - 100) / 10);
    return 5000 + additionalSteps * 1000;
}

// Helper: Calculate Boss Armor based on wave
function getBossArmor(w, isMegaBoss = false) {
    if (isMegaBoss) return 0; // 170W 메가보스는 방어력 0
    if (w < 30) return 0;
    if (w < 50) return 1;
    if (w < 70) return 2;
    if (w < 100) return 3;
    // 100웨이브 이상: 4, 이후 50웨이브마다 방어력 +1 (150W:5, 200W:6...)
    const extraArmor = Math.floor((w - 100) / 50);
    return 4 + extraArmor;
}

// 3. State Management Variables
let score = 0;
let bestScore = 0;
let wave = 1;
let bestWave = 1;
let coins = 0;

let highestBossDefeated = 0; // Tracks 10, 20, 30... for buffs
let activeBuffs = []; // List of string descriptions for UI
let gachaRatesChanged = false;

// DevTool Variables
let isDevMode = false;
let devSpentCoins = 0;

let launcherX = CANVAS_WIDTH / 2;
let nextLauncherX = launcherX;
let isFirstBallOnFloor = true;

let ballInventory = ['basic']; // Default starting inventory
let bonusBallsThisTurn = 0;    // Added via + items collected
let ballsToLaunch = [];        // Launch queue
let balls = [];                // Active balls in play
let bricks = [];
let items = [];
let effects = [];              // Floating text, particles, lasers, explosions
let screenShakeTimer = 0;
let screenShakeMagnitude = 0;
let shakeIntensity = 1.0;   // 0.0 (없음) ~ 1.0 (최대), 일반 진동 배율. 메가보스 진동은 제외.
let isQuickGachaClose = false; // 공 획득 시 아무 곳이나 클릭해 닫기 온오프
let starCoins = 0; // 별 동전: 별 벽돌 파괴 시 획득하는 별도 화폐

let gameState = 'READY'; // 'READY', 'LAUNCHING', 'BOUNCING', 'RETURNING', 'NEXT_WAVE', 'GAME_OVER'
let isAiming = false;
let aimAngle = -Math.PI / 2;
let mouseStart = { x: 0, y: 0 };
let mouseCurrent = { x: 0, y: 0 };

let launchTimer = 0;
let launchSpeed = 1; // 1, 2, 3
let comboCount = 0;
let isPaused = false;
let isMuted = false;
let currentTheme = 'light';
let drawnBallTemp = null; // Storing drawn ball until user accepts it

// HTML Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreVal = document.getElementById('score-val');
const bestVal = document.getElementById('best-val');
const waveVal = document.getElementById('wave-val');
const coinVal = document.getElementById('coin-val');
const totalBallsCount = document.getElementById('total-balls-count');
const inventoryList = document.getElementById('inventory-list');

const btnDraw = document.getElementById('btn-draw');
const btnDraw10 = document.getElementById('btn-draw-10');
const btnSound = document.getElementById('btn-sound');
const btnSpeed = document.getElementById('btn-speed');
const btnPause = document.getElementById('btn-pause');
const btnSkip = document.getElementById('btn-skip');
const btnDev = document.getElementById('btn-dev');
const devPanel = document.getElementById('dev-panel');
const devSpentVal = document.getElementById('dev-spent-val');
const btnTheme = null;
const btnRestart = document.getElementById('btn-restart');
const btnRestartOverlay = document.getElementById('btn-restart-overlay');
const btnGachaOk = document.getElementById('btn-gacha-ok');
const btnGacha10Ok = document.getElementById('btn-gacha-10-ok');

const shopOverlay = document.getElementById('shop-overlay');
const btnOpenShop = document.getElementById('btn-open-shop');
const btnCloseShop = document.getElementById('btn-close-shop');
const btnUpgradeCoin = document.getElementById('btn-upgrade-coin');
const upgradeCoinBadge = document.getElementById('upgrade-coin-badge');
const upgradeCoinDesc = document.getElementById('upgrade-coin-desc');
const upgradeCoinBtnText = document.getElementById('upgrade-coin-btn-text');
const btnUpgradeStar = document.getElementById('btn-upgrade-star');
const upgradeStarBadge = document.getElementById('upgrade-star-badge');
const upgradeStarDesc = document.getElementById('upgrade-star-desc');
const upgradeStarBtnText = document.getElementById('upgrade-star-btn-text');
const starCoinVal = document.getElementById('star-coin-val');

const settingsOverlay = document.getElementById('settings-overlay');
const btnOpenSettings = document.getElementById('btn-open-settings');
const btnCloseSettings = document.getElementById('btn-close-settings');
const volumeSlider = document.getElementById('volume-slider');
const volumeValueText = document.getElementById('volume-value-text');
const shakeSlider = document.getElementById('shake-slider');
const shakeValueText = document.getElementById('shake-value-text');
const btnToggleMuteSettings = document.getElementById('btn-toggle-mute-settings');
const muteStatusText = document.getElementById('mute-status-text');
const btnToggleQuickGacha = document.getElementById('btn-toggle-quick-gacha');
const quickGachaStatusText = document.getElementById('quick-gacha-status-text');

const iconSoundOn = document.getElementById('icon-sound-on');
const iconSoundOff = document.getElementById('icon-sound-off');
const iconPause = document.getElementById('icon-pause');
const iconPlay = document.getElementById('icon-play');
const iconSun = null;
const iconMoon = null;

const gameOverOverlay = document.getElementById('game-over-overlay');
const finalScore = document.getElementById('final-score');
const finalWave = document.getElementById('final-wave');

const gachaOverlay = document.getElementById('gacha-overlay');
const gachaCard = document.getElementById('gacha-card');
const gachaBallVisual = document.getElementById('gacha-ball-visual');
const gachaBallName = document.getElementById('gacha-ball-name');
const gachaBallDesc = document.getElementById('gacha-ball-desc');
const gachaBallRarity = document.getElementById('gacha-ball-rarity');

const gacha10Overlay = document.getElementById('gacha-10-overlay');
const gacha10Grid = document.getElementById('gacha-10-grid');

const wave80Overlay = document.getElementById('wave-80-overlay');
const btnWave80Yes = document.getElementById('btn-wave-80-yes');
const btnWave80No = document.getElementById('btn-wave-80-no');

// Instantiate Synthesizer
const synth = new AudioSynth();

// 4. Game Initialization and Storage
function initGame() {
    // Load local storage
    score = 0;
    wave = 1;
    coins = 0;
    isFirstBallOnFloor = true;
    launcherX = CANVAS_WIDTH / 2;
    nextLauncherX = launcherX;
    
    bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
    bestWave = parseInt(localStorage.getItem('bestWave')) || 1;
    coins = 0; // Reset coins on load/refresh
    
    ballInventory = ['basic']; // Reset ball inventory on refresh/new game

    balls = [];
    ballsToLaunch = [];
    effects = [];
    bonusBallsThisTurn = 0;
    gameState = 'READY';
    isPaused = false;
    launchSpeed = 1;

    // Full Reset Additions
    bricks = [];
    items = [];
    comboCount = 0;
    highestBossDefeated = 0;
    activeBuffs = [];
    updateBuffsUI();
    devSpentCoins = 0;
    brickCoinUpgradeLevel = 0; // Reset brick coin upgrade level
    brickStarUpgradeLevel = 0; // Reset brick star upgrade level

    if (gachaRatesChanged) {
        gachaRatesChanged = false;
        GACHA_BALLS.find(b => b.type === 'basic').prob = 0.30;
        GACHA_BALLS.find(b => b.type === 'steel').prob = 0.20;
        GACHA_BALLS.find(b => b.type === 'horizontal').prob = 0.15;
        GACHA_BALLS.find(b => b.type === 'vertical').prob = 0.15;
        GACHA_BALLS.find(b => b.type === 'bomb').prob = 0.10;
        GACHA_BALLS.find(b => b.type === 'cross').prob = 0.10;
    }

    updateUI();
    spawnBricksAndItems(true); // Initial spawn
    
    gameOverOverlay.classList.add('hidden');
    gachaOverlay.classList.add('hidden');
    if (shopOverlay) shopOverlay.classList.add('hidden');
}

function updateUI() {
    scoreVal.textContent = formatNumber(score);
    bestVal.textContent = formatNumber(bestScore);
    waveVal.textContent = wave;
    coinVal.textContent = coins;
    totalBallsCount.textContent = ballInventory.length;
    
    if (devSpentVal) devSpentVal.textContent = devSpentCoins;
    if (devPanel) {
        if (isDevMode) devPanel.classList.remove('hidden');
        else devPanel.classList.add('hidden');
    }
    
    // Draw Gacha Button Enable/Disable (Allow in DevMode regardless of coins)
    if ((coins >= 30 || isDevMode) && gameState === 'READY') {
        btnDraw.removeAttribute('disabled');
        btnDraw.classList.add('pulse');
    } else {
        btnDraw.setAttribute('disabled', 'true');
        btnDraw.classList.remove('pulse');
    }
    
    // Draw 10 Gacha Button Enable/Disable
    if ((coins >= 300 || isDevMode) && gameState === 'READY') {
        btnDraw10.removeAttribute('disabled');
        btnDraw10.classList.add('pulse');
    } else {
        btnDraw10.setAttribute('disabled', 'true');
        btnDraw10.classList.remove('pulse');
    }

    // Brick Destruction Coin Upgrade Button & Card UI
    if (btnUpgradeCoin) {
        if (brickCoinUpgradeLevel >= 5) {
            // Max Level reached
            if (upgradeCoinBadge) upgradeCoinBadge.textContent = 'Lv.MAX';
            if (upgradeCoinDesc) upgradeCoinDesc.textContent = `벽돌 파괴 시 추가 돈 +100 (최대 레벨)`;
            if (upgradeCoinBtnText) upgradeCoinBtnText.textContent = 'MAX';
            btnUpgradeCoin.setAttribute('disabled', 'true');
            btnUpgradeCoin.classList.remove('pulse');
        } else {
            const nextUpgrade = BRICK_COIN_UPGRADES[brickCoinUpgradeLevel + 1];
            const currentBonus = BRICK_COIN_UPGRADES[brickCoinUpgradeLevel].bonus;
            if (upgradeCoinBadge) upgradeCoinBadge.textContent = `Lv.${brickCoinUpgradeLevel}`;
            if (upgradeCoinDesc) upgradeCoinDesc.textContent = `벽돌 파괴 시 추가 돈 +${currentBonus} → +${nextUpgrade.bonus}`;
            if (upgradeCoinBtnText) upgradeCoinBtnText.textContent = `${nextUpgrade.cost} ₩`;

            if ((coins >= nextUpgrade.cost || isDevMode) && gameState === 'READY') {
                btnUpgradeCoin.removeAttribute('disabled');
                btnUpgradeCoin.classList.add('pulse');
            } else {
                btnUpgradeCoin.setAttribute('disabled', 'true');
                btnUpgradeCoin.classList.remove('pulse');
            }
        }
    }

    // Star Brick Chance Upgrade Button & Card UI
    if (btnUpgradeStar) {
        if (brickStarUpgradeLevel >= 5) {
            // Max Level reached
            if (upgradeStarBadge) upgradeStarBadge.textContent = 'Lv.MAX';
            if (upgradeStarDesc) upgradeStarDesc.textContent = `별 벽돌 등장 확률 100% (최대 레벨)`;
            if (upgradeStarBtnText) upgradeStarBtnText.textContent = 'MAX';
            btnUpgradeStar.setAttribute('disabled', 'true');
            btnUpgradeStar.classList.remove('pulse');
        } else {
            const nextStarUpgrade = BRICK_STAR_UPGRADES[brickStarUpgradeLevel + 1];
            const currentStarPercent = BRICK_STAR_UPGRADES[brickStarUpgradeLevel].percentText;
            if (upgradeStarBadge) upgradeStarBadge.textContent = `Lv.${brickStarUpgradeLevel}`;
            if (upgradeStarDesc) upgradeStarDesc.textContent = `별 벽돌 등장 확률 ${currentStarPercent} → ${nextStarUpgrade.percentText}`;
            if (upgradeStarBtnText) upgradeStarBtnText.textContent = `${nextStarUpgrade.cost} ₩`;

            if ((coins >= nextStarUpgrade.cost || isDevMode) && gameState === 'READY') {
                btnUpgradeStar.removeAttribute('disabled');
                btnUpgradeStar.classList.add('pulse');
            } else {
                btnUpgradeStar.setAttribute('disabled', 'true');
                btnUpgradeStar.classList.remove('pulse');
            }
        }
    }

    // Populate Inventory Bar
    inventoryList.innerHTML = '';
    const counts = {};
    ballInventory.forEach(type => {
        counts[type] = (counts[type] || 0) + 1;
    });

    GACHA_BALLS.forEach(ballInfo => {
        if (counts[ballInfo.type]) {
            let emoji = '⚪';
            if (ballInfo.type === 'steel') emoji = '🔘';
            if (ballInfo.type === 'horizontal') emoji = '🟢';
            if (ballInfo.type === 'vertical') emoji = '🔴';
            if (ballInfo.type === 'bomb') emoji = '🟠';
            if (ballInfo.type === 'cross') emoji = '🟡';

            const itemDiv = document.createElement('div');
            itemDiv.className = `inv-item ${ballInfo.type}`;
            itemDiv.title = `${ballInfo.name} (${ballInfo.rarity}): ${ballInfo.desc}`;
            itemDiv.innerHTML = `${emoji} ${counts[ballInfo.type]}`;
            inventoryList.appendChild(itemDiv);
        }
    });
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function saveHighScores() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }
    if (wave > bestWave) {
        bestWave = wave;
        localStorage.setItem('bestWave', bestWave);
    }
    // Coins and ball inventory are reset on refresh, so we do not save them to localStorage
}

function saveSettings() {
    localStorage.setItem('settings_volume', synth.currentVolume);
    localStorage.setItem('settings_muted', isMuted ? '1' : '0');
    localStorage.setItem('settings_shake', shakeIntensity);
    localStorage.setItem('settings_quick_gacha', isQuickGachaClose ? '1' : '0');
}

function loadSettings() {
    const savedVolume = parseFloat(localStorage.getItem('settings_volume'));
    const savedMuted = localStorage.getItem('settings_muted');
    const savedShake = parseFloat(localStorage.getItem('settings_shake'));
    const savedQuickGacha = localStorage.getItem('settings_quick_gacha');

    // Restore volume (default 0.5 if never saved)
    const vol = isNaN(savedVolume) ? 0.5 : savedVolume;
    synth.currentVolume = vol;

    // Restore mute state
    if (savedMuted === '1') {
        isMuted = true;
        if (iconSoundOn) iconSoundOn.classList.add('hidden');
        if (iconSoundOff) iconSoundOff.classList.remove('hidden');
    }

    // Restore shake intensity (default 1.0 if never saved)
    shakeIntensity = isNaN(savedShake) ? 1.0 : Math.max(0, Math.min(1, savedShake));

    // Restore quick gacha close setting
    isQuickGachaClose = savedQuickGacha === '1';

    // Sync UI elements
    if (volumeSlider) volumeSlider.value = Math.round(vol * 100);
    if (volumeValueText) volumeValueText.textContent = `${Math.round(vol * 100)}%`;
    if (shakeSlider) shakeSlider.value = Math.round(shakeIntensity * 100);
    if (shakeValueText) shakeValueText.textContent = `${Math.round(shakeIntensity * 100)}%`;
    if (muteStatusText) muteStatusText.textContent = isMuted ? '소리 꺼짐' : '소리 켬';
    if (btnToggleMuteSettings) btnToggleMuteSettings.classList.toggle('muted', isMuted);
    if (quickGachaStatusText) quickGachaStatusText.textContent = isQuickGachaClose ? 'ON' : 'OFF';
    if (btnToggleQuickGacha) btnToggleQuickGacha.classList.toggle('active', isQuickGachaClose);
}

// 5. Spawning Logic
function spawnBricksAndItems(isInitial = false) {
    // 170웨이브 이후 패턴
    if (wave > 170) {
        if (!isInitial) {
            // 홀수 웨이브 (171, 173...): 이동 및 스폰 없음
            if (wave % 2 !== 0) return;
            
            // 짝수 웨이브 (172, 174...): 모든 벽돌 전진
            bricks.forEach(brick => {
                brick.row++;
                brick.targetY = TOP_MARGIN + brick.row * ROW_HEIGHT + ROW_HEIGHT/2;
                if (brick.isMegaBoss) {
                    brick.targetY = TOP_MARGIN + (brick.row + 1) * ROW_HEIGHT;
                }
            });

            items = items.filter(item => item.row < 6);

            const gameOverReached = bricks.some(brick => {
                const bottomRow = brick.row + (brick.rowSpan || 1) - 1;
                return bottomRow >= 6;
            });
            if (gameOverReached) {
                triggerGameOver();
                return;
            }
            
            // 양옆 2줄(col 0,1,4,5)에 강철 벽돌 스폰
            const steelHp = 1000;
            [0, 1, 4, 5].forEach(col => {
                bricks.push({
                    row: 0,
                    col: col,
                    x: col * COL_WIDTH + COL_WIDTH / 2,
                    y: TOP_MARGIN - ROW_HEIGHT,
                    targetY: TOP_MARGIN + ROW_HEIGHT / 2,
                    hp: steelHp,
                    maxHp: steelHp,
                    type: 'normal',
                    color: '#8e9eab',
                    isBoss: false,
                    isSteelBrick: true,
                    shield: 0,
                    baseArmor: 0,
                    extraArmor: 0,
                    multiplier: 1,
                    stackCount: 0,
                    pulseScale: 1
                });
            });
        }
        return;
    }

    // 170웨이브 진입 시 메가보스 등장 연출
    if (wave === 170) {
        const megaBossExists = bricks.some(b => b.isMegaBoss);
        if (megaBossExists) return;
        
        // 기존 벽돌 모두 파괴 (폭발 이펙트)
        bricks.forEach(brick => {
            createHitParticles(brick.x, brick.targetY || brick.y, 10, getBrickColor(brick.hp, brick.maxHp, brick));
            effects.push({
                type: 'explosion',
                x: brick.x,
                y: brick.targetY || brick.y,
                maxRadius: 40,
                radius: 10,
                color: '#ff5722',
                life: 1.0
            });
        });
        bricks = []; // 화면 상의 모든 벽돌 즉시 삭제
        
        // 화면 진동
        screenShakeTimer = 1.0;
        screenShakeMagnitude = 15;
        synth.playExplosion();
        
        // 메가보스 최초 스폰 (중앙 2*2 크기, 체력 17,700,000, 방어력 0)
        const bossHp = getBossHp(170);
        bricks.push({
            row: 0,
            col: 2,
            x: 2 * COL_WIDTH + COL_WIDTH, // 중앙 col 2와 3 사이
            y: TOP_MARGIN - ROW_HEIGHT * 2, // 위에서 내려오게 연출
            targetY: TOP_MARGIN + ROW_HEIGHT,
            hp: bossHp,
            maxHp: bossHp,
            type: 'normal',
            color: '#8e44ad',
            isBoss: true,
            isMegaBoss: true,
            colSpan: 2,
            rowSpan: 2,
            shield: 0,
            multiplier: 1,
            stackCount: 0,
            pulseScale: 1
        });
        return;
    }

    // If it's a turn end, shift down first
    if (!isInitial) {
        bricks.forEach(brick => {
            brick.row++;
            brick.targetY = TOP_MARGIN + brick.row * ROW_HEIGHT + ROW_HEIGHT/2;
            if (brick.isMegaBoss) {
                brick.targetY = TOP_MARGIN + (brick.row + 1) * ROW_HEIGHT;
            }
        });

        // Remove all items that fell off the screen (though items are not spawned anymore)
        items = items.filter(item => item.row < 6);

        // Check for Game Over: Bricks reaching row 6 or below (touches floor)
        const gameOverReached = bricks.some(brick => {
            const bottomRow = brick.row + (brick.rowSpan || 1) - 1;
            return bottomRow >= 6;
        });
        if (gameOverReached) {
            triggerGameOver();
            return;
        }
    }

    // Spawn new row at row 0
    const isBossWave = (wave % 10 === 0);
    const hasBossDefender = isBossWave && wave >= 50;
    
    // Choose specific columns for boss and defender if applicable
    let specialCols = [];
    let bossCol = -1;
    let defenderCol = -1;
    
    let availableCols = [0, 1, 2, 3, 4, 5];
    
    if (isBossWave) {
        let rIdx = Math.floor(Math.random() * availableCols.length);
        bossCol = availableCols.splice(rIdx, 1)[0];
        specialCols.push(bossCol);
    }
    
    if (hasBossDefender) {
        let rIdx = Math.floor(Math.random() * availableCols.length);
        defenderCol = availableCols.splice(rIdx, 1)[0];
        specialCols.push(defenderCol);
    }
    
    // Determine which columns will have normal bricks
    let normalCols = [];
    
    for (let col of availableCols) {
        if (Math.random() < 0.45) {
            normalCols.push(col);
        }
    }
    
    // Minimum brick requirements
    // 150웨이브 이상: 매 줄 5개 이상
    // 50웨이브 이상: 매 줄 4개 이상
    // 30웨이브 이상: 매 줄 3개 이상
    // 보스 웨이브: 3개 이상
    let minBricks = isBossWave ? 3 : 1;
    if (wave >= 150) minBricks = Math.max(minBricks, 5);
    else if (wave >= 50) minBricks = Math.max(minBricks, 4);
    else if (wave >= 30) minBricks = Math.max(minBricks, 3);
    
    let currentTotal = specialCols.length + normalCols.length;
    
    while (currentTotal < minBricks) {
        let remaining = availableCols.filter(c => !normalCols.includes(c));
        if (remaining.length === 0) break;
        let rIdx = Math.floor(Math.random() * remaining.length);
        normalCols.push(remaining[rIdx]);
        currentTotal++;
    }
    
    // 3x multiplier stacking system (1 → 3 → 9 → 27 → ...)
    const spawnNormalBrick = (col, isDefender = false) => {
        let baseHp = wave;
        let hpMultiplier = 1;
        let stackCount = 0;
        
        if (wave >= 20) {
            let stackChance = wave / 100;
            while (stackChance > 0 && Math.random() < stackChance) {
                stackCount++;
                hpMultiplier = Math.pow(3, stackCount); // 3x per stack: 3, 9, 27, 81...
                stackChance -= 0.20; // Each stack reduces next chance by 20%p
            }
        }
        
        // 150웨이브 이상 시 모든 벽돌이 보스 색상(#8e44ad)으로 출현
        const starChance = BRICK_STAR_UPGRADES[brickStarUpgradeLevel] ? BRICK_STAR_UPGRADES[brickStarUpgradeLevel].chance : 0.20;
        const color = (wave >= 150) ? '#8e44ad' : (isDefender ? '#2c3e50' : (Math.random() < starChance ? '#00d7ff' : '#f18357'));
        
        bricks.push({
            row: 0,
            col: col,
            x: col * COL_WIDTH + COL_WIDTH / 2,
            y: TOP_MARGIN + ROW_HEIGHT / 2,
            targetY: TOP_MARGIN + ROW_HEIGHT / 2,
            hp: baseHp * hpMultiplier,
            maxHp: baseHp * hpMultiplier,
            type: 'normal',
            color: color,
            isDefender: isDefender,
            shield: 0,
            baseArmor: 0,
            extraArmor: 0,
            multiplier: hpMultiplier,
            stackCount: stackCount,
            pulseScale: 1
        });
    };
    
    // Spawn Boss
    if (bossCol !== -1) {
        const bHp = getBossHp(wave);
        bricks.push({
            row: 0,
            col: bossCol,
            x: bossCol * COL_WIDTH + COL_WIDTH / 2,
            y: TOP_MARGIN + ROW_HEIGHT / 2,
            targetY: TOP_MARGIN + ROW_HEIGHT / 2,
            hp: bHp,
            maxHp: bHp,
            type: 'normal',
            color: '#8e44ad',
            isBoss: true,
            spawnedAtWave: wave, // 정확한 웨이브 저장
            shield: 0,
            baseArmor: 0,
            extraArmor: 0,
            multiplier: 1,
            stackCount: 0,
            pulseScale: 1
        });
    }
    
    // Spawn Defender (boss wave)
    if (defenderCol !== -1) {
        spawnNormalBrick(defenderCol, true);
    }
    
    // Spawn Normals
    normalCols.forEach(col => spawnNormalBrick(col, false));
    
    // 50웨이브 이상 비보스 웨이브: (wave-30)% 확률로 무작위 벽돌 하나를 방어병으로 변환
    if (!isBossWave && wave >= 50) {
        const defenderChance = (wave - 30) / 100;
        if (Math.random() < defenderChance) {
            const row0Normals = bricks.filter(b => b.row === 0 && !b.isBoss && !b.isDefender);
            if (row0Normals.length > 0) {
                const target = row0Normals[Math.floor(Math.random() * row0Normals.length)];
                target.isDefender = true;
                if (wave < 150) target.color = '#2c3e50';
            }
        }
    }
    
    // 71웨이브부터 매 턴 마다 새로 나오는 벽돌 중 *1배, *3배, *9배 벽돌 방어력 지급 (최대 2개)
    if (wave >= 71) {
        const eligibleBricks = bricks.filter(b => b.row === 0 && !b.isBoss);
        const shuffled = [...eligibleBricks].sort(() => Math.random() - 0.5).slice(0, 2);
        shuffled.forEach(b => {
            if (b.stackCount === 0) b.baseArmor = 5;      // *1배 벽돌: 방어력 5
            else if (b.stackCount === 1) b.baseArmor = 3; // *3배 벽돌: 방어력 3
            else if (b.stackCount === 2) b.baseArmor = 2; // *9배 벽돌: 방어력 2
        });
    }
    
    // Apply Defender Shields & Defender Extra Armor
    const newlySpawnedDefenders = bricks.filter(b => b.row === 0 && b.isDefender);
    newlySpawnedDefenders.forEach(defender => {
        const shieldAmount = wave * 5;
        // 주변 3*3 벽돌에게만 보호막 효과 적용
        bricks.forEach(brick => {
            if (Math.abs(brick.row - defender.row) <= 1 && Math.abs(brick.col - defender.col) <= 1) {
                brick.shield = Math.max(brick.shield, shieldAmount);
            }
        });
        
        // 해당 턴 동안 주변 3*3 벽돌 방어력 +1 (70W 이상 +3, 100W 이상 +5)
        const extraArmorVal = wave >= 100 ? 5 : (wave >= 70 ? 3 : 1);
        bricks.forEach(brick => {
            if (Math.abs(brick.row - defender.row) <= 1 && Math.abs(brick.col - defender.col) <= 1) {
                brick.extraArmor = (brick.extraArmor || 0) + extraArmorVal;
            }
        });
        
        createFloatingText(defender.x, defender.y, `3x3 SHIELD +${shieldAmount}`, '#bdc3c7');
    });
}

// 6. Gacha Logic
// Helper: if a ball was drawn but not yet accepted, auto-add it now
function autoAcceptPendingBall() {
    if (drawnBallTemp) {
        ballInventory.push(drawnBallTemp.type);
        drawnBallTemp = null;
        gachaOverlay.classList.add('hidden');
    }
    if (drawn10BallsTemp.length > 0) {
        drawn10BallsTemp.forEach(ball => ballInventory.push(ball.type));
        drawn10BallsTemp = [];
        gacha10Overlay.classList.add('hidden');
    }
}

function runGacha() {
    if ((!isDevMode && coins < 30) || gameState !== 'READY') return;
    autoAcceptPendingBall(); // 이전 공 자동 추가
    
    synth.init();
    if (isDevMode) {
        devSpentCoins += 30;
    } else {
        coins -= 30;
    }
    saveHighScores();
    updateUI();
    
    // Choose drawn ball type
    const rand = Math.random();
    let accumulated = 0;
    let selectedBall = GACHA_BALLS[0]; // Fallback
    
    for (let i = 0; i < GACHA_BALLS.length; i++) {
        accumulated += GACHA_BALLS[i].prob;
        if (rand <= accumulated) {
            selectedBall = GACHA_BALLS[i];
            break;
        }
    }
    
    drawnBallTemp = selectedBall;
    
    // Open Gacha overlay
    gachaOverlay.classList.remove('hidden');
    gachaCard.classList.remove('flipped');
    
    // Play rolling synth effect
    synth.playGachaRoll();
    
    // Setup reveal contents
    gachaBallName.textContent = selectedBall.name;
    gachaBallDesc.textContent = selectedBall.desc;
    gachaBallRarity.className = `ball-rarity rarity-${selectedBall.rarity.toLowerCase()}`;
    gachaBallRarity.textContent = selectedBall.rarity;
    
    gachaBallVisual.className = `ball-visual v-${selectedBall.type}`;
    
    // Spin Card and trigger reveal after a delay
    setTimeout(() => {
        gachaCard.classList.add('flipped');
        synth.playGachaReveal();
        createGachaSparkles();
    }, 1500);
}

function acceptDrawnBall() {
    if (drawnBallTemp) {
        ballInventory.push(drawnBallTemp.type);
        drawnBallTemp = null;
        saveHighScores();
        updateUI();
        gachaOverlay.classList.add('hidden');
        if (shopOverlay) shopOverlay.classList.remove('hidden');
    }
}

let drawn10BallsTemp = [];

function runGacha10() {
    if ((!isDevMode && coins < 300) || gameState !== 'READY') return;
    autoAcceptPendingBall(); // 이전 공 자동 추가
    
    synth.init();
    if (isDevMode) {
        devSpentCoins += 300;
    } else {
        coins -= 300;
    }
    saveHighScores();
    updateUI();
    
    drawn10BallsTemp = [];
    gacha10Grid.innerHTML = '';
    
    // Choose 10 drawn balls
    for (let count = 0; count < 10; count++) {
        const rand = Math.random();
        let accumulated = 0;
        let selectedBall = GACHA_BALLS[0];
        
        for (let i = 0; i < GACHA_BALLS.length; i++) {
            accumulated += GACHA_BALLS[i].prob;
            if (rand <= accumulated) {
                selectedBall = GACHA_BALLS[i];
                break;
            }
        }
        drawn10BallsTemp.push(selectedBall);
        
        // Add to grid
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gacha-10-item';
        
        const visualDiv = document.createElement('div');
        visualDiv.className = `ball-visual-mini v-${selectedBall.type}`;
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'ball-name-mini';
        nameDiv.textContent = selectedBall.name.replace(' 레이저 공', '').replace(' 공', ''); // shorten name to fit
        
        itemDiv.appendChild(visualDiv);
        itemDiv.appendChild(nameDiv);
        gacha10Grid.appendChild(itemDiv);
    }
    
    // Open Gacha 10 overlay
    gacha10Overlay.classList.remove('hidden');
    
    // Play rolling click sound then reveal chords
    synth.playGachaRoll();
    setTimeout(() => {
        synth.playGachaReveal();
    }, 1200);
}

function accept10DrawnBalls() {
    if (drawn10BallsTemp.length > 0) {
        drawn10BallsTemp.forEach(ball => {
            ballInventory.push(ball.type);
        });
        drawn10BallsTemp = [];
        saveHighScores();
        updateUI();
        gacha10Overlay.classList.add('hidden');
        if (shopOverlay) shopOverlay.classList.remove('hidden');
    }
}

function createGachaSparkles() {
    const parent = document.querySelector('.gacha-sparkles');
    parent.innerHTML = '';
    const rect = gachaCard.getBoundingClientRect();
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'sparkle';
        // Random golden or rare color particles
        const colors = ['#ffe259', '#ffa751', '#00f0ff', '#ff007f', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 8 + 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        particle.style.left = '50%';
        particle.style.top = '50%';
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        
        let x = 0;
        let y = 0;
        let opacity = 1;
        
        parent.appendChild(particle);
        
        const anim = () => {
            x += dx;
            y += dy;
            opacity -= 0.02;
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(anim);
            } else {
                particle.remove();
            }
        };
        requestAnimationFrame(anim);
    }
}

// 7. Aiming & Physics Functions
function startAiming(e) {
    if (gameState !== 'READY' || isPaused) return;
    
    // Only allow left click (button 0) for mouse down events
    if (e.type === 'mousedown' && e.button !== 0) return;
    
    synth.init();
    isAiming = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouseStart = { x: clientX, y: clientY };
    mouseCurrent = { x: clientX, y: clientY };
    calculateAngle();
}

function continueAiming(e) {
    if (!isAiming || isPaused) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouseCurrent = { x: clientX, y: clientY };
    calculateAngle();
}

function endAiming() {
    if (!isAiming) return;
    isAiming = false;
    
    // Shoot if the aim angle points upward (mouse is above the floor level on canvas)
    // aimAngle is valid when it's in upper half: between -PI and 0 (exclusive of horizontal)
    if (aimAngle < -0.17 && aimAngle > -Math.PI + 0.17) {
        launchBalls();
    }
}

function calculateAngle() {
    // Aim from the launcher position towards the mouse cursor on canvas
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    
    // Convert mouse screen coords to canvas coords
    const mouseCanvasX = (mouseCurrent.x - rect.left) * scaleX;
    const mouseCanvasY = (mouseCurrent.y - rect.top) * scaleY;
    
    // Vector from launcher at floor to mouse position
    const dx = mouseCanvasX - launcherX;
    const dy = mouseCanvasY - FLOOR_Y;
    
    if (Math.hypot(dx, dy) < 5) {
        aimAngle = -Math.PI / 2;
        return;
    }
    
    aimAngle = Math.atan2(dy, dx);
    
    // Clamp: only allow aiming upward (negative dy side)
    // Min 10 degrees above horizontal on each side
    const minAngle = 10 * Math.PI / 180;
    if (aimAngle > -minAngle && aimAngle <= 0) {
        aimAngle = -minAngle;
    } else if (aimAngle < -Math.PI + minAngle || aimAngle > 0) {
        aimAngle = -Math.PI + minAngle;
    }
}

function getBallDamage(type) {
    let dmg = 1;
    if (type === 'basic') dmg = 1;
    else if (type === 'steel') dmg = 3;
    else if (type === 'bomb') dmg = 3;
    else if (type === 'horizontal' || type === 'vertical' || type === 'cross') dmg = 2;
    
    // Apply Boss Defeat Buffs
    if (highestBossDefeated >= 40) dmg += 1;
    if (highestBossDefeated >= 90) dmg += 3;
    if (highestBossDefeated >= 100) dmg *= 2;
    
    return dmg;
}

function launchBalls() {
    gameState = 'LAUNCHING';
    comboCount = 0;
    
    // Build launch queue from inventory + bonus + items collected
    ballsToLaunch = [];
    
    // Add inventory balls
    ballInventory.forEach(type => {
        const spec = GACHA_BALLS.find(b => b.type === type) || GACHA_BALLS[0];
        ballsToLaunch.push({
            type: type,
            damage: getBallDamage(type),
            radius: spec.radius,
            color: spec.color
        });
    });
    
    // Add bonus basic balls collected
    for (let i = 0; i < bonusBallsThisTurn; i++) {
        const spec = GACHA_BALLS[0];
        ballsToLaunch.push({
            type: 'basic',
            damage: getBallDamage('basic'),
            radius: spec.radius,
            color: spec.color
        });
    }
    
    isFirstBallOnFloor = false;
    nextLauncherX = launcherX;
    
    launchTimer = 0;
}

// 8. Physics Collisions Engine
function updatePhysics(dt) {
    if (gameState === 'READY' || gameState === 'GAME_OVER' || isPaused) return;

    // 1. Launching Queue
    if (gameState === 'LAUNCHING' && ballsToLaunch.length > 0) {
        // Adjust launching interval based on speed toggle
        const interval = 80 / launchSpeed;
        launchTimer += dt * 1000;
        
        if (launchTimer >= interval) {
            launchTimer = 0;
            const bData = ballsToLaunch.shift();
            
            const vx = Math.cos(aimAngle) * BALL_BASE_SPEED;
            const vy = Math.sin(aimAngle) * BALL_BASE_SPEED;
            
            balls.push({
                x: launcherX,
                y: FLOOR_Y,
                vx: vx,
                vy: vy,
                type: bData.type,
                damage: bData.damage,
                radius: bData.radius,
                color: bData.color,
                state: 'play', // 'play', 'returning'
                trail: []
            });
            
            synth.playShoot();
            
            if (ballsToLaunch.length === 0) {
                gameState = 'BOUNCING';
            }
        }
    }

    // 2. Update active balls
    let allBallsReturned = true;
    
    balls.forEach(ball => {
        if (ball.state === 'play') {
            allBallsReturned = false;
            
            // Sub-step movement to prevent tunneling at high speeds
            const steps = Math.max(1, Math.ceil(Math.abs(ball.vy) * launchSpeed / (ROW_HEIGHT / 2)));
            for (let step = 0; step < steps; step++) {
                ball.x += (ball.vx * launchSpeed) / steps;
                ball.y += (ball.vy * launchSpeed) / steps;
                
                // Wall reflection
                if (ball.x - ball.radius < 0) {
                    ball.x = ball.radius;
                    ball.vx = Math.abs(ball.vx);
                    synth.playHit(0);
                } else if (ball.x + ball.radius > CANVAS_WIDTH) {
                    ball.x = CANVAS_WIDTH - ball.radius;
                    ball.vx = -Math.abs(ball.vx);
                    synth.playHit(0);
                }
                
                if (ball.y - ball.radius < 0) {
                    ball.y = ball.radius;
                    ball.vy = Math.abs(ball.vy);
                    synth.playHit(0);
                }
                
                // Floor Collision
                if (ball.y >= FLOOR_Y) {
                    ball.y = FLOOR_Y;
                    ball.state = 'returning';
                    
                    if (!isFirstBallOnFloor) {
                        isFirstBallOnFloor = true;
                        nextLauncherX = ball.x;
                        nextLauncherX = Math.max(ball.radius + 6, Math.min(CANVAS_WIDTH - ball.radius - 6, nextLauncherX));
                    }
                    break; // stop sub-stepping once floor is hit
                }
                
                // Brick collisions within each sub-step
                const hit = checkBrickCollisions(ball);
                if (hit) break; // a bounce happened; stop sub-stepping to avoid double-bouncing
            }
            
            // Trail saving
            ball.trail.push({ x: ball.x, y: ball.y });
            if (ball.trail.length > 4) ball.trail.shift();
            
            // Collisions with Items (once per frame is fine)
            checkItemCollisions(ball);
            
        } else if (ball.state === 'returning') {
            // Ball slides smoothly on the floor to nextLauncherX
            const dx = nextLauncherX - ball.x;
            const slideSpeed = 10 * launchSpeed;
            
            if (Math.abs(dx) < slideSpeed) {
                ball.x = nextLauncherX;
                ball.state = 'done';
            } else {
                ball.x += Math.sign(dx) * slideSpeed;
                ball.y = FLOOR_Y;
            }
        }
    });
    
    // Check if turn ends
    const activePlay = balls.some(b => b.state === 'play' || b.state === 'returning');
    if (!activePlay && balls.length > 0 && gameState !== 'LAUNCHING') {
        endTurn();
    }
}

// Circle to Rectangle Collision — returns true if a bounce occurred
function checkBrickCollisions(ball) {
    let bounced = false;
    for (let i = bricks.length - 1; i >= 0; i--) {
        const brick = bricks[i];
        
        const padding = 2;
        const spanW = (brick.colSpan || 1) * COL_WIDTH;
        const spanH = (brick.rowSpan || 1) * ROW_HEIGHT;
        const rx = brick.x - spanW / 2 + padding;
        const ry = brick.y - spanH / 2 + padding;
        const rw = spanW - padding * 2;
        const rh = spanH - padding * 2;

        // Only handle normal (square) bricks now
        if (brick.type !== 'normal') continue;

        // Find closest point on rect to ball center
        const closestX = Math.max(rx, Math.min(ball.x, rx + rw));
        const closestY = Math.max(ry, Math.min(ball.y, ry + rh));
        
        const dx = ball.x - closestX;
        const dy = ball.y - closestY;
        const dist = Math.hypot(dx, dy);
        
        if (dist >= ball.radius) continue; // No collision
        
        // --- Bounce logic ---
        // Determine the deepest penetration axis to decide reflection
        const overlapX = (rw / 2 + ball.radius) - Math.abs(ball.x - (rx + rw / 2));
        const overlapY = (rh / 2 + ball.radius) - Math.abs(ball.y - (ry + rh / 2));
        
        if (overlapX < overlapY) {
            // Hit left or right face
            if (ball.x < rx + rw / 2) {
                ball.x = rx - ball.radius;     // push left
                ball.vx = -Math.abs(ball.vx); // reflect left
            } else {
                ball.x = rx + rw + ball.radius; // push right
                ball.vx = Math.abs(ball.vx);
            }
        } else {
            // Hit top or bottom face
            if (ball.y < ry + rh / 2) {
                ball.y = ry - ball.radius;     // push above
                ball.vy = -Math.abs(ball.vy); // reflect upward
            } else {
                ball.y = ry + rh + ball.radius; // push below
                ball.vy = Math.abs(ball.vy);
            }
        }
        
        bounced = true;
        
        // --- Damage logic (separately, after bounce) ---
        damageBrick(brick, ball.damage, ball.x, ball.y, ball.type);
        
        break; // one brick collision per sub-step
    }
    return bounced;
}

function checkItemCollisions(ball) {
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const dist = Math.hypot(ball.x - item.x, ball.y - item.y);
        
        if (dist < ball.radius + item.radius) {
            // Collect!
            if (item.type === 'plus') {
                bonusBallsThisTurn++;
                createFloatingText(item.x, item.y, '+1 Ball', '#00e676');
                synth.playCollect();
            } else if (item.type === 'coin') {
                coins += 5;
                createFloatingText(item.x, item.y, '+5 ₩', '#ffd700');
                synth.playCollect();
                // Send gold particles flying to top HUD
                createCoinVacuumParticles(item.x, item.y);
                updateUI();
            }
            items.splice(i, 1);
        }
    }
}

function damageBrick(brick, dmg, hitX, hitY, ballType) {
    comboCount++;
    
    let actualDmg = dmg;
    
    // Armor: boss uses getBossArmor(), normals use baseArmor + extraArmor
    if (brick.isSteelBrick) {
        actualDmg = 1;
    } else if (brick.isBoss) {
        const armor = getBossArmor(wave, brick.isMegaBoss || false);
        actualDmg = Math.max(0, actualDmg - armor);
    } else {
        const armor = (brick.baseArmor || 0) + (brick.extraArmor || 0);
        if (armor > 0) actualDmg = Math.max(0, actualDmg - armor);
    }
    
    // Shield Logic (process BEFORE early return so shield always takes hits)
    if (brick.shield > 0) {
        if (brick.shield >= actualDmg) {
            brick.shield -= actualDmg;
            actualDmg = 0;
        } else {
            actualDmg -= brick.shield;
            brick.shield = 0;
        }
    }
    
    // Trigger Special Ball Actions (must run even if actualDmg <= 0 due to high armor)
    triggerSpecialBallEffects(brick, ballType);
    
    if (actualDmg <= 0) {
        synth.playThud();
        createHitParticles(hitX, hitY, 3, '#7f8c8d');
        return; // No damage to HP, but shield was already consumed & special effects triggered
    }
    
    brick.hp -= actualDmg;
    // Removed pulseScale animation
    
    // Spawn Hit Particles
    createHitParticles(hitX, hitY, brick.hp <= 0 ? 12 : 5, getBrickColor(brick.hp, brick.maxHp, brick));
    
    if (brick.hp <= 0) {
        // Destroyed!
        synth.playBreak();
        
        let bonusCoin = BRICK_COIN_UPGRADES[brickCoinUpgradeLevel] ? BRICK_COIN_UPGRADES[brickCoinUpgradeLevel].bonus : 0;
        let coinsGained = 10 + bonusCoin;
        
        if (brick.isBoss) {
            let spawnedWave = wave; // Use current wave for boss kill
            if (brick.isMegaBoss) {
                coinsGained = 17700000 / 100 + bonusCoin; // Special reward
                createFloatingText(brick.x, brick.y, `+${coinsGained} ₩ MEGA BOSS!!!`, '#ff0055');
            } else {
                coinsGained = spawnedWave * 10 + bonusCoin;
                createFloatingText(brick.x, brick.y, `+${coinsGained} ₩ BOSS!`, '#8e44ad');
            }
            checkBossDefeatBuffs(spawnedWave);
        } else if (brick.color === '#00d7ff') {
            coinsGained = 30 + bonusCoin;
            createFloatingText(brick.x, brick.y, `+${coinsGained} ₩ ★`, '#00d7ff');
        } else {
            createFloatingText(brick.x, brick.y, `+${coinsGained} ₩`, '#ffd700');
        }
        
        if (highestBossDefeated >= 100) coinsGained *= 2;
        
        coins += coinsGained;
        score += brick.maxHp * 10;
        createCoinVacuumParticles(brick.x, brick.y);
        
        // Remove brick
        const idx = bricks.indexOf(brick);
        if (idx > -1) bricks.splice(idx, 1);
        
        updateUI();
    } else {
        synth.playHit(comboCount);
    }
}

function triggerSpecialBallEffects(brick, ballType) {
    if (!ballType || ballType === 'basic' || ballType === 'steel') return;
    
    let laserChance = 0;
    let bombChance = 0;
    
    if (wave < 20) laserChance = 0.30;
    else if (wave < 40) laserChance = 0.40;
    else laserChance = 0.50;
    
    if (highestBossDefeated >= 20) laserChance = 0.40;
    if (highestBossDefeated >= 30) laserChance = 0.50;
    
    if (highestBossDefeated >= 40) bombChance = 0.40;
    else bombChance = 0.30;
    
    if (highestBossDefeated >= 50) { laserChance = 0.60; bombChance = 0.50; }
    if (highestBossDefeated >= 60) { laserChance = 0.70; bombChance = 0.60; }
    if (highestBossDefeated >= 80) { laserChance = 0.80; bombChance = 0.70; }
    if (highestBossDefeated >= 90) { laserChance = 0.90; bombChance = 0.80; }
    if (highestBossDefeated >= 100) { laserChance = 1.00; bombChance = 0.90; }
    
    let laserDmg = 2;
    let crossLaserDmg = 3;
    let bombDmg = 5;
    
    if (highestBossDefeated >= 30) {
        laserDmg += 2;
        crossLaserDmg += 2;
    }
    if (highestBossDefeated >= 70) {
        laserDmg += 5;        // 70W 보스 처치 시 레이저 데미지 +5 (총 9, 방어력 5~8 벽돌 관통)
        crossLaserDmg += 5;   // 70W 보스 처치 시 십자 레이저 데미지 +5 (총 10)
        bombDmg = Math.max(bombDmg * 2, 12); // 폭탄 데미지 12 (방어력 5~8 관통)
    }
    if (highestBossDefeated >= 100) {
        laserDmg *= 2;
        crossLaserDmg *= 2;
        bombDmg *= 2;
    }
    
    if (ballType === 'horizontal') {
        if (Math.random() < laserChance) triggerLaser(brick, 'horizontal', laserDmg);
    } else if (ballType === 'vertical') {
        if (Math.random() < laserChance) triggerLaser(brick, 'vertical', laserDmg);
    } else if (ballType === 'bomb') {
        if (Math.random() < bombChance) triggerBombExplosion(brick, bombDmg);
    } else if (ballType === 'cross') {
        if (Math.random() < laserChance) triggerLaser(brick, 'cross', crossLaserDmg);
    }
}

function checkBossDefeatBuffs(bossWave) {
    if (bossWave > highestBossDefeated) {
        highestBossDefeated = bossWave;
        activeBuffs = []; // Rebuild for UI
        
        if (highestBossDefeated >= 10) {
            coins += 500;
            createFloatingText(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, '+500 ₩ (WAVE 10 BOSS)', '#ffd700');
            activeBuffs.push("Wave 10: +500 Coins");
        }
        if (highestBossDefeated >= 20) activeBuffs.push("Wave 20: Laser Chance +10%");
        if (highestBossDefeated >= 30) activeBuffs.push("Wave 30: Laser DMG +2, Laser Chance +10%");
        if (highestBossDefeated >= 40) activeBuffs.push("Wave 40: Base DMG +1, Bomb Chance +10%");
        if (highestBossDefeated >= 50) {
            activeBuffs.push("Wave 50: Laser/Bomb Chance +10%");
            if (!gachaRatesChanged) {
                gachaRatesChanged = true;
                // Change Gacha Probabilities
                GACHA_BALLS.find(b => b.type === 'basic').prob = 0.10;
                GACHA_BALLS.find(b => b.type === 'steel').prob = 0.10;
                GACHA_BALLS.find(b => b.type === 'horizontal').prob = 0.15;
                GACHA_BALLS.find(b => b.type === 'vertical').prob = 0.15;
                GACHA_BALLS.find(b => b.type === 'bomb').prob = 0.25;
                GACHA_BALLS.find(b => b.type === 'cross').prob = 0.25;
            }
        }
        if (highestBossDefeated >= 60) activeBuffs.push("Wave 60: Laser/Bomb Chance +10%");
        if (highestBossDefeated >= 70) activeBuffs.push("Wave 70: Laser DMG +3, Bomb DMG x2");
        if (highestBossDefeated >= 80) {
            activeBuffs.push("Wave 80: Laser/Bomb Chance +10%");
            // Trigger 1-time steel ball conversion modal if exactly hitting 80
            if (bossWave === 80) {
                document.getElementById('wave-80-overlay').classList.remove('hidden');
            }
        }
        if (highestBossDefeated >= 90) activeBuffs.push("Wave 90: Base DMG +3, Laser/Bomb Chance +10%");
        if (highestBossDefeated >= 100) activeBuffs.push("Wave 100: Final DMG x2, Coin Gain x2, Laser Chance 100%");

        updateBuffsUI();
    }
}

// 웨이브 스킵 시 해당 웨이브 전 보스 버프를 모두 재계산하여 적용
function applyBuffsForWave(targetWave) {
    // targetWave 이전에 처치했을 보스 웨이브 목록 계산 (10의 배수)
    const highestBossWave = Math.floor((targetWave - 1) / 10) * 10;
    
    // 기존 버프 및 가챠 확률 초기화
    highestBossDefeated = 0;
    activeBuffs = [];
    if (gachaRatesChanged) {
        gachaRatesChanged = false;
        GACHA_BALLS.find(b => b.type === 'basic').prob = 0.30;
        GACHA_BALLS.find(b => b.type === 'steel').prob = 0.20;
        GACHA_BALLS.find(b => b.type === 'horizontal').prob = 0.15;
        GACHA_BALLS.find(b => b.type === 'vertical').prob = 0.15;
        GACHA_BALLS.find(b => b.type === 'bomb').prob = 0.10;
        GACHA_BALLS.find(b => b.type === 'cross').prob = 0.10;
    }
    
    if (highestBossWave <= 0) {
        updateBuffsUI();
        return;
    }
    
    // 해당 범위의 보스 버프를 순서대로 적용
    highestBossDefeated = highestBossWave;
    
    if (highestBossDefeated >= 10) activeBuffs.push("Wave 10: +500 Coins");
    if (highestBossDefeated >= 20) activeBuffs.push("Wave 20: Laser Chance +10%");
    if (highestBossDefeated >= 30) activeBuffs.push("Wave 30: Laser DMG +2, Laser Chance +10%");
    if (highestBossDefeated >= 40) activeBuffs.push("Wave 40: Base DMG +1, Bomb Chance +10%");
    if (highestBossDefeated >= 50) {
        activeBuffs.push("Wave 50: Laser/Bomb Chance +10%");
        gachaRatesChanged = true;
        GACHA_BALLS.find(b => b.type === 'basic').prob = 0.10;
        GACHA_BALLS.find(b => b.type === 'steel').prob = 0.10;
        GACHA_BALLS.find(b => b.type === 'horizontal').prob = 0.15;
        GACHA_BALLS.find(b => b.type === 'vertical').prob = 0.15;
        GACHA_BALLS.find(b => b.type === 'bomb').prob = 0.25;
        GACHA_BALLS.find(b => b.type === 'cross').prob = 0.25;
    }
    if (highestBossDefeated >= 60) activeBuffs.push("Wave 60: Laser/Bomb Chance +10%");
    if (highestBossDefeated >= 70) activeBuffs.push("Wave 70: Laser DMG +3, Bomb DMG x2");
    if (highestBossDefeated >= 80) activeBuffs.push("Wave 80: Laser/Bomb Chance +10%");
    if (highestBossDefeated >= 90) activeBuffs.push("Wave 90: Base DMG +3, Laser/Bomb Chance +10%");
    if (highestBossDefeated >= 100) activeBuffs.push("Wave 100: Final DMG x2, Coin Gain x2, Laser Chance 100%");
    
    updateBuffsUI();
}

function updateBuffsUI() {
    const buffList = document.getElementById('buff-list');
    if (!buffList) return;
    buffList.innerHTML = '';
    
    // Reverse to show newest first
    const reversed = [...activeBuffs].reverse();
    reversed.forEach((buff, index) => {
        const item = document.createElement('div');
        item.className = 'buff-item' + (index === 0 ? ' highlight' : '');
        item.textContent = buff;
        buffList.appendChild(item);
    });
}

// Special Weapon triggers
function triggerLaser(origin, type, dmg) {
    synth.playLaser();
    
    // Determine beam center (support brick object or row/col numbers for backwards compatibility)
    let centerX, centerY;
    let targetRows = [];
    let targetCols = [];

    if (typeof origin === 'object' && origin !== null) {
        centerX = origin.x;
        centerY = origin.targetY !== undefined ? origin.targetY : origin.y;
        const rSpan = origin.rowSpan || 1;
        const cSpan = origin.colSpan || 1;
        for (let r = 0; r < rSpan; r++) targetRows.push(origin.row + r);
        for (let c = 0; c < cSpan; c++) targetCols.push(origin.col + c);
    } else {
        // legacy call: triggerLaser(row, col, dmg)
        const row = origin;
        const col = type;
        if (row !== -1 && col === -1) {
            type = 'horizontal';
            centerY = TOP_MARGIN + row * ROW_HEIGHT + ROW_HEIGHT/2;
            targetRows.push(row);
        } else if (row === -1 && col !== -1) {
            type = 'vertical';
            centerX = col * COL_WIDTH + COL_WIDTH/2;
            targetCols.push(col);
        } else {
            type = 'cross';
            centerY = TOP_MARGIN + row * ROW_HEIGHT + ROW_HEIGHT/2;
            centerX = col * COL_WIDTH + COL_WIDTH/2;
            targetRows.push(row);
            targetCols.push(col);
        }
    }
    
    // Create laser line visual effects spanning full canvas smoothly
    if (type === 'horizontal') {
        effects.push({
            type: 'laser',
            x1: 0,
            y1: centerY,
            x2: CANVAS_WIDTH,
            y2: centerY,
            color: '#00e676',
            life: 1.0,
            thickness: 8
        });
        
        // Damage all bricks intersecting target rows
        for (let i = bricks.length - 1; i >= 0; i--) {
            const b = bricks[i];
            const bRows = [];
            const rSpan = b.rowSpan || 1;
            for (let r = 0; r < rSpan; r++) bRows.push(b.row + r);
            if (bRows.some(r => targetRows.includes(r))) {
                applyLaserDamage(b, dmg);
            }
        }
    } else if (type === 'vertical') {
        effects.push({
            type: 'laser',
            x1: centerX,
            y1: 0,
            x2: centerX,
            y2: CANVAS_HEIGHT,
            color: '#ff007f',
            life: 1.0,
            thickness: 8
        });
        
        // Damage all bricks intersecting target columns
        for (let i = bricks.length - 1; i >= 0; i--) {
            const b = bricks[i];
            const bCols = [];
            const cSpan = b.colSpan || 1;
            for (let c = 0; c < cSpan; c++) bCols.push(b.col + c);
            if (bCols.some(c => targetCols.includes(c))) {
                applyLaserDamage(b, dmg);
            }
        }
    } else if (type === 'cross') {
        effects.push({
            type: 'laser',
            x1: 0,
            y1: centerY,
            x2: CANVAS_WIDTH,
            y2: centerY,
            color: '#ffd700',
            life: 1.0,
            thickness: 10
        });
        effects.push({
            type: 'laser',
            x1: centerX,
            y1: 0,
            x2: centerX,
            y2: CANVAS_HEIGHT,
            color: '#ffd700',
            life: 1.0,
            thickness: 10
        });
        
        // Damage all bricks intersecting target rows or cols
        for (let i = bricks.length - 1; i >= 0; i--) {
            const b = bricks[i];
            const bRows = [];
            const bCols = [];
            const rSpan = b.rowSpan || 1;
            const cSpan = b.colSpan || 1;
            for (let r = 0; r < rSpan; r++) bRows.push(b.row + r);
            for (let c = 0; c < cSpan; c++) bCols.push(b.col + c);
            if (bRows.some(r => targetRows.includes(r)) || bCols.some(c => targetCols.includes(c))) {
                applyLaserDamage(b, dmg);
            }
        }
    }
}

function applyLaserDamage(brick, dmg) {
    let actualDmg = dmg;
    
    // Armor: boss uses getBossArmor(), normals use baseArmor + extraArmor
    if (brick.isSteelBrick) {
        actualDmg = 1;
    } else if (brick.isBoss) {
        const armor = getBossArmor(wave, brick.isMegaBoss || false);
        actualDmg = Math.max(0, actualDmg - armor);
    } else {
        const armor = (brick.baseArmor || 0) + (brick.extraArmor || 0);
        if (armor > 0) actualDmg = Math.max(0, actualDmg - armor);
    }
    
    // Shield Logic (process BEFORE early return so shield always takes hits)
    if (brick.shield > 0) {
        if (brick.shield >= actualDmg) {
            brick.shield -= actualDmg;
            actualDmg = 0;
        } else {
            actualDmg -= brick.shield;
            brick.shield = 0;
        }
    }
    
    if (actualDmg <= 0) {
        synth.playThud();
        createHitParticles(brick.x, brick.y, 3, '#7f8c8d');
        return; // No damage to HP, but shield was already consumed above
    }
    
    brick.hp -= actualDmg;
    // Removed pulseScale
    
    createHitParticles(brick.x, brick.y, 4, getBrickColor(brick.hp, brick.maxHp, brick));
    
    if (brick.hp <= 0) {
        synth.playBreak();
        
        let bonusCoin = BRICK_COIN_UPGRADES[brickCoinUpgradeLevel] ? BRICK_COIN_UPGRADES[brickCoinUpgradeLevel].bonus : 0;
        let coinsGained = 10 + bonusCoin;
        
        if (brick.isBoss) {
            let spawnedWave = brick.spawnedAtWave || wave; // spawnedAtWave로 정확한 웨이브 사용
            coinsGained = spawnedWave * 10 + bonusCoin;
            createFloatingText(brick.x, brick.y, `+${coinsGained} ₩ BOSS!`, '#8e44ad');
            checkBossDefeatBuffs(spawnedWave);
        } else if (brick.color === '#00d7ff') {
            coinsGained = 30 + bonusCoin;
            createFloatingText(brick.x, brick.y, `+30 ₩ ★`, '#00d7ff');
        } else {
            createFloatingText(brick.x, brick.y, `+${coinsGained} ₩`, '#ffd700');
        }
        
        if (highestBossDefeated >= 100) coinsGained *= 2;
        
        coins += coinsGained;
        score += brick.maxHp * 10;
        createCoinVacuumParticles(brick.x, brick.y);
        
        const idx = bricks.indexOf(brick);
        if (idx > -1) bricks.splice(idx, 1);
        
        updateUI();
    }
}

function triggerBombExplosion(origin, dmg) {
    synth.playExplosion();
    
    // Add screenshake! (일반 진동 – shakeIntensity 배율 적용)
    screenShakeTimer = 0.35; // 350ms
    screenShakeMagnitude = 6 * shakeIntensity;
    
    let bx, by;
    let targetRows = [];
    let targetCols = [];

    if (typeof origin === 'object' && origin !== null) {
        bx = origin.x;
        by = origin.targetY !== undefined ? origin.targetY : origin.y;
        const rSpan = origin.rowSpan || 1;
        const cSpan = origin.colSpan || 1;
        for (let r = 0; r < rSpan; r++) targetRows.push(origin.row + r);
        for (let c = 0; c < cSpan; c++) targetCols.push(origin.col + c);
    } else {
        // legacy call: triggerBombExplosion(row, col, dmg)
        const row = origin;
        const col = arguments[1];
        dmg = arguments[2] !== undefined ? arguments[2] : dmg;
        bx = col * COL_WIDTH + COL_WIDTH/2;
        by = TOP_MARGIN + row * ROW_HEIGHT + ROW_HEIGHT/2;
        targetRows.push(row);
        targetCols.push(col);
    }
    
    // Exploding graphic
    effects.push({
        type: 'explosion',
        x: bx,
        y: by,
        maxRadius: (origin && origin.isMegaBoss) ? 110 : 75,
        radius: 10,
        color: '#ff5722',
        life: 1.0
    });
    
    // Damage surrounding 3x3 bricks (or surrounding area around multi-cell boss)
    for (let i = bricks.length - 1; i >= 0; i--) {
        const brick = bricks[i];
        const bRows = [];
        const bCols = [];
        const rSpan = brick.rowSpan || 1;
        const cSpan = brick.colSpan || 1;
        for (let r = 0; r < rSpan; r++) bRows.push(brick.row + r);
        for (let c = 0; c < cSpan; c++) bCols.push(brick.col + c);

        const rowAdjacent = bRows.some(br => targetRows.some(tr => Math.abs(br - tr) <= 1));
        const colAdjacent = bCols.some(bc => targetCols.some(tc => Math.abs(bc - tc) <= 1));

        if (rowAdjacent && colAdjacent) {
            applyLaserDamage(brick, dmg);
        }
    }
}

function endTurn() {
    balls = [];
    launcherX = nextLauncherX;
    gameState = 'NEXT_WAVE';
    
    // Reset Shields and temporary extra armor
    bricks.forEach(brick => {
        brick.shield = 0;
        brick.extraArmor = 0; // Extra armor from Defender is per-turn only
    });
    
    // Next wave shift down
    setTimeout(() => {
        wave++;
        spawnBricksAndItems(false);
        
        if (gameState !== 'GAME_OVER') {
            gameState = 'READY';
            bonusBallsThisTurn = 0; // reset collected
            updateUI();
            saveHighScores();
        }
    }, 400);
}

function skipTurn() {
    // Allow skip from READY state (wave skip without throwing balls)
    if (gameState === 'READY') {
        endTurn();
        return;
    }
    if (gameState === 'LAUNCHING' || gameState === 'BOUNCING' || gameState === 'RETURNING') {
        balls.forEach(ball => {
            ball.state = 'done';
            ball.y = FLOOR_Y;
            if (isFirstBallOnFloor) {
                isFirstBallOnFloor = false;
                nextLauncherX = ball.x;
            } else {
                ball.x = nextLauncherX;
            }
        });
        
        // Immediately end the wave instead of waiting for returning logic
        endTurn();
    }
}

function triggerGameOver() {
    gameState = 'GAME_OVER';
    synth.playGameOver();
    saveHighScores();
    
    finalScore.textContent = formatNumber(score);
    finalWave.textContent = wave;
    gameOverOverlay.classList.remove('hidden');
}

// 9. Visual Particle Systems
function createHitParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        effects.push({
            type: 'particle',
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1, // upward drift
            size: Math.random() * 4 + 2,
            color: color,
            life: 1.0,
            decay: Math.random() * 0.05 + 0.03
        });
    }
}

function createCoinVacuumParticles(x, y) {
    // Spawn gold particles that fly toward the coin indicator HUD!
    // HUD coin X coordinate: roughly 40px inside the coin-display container
    // We target the top-left area where coin panel is: x ~ 80, y ~ 35.
    const targetX = 85;
    const targetY = 32;
    
    for (let i = 0; i < 3; i++) {
        effects.push({
            type: 'coin_vacuum',
            x: x + (Math.random() - 0.5) * 15,
            y: y + (Math.random() - 0.5) * 15,
            tx: targetX,
            ty: targetY,
            speed: 0.02 + Math.random() * 0.015,
            progress: 0,
            size: 6,
            color: '#ffd700'
        });
    }
}

function createFloatingText(x, y, text, color) {
    effects.push({
        type: 'text',
        x: x,
        y: y,
        text: text,
        color: color,
        vy: -1.2,
        life: 1.0,
        decay: 0.02
    });
}

function getBrickColor(hp, maxHp, brick) {
    const startColor = (brick && brick.color) ? brick.color : '#f18357';
    const ratio = Math.max(0, Math.min(1, hp / maxHp)); // 0 to 1
    
    // Target Red: rgb(231, 76, 60)
    const targetRed = { r: 231, g: 76, b: 60 };
    
    // Parse starting color
    let startRGB = { r: 241, g: 131, b: 87 }; // Default orange
    if (startColor === '#00d7ff') {
        startRGB = { r: 0, g: 215, b: 255 }; // Cyan
    } else if (startColor === '#8e44ad') {
        startRGB = { r: 142, g: 68, b: 173 }; // Purple Boss
    }
    
    // Interpolate towards red as health drops
    const r_val = Math.round(targetRed.r + (startRGB.r - targetRed.r) * ratio);
    const g_val = Math.round(targetRed.g + (startRGB.g - targetRed.g) * ratio);
    const b_val = Math.round(targetRed.b + (startRGB.b - targetRed.b) * ratio);
    
    return `rgb(${r_val}, ${g_val}, ${b_val})`;
}

// 10. Canvas Rendering
function draw() {
    // Handle screen shake
    let shakeX = 0;
    let shakeY = 0;
    if (screenShakeTimer > 0) {
        shakeX = (Math.random() - 0.5) * screenShakeMagnitude;
        shakeY = (Math.random() - 0.5) * screenShakeMagnitude;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);
    
    // Clear Canvas — black from wave 150+, white otherwise
    const isDarkMode = wave >= 150;
    ctx.fillStyle = isDarkMode ? '#000000' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 1. Draw Grid Lines
    ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 1;
    for (let col = 1; col < GRID_COLS; col++) {
        ctx.beginPath();
        ctx.moveTo(col * COL_WIDTH, TOP_MARGIN);
        ctx.lineTo(col * COL_WIDTH, FLOOR_Y);
        ctx.stroke();
    }
    for (let row = 0; row <= GRID_ROWS - 1; row++) {
        ctx.beginPath();
        ctx.moveTo(0, TOP_MARGIN + row * ROW_HEIGHT);
        ctx.lineTo(CANVAS_WIDTH, TOP_MARGIN + row * ROW_HEIGHT);
        ctx.stroke();
    }

    // 2. Draw Floor line
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, FLOOR_Y);
    ctx.lineTo(CANVAS_WIDTH, FLOOR_Y);
    ctx.stroke();

    // 3. Draw Items
    items.forEach(item => {
        // Smooth slide Y animation
        if (item.y !== item.targetY) {
            item.y += (item.targetY - item.y) * 0.15;
        }
        
        item.angle += 0.03; // Rotate item
        
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.angle);
        
        if (item.type === 'plus') {
            // Draw Ball Plus (+) icon (No glow)
            ctx.strokeStyle = '#27ae60';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner plus sign
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(-6, -1.5, 12, 3);
            ctx.fillRect(-1.5, -6, 3, 12);
        } else if (item.type === 'coin') {
            // Draw Gold coin (No glow)
            ctx.fillStyle = '#f1c40f';
            ctx.strokeStyle = '#d35400';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 0;
            
            ctx.beginPath();
            ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // "₩" symbol
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px Outfit';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('₩', 0, 0.5);
        }
        ctx.restore();
    });

    // 4. Draw Bricks
    bricks.forEach(brick => {
        // Smooth slide Y animation
        if (brick.y !== brick.targetY) {
            brick.y += (brick.targetY - brick.y) * 0.15;
        }

        const color = getBrickColor(brick.hp, brick.maxHp, brick);
        
        ctx.save();
        ctx.translate(brick.x, brick.y);
        
        // MegaBoss is 2x2 sized
        const spanW = (brick.colSpan || 1) * COL_WIDTH;
        const spanH = (brick.rowSpan || 1) * ROW_HEIGHT;
        const lx = -spanW / 2;
        const ly = -spanH / 2;
        const lw = spanW;
        const lh = spanH;

        ctx.fillStyle = color;
        ctx.strokeStyle = isDarkMode ? '#ffffff' : '#000000';
        ctx.lineWidth = brick.isMegaBoss ? 3 : 1;
        ctx.shadowBlur = 0;

        // Draw flat sharp square (no rounding)
        ctx.fillRect(lx, ly, lw, lh);
        ctx.strokeRect(lx, ly, lw, lh);
        
        // Draw Defender Shield Indicator
        if (brick.shield > 0) {
            ctx.fillStyle = 'rgba(0, 215, 255, 0.4)';
            ctx.fillRect(lx, ly, lw, lh);
            ctx.strokeStyle = '#00d7ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(lx+1, ly+1, lw-2, lh-2);
        }

        // Draw white star ★ in top-right corner if originally cyan brick
        if (brick.color === '#00d7ff') {
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Outfit';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.fillText('★', lx + lw - 3, ly + 3);
        }

        // Draw crown 👑 at the top center if Boss brick + armor in bottom-right
        if (brick.isBoss) {
            ctx.fillStyle = '#ffffff';
            ctx.font = brick.isMegaBoss ? '18px Outfit' : '10px Outfit';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(brick.isMegaBoss ? '💀' : '👑', 0, ly + 3);
            
            // Draw armor value in bottom-right with shield emoji
            const armor = getBossArmor(wave, brick.isMegaBoss || false);
            
            if (armor > 0) {
                ctx.font = 'bold 9px Outfit';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillStyle = '#00d7ff';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                const armorText = `🛡${armor}`;
                ctx.strokeText(armorText, lx + lw - 3, ly + lh - 2);
                ctx.fillText(armorText, lx + lw - 3, ly + lh - 2);
            }
        }

        // Draw multiplier indicator (e.g. x3, x9) in bottom-left corner
        if (brick.multiplier && brick.multiplier > 1 && !brick.isBoss) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8px Outfit';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`x${brick.multiplier}`, lx + 3, ly + lh - 2);
        }

        // Draw base armor indicator on non-boss bricks
        if (!brick.isBoss && (brick.baseArmor || 0) > 0) {
            ctx.font = 'bold 8px Outfit';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = '#aaeeff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            const aText = `🛡${brick.baseArmor}`;
            ctx.strokeText(aText, lx + lw - 3, ly + lh - 2);
            ctx.fillText(aText, lx + lw - 3, ly + lh - 2);
        }

        // Draw Health Number Text with Black Stroke Outline
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000'; // Black stroke outline
        ctx.lineWidth = 3.5;
        ctx.textAlign = 'center';
        
        if (brick.shield > 0) {
            // Draw HP slightly higher
            ctx.font = '900 15px Outfit';
            ctx.textBaseline = 'bottom';
            ctx.strokeText(brick.hp, 0, 0);
            ctx.fillText(brick.hp, 0, 0);
            
            // Draw Shield amount lower in gray
            ctx.font = '900 11px Outfit';
            ctx.fillStyle = '#cccccc'; // Light Gray color
            ctx.textBaseline = 'top';
            ctx.strokeText(brick.shield, 0, 1);
            ctx.fillText(brick.shield, 0, 1);
        } else {
            // Normal centered HP
            ctx.font = '900 15px Outfit';
            ctx.textBaseline = 'middle';
            ctx.strokeText(brick.hp, 0, 0);
            ctx.fillText(brick.hp, 0, 0);
        }
        ctx.restore();
    });

    // 5. Draw Aiming dots
    if (isAiming && gameState === 'READY') {
        drawAimingDots();
    }

    // 6. Draw Balls (Active and Launcher)
    if (gameState === 'READY' || gameState === 'NEXT_WAVE') {
        // Draw Stationary Launcher Ball
        drawBallGraphic(launcherX, FLOOR_Y, GACHA_BALLS[0].radius, '#ffffff', 'basic');
    }

    // Draw Next landing spot guide circle
    if (gameState === 'LAUNCHING' || gameState === 'BOUNCING' || gameState === 'RETURNING') {
        if (isFirstBallOnFloor) {
            ctx.save();
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.arc(nextLauncherX, FLOOR_Y, 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    // Active Balls
    balls.forEach(ball => {
        if (ball.state === 'play') {
            // Draw trail
            ctx.save();
            ctx.globalAlpha = 0.25;
            ball.trail.forEach((pos, idx) => {
                ctx.fillStyle = ball.color;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, ball.radius * (idx / ball.trail.length), 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();
            
            drawBallGraphic(ball.x, ball.y, ball.radius, ball.color, ball.type);
        } else if (ball.state === 'returning') {
            drawBallGraphic(ball.x, ball.y, ball.radius, ball.color, ball.type);
        }
    });

    // 7. Render FX / Overlay Effects (Lasers, Explosions, Particles, Texts)
    drawFX();

    ctx.restore(); // Restore shake
    
    // Screen shake update
    if (screenShakeTimer > 0) {
        screenShakeTimer -= 1/60;
    }
}

function drawRoundedRect(c, x, y, width, height, radius) {
    c.beginPath();
    c.moveTo(x + radius, y);
    c.lineTo(x + width - radius, y);
    c.quadraticCurveTo(x + width, y, x + width, y + radius);
    c.lineTo(x + width, y + height - radius);
    c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    c.lineTo(x + radius, y + height);
    c.quadraticCurveTo(x, y + height, x, y + height - radius);
    c.lineTo(x, y + radius);
    c.quadraticCurveTo(x, y, x + radius, y);
    c.closePath();
}

function drawBallGraphic(x, y, radius, color, type) {
    ctx.save();
    ctx.translate(x, y);

    if (type === 'basic') {
        // White Ping Pong Ball 3D Shading
        const grad = ctx.createRadialGradient(-radius*0.25, -radius*0.25, radius*0.1, 0, 0, radius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.6, '#dddddd');
        grad.addColorStop(1, '#9e9e9e');
        
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Soft outer outline
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    } else {
        // Special ball 3D grading
        const grad = ctx.createRadialGradient(-radius*0.2, -radius*0.2, radius*0.15, 0, 0, radius);
        
        // Highlight color
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, color);
        
        // Darken for 3D sphere shadow
        const darker = darkenColor(color, 35);
        grad.addColorStop(1, darker);
        
        ctx.fillStyle = grad;
        ctx.shadowBlur = 0; // No glow
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw subtle ring or core indicator based on special type
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1;
        
        if (type === 'horizontal') {
            ctx.beginPath();
            ctx.moveTo(-radius + 2, 0);
            ctx.lineTo(radius - 2, 0);
            ctx.stroke();
        } else if (type === 'vertical') {
            ctx.beginPath();
            ctx.moveTo(0, -radius + 2);
            ctx.lineTo(0, radius - 2);
            ctx.stroke();
        } else if (type === 'cross') {
            ctx.beginPath();
            ctx.moveTo(-radius + 2.5, 0); ctx.lineTo(radius - 2.5, 0);
            ctx.moveTo(0, -radius + 2.5); ctx.lineTo(0, radius - 2.5);
            ctx.stroke();
        } else if (type === 'bomb') {
            // Draw a tiny black core dot
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(0, 0, 2.5, 0, Math.PI*2);
            ctx.fill();
        }
    }
    ctx.restore();
}

function darkenColor(hex, percent) {
    // Simple hex darken
    let num = parseInt(hex.replace("#",""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    G = (num >> 8 & 0x00FF) - amt,
    B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R<0?0:R>255?255:R)*0x10000 + (G<0?0:G>255?255:G)*0x100 + (B<0?0:B>255?255:B)).toString(16).slice(1);
}

function drawAimingDots() {
    // Tracing aiming dots in aimAngle direction, reflecting off walls
    let curX = launcherX;
    let curY = FLOOR_Y;
    
    let stepX = Math.cos(aimAngle) * 8;
    let stepY = Math.sin(aimAngle) * 8;
    
    ctx.save();
    
    // Draw Launcher Arrow Indicator
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 0;
    
    ctx.beginPath();
    ctx.moveTo(launcherX, FLOOR_Y);
    ctx.lineTo(launcherX + Math.cos(aimAngle) * 35, FLOOR_Y + Math.sin(aimAngle) * 35);
    ctx.stroke();
    
    // Dot settings
    ctx.fillStyle = 'rgba(2, 132, 199, 0.8)';
    ctx.shadowBlur = 0;
    
    // Step along the ray
    for (let i = 0; i < 45; i++) {
        curX += stepX;
        curY += stepY;
        
        // Wall Bounce left/right
        if (curX <= 7) {
            curX = 7;
            stepX = -stepX;
        } else if (curX >= CANVAS_WIDTH - 7) {
            curX = CANVAS_WIDTH - 7;
            stepX = -stepX;
        }
        
        // Top Wall Bounce
        if (curY <= 7) {
            curY = 7;
            stepY = -stepY;
        }
        
        // Floor intersection (should not happen since we point up, but just in case)
        if (curY >= FLOOR_Y) break;
        
        // Check if dot collides with any brick
        let hitBrick = false;
        for (let j = 0; j < bricks.length; j++) {
            const brick = bricks[j];
            const bx = brick.x - COL_WIDTH / 2;
            const by = brick.y - ROW_HEIGHT / 2;
            
            // Simple check
            if (curX >= bx + 1 && curX <= bx + COL_WIDTH - 1 && curY >= by + 1 && curY <= by + ROW_HEIGHT - 1) {
                hitBrick = true;
                break;
            }
        }
        
        if (hitBrick) {
            // Draw a small target ring at the hit spot and terminate trace
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(curX, curY, 8, 0, Math.PI * 2);
            ctx.stroke();
            break;
        }
        
        // Draw dot
        // Dots get slightly smaller along path
        const dotRadius = Math.max(1.5, 4 * (1 - i / 50));
        ctx.beginPath();
        ctx.arc(curX, curY, dotRadius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

function drawFX() {
    for (let i = effects.length - 1; i >= 0; i--) {
        const fx = effects[i];
        
        if (fx.type === 'laser') {
            // Draw a fading neon laser line
            ctx.save();
            ctx.lineCap = 'round';
            ctx.strokeStyle = fx.color;
            ctx.lineWidth = fx.thickness * fx.life;
            ctx.globalAlpha = Math.min(1, fx.life);
            
            // Outer beam glow
            ctx.beginPath();
            ctx.moveTo(fx.x1, fx.y1);
            ctx.lineTo(fx.x2, fx.y2);
            ctx.stroke();
            
            // Draw a white bright core inside the beam
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = (fx.thickness * 0.45) * fx.life;
            ctx.beginPath();
            ctx.moveTo(fx.x1, fx.y1);
            ctx.lineTo(fx.x2, fx.y2);
            ctx.stroke();
            
            ctx.restore();
            
            fx.life -= 0.05; // Smoother fade out
            if (fx.life <= 0) effects.splice(i, 1);
            
        } else if (fx.type === 'explosion') {
            // Draw expanding orange shockwave ring
            ctx.save();
            ctx.strokeStyle = fx.color;
            ctx.lineWidth = 4 * fx.life;
            ctx.globalAlpha = fx.life;
            ctx.shadowBlur = 0;
            
            ctx.beginPath();
            ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Radial flash
            ctx.fillStyle = fx.color;
            ctx.globalAlpha = fx.life * 0.25;
            ctx.beginPath();
            ctx.arc(fx.x, fx.y, fx.radius * 0.85, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            
            // Expand size
            fx.radius += (fx.maxRadius - fx.radius) * 0.2;
            fx.life -= 0.05;
            if (fx.life <= 0) effects.splice(i, 1);
            
        } else if (fx.type === 'particle') {
            // Draw tiny drift square particles
            ctx.save();
            ctx.fillStyle = fx.color;
            ctx.globalAlpha = fx.life;
            ctx.fillRect(fx.x - fx.size/2, fx.y - fx.size/2, fx.size, fx.size);
            ctx.restore();
            
            fx.x += fx.vx;
            fx.y += fx.vy;
            fx.vy += 0.08; // Gravity
            fx.life -= fx.decay;
            if (fx.life <= 0) effects.splice(i, 1);
            
        } else if (fx.type === 'coin_vacuum') {
            // Fly toward the coin display HUD
            fx.progress += fx.speed;
            
            // Bezier curve to move in a nice arc path
            const startX = fx.x;
            const startY = fx.y;
            const controlX = startX + (fx.tx - startX) * 0.1;
            const controlY = startY - 150; // Curve upwards
            
            const t = fx.progress;
            const u = 1 - t;
            
            // Quadratic Bezier formula
            const currentX = u * u * startX + 2 * u * t * controlX + t * t * fx.tx;
            const currentY = u * u * startY + 2 * u * t * controlY + t * t * fx.ty;
            
            ctx.save();
            ctx.fillStyle = fx.color;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(currentX, currentY, fx.size * (1 - t*0.3), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            if (t >= 1.0) {
                effects.splice(i, 1);
            }
            
        } else if (fx.type === 'text') {
            // Floating text
            ctx.save();
            ctx.fillStyle = fx.color;
            ctx.font = '900 13px Outfit';
            ctx.textAlign = 'center';
            ctx.globalAlpha = fx.life;
            ctx.fillText(fx.text, fx.x, fx.y);
            ctx.restore();
            
            fx.y += fx.vy;
            fx.life -= fx.decay;
            if (fx.life <= 0) effects.splice(i, 1);
        }
    }
}

// 11. Event Listeners & Game Loop
let lastTime = 0;
function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min(0.03, (timestamp - lastTime) / 1000);
    lastTime = timestamp;
    
    updatePhysics(dt);
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Start listener setup
function setupEvents() {
    // Mouse Listeners
    canvas.addEventListener('mousedown', startAiming);
    window.addEventListener('mousemove', continueAiming);
    window.addEventListener('mouseup', endAiming);
    
    // Touch Listeners (Mobile support)
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startAiming(e);
    });
    window.addEventListener('touchmove', (e) => {
        continueAiming(e);
    }, { passive: true });
    window.addEventListener('touchend', (e) => {
        endAiming();
    });

    // DevMode: 'W' key to jump to a specific wave
    window.addEventListener('keydown', (e) => {
        if (isDevMode && (e.key === 'w' || e.key === 'W')) {
            const input = prompt("이동할 웨이브를 입력하세요 (숫자):", wave);
            if (input !== null) {
                const targetWave = parseInt(input, 10);
                if (!isNaN(targetWave) && targetWave > 0) {
                    wave = targetWave - 1;
                    bricks = [];
                    items = [];
                    effects = [];
                    gameState = 'READY';
                    
                    // Clear balls
                    balls.forEach(ball => { ball.state = 'done'; ball.y = FLOOR_Y; });
                    balls = [];
                    isFirstBallOnFloor = true;
                    nextLauncherX = launcherX;
                    
                    // 웨이브에 맞는 보스 버프 자동 적용/해제
                    applyBuffsForWave(targetWave);
                    
                    endTurn(); // Moves to next wave (which will be targetWave)
                }
            }
        }
    });

    // Shop triggers
    if (btnOpenShop && shopOverlay) {
        btnOpenShop.addEventListener('click', () => {
            shopOverlay.classList.remove('hidden');
        });
    }
    if (btnCloseShop && shopOverlay) {
        btnCloseShop.addEventListener('click', () => {
            shopOverlay.classList.add('hidden');
        });
    }

    // Settings triggers
    if (btnOpenSettings && settingsOverlay) {
        btnOpenSettings.addEventListener('click', () => {
            // Sync slider to current synth volume when opening
            const currentVol = Math.round(synth.currentVolume * 100);
            if (volumeSlider) volumeSlider.value = currentVol;
            if (volumeValueText) volumeValueText.textContent = `${currentVol}%`;
            // Sync shake slider
            const currentShake = Math.round(shakeIntensity * 100);
            if (shakeSlider) shakeSlider.value = currentShake;
            if (shakeValueText) shakeValueText.textContent = `${currentShake}%`;
            // Sync mute button state
            if (muteStatusText) muteStatusText.textContent = isMuted ? '소리 꺼짐' : '소리 켬';
            if (btnToggleMuteSettings) {
                btnToggleMuteSettings.classList.toggle('muted', isMuted);
            }
            // Sync quick gacha setting button state
            if (quickGachaStatusText) quickGachaStatusText.textContent = isQuickGachaClose ? 'ON' : 'OFF';
            if (btnToggleQuickGacha) btnToggleQuickGacha.classList.toggle('active', isQuickGachaClose);
            settingsOverlay.classList.remove('hidden');
        });
    }
    if (btnCloseSettings && settingsOverlay) {
        btnCloseSettings.addEventListener('click', () => {
            settingsOverlay.classList.add('hidden');
        });
    }
    // Close settings when clicking outside the modal content
    if (settingsOverlay) {
        settingsOverlay.addEventListener('click', (e) => {
            if (e.target === settingsOverlay) {
                settingsOverlay.classList.add('hidden');
            }
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            const vol = parseInt(volumeSlider.value, 10) / 100;
            synth.setVolume(vol);
            if (volumeValueText) volumeValueText.textContent = `${volumeSlider.value}%`;
            // If user drags slider up from 0 and was muted, unmute
            if (vol > 0 && isMuted) {
                isMuted = false;
                synth.setMute(false);
                if (muteStatusText) muteStatusText.textContent = '소리 켬';
                if (btnToggleMuteSettings) btnToggleMuteSettings.classList.remove('muted');
                iconSoundOn.classList.remove('hidden');
                iconSoundOff.classList.add('hidden');
            }
            saveSettings();
        });
    }

    if (shakeSlider) {
        shakeSlider.addEventListener('input', () => {
            const val = parseInt(shakeSlider.value, 10);
            shakeIntensity = Math.max(0, Math.min(1, val / 100));
            if (shakeValueText) shakeValueText.textContent = `${val}%`;
            saveSettings();
        });
    }

    if (btnToggleMuteSettings) {
        btnToggleMuteSettings.addEventListener('click', () => {
            isMuted = !isMuted;
            synth.setMute(isMuted);
            if (muteStatusText) muteStatusText.textContent = isMuted ? '소리 꺼짐' : '소리 켬';
            btnToggleMuteSettings.classList.toggle('muted', isMuted);
            // Sync footer sound button icons too
            if (isMuted) {
                iconSoundOn.classList.add('hidden');
                iconSoundOff.classList.remove('hidden');
            } else {
                iconSoundOn.classList.remove('hidden');
                iconSoundOff.classList.add('hidden');
            }
            saveSettings();
        });
    }

    if (btnToggleQuickGacha) {
        btnToggleQuickGacha.addEventListener('click', () => {
            isQuickGachaClose = !isQuickGachaClose;
            if (quickGachaStatusText) quickGachaStatusText.textContent = isQuickGachaClose ? 'ON' : 'OFF';
            btnToggleQuickGacha.classList.toggle('active', isQuickGachaClose);
            saveSettings();
        });
    }

    // Control bar triggers
    btnDraw.addEventListener('click', runGacha);
    btnDraw10.addEventListener('click', runGacha10);
    btnGachaOk.addEventListener('click', acceptDrawnBall);
    btnGacha10Ok.addEventListener('click', accept10DrawnBalls);

    // Upgrade triggers
    if (btnUpgradeCoin) {
        btnUpgradeCoin.addEventListener('click', () => {
            if (brickCoinUpgradeLevel >= 5) return;
            const nextUpgrade = BRICK_COIN_UPGRADES[brickCoinUpgradeLevel + 1];
            if (!nextUpgrade) return;

            if (!isDevMode && coins < nextUpgrade.cost) return;

            synth.init();
            if (isDevMode) {
                devSpentCoins += nextUpgrade.cost;
            } else {
                coins -= nextUpgrade.cost;
            }

            brickCoinUpgradeLevel++;
            synth.playCollect();
            updateUI();
        });
    }

    if (btnUpgradeStar) {
        btnUpgradeStar.addEventListener('click', () => {
            if (brickStarUpgradeLevel >= 5) return;
            const nextStarUpgrade = BRICK_STAR_UPGRADES[brickStarUpgradeLevel + 1];
            if (!nextStarUpgrade) return;

            if (!isDevMode && coins < nextStarUpgrade.cost) return;

            synth.init();
            if (isDevMode) {
                devSpentCoins += nextStarUpgrade.cost;
            } else {
                coins -= nextStarUpgrade.cost;
            }

            brickStarUpgradeLevel++;
            synth.playCollect();
            updateUI();
        });
    }

    // Quick close on gacha overlay click
    if (gachaOverlay) {
        gachaOverlay.addEventListener('click', (e) => {
            if (isQuickGachaClose && !gachaOverlay.classList.contains('hidden')) {
                // If clicked ok button, acceptDrawnBall is triggered already, but clicking anywhere else accepts as well
                if (e.target !== btnGachaOk) {
                    acceptDrawnBall();
                }
            }
        });
    }
    if (gacha10Overlay) {
        gacha10Overlay.addEventListener('click', (e) => {
            if (isQuickGachaClose && !gacha10Overlay.classList.contains('hidden')) {
                if (e.target !== btnGacha10Ok) {
                    accept10DrawnBalls();
                }
            }
        });
    }
    
    btnRestart.addEventListener('click', () => {
        if (confirm("게임을 처음부터 다시 시작하시겠습니까?")) {
            initGame();
        }
    });

    btnRestartOverlay.addEventListener('click', initGame);

    btnSpeed.addEventListener('click', () => {
        if (launchSpeed === 1) {
            launchSpeed = 2;
        } else if (launchSpeed === 2) {
            launchSpeed = 3;
        } else {
            launchSpeed = 1;
        }
        btnSpeed.textContent = `${launchSpeed}x`;
    });
    
    btnSkip.addEventListener('click', skipTurn);
    
    btnWave80Yes.addEventListener('click', () => {
        // Convert all 'basic' balls to 'steel'
        ballInventory = ballInventory.map(ball => ball === 'basic' ? 'steel' : ball);
        updateUI();
        wave80Overlay.classList.add('hidden');
    });
    
    btnWave80No.addEventListener('click', () => {
        wave80Overlay.classList.add('hidden');
    });

    btnSound.addEventListener('click', () => {
        isMuted = !isMuted;
        synth.setMute(isMuted);
        
        if (isMuted) {
            iconSoundOn.classList.add('hidden');
            iconSoundOff.classList.remove('hidden');
        } else {
            iconSoundOn.classList.remove('hidden');
            iconSoundOff.classList.add('hidden');
        }
        // Sync settings modal mute button if open
        if (muteStatusText) muteStatusText.textContent = isMuted ? '소리 꺼짐' : '소리 켬';
        if (btnToggleMuteSettings) btnToggleMuteSettings.classList.toggle('muted', isMuted);
        saveSettings();
    });

    btnPause.addEventListener('click', () => {
        if (gameState === 'GAME_OVER') return;
        isPaused = !isPaused;
        
        if (isPaused) {
            iconPause.classList.add('hidden');
            iconPlay.classList.remove('hidden');
        } else {
            iconPause.classList.remove('hidden');
            iconPlay.classList.add('hidden');
        }
    });

    // Theme switcher removed
    
    // Developer Tool Toggle
    btnDev.addEventListener('click', () => {
        isDevMode = !isDevMode;
        btnDev.style.background = isDevMode ? 'rgba(255,0,85,0.25)' : '';
        updateUI();
    });
    
    // Prevent default context menu on canvas
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        // DevMode: Right click on canvas to instantly destroy brick
        if (!isDevMode || gameState === 'GAME_OVER') return;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;
        
        for (let i = bricks.length - 1; i >= 0; i--) {
            const brick = bricks[i];
            const spanW = (brick.colSpan || 1) * COL_WIDTH;
            const spanH = (brick.rowSpan || 1) * ROW_HEIGHT;
            const bLeft = brick.x - spanW / 2;
            const bTop = brick.y - spanH / 2;
            if (mx >= bLeft && mx <= bLeft + spanW && my >= bTop && my <= bTop + spanH) {
                // Instantly remove and trigger all destruction logic (coins, buffs)
                createFloatingText(brick.x, brick.y, '[DEV] LETHAL', '#ff0055');
                damageBrick(brick, 99999999, brick.x, brick.y);
                break;
            }
        }
    });
}

// Window load triggers
window.addEventListener('load', () => {
    setupEvents();
    loadSettings(); // Restore volume & mute from localStorage
    initGame();
    requestAnimationFrame(gameLoop);
});
