import { Sprite, Bitmap, BitmapData, Texture, TextField, Shape, TouchEvent, Event, getTimer } from '@blakron/core';
import { Tween, Ease, MovieClip, MovieClipData } from '@blakron/game';

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

function sectionLabel(parent: Sprite, text: string, y: number): void {
	const tf = new TextField();
	tf.text = text;
	tf.textColor = 0xb2bec3;
	tf.size = 14;
	tf.x = 20;
	tf.y = y;
	parent.addChild(tf);
}

// ── GameScene ────────────────────────────────────────────────────────────────

export class GameScene extends Sprite {
	public constructor() {
		super();
	}

	public create(): void {
		const title = new TextField();
		title.text = 'Game Scene';
		title.textColor = 0xffffff;
		title.size = 28;
		title.bold = true;
		title.x = 20;
		title.y = 10;
		this.addChild(title);

		this._buildTweenBasic();
		this._buildTweenChain();
		this._buildEaseShowcase();
		this._buildMovieClip();
		this._buildOrbitDemo();
	}

	private _buildTweenBasic(): void {
		sectionLabel(this, 'Basic Tween (x + alpha)', 55);

		const ball = new Bitmap(makeCircleTexture(24, '#ff6b6b'));
		ball.x = 30;
		ball.y = 95;
		this.addChild(ball);

		Tween.get(ball, { loop: true })
			.to({ x: 350, alpha: 0.3 }, 1500, Ease.sineInOut)
			.to({ x: 30, alpha: 1.0 }, 1500, Ease.sineInOut);

		const ball2 = new Bitmap(makeCircleTexture(20, '#48dbfb'));
		ball2.x = 30;
		ball2.y = 130;
		this.addChild(ball2);

		Tween.get(ball2, { loop: true })
			.to({ x: 350 }, 1500, Ease.bounceOut)
			.wait(300)
			.to({ x: 30 }, 1500, Ease.cubicOut);
	}

	private _buildTweenChain(): void {
		sectionLabel(this, 'Chained Tween (scale -> rotate -> color)', 170);

		const ball = new Bitmap(makeCircleTexture(28, '#feca57'));
		ball.x = 60;
		ball.y = 215;
		this.addChild(ball);

		Tween.get(ball, { loop: true })
			.to({ scaleX: 2, scaleY: 2 }, 600, Ease.backOut)
			.to({ rotation: 360 }, 800, Ease.cubicInOut)
			.to({ scaleX: 1, scaleY: 1, alpha: 0.4 }, 500, Ease.sineIn)
			.wait(200)
			.set({ alpha: 1.0, rotation: 0 })
			.to({ scaleX: 1.5, scaleY: 0.5 }, 300, Ease.sineOut)
			.to({ scaleX: 1, scaleY: 1 }, 300, Ease.sineOut)
			.wait(500);
	}

	private _buildEaseShowcase(): void {
		sectionLabel(this, 'Ease Functions', 260);

		const eases: { name: string; fn: (t: number) => number }[] = [
			{ name: 'linear', fn: Ease.linear },
			{ name: 'cubicOut', fn: Ease.cubicOut },
			{ name: 'elasticOut', fn: Ease.elasticOut },
			{ name: 'bounceOut', fn: Ease.bounceOut },
			{ name: 'backOut', fn: Ease.backOut },
		];

		eases.forEach((e, i) => {
			const row = new Sprite();
			row.y = 285 + i * 24;

			const nameTf = new TextField();
			nameTf.text = e.name;
			nameTf.textColor = 0xdfe6e9;
			nameTf.size = 12;
			row.addChild(nameTf);

			const dot = new Bitmap(makeCircleTexture(8, '#74b9ff'));
			dot.x = 100;
			dot.y = -4;
			row.addChild(dot);

			Tween.get(dot, { loop: true })
				.to({ x: 350 }, 1200, e.fn)
				.to({ x: 100 }, 800, Ease.sineInOut)
				.wait(200 + i * 100);

			this.addChild(row);
		});
	}

	private _buildMovieClip(): void {
		sectionLabel(this, 'MovieClip (8 generated frames)', 420);

		const textures: Texture[] = [];
		for (let i = 0; i < 8; i++) {
			textures.push(makeFrameTexture(i, 8, 40));
		}

		const data = MovieClipData.fromTextureArray(textures, 8);

		const mc1 = new MovieClip(data);
		mc1.x = 20;
		mc1.y = 450;
		mc1.play(-1);
		this.addChild(mc1);

		const mc2 = new MovieClip(data);
		mc2.x = 80;
		mc2.y = 450;
		mc2.frameRate = 20;
		mc2.play(-1);
		this.addChild(mc2);

		const mc3 = new MovieClip(data);
		mc3.x = 150;
		mc3.y = 445;
		mc3.scaleX = 1.5;
		mc3.scaleY = 1.5;
		mc3.play(-1);
		this.addChild(mc3);
	}

	private _buildOrbitDemo(): void {
		sectionLabel(this, 'Orbit Animation', 520);

		const orbitCenter = new Sprite();
		orbitCenter.x = 200;
		orbitCenter.y = 580;
		this.addChild(orbitCenter);

		const center = new Bitmap(makeCircleTexture(12, '#e17055'));
		center.x = -6;
		center.y = -6;
		orbitCenter.addChild(center);

		const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#6c5ce7'];
		for (let i = 0; i < 4; i++) {
			const dot = new Bitmap(makeCircleTexture(8, colors[i]));
			const angle = (i / 4) * Math.PI * 2;
			const radius = 35 + i * 15;
			dot.x = Math.cos(angle) * radius - 4;
			dot.y = Math.sin(angle) * radius - 4;
			orbitCenter.addChild(dot);
		}

		Tween.get(orbitCenter, { loop: true })
			.to({ rotation: 360 }, 3000, Ease.linear)
			.call(() => {
				orbitCenter.rotation = 0;
			});
	}
}
