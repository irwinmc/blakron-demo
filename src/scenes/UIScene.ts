import { Sprite, TextField, TouchEvent, Event } from '@blakron/core';
import {
	Group,
	Label,
	Rect,
	Button,
	Image,
	ProgressBar,
	CheckBox,
	RadioButton,
	VerticalLayout,
	HorizontalLayout,
	BasicLayout,
	ArrayCollection,
	UIEvent,
} from '@blakron/ui';
import { Tween, Ease } from '@blakron/game';

// ── Layout constants ─────────────────────────────────────────────────────────

const COL_LEFT_X = 0;
const COL_RIGHT_X = 440;
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
	public constructor() {
		super();
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

		ly = this._buildLabels(COL_LEFT_X, ly) + SECTION_GAP;
		ly = this._buildButtons(COL_LEFT_X, ly) + SECTION_GAP;
		ly = this._buildProgressBar(COL_LEFT_X, ly) + SECTION_GAP;
		ly = this._buildCheckBoxes(COL_LEFT_X, ly) + SECTION_GAP;
		ly = this._buildRadioButtons(COL_LEFT_X, ly) + SECTION_GAP;
		this._buildAnimation(COL_LEFT_X, ly);

		// ── Right column ─────────────────────────────────────────────────
		let ry = 55;

		ry = this._buildImage(COL_RIGHT_X, ry) + SECTION_GAP;
		this._buildRects(COL_RIGHT_X, ry);
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
}
