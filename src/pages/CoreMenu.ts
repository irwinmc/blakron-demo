import {
	Sprite,
	Shape,
	Bitmap,
	BitmapData,
	Texture,
	TextField,
	BlurFilter,
	GlowFilter,
	ColorMatrixFilter,
	TouchEvent,
	ImageLoader,
	resource,
	ResourceType,
	Event,
} from '@blakron/core';
import { Label } from '@blakron/ui';
import { createTitleBar, createContentArea, createMenuCard, CONTENT_W, CARD_H, CARD_GAP } from './common.js';
import { Navigator } from '../Navigator.js';

// ── Texture helpers ───────────────────────────────────────────────────────────

function makeGradientTexture(w: number, h: number, colors: string[]): Texture {
	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext('2d')!;
	const grad = ctx.createLinearGradient(0, 0, w, h);
	colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, w, h);
	const bd = new BitmapData(canvas);
	const tex = new Texture();
	tex.setBitmapData(bd);
	return tex;
}

function makeColorTexture(w: number, h: number, color: string): Texture {
	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext('2d')!;
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, w, h);
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
// Individual Core test pages
// ═══════════════════════════════════════════════════════════════════════════════

function buildShapesPage(nav: Navigator): Sprite {
	return makePage('Shapes', nav, content => {
		let cy = 16;

		// Section label
		const header = new Label('Primitive Shapes');
		header.x = 16;
		header.y = cy;
		header.width = CONTENT_W - 32;
		header.height = 22;
		header.textColor = 0xb2bec3;
		header.size = 14;
		header.bold = true;
		content.addChild(header);
		cy += 30;

		// 红色矩形
		const rect = new Shape();
		rect.graphics.beginFill(0xff4444);
		rect.graphics.drawRect(0, 0, 140, 80);
		rect.graphics.endFill();
		rect.x = 16;
		rect.y = cy;
		content.addChild(rect);

		// 蓝色圆
		const circle = new Shape();
		circle.graphics.beginFill(0x4488ff);
		circle.graphics.drawCircle(0, 0, 40);
		circle.graphics.endFill();
		circle.x = 220;
		circle.y = cy + 40;
		content.addChild(circle);

		// 绿色描边圆角矩形
		cy += 96;
		const roundRect = new Shape();
		roundRect.graphics.lineStyle(3, 0x44ff88);
		roundRect.graphics.beginFill(0x224422, 0.5);
		roundRect.graphics.drawRoundRect(0, 0, 280, 60, 12);
		roundRect.graphics.endFill();
		roundRect.x = 16;
		roundRect.y = cy;
		content.addChild(roundRect);

		// 椭圆
		cy += 76;
		const ellipse = new Shape();
		ellipse.graphics.beginFill(0xfeca57, 0.8);
		ellipse.graphics.drawEllipse(0, 0, 180, 60);
		ellipse.graphics.endFill();
		ellipse.x = 16;
		ellipse.y = cy;
		content.addChild(ellipse);

		// Labels
		cy += 76;
		const labels = [
			'■ beginFill + drawRect',
			'● beginFill + drawCircle',
			'▣ lineStyle + drawRoundRect (stroke)',
			'⬮ beginFill + drawEllipse',
		];
		labels.forEach(text => {
			const tf = new Label(text);
			tf.x = 24;
			tf.y = cy;
			tf.width = CONTENT_W - 48;
			tf.height = 20;
			tf.textColor = 0x636e72;
			tf.size = 12;
			content.addChild(tf);
			cy += 22;
		});
	});
}

function buildGraphicsBitmapPage(nav: Navigator): Sprite {
	return makePage('Graphics & Bitmap', nav, content => {
		let cy = 16;

		const header = new Label('Arc, Gradient, Solid Bitmaps');
		header.x = 16;
		header.y = cy;
		header.width = CONTENT_W - 32;
		header.height = 22;
		header.textColor = 0xb2bec3;
		header.size = 14;
		header.bold = true;
		content.addChild(header);
		cy += 36;

		// 弧线
		const arc = new Shape();
		arc.graphics.lineStyle(4, 0xff66ff);
		arc.graphics.drawArc(50, 50, 44, 0, Math.PI * 1.5, false);
		arc.x = 16;
		arc.y = cy;
		content.addChild(arc);

		// 渐变位图
		const gradTex = makeGradientTexture(80, 80, ['#ff9a9e', '#fad0c4', '#ffecd2']);
		const gradBmp = new Bitmap(gradTex);
		gradBmp.x = 140;
		gradBmp.y = cy;
		content.addChild(gradBmp);

		// 纯色位图 × 缩放
		const solidTex = makeColorTexture(32, 32, '#6c5ce7');
		const solidBmp = new Bitmap(solidTex);
		solidBmp.x = 240;
		solidBmp.y = cy;
		solidBmp.scaleX = 2.5;
		solidBmp.scaleY = 2.5;
		content.addChild(solidBmp);

		// 旋转渐变位图
		cy += 100;
		const tex3 = makeGradientTexture(72, 72, ['#00b894', '#00cec9', '#0984e3']);
		const bmp3 = new Bitmap(tex3);
		bmp3.x = 16;
		bmp3.y = cy;
		bmp3.rotation = 15;
		content.addChild(bmp3);

		// Info labels
		cy += 96;
		const infos = [
			'◉ drawArc — arc path with lineStyle',
			'◉ Bitmap from gradient canvas',
			'◉ Bitmap scaled 2.5× from 32px source',
			'◉ Bitmap rotated 15°',
		];
		infos.forEach(text => {
			const tf = new Label(text);
			tf.x = 24;
			tf.y = cy;
			tf.width = CONTENT_W - 48;
			tf.height = 20;
			tf.textColor = 0x636e72;
			tf.size = 12;
			content.addChild(tf);
			cy += 22;
		});
	});
}

function buildTextFiltersPage(nav: Navigator): Sprite {
	return makePage('TextField & Filters', nav, content => {
		let cy = 16;

		// ── TextField section ──────────────────────────────────────────────
		const header1 = new Label('TextField');
		header1.x = 16;
		header1.y = cy;
		header1.width = CONTENT_W - 32;
		header1.height = 22;
		header1.textColor = 0xb2bec3;
		header1.size = 14;
		header1.bold = true;
		content.addChild(header1);
		cy += 28;

		const tf1 = new TextField();
		tf1.text = 'Hello Blakron!';
		tf1.textColor = 0xfeca57;
		tf1.size = 22;
		tf1.bold = true;
		tf1.x = 16;
		tf1.y = cy;
		content.addChild(tf1);
		cy += 32;

		const tf2 = new TextField();
		tf2.text = 'Multi-line\ntext field';
		tf2.textColor = 0xdfe6e9;
		tf2.size = 16;
		tf2.x = 16;
		tf2.y = cy;
		content.addChild(tf2);
		cy += 40;

		const tf3 = new TextField();
		tf3.text = '描边文字';
		tf3.textColor = 0xffffff;
		tf3.size = 20;
		tf3.stroke = 2;
		tf3.strokeColor = 0x000000;
		tf3.x = 16;
		tf3.y = cy;
		content.addChild(tf3);
		cy += 36;

		// ── Filters section ────────────────────────────────────────────────
		const header2 = new Label('Filters');
		header2.x = 16;
		header2.y = cy;
		header2.width = CONTENT_W - 32;
		header2.height = 22;
		header2.textColor = 0xb2bec3;
		header2.size = 14;
		header2.bold = true;
		content.addChild(header2);
		cy += 32;

		// Blur
		const blurTarget = new Shape();
		blurTarget.graphics.beginFill(0xe17055);
		blurTarget.graphics.drawCircle(0, 0, 28);
		blurTarget.graphics.endFill();
		blurTarget.x = 44;
		blurTarget.y = cy + 28;
		blurTarget.filters = [new BlurFilter(6, 6)];
		content.addChild(blurTarget);

		const blurLabel = new Label('BlurFilter');
		blurLabel.x = 16;
		blurLabel.y = cy + 62;
		blurLabel.textColor = 0x636e72;
		blurLabel.size = 11;
		content.addChild(blurLabel);

		// Glow
		const glowTarget = new Shape();
		glowTarget.graphics.beginFill(0x6c5ce7);
		glowTarget.graphics.drawRect(0, 0, 70, 40);
		glowTarget.graphics.endFill();
		glowTarget.x = 120;
		glowTarget.y = cy + 8;
		glowTarget.filters = [new GlowFilter(0x00ff88, 0.8, 10, 10, 3)];
		content.addChild(glowTarget);

		const glowLabel = new Label('GlowFilter');
		glowLabel.x = 120;
		glowLabel.y = cy + 62;
		glowLabel.textColor = 0x636e72;
		glowLabel.size = 11;
		content.addChild(glowLabel);

		// ColorMatrix
		const colorTarget = new Bitmap(makeGradientTexture(100, 40, ['#ff6348', '#ffa502']));
		colorTarget.x = 240;
		colorTarget.y = cy + 8;
		const gray = new ColorMatrixFilter();
		gray.matrix = [0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0, 0, 0, 1, 0];
		colorTarget.filters = [gray];
		content.addChild(colorTarget);

		const cmLabel = new Label('ColorMatrix (grayscale)');
		cmLabel.x = 240;
		cmLabel.y = cy + 62;
		cmLabel.textColor = 0x636e72;
		cmLabel.size = 11;
		content.addChild(cmLabel);
	});
}

function buildEventsPage(nav: Navigator): Sprite {
	return makePage('Events & Interaction', nav, content => {
		let cy = 16;

		const header = new Label('Touch Events & RenderGroup');
		header.x = 16;
		header.y = cy;
		header.width = CONTENT_W - 32;
		header.height = 22;
		header.textColor = 0xb2bec3;
		header.size = 14;
		header.bold = true;
		content.addChild(header);
		cy += 36;

		// Tap counter button
		const btnW = 200;
		const btnH = 50;
		const box = new Sprite();
		box.x = 16;
		box.y = cy;
		box.touchEnabled = true;

		const bg = new Shape();
		bg.graphics.beginFill(0x00b894);
		bg.graphics.drawRoundRect(0, 0, btnW, btnH, 10);
		bg.graphics.endFill();
		box.addChild(bg);

		const btnLabel = new TextField();
		btnLabel.text = 'Tap me! (0)';
		btnLabel.textColor = 0xffffff;
		btnLabel.size = 18;
		btnLabel.x = 0;
		btnLabel.y = 0;
		btnLabel.width = btnW;
		btnLabel.height = btnH;
		btnLabel.textAlign = 'center';
		btnLabel.verticalAlign = 'middle';
		box.addChild(btnLabel);

		let count = 0;
		box.addEventListener(TouchEvent.TOUCH_TAP, () => {
			count++;
			btnLabel.text = `Tap me! (${count})`;
			box.alpha = 0.6;
			setTimeout(() => {
				box.alpha = 1.0;
			}, 100);
		});
		content.addChild(box);

		// Status
		const hint = new Label('Tap the button to test TOUCH_TAP events');
		hint.x = 16;
		hint.y = cy + btnH + 12;
		hint.width = CONTENT_W - 32;
		hint.textColor = 0x636e72;
		hint.size = 12;
		content.addChild(hint);
		cy += btnH + 40;

		// RenderGroup
		const rgHeader = new Label('RenderGroup (batched rendering)');
		rgHeader.x = 16;
		rgHeader.y = cy;
		rgHeader.width = CONTENT_W - 32;
		rgHeader.height = 22;
		rgHeader.textColor = 0xb2bec3;
		rgHeader.size = 14;
		rgHeader.bold = true;
		content.addChild(rgHeader);
		cy += 30;

		const group = new Sprite();
		group.isRenderGroup = true;
		group.x = 16;
		group.y = cy;

		const colors = [0x636e72, 0x2d3436, 0x74b9ff, 0xa29bfe];
		for (let i = 0; i < 4; i++) {
			const tile = new Shape();
			tile.graphics.beginFill(colors[i]);
			tile.graphics.drawRect(0, 0, 60, 60);
			tile.graphics.endFill();
			tile.x = (i % 2) * 64;
			tile.y = Math.floor(i / 2) * 64;
			group.addChild(tile);
		}
		content.addChild(group);

		const rgInfo = new Label('4 tiles rendered as a single batch');
		rgInfo.x = 160;
		rgInfo.y = cy + 8;
		rgInfo.width = CONTENT_W - 180;
		rgInfo.textColor = 0x636e72;
		rgInfo.size = 12;
		content.addChild(rgInfo);
	});
}

function buildImageLoadingPage(nav: Navigator): Sprite {
	return makePage('Image Loading', nav, content => {
		let cy = 16;

		// ── ImageLoader single ─────────────────────────────────────────────
		const header1 = new Label('ImageLoader (single file)');
		header1.x = 16;
		header1.y = cy;
		header1.width = CONTENT_W - 32;
		header1.height = 22;
		header1.textColor = 0xb2bec3;
		header1.size = 14;
		header1.bold = true;
		content.addChild(header1);
		cy += 30;

		const imgSize = 120;

		const placeholder = new Shape();
		placeholder.graphics.beginFill(0x2d3436);
		placeholder.graphics.drawRoundRect(0, 0, imgSize, imgSize, 8);
		placeholder.graphics.endFill();
		placeholder.x = 16;
		placeholder.y = cy;
		content.addChild(placeholder);

		const statusTf = new TextField();
		statusTf.text = 'Loading...';
		statusTf.textColor = 0x636e72;
		statusTf.size = 13;
		statusTf.x = 16 + imgSize + 16;
		statusTf.y = cy + 16;
		statusTf.width = 200;
		content.addChild(statusTf);

		const loader = new ImageLoader();
		const imgY = cy; // 固定 y 坐标，避免异步回调时 cy 已被更新
		loader.addEventListener(Event.COMPLETE, () => {
			if (!loader.data) return;
			content.removeChild(placeholder);
			const tex = new Texture();
			tex.setBitmapData(loader.data);
			const bmp = new Bitmap(tex);
			bmp.x = 16;
			bmp.y = imgY;
			bmp.width = imgSize;
			bmp.height = imgSize;
			content.addChild(bmp);
			statusTf.text = `✓ Loaded\n${loader.data.width}×${loader.data.height}`;
			statusTf.textColor = 0x00b894;
		});
		loader.addEventListener('ioError', () => {
			statusTf.text = '✗ Load failed';
			statusTf.textColor = 0xe17055;
		});
		loader.load('/assets/img-red.svg');

		cy += imgSize + 24;

		// ── resource batch ─────────────────────────────────────────────────
		const header2 = new Label('resource.load (batch + progress)');
		header2.x = 16;
		header2.y = cy;
		header2.width = CONTENT_W - 32;
		header2.height = 22;
		header2.textColor = 0xb2bec3;
		header2.size = 14;
		header2.bold = true;
		content.addChild(header2);
		cy += 30;

		const barW = CONTENT_W - 32;

		// Progress bar
		const pbBg = new Shape();
		pbBg.graphics.beginFill(0x2d3436);
		pbBg.graphics.drawRoundRect(0, 0, barW, 10, 5);
		pbBg.graphics.endFill();
		pbBg.x = 16;
		pbBg.y = cy;
		content.addChild(pbBg);

		const pbFill = new Shape();
		pbFill.graphics.beginFill(0x6c5ce7);
		pbFill.graphics.drawRoundRect(0, 0, 0, 10, 5);
		pbFill.graphics.endFill();
		pbFill.x = 16;
		pbFill.y = cy;
		content.addChild(pbFill);

		const batchStatus = new TextField();
		batchStatus.text = '0 / 2';
		batchStatus.textColor = 0x636e72;
		batchStatus.size = 13;
		batchStatus.x = 16;
		batchStatus.y = cy + 16;
		content.addChild(batchStatus);

		cy += 40;

		// Image slots
		const names = ['img-green', 'img-blue'];
		const slots: Shape[] = [];
		names.forEach((_, i) => {
			const slot = new Shape();
			slot.graphics.beginFill(0x2d3436);
			slot.graphics.drawRoundRect(0, 0, imgSize, imgSize, 8);
			slot.graphics.endFill();
			slot.x = 16 + i * (imgSize + 16);
			slot.y = cy;
			content.addChild(slot);
			slots.push(slot);
		});

		resource.addResource({ name: 'img-green', url: '/assets/img-green.svg', type: ResourceType.Image });
		resource.addResource({ name: 'img-blue', url: '/assets/img-blue.svg', type: ResourceType.Image });

		let loadedCount = 0;
		(async () => {
			for (let i = 0; i < names.length; i++) {
				await resource.load(names[i]);
				loadedCount++;
				const pct = loadedCount / names.length;
				pbFill.graphics.clear();
				pbFill.graphics.beginFill(0x6c5ce7);
				pbFill.graphics.drawRoundRect(0, 0, Math.round(barW * pct), 10, 5);
				pbFill.graphics.endFill();
				batchStatus.text = `${loadedCount} / ${names.length}`;

				const tex = resource.get<Texture>(names[i]);
				if (tex) {
					content.removeChild(slots[i]);
					const bmp = new Bitmap(tex);
					bmp.x = 16 + i * (imgSize + 16);
					bmp.y = cy;
					bmp.width = imgSize;
					bmp.height = imgSize;
					content.addChild(bmp);
				}
			}
			batchStatus.text = 'All loaded ✓';
			batchStatus.textColor = 0x00b894;
		})();
	});
}

// ═══════════════════════════════════════════════════════════════════════════════
// Core menu entries
// ═══════════════════════════════════════════════════════════════════════════════

interface MenuEntry {
	title: string;
	description: string;
	accent: number;
	build: (nav: Navigator) => Sprite;
}

const MENU_ENTRIES: MenuEntry[] = [
	{
		title: 'Shapes',
		description: 'Rect, circle, roundRect, ellipse with fill & stroke',
		accent: 0xff4444,
		build: buildShapesPage,
	},
	{
		title: 'Graphics & Bitmap',
		description: 'Arc, gradient texture, scaled & rotated bitmaps',
		accent: 0x6c5ce7,
		build: buildGraphicsBitmapPage,
	},
	{
		title: 'TextField & Filters',
		description: 'Text rendering, stroke, Blur/Glow/ColorMatrix filters',
		accent: 0x00b894,
		build: buildTextFiltersPage,
	},
	{
		title: 'Events & RenderGroup',
		description: 'Touch events, tap counter, batched render group',
		accent: 0xfeca57,
		build: buildEventsPage,
	},
	{
		title: 'Image Loading',
		description: 'ImageLoader single file + resource batch with progress',
		accent: 0x74b9ff,
		build: buildImageLoadingPage,
	},
];

// ═══════════════════════════════════════════════════════════════════════════════
// Main entry point
// ═══════════════════════════════════════════════════════════════════════════════

export function createCoreMenu(nav: Navigator): Sprite {
	const page = new Sprite();
	page.addChild(createTitleBar('Core', () => nav.pop()));

	const content = createContentArea();
	page.addChild(content);

	// Subtitle
	const subtitle = new Label(`@blakron/core — ${MENU_ENTRIES.length} demos`);
	subtitle.x = 16;
	subtitle.y = 8;
	subtitle.width = CONTENT_W - 32;
	subtitle.height = 20;
	subtitle.textColor = 0x636e72;
	subtitle.size = 12;
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
