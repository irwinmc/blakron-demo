import { Sprite, TextField, TouchEvent, Event } from '@blakron/core';
import {
	Group,
	Label,
	Rect,
	Button,
	Image,
	CheckBox,
	RadioButton,
	HSlider,
	VSlider,
	ToggleSwitch,
	ViewStack,
	Panel,
} from '@blakron/ui';
import { Tween, Ease } from '@blakron/game';

// ── Layout constants ─────────────────────────────────────────────────────────

const SECTION_GAP = 20;
const ROW_GAP = 32;
const HEADER_H = 22;

/** Create a section group with a header label. */
function sectionGroup(title: string, x: number, y: number): Group {
	const group = new Group();
	group.x = x;
	group.y = y;

	const label = new TextField();
	label.text = title;
	label.textColor = 0xb2bec3;
	label.size = 14;
	group.addChild(label);

	return group;
}

// ── UIScene ──────────────────────────────────────────────────────────────────

export class UIScene extends Sprite {
	private readonly _colW: number;
	private readonly _col0: number;
	private readonly _col1: number;
	private readonly _col2: number;

	public constructor(screenWidth = 1200, _screenHeight = 800) {
		super();
		const pad = 20;
		this._colW = Math.floor((screenWidth - pad * 4) / 3);
		this._col0 = pad;
		this._col1 = pad * 2 + this._colW;
		this._col2 = pad * 3 + this._colW * 2;
	}

	public create(): void {
		// Title
		const title = new TextField();
		title.text = 'UI Scene';
		title.textColor = 0xffffff;
		title.size = 28;
		title.bold = true;
		title.x = 20;
		title.y = 10;
		this.addChild(title);

		// ── Left column ──────────────────────────────────────────────────
		let ly = 55;

		ly = this._buildLabels(this._col0, ly) + SECTION_GAP;
		ly = this._buildButtons(this._col0, ly) + SECTION_GAP;
		ly = this._buildProgressBar(this._col0, ly) + SECTION_GAP;
		ly = this._buildCheckBoxes(this._col0, ly) + SECTION_GAP;
		ly = this._buildRadioButtons(this._col0, ly) + SECTION_GAP;
		this._buildAnimation(this._col0, ly);

		// ── Middle column ─────────────────────────────────────────────────
		let my = 55;

		my = this._buildImage(this._col1, my) + SECTION_GAP;
		my = this._buildRects(this._col1, my) + SECTION_GAP;
		my = this._buildSliders(this._col1, my) + SECTION_GAP;
		my = this._buildToggleSwitch(this._col1, my) + SECTION_GAP;
		this._buildViewStack(this._col1, my);

		// ── Right column ──────────────────────────────────────────────────
		let ry = 55;

		ry = this._buildPanel(this._col2, ry) + SECTION_GAP;
		this._buildList(this._col2, ry);
	}

	// ── Labels ─────────────────────────────────────────────────────────────

	private _buildLabels(x: number, y: number): number {
		const g = sectionGroup('Labels', x, y);
		this.addChild(g);

		let cy = HEADER_H;

		const lbl1 = new Label('Default Label');
		lbl1.y = cy;
		g.addChild(lbl1);
		cy += 30;

		const lbl2 = new Label('Colored Label');
		lbl2.y = cy;
		lbl2.textColor = 0xfeca57;
		lbl2.size = 20;
		g.addChild(lbl2);
		cy += 30;

		const lbl3 = new Label('Bold Label');
		lbl3.y = cy;
		lbl3.bold = true;
		lbl3.size = 18;
		g.addChild(lbl3);

		return y + HEADER_H + 90;
	}

	// ── Buttons ────────────────────────────────────────────────────────────

	private _buildButtons(x: number, y: number): number {
		const g = sectionGroup('Buttons (tap to test events)', x, y);
		this.addChild(g);

		const statusTf = new TextField();
		statusTf.text = 'Status: idle';
		statusTf.textColor = 0xdfe6e9;
		statusTf.size = 14;
		statusTf.x = 200;
		statusTf.y = 0;
		g.addChild(statusTf);

		const createBtn = (text: string, bx: number, color: number): Button => {
			const btn = new Button();
			btn.label = text;
			btn.width = 120;
			btn.height = 36;
			btn.x = bx;
			btn.y = HEADER_H;

			btn.graphics.beginFill(0x000000, 0.01);
			btn.graphics.drawRect(0, 0, 120, 36);
			btn.graphics.endFill();

			const bg = new Rect(120, 36, color);
			btn.addChild(bg);

			const lbl = new Label(text);
			lbl.width = 120;
			lbl.height = 36;
			lbl.textAlign = 'center';
			lbl.verticalAlign = 'middle';
			lbl.textColor = 0xffffff;
			lbl.size = 16;
			btn.labelDisplay = lbl;
			btn.addChild(lbl);

			btn.addEventListener(TouchEvent.TOUCH_TAP, () => {
				statusTf.text = `Tapped: ${text}`;
			});

			g.addChild(btn);
			return btn;
		};

		createBtn('Button A', 0, 0x6c5ce7);
		createBtn('Button B', 140, 0x00b894);
		createBtn('Button C', 280, 0xe17055);

		return y + HEADER_H + 36;
	}

	// ── ProgressBar ────────────────────────────────────────────────────────

	private _buildProgressBar(x: number, y: number): number {
		const g = sectionGroup('ProgressBar + Animation', x, y);
		this.addChild(g);

		const pbBg = new Rect(300, 20, 0x2d3436);
		pbBg.y = HEADER_H;
		pbBg.strokeColor = 0x636e72;
		pbBg.strokeWeight = 1;
		g.addChild(pbBg);

		const pbFill = new Rect(150, 20, 0x6c5ce7);
		pbFill.y = HEADER_H;
		g.addChild(pbFill);

		const pbLabel = new TextField();
		pbLabel.text = '50%';
		pbLabel.textColor = 0xffffff;
		pbLabel.size = 12;
		pbLabel.x = 310;
		pbLabel.y = HEADER_H + 3;
		g.addChild(pbLabel);

		let progress = 0;
		let direction = 1;
		setInterval(() => {
			progress += direction * 0.005;
			if (progress >= 1) {
				progress = 1;
				direction = -1;
			}
			if (progress <= 0) {
				progress = 0;
				direction = 1;
			}
			pbFill.width = 300 * progress;
			pbLabel.text = `${Math.round(progress * 100)}%`;
		}, 16);

		return y + HEADER_H + 20;
	}

	// ── CheckBoxes ─────────────────────────────────────────────────────────

	private _buildCheckBoxes(x: number, y: number): number {
		const g = sectionGroup('CheckBoxes', x, y);
		this.addChild(g);

		const items = ['Option A', 'Option B', 'Option C'];

		const stateLabel = new TextField();
		stateLabel.text = 'Selected: none';
		stateLabel.textColor = 0xdfe6e9;
		stateLabel.size = 12;
		stateLabel.x = 180;
		stateLabel.y = 0;
		g.addChild(stateLabel);

		const checkboxes: CheckBox[] = [];
		const boxes: Rect[] = [];

		const updateStateLabel = () => {
			const selected = checkboxes.map((cb, idx) => (cb.selected ? items[idx] : null)).filter(Boolean);
			stateLabel.text = selected.length > 0 ? `Selected: ${selected.join(', ')}` : 'Selected: none';
		};

		items.forEach((text, i) => {
			const cb = new CheckBox();
			cb.label = text;
			cb.width = 180;
			cb.height = 28;
			cb.y = HEADER_H + i * ROW_GAP;

			cb.graphics.beginFill(0x000000, 0.01);
			cb.graphics.drawRect(0, 0, 180, 28);
			cb.graphics.endFill();

			const box = new Rect(20, 20, 0x2d3436);
			box.strokeColor = 0x636e72;
			box.strokeWeight = 1;
			cb.addChild(box);

			const lbl = new Label(text);
			lbl.x = 28;
			lbl.y = 0;
			lbl.size = 14;
			lbl.textColor = 0xdfe6e9;
			cb.addChild(lbl);

			checkboxes.push(cb);
			boxes.push(box);

			cb.addEventListener(Event.CHANGE, () => {
				box.fillColor = cb.selected ? 0x6c5ce7 : 0x2d3436;
				updateStateLabel();
			});

			g.addChild(cb);
		});

		return y + HEADER_H + items.length * ROW_GAP;
	}

	// ── RadioButtons ───────────────────────────────────────────────────────

	private _buildRadioButtons(x: number, y: number): number {
		const g = sectionGroup('RadioButtons', x, y);
		this.addChild(g);

		const items = ['Choice 1', 'Choice 2', 'Choice 3'];

		const radioLabel = new TextField();
		radioLabel.text = 'Selected: none';
		radioLabel.textColor = 0xdfe6e9;
		radioLabel.size = 12;
		radioLabel.x = 180;
		radioLabel.y = 0;
		g.addChild(radioLabel);

		const radioButtons: RadioButton[] = [];
		const circles: Rect[] = [];

		items.forEach((text, i) => {
			const rb = new RadioButton();
			rb.label = text;
			rb.value = text;
			rb.width = 180;
			rb.height = 28;
			rb.y = HEADER_H + i * ROW_GAP;

			rb.graphics.beginFill(0x000000, 0.01);
			rb.graphics.drawRect(0, 0, 180, 28);
			rb.graphics.endFill();

			const circle = new Rect(20, 20, 0x2d3436);
			circle.strokeColor = 0x636e72;
			circle.strokeWeight = 1;
			rb.addChild(circle);

			const lbl = new Label(text);
			lbl.x = 28;
			lbl.y = 0;
			lbl.size = 14;
			lbl.textColor = 0xdfe6e9;
			rb.addChild(lbl);

			radioButtons.push(rb);
			circles.push(circle);

			rb.addEventListener(Event.CHANGE, () => {
				if (!rb.selected) return;
				radioButtons.forEach((other, idx) => {
					if (other !== rb && other.selected) {
						other.selected = false;
					}
					circles[idx].fillColor = other.selected ? 0x00b894 : 0x2d3436;
				});
				radioLabel.text = `Selected: ${text}`;
			});

			g.addChild(rb);
		});

		return y + HEADER_H + items.length * ROW_GAP;
	}

	// ── Animation ──────────────────────────────────────────────────────────

	private _buildAnimation(x: number, y: number): number {
		const g = sectionGroup('UI Animation (pulse)', x, y);
		this.addChild(g);

		const box = new Rect(60, 60, 0xe17055);
		box.x = 180;
		box.y = 10;
		g.addChild(box);

		Tween.get(box, { loop: true })
			.to({ scaleX: 1.8, scaleY: 1.8, x: 150, y: -8 }, 600, Ease.sineInOut)
			.to({ scaleX: 1.0, scaleY: 1.0, x: 180, y: 10 }, 600, Ease.sineInOut);

		return y + 10 + 60 + 40;
	}

	// ── Image ───────────────────────────────────────────────────────────────

	private _buildImage(x: number, y: number): number {
		const g = sectionGroup('Image (Black_Heron.webp)', x, y);
		this.addChild(g);

		const img = new Image('/assets/Black_Heron.webp');
		img.y = HEADER_H;
		img.width = 200;
		img.height = 130;
		img.addEventListener(Event.COMPLETE, () => {
			console.log('[UIScene] Image loaded:', img.source);
		});
		g.addChild(img);

		return y + HEADER_H + 130;
	}

	// ── Rects ──────────────────────────────────────────────────────────────

	private _buildRects(x: number, y: number): number {
		const g = sectionGroup('Rects', x, y);
		this.addChild(g);

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

		return y + HEADER_H + 50 + 40;
	}

	// ── Sliders ────────────────────────────────────────────────────────────

	private _buildSliders(x: number, y: number): number {
		const g = sectionGroup('HSlider / VSlider', x, y);
		this.addChild(g);

		const trackW = 200;
		const trackH = 8;
		const thumbSize = 20;

		// Value display
		const valTf = new TextField();
		valTf.text = 'H: 50   V: 0';
		valTf.textColor = 0xdfe6e9;
		valTf.size = 12;
		valTf.x = 0;
		valTf.y = HEADER_H;
		g.addChild(valTf);

		// ── HSlider ───────────────────────────────────────────────────────
		// thumb/track/fill are children of hs so coordinates are in hs-local space
		const hs = new HSlider();
		hs.minimum = 0;
		hs.maximum = 100;
		hs.value = 50;
		hs.width = trackW;
		hs.height = thumbSize;
		hs.x = 0;
		hs.y = HEADER_H + 24;
		hs.touchChildren = true;

		const hTrack = new Rect(trackW, trackH, 0x2d3436);
		hTrack.strokeColor = 0x636e72;
		hTrack.strokeWeight = 1;
		hTrack.y = (thumbSize - trackH) / 2;
		hs.addChild(hTrack);

		const hFill = new Rect(trackW / 2, trackH, 0x6c5ce7);
		hFill.y = (thumbSize - trackH) / 2;
		hs.addChild(hFill);

		const hThumb = new Rect(thumbSize, thumbSize, 0xffffff);
		hThumb.x = trackW / 2 - thumbSize / 2;
		hThumb.y = 0;
		hThumb.touchEnabled = true;
		hs.addChild(hThumb);

		// transparent hit area on hs itself
		hs.graphics.beginFill(0x000000, 0.01);
		hs.graphics.drawRect(0, 0, trackW, thumbSize);
		hs.graphics.endFill();

		hs.thumb = hThumb;
		hs.track = hTrack;
		g.addChild(hs);

		hs.addEventListener('propertyChange', () => {
			const pct = hs.value / 100;
			hFill.width = trackW * pct;
			hThumb.x = trackW * pct - thumbSize / 2;
			valTf.text = `H: ${Math.round(hs.value)}   V: ${Math.round(vs.value)}`;
		});

		// ── VSlider ───────────────────────────────────────────────────────
		const vTrackH = 100;

		const vs = new VSlider();
		vs.minimum = 0;
		vs.maximum = 100;
		vs.value = 0;
		vs.width = thumbSize;
		vs.height = vTrackH;
		vs.x = trackW + 20;
		vs.y = HEADER_H + 24;
		vs.touchChildren = true;

		const vTrack = new Rect(trackH, vTrackH, 0x2d3436);
		vTrack.strokeColor = 0x636e72;
		vTrack.strokeWeight = 1;
		vTrack.x = (thumbSize - trackH) / 2;
		vs.addChild(vTrack);

		const vThumb = new Rect(thumbSize, thumbSize, 0x00b894);
		vThumb.x = 0;
		vThumb.y = vTrackH - thumbSize;
		vThumb.touchEnabled = true;
		vs.addChild(vThumb);

		vs.graphics.beginFill(0x000000, 0.01);
		vs.graphics.drawRect(0, 0, thumbSize, vTrackH);
		vs.graphics.endFill();

		vs.thumb = vThumb;
		vs.track = vTrack;
		g.addChild(vs);

		vs.addEventListener('propertyChange', () => {
			const pct = vs.value / 100;
			vThumb.y = vTrackH * (1 - pct) - thumbSize / 2;
			valTf.text = `H: ${Math.round(hs.value)}   V: ${Math.round(vs.value)}`;
		});

		return y + HEADER_H + 24 + vTrackH + 8;
	}

	// ── ToggleSwitch ───────────────────────────────────────────────────────

	private _buildToggleSwitch(x: number, y: number): number {
		const g = sectionGroup('ToggleSwitch', x, y);
		this.addChild(g);

		const stateTf = new TextField();
		stateTf.text = 'OFF';
		stateTf.textColor = 0x636e72;
		stateTf.size = 14;
		stateTf.x = 120;
		stateTf.y = HEADER_H + 4;
		g.addChild(stateTf);

		const sw = new ToggleSwitch();
		sw.width = 100;
		sw.height = 32;
		sw.y = HEADER_H;

		// Track
		const track = new Rect(100, 32, 0x2d3436);
		track.strokeColor = 0x636e72;
		track.strokeWeight = 1;
		sw.addChild(track);

		// Thumb
		const thumb = new Rect(28, 28, 0x636e72);
		thumb.x = 2;
		thumb.y = 2;
		sw.addChild(thumb);

		sw.graphics.beginFill(0x000000, 0.01);
		sw.graphics.drawRect(0, 0, 100, 32);
		sw.graphics.endFill();

		sw.addEventListener(Event.CHANGE, () => {
			track.fillColor = sw.selected ? 0x00b894 : 0x2d3436;
			thumb.fillColor = sw.selected ? 0xffffff : 0x636e72;
			thumb.x = sw.selected ? 70 : 2;
			stateTf.text = sw.selected ? 'ON' : 'OFF';
			stateTf.textColor = sw.selected ? 0x00b894 : 0x636e72;
		});

		g.addChild(sw);
		return y + HEADER_H + 32;
	}

	// ── ViewStack ──────────────────────────────────────────────────────────

	private _buildViewStack(x: number, y: number): number {
		const g = sectionGroup('ViewStack', x, y);
		this.addChild(g);

		const vs = new ViewStack();
		vs.width = 300;
		vs.height = 80;
		vs.y = HEADER_H;
		g.addChild(vs);

		const colors = [0x6c5ce7, 0x00b894, 0xe17055];
		const names = ['View A', 'View B', 'View C'];

		names.forEach((name, i) => {
			const page = new Rect(300, 80, colors[i]);
			const lbl = new Label(name);
			lbl.x = 10;
			lbl.y = 10;
			lbl.textColor = 0xffffff;
			lbl.size = 16;
			page.addChild(lbl);
			vs.addChild(page);
		});

		// Nav buttons
		names.forEach((name, i) => {
			const btn = new Button();
			btn.width = 80;
			btn.height = 28;
			btn.x = i * 88;
			btn.y = HEADER_H + 88;
			btn.graphics.beginFill(0x000000, 0.01);
			btn.graphics.drawRect(0, 0, 80, 28);
			btn.graphics.endFill();
			const bg = new Rect(80, 28, colors[i]);
			btn.addChild(bg);
			const lbl = new Label(name);
			lbl.width = 80;
			lbl.height = 28;
			lbl.textAlign = 'center';
			lbl.verticalAlign = 'middle';
			lbl.textColor = 0xffffff;
			lbl.size = 12;
			btn.addChild(lbl);
			btn.addEventListener(TouchEvent.TOUCH_TAP, () => {
				vs.selectedIndex = i;
			});
			g.addChild(btn);
		});

		return y + HEADER_H + 80 + 28 + 8;
	}

	// ── Panel ──────────────────────────────────────────────────────────────

	private _buildPanel(x: number, y: number): number {
		const g = sectionGroup('Panel', x, y);
		this.addChild(g);

		const panel = new Panel();
		panel.title = 'My Panel';
		panel.width = 280;
		panel.height = 100;
		panel.y = HEADER_H;

		// Manual skin: title bar + content area
		const titleBar = new Rect(280, 28, 0x0f3460);
		panel.addChild(titleBar);

		const titleLbl = new Label('My Panel');
		titleLbl.x = 10;
		titleLbl.y = 0;
		titleLbl.width = 260;
		titleLbl.height = 28;
		titleLbl.verticalAlign = 'middle';
		titleLbl.textColor = 0xffffff;
		titleLbl.size = 13;
		panel.titleDisplay = titleLbl;
		panel.addChild(titleLbl);

		const content = new Rect(280, 72, 0x16213e);
		content.y = 28;
		content.strokeColor = 0x0f3460;
		content.strokeWeight = 1;
		panel.addChild(content);

		const contentLbl = new Label('Panel content area');
		contentLbl.x = 10;
		contentLbl.y = 38;
		contentLbl.textColor = 0xb2bec3;
		contentLbl.size = 13;
		panel.addChild(contentLbl);

		g.addChild(panel);
		return y + HEADER_H + 100;
	}

	// ── List ───────────────────────────────────────────────────────────────

	private _buildList(x: number, y: number): number {
		const g = sectionGroup('List (tap to select)', x, y);
		this.addChild(g);

		const items = ['Apple', 'Banana', 'Cherry', 'Durian', 'Elderberry'];
		const rowH = 36;

		const selTf = new TextField();
		selTf.text = 'Selected: none';
		selTf.textColor = 0xdfe6e9;
		selTf.size = 12;
		selTf.x = 0;
		selTf.y = 0;
		g.addChild(selTf);

		const rows: Rect[] = [];

		items.forEach((item, i) => {
			const row = new Sprite();
			row.y = HEADER_H + i * rowH;
			row.touchEnabled = true;

			const bg = new Rect(200, rowH, i % 2 === 0 ? 0x16213e : 0x0f3460);
			bg.strokeColor = 0x2d3436;
			bg.strokeWeight = 1;
			row.addChild(bg);
			rows.push(bg);

			// transparent hit area
			row.graphics.beginFill(0x000000, 0.01);
			row.graphics.drawRect(0, 0, 200, rowH);
			row.graphics.endFill();

			const lbl = new Label(item);
			lbl.x = 12;
			lbl.y = 0;
			lbl.width = 176;
			lbl.height = rowH;
			lbl.verticalAlign = 'middle';
			lbl.textColor = 0xdfe6e9;
			lbl.size = 14;
			row.addChild(lbl);

			row.addEventListener(TouchEvent.TOUCH_TAP, () => {
				selTf.text = `Selected: ${item}`;
				rows.forEach((r, idx) => {
					r.fillColor = idx === i ? 0x6c5ce7 : idx % 2 === 0 ? 0x16213e : 0x0f3460;
				});
			});

			g.addChild(row);
		});

		return y + HEADER_H + items.length * rowH;
	}
}
