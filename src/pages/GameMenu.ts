import { Sprite, Bitmap, BitmapData, Texture, TextField, Shape } from '@blakron/core';
import { Tween, Ease, MovieClip, MovieClipData } from '@blakron/game';
import { Label } from '@blakron/ui';
import { createTitleBar, createContentArea, createMenuCard, CONTENT_W, CARD_H, CARD_GAP } from './common.js';
import { Navigator } from '../Navigator.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeCircleTexture(size: number, color: string): Texture {
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d')!;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
	ctx.fill();
	const bd = new BitmapData(canvas);
	const tex = new Texture();
	tex.setBitmapData(bd);
	return tex;
}

function makeFrameTexture(index: number, total: number, size: number): Texture {
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d')!;
	const hue = (index / total) * 360;
	ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
	ctx.fillRect(0, 0, size, size);
	ctx.fillStyle = '#fff';
	ctx.font = `bold ${size * 0.4}px Arial`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(String(index + 1), size / 2, size / 2);
	const bd = new BitmapData(canvas);
	const tex = new Texture();
	tex.setBitmapData(bd);
	return tex;
}

// ── Page builder helper ───────────────────────────────────────────────────────

function makePage(title: string, nav: Navigator, buildContent: (content: Sprite) => void): Sprite {
	const page = new Sprite();
	page.addChild(createTitleBar(title, () => nav.pop()));

	const content = createContentArea();
	buildContent(content);
	page.addChild(content);

	return page;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Individual Game test pages
// ═══════════════════════════════════════════════════════════════════════════════

function buildBasicTweenPage(nav: Navigator): Sprite {
	return makePage('Basic Tween', nav, content => {
		let cy = 16;

		const header = new Label('x + alpha animation');
		header.x = 16;
		header.y = cy;
		header.width = CONTENT_W - 32;
		header.height = 22;
		header.textColor = 0xb2bec3;
		header.size = 16;
		header.bold = true;
		content.addChild(header);
		cy += 36;

		// Ball 1: x + alpha
		const ball = new Bitmap(makeCircleTexture(24, '#ff6b6b'));
		ball.x = 30;
		ball.y = cy;
		content.addChild(ball);

		const ballLabel = new Label('sineInOut loop');
		ballLabel.x = 30;
		ballLabel.y = cy + 32;
		ballLabel.textColor = 0x636e72;
		ballLabel.size = 13;
		content.addChild(ballLabel);

		Tween.get(ball, { loop: true })
			.to({ x: 350, alpha: 0.3 }, 1500, Ease.sineInOut)
			.to({ x: 30, alpha: 1.0 }, 1500, Ease.sineInOut);

		cy += 68;

		// Ball 2: x with bounce
		const ball2 = new Bitmap(makeCircleTexture(20, '#48dbfb'));
		ball2.x = 30;
		ball2.y = cy;
		content.addChild(ball2);

		const ball2Label = new Label('bounceOut + wait');
		ball2Label.x = 30;
		ball2Label.y = cy + 30;
		ball2Label.textColor = 0x636e72;
		ball2Label.size = 13;
		content.addChild(ball2Label);

		Tween.get(ball2, { loop: true })
			.to({ x: 350 }, 1500, Ease.bounceOut)
			.wait(300)
			.to({ x: 30 }, 1500, Ease.cubicOut);

		// Track line
		cy += 60;
		const track = new Shape();
		track.graphics.lineStyle(1, 0x2d3436);
		track.graphics.moveTo(30, cy);
		track.graphics.lineTo(380, cy);
		track.graphics.endFill();
		content.addChild(track);

		const trackLabel = new Label('← Track range (x: 30 → 350) →');
		trackLabel.x = 30;
		trackLabel.y = cy + 6;
		trackLabel.width = 360;
		trackLabel.textColor = 0x636e72;
		trackLabel.size = 13;
		trackLabel.textAlign = 'center';
		content.addChild(trackLabel);
	});
}

function buildChainedTweenPage(nav: Navigator): Sprite {
	return makePage('Chained Tween', nav, content => {
		let cy = 16;

		const header = new Label('scale → rotate → alpha → squish');
		header.x = 16;
		header.y = cy;
		header.width = CONTENT_W - 32;
		header.height = 22;
		header.textColor = 0xb2bec3;
		header.size = 16;
		header.bold = true;
		content.addChild(header);
		cy += 40;

		const ball = new Bitmap(makeCircleTexture(28, '#feca57'));
		ball.x = 120;
		ball.y = cy + 60;
		content.addChild(ball);

		Tween.get(ball, { loop: true })
			.to({ scaleX: 2, scaleY: 2 }, 600, Ease.backOut)
			.to({ rotation: 360 }, 800, Ease.cubicInOut)
			.to({ scaleX: 1, scaleY: 1, alpha: 0.4 }, 500, Ease.sineIn)
			.wait(200)
			.set({ alpha: 1.0, rotation: 0 })
			.to({ scaleX: 1.5, scaleY: 0.5 }, 300, Ease.sineOut)
			.to({ scaleX: 1, scaleY: 1 }, 300, Ease.sineOut)
			.wait(500);

		// Chain description
		cy += 140;
		const steps = [
			'1. Scale up 2× (backOut)',
			'2. Rotate 360° (cubicInOut)',
			'3. Scale down + fade (sineIn)',
			'4. Squish 1.5×0.5 (sineOut)',
			'5. Reset to normal',
		];
		steps.forEach(text => {
			const tf = new Label(text);
			tf.x = 24;
			tf.y = cy;
			tf.width = CONTENT_W - 48;
			tf.height = 22;
			tf.textColor = 0x636e72;
			tf.size = 14;
			content.addChild(tf);
			cy += 24;
		});
	});
}

function buildEaseShowcasePage(nav: Navigator): Sprite {
	return makePage('Ease Functions', nav, content => {
		let cy = 16;

		const header = new Label('5 easing function comparisons');
		header.x = 16;
		header.y = cy;
		header.width = CONTENT_W - 32;
		header.height = 22;
		header.textColor = 0xb2bec3;
		header.size = 16;
		header.bold = true;
		content.addChild(header);
		cy += 36;

		const eases: { name: string; fn: (t: number) => number; color: string }[] = [
			{ name: 'linear', fn: Ease.linear, color: '#ff6b6b' },
			{ name: 'cubicOut', fn: Ease.cubicOut, color: '#48dbfb' },
			{ name: 'elasticOut', fn: Ease.elasticOut, color: '#feca57' },
			{ name: 'bounceOut', fn: Ease.bounceOut, color: '#6c5ce7' },
			{ name: 'backOut', fn: Ease.backOut, color: '#00b894' },
		];

		// Track
		const trackLine = new Shape();
		trackLine.graphics.lineStyle(1, 0x2d3436);
		trackLine.graphics.moveTo(120, cy);
		trackLine.graphics.lineTo(560, cy);
		trackLine.graphics.endFill();
		content.addChild(trackLine);

		eases.forEach((e, i) => {
			const row = new Sprite();
			row.y = cy + i * 32;

			const nameTf = new TextField();
			nameTf.text = e.name;
			nameTf.textColor = 0xdfe6e9;
			nameTf.size = 14;
			nameTf.width = 110;
			nameTf.height = 20;
			row.addChild(nameTf);

			const dot = new Bitmap(makeCircleTexture(10, e.color));
			dot.x = 120;
			dot.y = -5;
			row.addChild(dot);

			Tween.get(dot, { loop: true })
				.to({ x: 540 }, 1200, e.fn)
				.to({ x: 120 }, 800, Ease.sineInOut)
				.wait(200 + i * 100);

			content.addChild(row);
		});
	});
}

function buildMovieClipPage(nav: Navigator): Sprite {
	return makePage('MovieClip', nav, content => {
		let cy = 16;

		const header = new Label('Sprite sheet animation');
		header.x = 16;
		header.y = cy;
		header.width = CONTENT_W - 32;
		header.height = 22;
		header.textColor = 0xb2bec3;
		header.size = 16;
		header.bold = true;
		content.addChild(header);
		cy += 36;

		// Generate 8 frames
		const textures: Texture[] = [];
		for (let i = 0; i < 8; i++) {
			textures.push(makeFrameTexture(i, 8, 48));
		}

		const data = MovieClipData.fromTextureArray(textures, 8);

		// MC1: Normal speed
		const mc1 = new MovieClip(data);
		mc1.x = 24;
		mc1.y = cy;
		mc1.play(-1);
		content.addChild(mc1);

		const mc1Label = new Label('Default (8fps)');
		mc1Label.x = 24;
		mc1Label.y = cy + 56;
		mc1Label.width = 60;
		mc1Label.height = 16;
		mc1Label.textColor = 0x636e72;
		mc1Label.size = 12;
		content.addChild(mc1Label);

		// MC2: 20fps
		const mc2 = new MovieClip(data);
		mc2.x = 100;
		mc2.y = cy;
		mc2.frameRate = 20;
		mc2.play(-1);
		content.addChild(mc2);

		const mc2Label = new Label('20fps');
		mc2Label.x = 100;
		mc2Label.y = cy + 56;
		mc2Label.width = 60;
		mc2Label.height = 16;
		mc2Label.textColor = 0x636e72;
		mc2Label.size = 12;
		content.addChild(mc2Label);

		// MC3: 1.5× scaled
		const mc3 = new MovieClip(data);
		mc3.x = 190;
		mc3.y = cy - 4;
		mc3.scaleX = 1.5;
		mc3.scaleY = 1.5;
		mc3.play(-1);
		content.addChild(mc3);

		const mc3Label = new Label('Scale 1.5×');
		mc3Label.x = 190;
		mc3Label.y = cy + 72;
		mc3Label.width = 80;
		mc3Label.height = 16;
		mc3Label.textColor = 0x636e72;
		mc3Label.size = 12;
		content.addChild(mc3Label);

		// Info
		cy += 100;
		const infos = [
			'• MovieClipData.fromTextureArray — 8 generated frames',
			'• Each frame is a unique hue + number label',
			'• Supports frameRate control & scale transform',
		];
		infos.forEach(text => {
			const tf = new Label(text);
			tf.x = 24;
			tf.y = cy;
			tf.width = CONTENT_W - 48;
			tf.height = 22;
			tf.textColor = 0x636e72;
			tf.size = 14;
			content.addChild(tf);
			cy += 24;
		});
	});
}

function buildOrbitPage(nav: Navigator): Sprite {
	return makePage('Orbit Animation', nav, content => {
		let cy = 16;

		const header = new Label('Rotation-based orbit with nested children');
		header.x = 16;
		header.y = cy;
		header.width = CONTENT_W - 32;
		header.height = 22;
		header.textColor = 0xb2bec3;
		header.size = 16;
		header.bold = true;
		content.addChild(header);
		cy += 40;

		const orbitCenter = new Sprite();
		orbitCenter.x = CONTENT_W / 2;
		orbitCenter.y = cy + 120;
		content.addChild(orbitCenter);

		// Center dot
		const center = new Bitmap(makeCircleTexture(16, '#e17055'));
		center.x = -8;
		center.y = -8;
		orbitCenter.addChild(center);

		// Orbiting dots at various radii
		const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#6c5ce7'];
		for (let i = 0; i < 4; i++) {
			const dot = new Bitmap(makeCircleTexture(8, colors[i]));
			const angle = (i / 4) * Math.PI * 2;
			const radius = 40 + i * 18;
			dot.x = Math.cos(angle) * radius - 4;
			dot.y = Math.sin(angle) * radius - 4;
			orbitCenter.addChild(dot);
		}

		// Orbit ring indicators
		for (let i = 0; i < 4; i++) {
			const ring = new Shape();
			const r = 40 + i * 18;
			ring.graphics.lineStyle(1, 0x2d3436);
			ring.graphics.drawCircle(0, 0, r);
			ring.graphics.endFill();
			orbitCenter.addChild(ring);
		}

		Tween.get(orbitCenter, { loop: true })
			.to({ rotation: 360 }, 3000, Ease.linear)
			.call(() => {
				orbitCenter.rotation = 0;
			});

		// Info
		cy += 260;
		const infos = [
			'• Parent sprite rotates 360° (degrees, not radians)',
			'• Children orbit at different radii (40–94px)',
			'• Uses Ease.linear for constant angular velocity',
			'• Reset rotation to 0° on loop to avoid drift',
		];
		infos.forEach(text => {
			const tf = new Label(text);
			tf.x = 24;
			tf.y = cy;
			tf.width = CONTENT_W - 48;
			tf.height = 22;
			tf.textColor = 0x636e72;
			tf.size = 14;
			content.addChild(tf);
			cy += 24;
		});
	});
}

// ═══════════════════════════════════════════════════════════════════════════════
// Game menu entries
// ═══════════════════════════════════════════════════════════════════════════════

interface MenuEntry {
	title: string;
	description: string;
	accent: number;
	build: (nav: Navigator) => Sprite;
}

const MENU_ENTRIES: MenuEntry[] = [
	{
		title: 'Basic Tween',
		description: 'x + alpha animation with sineInOut and bounceOut',
		accent: 0xff6b6b,
		build: buildBasicTweenPage,
	},
	{
		title: 'Chained Tween',
		description: 'scale → rotate → fade → squish animation sequence',
		accent: 0xfeca57,
		build: buildChainedTweenPage,
	},
	{
		title: 'Ease Functions',
		description: '5 easing functions compared side by side',
		accent: 0x48dbfb,
		build: buildEaseShowcasePage,
	},
	{
		title: 'MovieClip',
		description: 'Sprite sheet animation with 8 generated frames',
		accent: 0x6c5ce7,
		build: buildMovieClipPage,
	},
	{
		title: 'Orbit Animation',
		description: 'Rotation-based orbit with nested children',
		accent: 0xe17055,
		build: buildOrbitPage,
	},
];

// ═══════════════════════════════════════════════════════════════════════════════
// Main entry point
// ═══════════════════════════════════════════════════════════════════════════════

export function createGameMenu(nav: Navigator): Sprite {
	const page = new Sprite();
	page.addChild(createTitleBar('Game', () => nav.pop()));

	const content = createContentArea();
	page.addChild(content);

	// Subtitle
	const subtitle = new Label(`@blakron/game — ${MENU_ENTRIES.length} demos`);
	subtitle.x = 16;
	subtitle.y = 8;
	subtitle.width = CONTENT_W - 32;
	subtitle.height = 20;
	subtitle.textColor = 0x636e72;
	subtitle.size = 14;
	content.addChild(subtitle);

	// Cards
	let cy = 36;
	MENU_ENTRIES.forEach(entry => {
		const card = createMenuCard(
			{
				title: entry.title,
				description: entry.description,
				accent: entry.accent,
				onTap: () => nav.push(entry.build(nav)),
			},
			cy,
		);
		content.addChild(card);
		cy += CARD_H + CARD_GAP;
	});

	return page;
}
