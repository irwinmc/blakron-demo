import { Sprite } from '@blakron/core';
import { Label, Rect, Image } from '@blakron/ui';
import { Tween, Ease } from '@blakron/game';
import { CONTENT_W, makePage, sectionGroup, HEADER_H, SECTION_GAP } from './shared.js';
import type { Navigator } from '../../Navigator.js';

// ── Composite page: all display widgets in one scrollable page ───────────────

export function buildDisplayWidgetsPage(nav: Navigator): Sprite {
	return makePage('Display Widgets', nav, content => {
		let cy = 8;

		// ── Labels ───────────────────────────────────────────────────────
		buildLabels(content, cy);
		cy += 310 + SECTION_GAP;

		// ── Rects ────────────────────────────────────────────────────────
		buildRects(content, cy);
		cy += 130 + SECTION_GAP;

		// ── Image ────────────────────────────────────────────────────────
		buildImage(content, cy);
		cy += 180 + SECTION_GAP;

		// ── Animation ────────────────────────────────────────────────────
		buildAnimation(content, cy);
	});
}

function buildLabels(content: Sprite, baseY: number): void {
	const g = sectionGroup('Labels', baseY);
	content.addChild(g);
	let cy = HEADER_H;

	const lbl1 = new Label('Default Label');
	lbl1.y = cy;
	lbl1.size = 16;
	cy += 34;
	g.addChild(lbl1);

	const lbl2 = new Label('Colored Label');
	lbl2.y = cy;
	cy += 36;
	lbl2.textColor = 0xfeca57;
	lbl2.size = 22;
	g.addChild(lbl2);

	const lbl3 = new Label('Bold Label');
	lbl3.y = cy;
	cy += 34;
	lbl3.bold = true;
	lbl3.size = 20;
	g.addChild(lbl3);

	const lbl4 = new Label('Small Label');
	lbl4.y = cy;
	cy += 28;
	lbl4.size = 13;
	lbl4.textColor = 0x636e72;
	g.addChild(lbl4);

	const lbl5 = new Label('Right-aligned Label');
	lbl5.y = cy;
	lbl5.width = CONTENT_W - 32;
	lbl5.textAlign = 'right';
	lbl5.size = 16;
	lbl5.textColor = 0x74b9ff;
	g.addChild(lbl5);

	cy += 28;

	const lbl6 = new Label(
		'В надвигающихся тучах над морем гордо реет Буревестник, подобный черной молнии. Он кричит, и тучи слышат радость в его смелом крике — жажду бури, силу гнева, пламя страсти и уверенность в победе.',
	);
	lbl6.y = cy;
	lbl6.width = CONTENT_W - 32;
	lbl6.wordWrap = true;
	lbl6.size = 16;
	lbl6.textColor = 0xdfe6e9;
	g.addChild(lbl6);
}

function buildRects(content: Sprite, baseY: number): void {
	const g = sectionGroup('Rects', baseY);
	content.addChild(g);

	const r1 = new Rect(60, 40, 0xff6b6b);
	r1.y = HEADER_H;
	g.addChild(r1);

	const r2 = new Rect(60, 40, 0x48dbfb);
	r2.x = 70;
	r2.y = HEADER_H;
	r2.fillAlpha = 0.6;
	g.addChild(r2);

	const r3 = new Rect(140, 40, 0x2d3436);
	r3.y = HEADER_H + 50;
	r3.strokeColor = 0xfeca57;
	r3.strokeWeight = 2;
	g.addChild(r3);
}

function buildImage(content: Sprite, baseY: number): void {
	const g = sectionGroup('Image (Black_Heron.webp)', baseY);
	content.addChild(g);

	const img = new Image('assets/Black_Heron.webp');
	img.y = HEADER_H;
	img.width = 200;
	img.height = 130;
	img.addEventListener('complete', () => {
		console.log('[UITests] Image loaded:', img.source);
	});
	g.addChild(img);
}

function buildAnimation(content: Sprite, baseY: number): void {
	const g = sectionGroup('Animation (pulse)', baseY);
	content.addChild(g);

	const box = new Rect(60, 60, 0xe17055);
	box.x = 180;
	box.y = HEADER_H + 10;
	g.addChild(box);

	Tween.get(box, { loop: true })
		.to({ scaleX: 1.8, scaleY: 1.8, x: 150, y: -8 }, 600, Ease.sineInOut)
		.to({ scaleX: 1.0, scaleY: 1.0, x: 180, y: HEADER_H + 10 }, 600, Ease.sineInOut);
}
