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
} from '@blakron/core';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a gradient texture from a canvas */
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

/** Generate a solid color texture */
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

// ── CoreScene ────────────────────────────────────────────────────────────────

export class CoreScene extends Sprite {
	private readonly _title: TextField;

	public constructor() {
		super();
		this._title = new TextField();
	}

	public create(): void {
		// Title
		this._title.text = 'Core Scene';
		this._title.textColor = 0xffffff;
		this._title.size = 28;
		this._title.bold = true;
		this._title.x = 20;
		this._title.y = 10;
		this.addChild(this._title);

		this._buildShapes();
		this._buildGraphics();
		this._buildBitmaps();
		this._buildTextFields();
		this._buildFilters();
		this._buildInteractiveSprite();
		this._buildRenderGroup();
	}

	// ── Shape (矢量矩形 / 圆形) ───────────────────────────────────────────

	private _buildShapes(): void {
		// 红色矩形
		const rect = new Shape();
		rect.graphics.beginFill(0xff4444);
		rect.graphics.drawRect(0, 0, 80, 60);
		rect.graphics.endFill();
		rect.x = 20;
		rect.y = 60;
		this.addChild(rect);

		// 蓝色圆
		const circle = new Shape();
		circle.graphics.beginFill(0x4488ff);
		circle.graphics.drawCircle(0, 0, 35);
		circle.graphics.endFill();
		circle.x = 150;
		circle.y = 90;
		this.addChild(circle);

		// 绿色描边圆角矩形
		const roundRect = new Shape();
		roundRect.graphics.lineStyle(3, 0x44ff88);
		roundRect.graphics.beginFill(0x224422, 0.5);
		roundRect.graphics.drawRoundRect(0, 0, 100, 50, 12);
		roundRect.graphics.endFill();
		roundRect.x = 220;
		roundRect.y = 65;
		this.addChild(roundRect);
	}

	// ── Graphics 渐变 / 弧线 ──────────────────────────────────────────────

	private _buildGraphics(): void {
		// Multi-color filled shape
		const shape = new Shape();
		shape.graphics.beginFill(0xfeca57, 0.8);
		shape.graphics.drawEllipse(0, 0, 100, 50);
		shape.graphics.endFill();
		shape.x = 20;
		shape.y = 150;
		this.addChild(shape);

		// 弧线
		const arc = new Shape();
		arc.graphics.lineStyle(4, 0xff66ff);
		arc.graphics.drawArc(50, 50, 40, 0, Math.PI * 1.5, false);
		arc.x = 160;
		arc.y = 140;
		this.addChild(arc);
	}

	// ── Bitmap (位图渲染) ──────────────────────────────────────────────────

	private _buildBitmaps(): void {
		// 渐变位图
		const gradTex = makeGradientTexture(64, 64, ['#ff9a9e', '#fad0c4', '#ffecd2']);
		const gradBmp = new Bitmap(gradTex);
		gradBmp.x = 20;
		gradBmp.y = 230;
		this.addChild(gradBmp);

		// 纯色位图 + 缩放
		const solidTex = makeColorTexture(32, 32, '#6c5ce7');
		const solidBmp = new Bitmap(solidTex);
		solidBmp.x = 110;
		solidBmp.y = 230;
		solidBmp.scaleX = 2;
		solidBmp.scaleY = 2;
		this.addChild(solidBmp);

		// 另一个渐变位图
		const tex3 = makeGradientTexture(64, 64, ['#00b894', '#00cec9', '#0984e3']);
		const bmp3 = new Bitmap(tex3);
		bmp3.x = 200;
		bmp3.y = 230;
		bmp3.rotation = 15;
		this.addChild(bmp3);
	}

	// ── TextField ──────────────────────────────────────────────────────────

	private _buildTextFields(): void {
		const tf = new TextField();
		tf.text = 'Hello Blakron!';
		tf.textColor = 0xfeca57;
		tf.size = 24;
		tf.bold = true;
		tf.x = 20;
		tf.y = 330;
		this.addChild(tf);

		const tf2 = new TextField();
		tf2.text = 'Multi-line\ntext field\nwith \\n';
		tf2.textColor = 0xdfe6e9;
		tf2.size = 16;
		tf2.x = 20;
		tf2.y = 370;
		this.addChild(tf2);

		const tf3 = new TextField();
		tf3.text = '描边文字';
		tf3.textColor = 0xffffff;
		tf3.size = 22;
		tf3.stroke = 2;
		tf3.strokeColor = 0x000000;
		tf3.x = 200;
		tf3.y = 370;
		this.addChild(tf3);
	}

	// ── Filters ────────────────────────────────────────────────────────────

	private _buildFilters(): void {
		// Blur filter
		const blurTarget = new Shape();
		blurTarget.graphics.beginFill(0xe17055);
		blurTarget.graphics.drawCircle(0, 0, 30);
		blurTarget.graphics.endFill();
		blurTarget.x = 60;
		blurTarget.y = 480;
		blurTarget.filters = [new BlurFilter(6, 6)];
		this.addChild(blurTarget);

		// Glow filter
		const glowTarget = new Shape();
		glowTarget.graphics.beginFill(0x6c5ce7);
		glowTarget.graphics.drawRect(0, 0, 60, 40);
		glowTarget.graphics.endFill();
		glowTarget.x = 120;
		glowTarget.y = 460;
		glowTarget.filters = [new GlowFilter(0x00ff88, 0.8, 10, 10, 3)];
		this.addChild(glowTarget);

		// ColorMatrixFilter (灰度)
		const colorTarget = new Bitmap(makeGradientTexture(60, 40, ['#ff6348', '#ffa502']));
		colorTarget.x = 220;
		colorTarget.y = 460;
		const gray = new ColorMatrixFilter();
		gray.matrix = [
			0.3, 0.6, 0.1, 0, 0,
			0.3, 0.6, 0.1, 0, 0,
			0.3, 0.6, 0.1, 0, 0,
			0, 0, 0, 1, 0,
		];
		colorTarget.filters = [gray];
		this.addChild(colorTarget);
	}

	// ── Interactive sprite (事件) ──────────────────────────────────────────

	private _buildInteractiveSprite(): void {
		const box = new Sprite();
		box.x = 20;
		box.y = 540;
		box.touchEnabled = true;

		const bg = new Shape();
		bg.graphics.beginFill(0x00b894);
		bg.graphics.drawRoundRect(0, 0, 140, 36, 8);
		bg.graphics.endFill();
		box.addChild(bg);

		const label = new TextField();
		label.text = 'Tap me! (0)';
		label.textColor = 0xffffff;
		label.size = 16;
		label.x = 12;
		label.y = 8;
		box.addChild(label);

		let count = 0;
		box.addEventListener(TouchEvent.TOUCH_TAP, () => {
			count++;
			label.text = `Tap me! (${count})`;
			// Flash effect
			box.alpha = 0.6;
			setTimeout(() => { box.alpha = 1.0; }, 100);
		});

		this.addChild(box);
	}

	// ── RenderGroup (静态子树) ─────────────────────────────────────────────

	private _buildRenderGroup(): void {
		const group = new Sprite();
		group.isRenderGroup = true;
		group.x = 320;
		group.y = 60;

		for (let i = 0; i < 4; i++) {
			const tile = new Shape();
			tile.graphics.beginFill([0x636e72, 0x2d3436, 0x74b9ff, 0xa29bfe][i]);
			tile.graphics.drawRect(0, 0, 40, 40);
			tile.graphics.endFill();
			tile.x = (i % 2) * 44;
			tile.y = Math.floor(i / 2) * 44;
			group.addChild(tile);
		}

		const label = new TextField();
		label.text = 'RenderGroup';
		label.textColor = 0xb2bec3;
		label.size = 12;
		label.y = 96;
		group.addChild(label);

		this.addChild(group);
	}
}
