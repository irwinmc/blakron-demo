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

// ── Layout constants ──────────────────────────────────────────────────────────

const PAD = 20; // outer padding & gutter
const LABEL_H = 24; // section label height
const CELL_H = 160; // content area height per cell
const ROW_GAP = 16; // vertical gap between rows
const TITLE_H = 52; // top title area

// ── CoreScene ─────────────────────────────────────────────────────────────────

export class CoreScene extends Sprite {
	private readonly _sw: number; // screen width
	private readonly _colW: number; // column width (2-col layout)

	public constructor(screenWidth = 800) {
		super();
		this._sw = screenWidth;
		this._colW = Math.floor((screenWidth - PAD * 3) / 2);
	}

	/** x origin of column (0 or 1) */
	private cx(col: number): number {
		return PAD + col * (this._colW + PAD);
	}

	/** y origin of a row's content area (below its label) */
	private ry(row: number): number {
		return TITLE_H + row * (LABEL_H + CELL_H + ROW_GAP) + LABEL_H;
	}

	/** Add a section label */
	private label(text: string, col: number, row: number): void {
		const tf = new TextField();
		tf.text = text;
		tf.textColor = 0xb2bec3;
		tf.size = 13;
		tf.bold = true;
		tf.x = this.cx(col);
		tf.y = TITLE_H + row * (LABEL_H + CELL_H + ROW_GAP);
		tf.width = this._colW;
		tf.height = LABEL_H;
		tf.verticalAlign = 'middle';
		this.addChild(tf);
	}

	public create(): void {
		// ── Title ─────────────────────────────────────────────────────────────
		const title = new TextField();
		title.text = 'Core Scene';
		title.textColor = 0xffffff;
		title.size = 24;
		title.bold = true;
		title.x = PAD;
		title.y = 12;
		this.addChild(title);

		// Row 0: Shapes | Graphics & Bitmap
		this._buildShapes(0, 0);
		this._buildGraphicsAndBitmap(1, 0);

		// Row 1: TextField & Filters | Events & RenderGroup
		this._buildTextAndFilters(0, 1);
		this._buildEventsAndRenderGroup(1, 1);

		// Row 2: Image Loading (full width)
		this._buildImageLoading(2);
	}

	// ── Row 0 Col 0 — Shapes ─────────────────────────────────────────────────

	private _buildShapes(col: number, row: number): void {
		this.label('Shapes', col, row);
		const ox = this.cx(col);
		const oy = this.ry(row);
		const cw = this._colW;

		// 红色矩形
		const rect = new Shape();
		rect.graphics.beginFill(0xff4444);
		rect.graphics.drawRect(0, 0, 100, 60);
		rect.graphics.endFill();
		rect.x = ox;
		rect.y = oy;
		this.addChild(rect);

		// 蓝色圆
		const circle = new Shape();
		circle.graphics.beginFill(0x4488ff);
		circle.graphics.drawCircle(0, 0, 36);
		circle.graphics.endFill();
		circle.x = ox + 150;
		circle.y = oy + 36;
		this.addChild(circle);

		// 绿色描边圆角矩形
		const roundRect = new Shape();
		roundRect.graphics.lineStyle(3, 0x44ff88);
		roundRect.graphics.beginFill(0x224422, 0.5);
		roundRect.graphics.drawRoundRect(0, 0, Math.min(200, cw - 20), 50, 12);
		roundRect.graphics.endFill();
		roundRect.x = ox;
		roundRect.y = oy + 80;
		this.addChild(roundRect);

		// 椭圆
		const ellipse = new Shape();
		ellipse.graphics.beginFill(0xfeca57, 0.8);
		ellipse.graphics.drawEllipse(0, 0, 120, 50);
		ellipse.graphics.endFill();
		ellipse.x = ox + Math.max(0, cw - 140);
		ellipse.y = oy + 80;
		this.addChild(ellipse);
	}

	// ── Row 0 Col 1 — Graphics & Bitmap ──────────────────────────────────────

	private _buildGraphicsAndBitmap(col: number, row: number): void {
		this.label('Graphics & Bitmap', col, row);
		const ox = this.cx(col);
		const oy = this.ry(row);

		// 弧线
		const arc = new Shape();
		arc.graphics.lineStyle(4, 0xff66ff);
		arc.graphics.drawArc(50, 50, 44, 0, Math.PI * 1.5, false);
		arc.x = ox;
		arc.y = oy;
		this.addChild(arc);

		// 渐变位图
		const gradTex = makeGradientTexture(80, 80, ['#ff9a9e', '#fad0c4', '#ffecd2']);
		const gradBmp = new Bitmap(gradTex);
		gradBmp.x = ox + 120;
		gradBmp.y = oy;
		this.addChild(gradBmp);

		// 纯色位图 × 缩放
		const solidTex = makeColorTexture(32, 32, '#6c5ce7');
		const solidBmp = new Bitmap(solidTex);
		solidBmp.x = ox + 210;
		solidBmp.y = oy;
		solidBmp.scaleX = 2.5;
		solidBmp.scaleY = 2.5;
		this.addChild(solidBmp);

		// 旋转渐变位图
		const tex3 = makeGradientTexture(72, 72, ['#00b894', '#00cec9', '#0984e3']);
		const bmp3 = new Bitmap(tex3);
		bmp3.x = ox + 120;
		bmp3.y = oy + 88;
		bmp3.rotation = 15;
		this.addChild(bmp3);
	}

	// ── Row 1 Col 0 — TextField & Filters ────────────────────────────────────

	private _buildTextAndFilters(col: number, row: number): void {
		this.label('TextField & Filters', col, row);
		const ox = this.cx(col);
		const oy = this.ry(row);

		// TextFields
		const tf1 = new TextField();
		tf1.text = 'Hello Blakron!';
		tf1.textColor = 0xfeca57;
		tf1.size = 22;
		tf1.bold = true;
		tf1.x = ox;
		tf1.y = oy;
		this.addChild(tf1);

		const tf2 = new TextField();
		tf2.text = 'Multi-line\ntext field';
		tf2.textColor = 0xdfe6e9;
		tf2.size = 16;
		tf2.x = ox;
		tf2.y = oy + 36;
		this.addChild(tf2);

		const tf3 = new TextField();
		tf3.text = '描边文字';
		tf3.textColor = 0xffffff;
		tf3.size = 20;
		tf3.stroke = 2;
		tf3.strokeColor = 0x000000;
		tf3.x = ox + 180;
		tf3.y = oy + 36;
		this.addChild(tf3);

		// Filters
		const blurTarget = new Shape();
		blurTarget.graphics.beginFill(0xe17055);
		blurTarget.graphics.drawCircle(0, 0, 28);
		blurTarget.graphics.endFill();
		blurTarget.x = ox + 28;
		blurTarget.y = oy + 110;
		blurTarget.filters = [new BlurFilter(6, 6)];
		this.addChild(blurTarget);

		const glowTarget = new Shape();
		glowTarget.graphics.beginFill(0x6c5ce7);
		glowTarget.graphics.drawRect(0, 0, 70, 40);
		glowTarget.graphics.endFill();
		glowTarget.x = ox + 80;
		glowTarget.y = oy + 96;
		glowTarget.filters = [new GlowFilter(0x00ff88, 0.8, 10, 10, 3)];
		this.addChild(glowTarget);

		const colorTarget = new Bitmap(makeGradientTexture(80, 36, ['#ff6348', '#ffa502']));
		colorTarget.x = ox + 180;
		colorTarget.y = oy + 100;
		const gray = new ColorMatrixFilter();
		gray.matrix = [0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0, 0, 0, 1, 0];
		colorTarget.filters = [gray];
		this.addChild(colorTarget);
	}

	// ── Row 1 Col 1 — Events & RenderGroup ───────────────────────────────────

	private _buildEventsAndRenderGroup(col: number, row: number): void {
		this.label('Events & RenderGroup', col, row);
		const ox = this.cx(col);
		const oy = this.ry(row);
		const cw = this._colW;

		// Tap button
		const btnW = Math.min(200, cw / 2 - 10);
		const box = new Sprite();
		box.x = ox;
		box.y = oy + 10;
		box.touchEnabled = true;

		const bg = new Shape();
		bg.graphics.beginFill(0x00b894);
		bg.graphics.drawRoundRect(0, 0, btnW, 44, 8);
		bg.graphics.endFill();
		box.addChild(bg);

		const btnLabel = new TextField();
		btnLabel.text = 'Tap me! (0)';
		btnLabel.textColor = 0xffffff;
		btnLabel.size = 16;
		btnLabel.x = 0;
		btnLabel.y = 0;
		btnLabel.width = btnW;
		btnLabel.height = 44;
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
		this.addChild(box);

		// RenderGroup
		const group = new Sprite();
		group.isRenderGroup = true;
		group.x = ox + cw / 2 + 10;
		group.y = oy;

		const colors = [0x636e72, 0x2d3436, 0x74b9ff, 0xa29bfe];
		for (let i = 0; i < 4; i++) {
			const tile = new Shape();
			tile.graphics.beginFill(colors[i]);
			tile.graphics.drawRect(0, 0, 52, 52);
			tile.graphics.endFill();
			tile.x = (i % 2) * 56;
			tile.y = Math.floor(i / 2) * 56;
			group.addChild(tile);
		}

		const rgLabel = new TextField();
		rgLabel.text = 'RenderGroup';
		rgLabel.textColor = 0xb2bec3;
		rgLabel.size = 12;
		rgLabel.y = 116;
		group.addChild(rgLabel);

		this.addChild(group);
	}

	// ── Row 2 — Image Loading (full width, 2 columns inside) ─────────────────

	private _buildImageLoading(row: number): void {
		// Full-width label
		const sectionTf = new TextField();
		sectionTf.text = 'Image Loading';
		sectionTf.textColor = 0xb2bec3;
		sectionTf.size = 13;
		sectionTf.bold = true;
		sectionTf.x = PAD;
		sectionTf.y = TITLE_H + row * (LABEL_H + CELL_H + ROW_GAP);
		sectionTf.width = this._sw - PAD * 2;
		sectionTf.height = LABEL_H;
		sectionTf.verticalAlign = 'middle';
		this.addChild(sectionTf);

		const oy = this.ry(row);
		const imgSize = Math.min(CELL_H - 30, 120);

		// ── Left: ImageLoader single ──────────────────────────────────────────
		const lox = PAD;

		const loaderCaption = new TextField();
		loaderCaption.text = 'ImageLoader (single)';
		loaderCaption.textColor = 0x636e72;
		loaderCaption.size = 12;
		loaderCaption.x = lox;
		loaderCaption.y = oy;
		this.addChild(loaderCaption);

		const placeholder = new Shape();
		placeholder.graphics.beginFill(0x2d3436);
		placeholder.graphics.drawRoundRect(0, 0, imgSize, imgSize, 8);
		placeholder.graphics.endFill();
		placeholder.x = lox;
		placeholder.y = oy + 20;
		this.addChild(placeholder);

		const statusTf = new TextField();
		statusTf.text = 'Loading...';
		statusTf.textColor = 0x636e72;
		statusTf.size = 12;
		statusTf.x = lox + imgSize + 12;
		statusTf.y = oy + 20;
		this.addChild(statusTf);

		const loader = new ImageLoader();
		loader.addEventListener(Event.COMPLETE, () => {
			if (!loader.data) return;
			this.removeChild(placeholder);
			const tex = new Texture();
			tex.setBitmapData(loader.data);
			const bmp = new Bitmap(tex);
			bmp.x = lox;
			bmp.y = oy + 20;
			bmp.width = imgSize;
			bmp.height = imgSize;
			this.addChild(bmp);
			statusTf.text = `✓ Loaded\n${loader.data.width}×${loader.data.height}`;
			statusTf.textColor = 0x00b894;
		});
		loader.addEventListener('ioError', () => {
			statusTf.text = '✗ Load failed';
			statusTf.textColor = 0xe17055;
		});
		loader.load('assets/img-red.svg');

		// ── Right: resource batch ─────────────────────────────────────────────
		const rox = this.cx(1);

		const batchCaption = new TextField();
		batchCaption.text = 'resource.load (batch + progress)';
		batchCaption.textColor = 0x636e72;
		batchCaption.size = 12;
		batchCaption.x = rox;
		batchCaption.y = oy;
		this.addChild(batchCaption);

		// Progress bar
		const pbBg = new Shape();
		pbBg.graphics.beginFill(0x2d3436);
		pbBg.graphics.drawRoundRect(0, 0, this._colW, 8, 4);
		pbBg.graphics.endFill();
		pbBg.x = rox;
		pbBg.y = oy + 22;
		this.addChild(pbBg);

		const pbFill = new Shape();
		pbFill.graphics.beginFill(0x6c5ce7);
		pbFill.graphics.drawRoundRect(0, 0, 0, 8, 4);
		pbFill.graphics.endFill();
		pbFill.x = rox;
		pbFill.y = oy + 22;
		this.addChild(pbFill);

		const batchStatus = new TextField();
		batchStatus.text = '0 / 2';
		batchStatus.textColor = 0x636e72;
		batchStatus.size = 12;
		batchStatus.x = rox;
		batchStatus.y = oy + 36;
		this.addChild(batchStatus);

		// Image slots
		const names = ['img-green', 'img-blue'];
		const slots: Shape[] = [];
		names.forEach((_, i) => {
			const slot = new Shape();
			slot.graphics.beginFill(0x2d3436);
			slot.graphics.drawRoundRect(0, 0, imgSize, imgSize, 8);
			slot.graphics.endFill();
			slot.x = rox + i * (imgSize + 12);
			slot.y = oy + 56;
			this.addChild(slot);
			slots.push(slot);
		});

		resource.addResource({ name: 'img-green', url: 'assets/img-green.svg', type: ResourceType.Image });
		resource.addResource({ name: 'img-blue', url: 'assets/img-blue.svg', type: ResourceType.Image });

		let loadedCount = 0;
		(async () => {
			for (let i = 0; i < names.length; i++) {
				await resource.load(names[i]);
				loadedCount++;
				const pct = loadedCount / names.length;
				pbFill.graphics.clear();
				pbFill.graphics.beginFill(0x6c5ce7);
				pbFill.graphics.drawRoundRect(0, 0, Math.round(this._colW * pct), 8, 4);
				pbFill.graphics.endFill();
				batchStatus.text = `${loadedCount} / ${names.length}`;

				// Show loaded image
				const tex = resource.get<Texture>(names[i]);
				if (tex) {
					this.removeChild(slots[i]);
					const bmp = new Bitmap(tex);
					bmp.x = rox + i * (imgSize + 12);
					bmp.y = oy + 56;
					bmp.width = imgSize;
					bmp.height = imgSize;
					this.addChild(bmp);
				}
			}
			batchStatus.text = 'All loaded ✓';
			batchStatus.textColor = 0x00b894;
		})();
	}
}

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
