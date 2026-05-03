import { createPlayer, Sprite, Shape, TextField, TouchEvent, DisplayObject, Stage } from '@blakron/core';
import { CoreScene } from './scenes/CoreScene.js';
import { GameScene } from './scenes/GameScene.js';
import { UIScene } from './scenes/UIScene.js';
import { EXMLScene } from './scenes/EXMLScene.js';

// ── Scene Navigation ─────────────────────────────────────────────────────────

type SceneName = 'core' | 'game' | 'ui' | 'exml';

const SCENE_LABELS: Record<SceneName, string> = {
	core: 'Core',
	game: 'Game',
	ui: 'UI',
	exml: 'EXML',
};

const SCENE_COLORS: Record<SceneName, number> = {
	core: 0x6c5ce7,
	game: 0x00b894,
	ui: 0xe17055,
	exml: 0xfdcb6e,
};

// ── Main ──────────────────────────────────────────────────────────────────────

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

const app = createPlayer({
	canvas,
	contentWidth: window.innerWidth,
	contentHeight: window.innerHeight,
	scaleMode: 'noScale',
	frameRate: 60,
	background: '#1a1a2e',
});

// ── Root container ────────────────────────────────────────────────────────────

const root = new Sprite();
app.start(root);

// ── Tab bar ───────────────────────────────────────────────────────────────────

const tabBar = new Sprite();
tabBar.y = 0;
root.addChild(tabBar);

// Tab background
const tabBg = new Shape();
tabBg.graphics.beginFill(0x16213e);
tabBg.graphics.drawRect(0, 0, window.innerWidth, 44);
tabBg.graphics.endFill();
tabBar.addChild(tabBg);

// Scene container (below tab bar)
const sceneContainer = new Sprite();
sceneContainer.y = 44;
root.addChild(sceneContainer);

let currentScene: Sprite | undefined;
let activeTab: SceneName = 'core';

function createTabButton(name: SceneName, x: number): void {
	const w = 100;
	const h = 36;
	const isActive = name === activeTab;

	const tab = new Sprite();
	tab.x = x;
	tab.y = 4;
	tab.touchEnabled = true;

	// Background
	const bg = new Shape();
	bg.graphics.beginFill(isActive ? SCENE_COLORS[name] : 0x0f3460);
	bg.graphics.drawRoundRect(0, 0, w, h, 6);
	bg.graphics.endFill();
	tab.addChild(bg);

	// Label
	const label = new TextField();
	label.text = SCENE_LABELS[name];
	label.textColor = isActive ? 0xffffff : 0xb2bec3;
	label.size = 14;
	label.bold = isActive;
	label.x = 0;
	label.y = 0;
	label.width = w;
	label.height = h;
	label.textAlign = 'center';
	label.verticalAlign = 'middle';
	tab.addChild(label);

	// Tap handler
	tab.addEventListener(TouchEvent.TOUCH_TAP, () => {
		switchScene(name);
	});

	tabBar.addChild(tab);
}

function switchScene(name: SceneName): void {
	if (name === activeTab && currentScene) return;
	activeTab = name;

	// Rebuild tab bar
	while (tabBar.numChildren > 1) {
		tabBar.removeChildAt(tabBar.numChildren - 1);
	}

	const tabs: SceneName[] = ['core', 'game', 'ui', 'exml'];
	tabs.forEach((t, i) => createTabButton(t, 20 + i * 120));

	// Remove old scene
	if (currentScene) {
		sceneContainer.removeChild(currentScene);
	}

	// Create new scene
	switch (name) {
		case 'core':
			currentScene = new CoreScene(window.innerWidth);
			(currentScene as CoreScene).create();
			break;
		case 'game':
			currentScene = new GameScene();
			(currentScene as GameScene).create();
			break;
		case 'ui':
			currentScene = new UIScene(window.innerWidth, window.innerHeight - 44);
			(currentScene as UIScene).create();
			break;
		case 'exml':
			currentScene = new EXMLScene(window.innerWidth, window.innerHeight - 44);
			(currentScene as EXMLScene).create();
			break;
	}

	sceneContainer.addChild(currentScene);

	// Info text
	console.log(`[Blakron Demo] Switched to ${SCENE_LABELS[name]} scene`);
}

// ── FPS display ───────────────────────────────────────────────────────────────

const fpsText = new TextField();
fpsText.text = 'FPS: --';
fpsText.textColor = 0x636e72;
fpsText.size = 11;
fpsText.x = window.innerWidth - 80;
fpsText.y = 14;
tabBar.addChild(fpsText);

setInterval(() => {
	fpsText.text = `FPS: ${Math.round(app.player.perf.fps)}`;
}, 500);

// ── Start ─────────────────────────────────────────────────────────────────────

switchScene('core');
console.log('[Blakron Demo] Started — click tabs to switch scenes');
console.log(`[Blakron Demo] Renderer: ${app.player.isWebGL ? 'WebGL' : 'Canvas 2D'}`);

// ── Resize ────────────────────────────────────────────────────────────────────

app.stage.addEventListener(Event.RESIZE, () => {
	const w = app.stage.stageWidth;
	const h = app.stage.stageHeight;

	// Redraw tab bar background
	tabBg.graphics.clear();
	tabBg.graphics.beginFill(0x16213e);
	tabBg.graphics.drawRect(0, 0, w, 44);
	tabBg.graphics.endFill();

	// Move FPS display
	fpsText.x = w - 80;

	// Recreate current scene with new dimensions
	const current = activeTab;
	activeTab = '' as SceneName;
	switchScene(current);
});
