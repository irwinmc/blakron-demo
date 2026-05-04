import { createPlayer } from '@blakron/core';
import { Navigator } from './Navigator.js';
import { createMainMenu } from './pages/MainMenu.js';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

const app = createPlayer({
	canvas,
	contentWidth: 640,
	contentHeight: 1136,
	scaleMode: 'showAll',
	frameRate: 60,
	background: '#1a1a2e',
});

const nav = new Navigator();
app.start(nav);

nav.push(createMainMenu(nav));

console.log('[Blakron Demo] Started (640×1136 showAll)');
console.log(`[Blakron Demo] Renderer: ${app.player.isWebGL ? 'WebGL' : 'Canvas 2D'}`);
