import { Sprite, TextField, TouchEvent, Event } from '@blakron/core';
import {
	Group,
	Label,
	Rect,
	Button,
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

// ── UIScene ──────────────────────────────────────────────────────────────────

export class UIScene extends Sprite {
	public constructor() {
		super();
	}

	public create(): void {
		const title = new TextField();
		title.text = 'UI Scene';
		title.textColor = 0xffffff;
		title.size = 28;
		title.bold = true;
		title.x = 20;
		title.y = 10;
		this.addChild(title);

		this._buildLabels();
		this._buildRects();
		this._buildButtons();
		this._buildProgressBar();
		this._buildCheckBoxes();
		this._buildRadioButtons();
		this._buildAnimation();
	}

	// ── Labels ─────────────────────────────────────────────────────────────

	private _buildLabels(): void {
		const label = new TextField();
		label.text = 'Labels';
		label.textColor = 0xb2bec3;
		label.size = 14;
		label.x = 20;
		label.y = 55;
		this.addChild(label);

		// Using UI Label component
		const lbl1 = new Label('Default Label');
		lbl1.x = 20;
		lbl1.y = 80;
		this.addChild(lbl1);

		const lbl2 = new Label('Colored Label');
		lbl2.x = 20;
		lbl2.y = 110;
		lbl2.textColor = 0xfeca57;
		lbl2.size = 20;
		this.addChild(lbl2);

		const lbl3 = new Label('Bold Label');
		lbl3.x = 20;
		lbl3.y = 140;
		lbl3.bold = true;
		lbl3.size = 18;
		this.addChild(lbl3);
	}

	// ── Rects ──────────────────────────────────────────────────────────────

	private _buildRects(): void {
		const label = new TextField();
		label.text = 'Rects';
		label.textColor = 0xb2bec3;
		label.size = 14;
		label.x = 250;
		label.y = 55;
		this.addChild(label);

		const r1 = new Rect(60, 40, 0xff6b6b);
		r1.x = 250;
		r1.y = 80;
		this.addChild(r1);

		const r2 = new Rect(60, 40, 0x48dbfb);
		r2.x = 320;
		r2.y = 80;
		r2.fillAlpha = 0.6;
		this.addChild(r2);

		const r3 = new Rect(130, 40, 0x2d3436);
		r3.x = 250;
		r3.y = 130;
		r3.strokeColor = 0xfeca57;
		r3.strokeWeight = 2;
		this.addChild(r3);
	}

	// ── Buttons ────────────────────────────────────────────────────────────

	private _buildButtons(): void {
		const label = new TextField();
		label.text = 'Buttons (tap to test events)';
		label.textColor = 0xb2bec3;
		label.size = 14;
		label.x = 20;
		label.y = 190;
		this.addChild(label);

		const statusTf = new TextField();
		statusTf.text = 'Status: idle';
		statusTf.textColor = 0xdfe6e9;
		statusTf.size = 14;
		statusTf.x = 200;
		statusTf.y = 190;
		this.addChild(statusTf);

		const createBtn = (text: string, x: number, y: number, color: number): Button => {
			const btn = new Button();
			btn.label = text;
			btn.width = 120;
			btn.height = 36;
			btn.x = x;
			btn.y = y;

			// Transparent hit area so the Button itself can receive touch events.
			btn.graphics.beginFill(0x000000, 0);
			btn.graphics.drawRect(0, 0, 120, 36);
			btn.graphics.endFill();

			// Manual skin: background rect + label
			const bg = new Rect(120, 36, color);
			btn.addChild(bg);

			const lbl = new Label(text);
			lbl.x = 10;
			lbl.y = 6;
			lbl.textColor = 0xffffff;
			lbl.size = 16;
			btn.labelDisplay = lbl;
			btn.addChild(lbl);

			btn.addEventListener(TouchEvent.TOUCH_TAP, () => {
				statusTf.text = `Tapped: ${text}`;
			});

			this.addChild(btn);
			return btn;
		};

		createBtn('Button A', 20, 215, 0x6c5ce7);
		createBtn('Button B', 160, 215, 0x00b894);
		createBtn('Button C', 300, 215, 0xe17055);
	}

	// ── ProgressBar ────────────────────────────────────────────────────────

	private _buildProgressBar(): void {
		const label = new TextField();
		label.text = 'ProgressBar + Animation';
		label.textColor = 0xb2bec3;
		label.size = 14;
		label.x = 20;
		label.y = 275;
		this.addChild(label);

		// Progress bar background
		const pbBg = new Rect(300, 20, 0x2d3436);
		pbBg.x = 20;
		pbBg.y = 300;
		pbBg.strokeColor = 0x636e72;
		pbBg.strokeWeight = 1;
		this.addChild(pbBg);

		// Progress bar fill
		const pbFill = new Rect(150, 20, 0x6c5ce7);
		pbFill.x = 20;
		pbFill.y = 300;
		this.addChild(pbFill);

		const pbLabel = new TextField();
		pbLabel.text = '50%';
		pbLabel.textColor = 0xffffff;
		pbLabel.size = 12;
		pbLabel.x = 330;
		pbLabel.y = 303;
		this.addChild(pbLabel);

		// Animate the progress bar using core ticker + manual animation
		let progress = 0;
		let direction = 1;
		const animate = () => {
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
		};

		// Use a simple setInterval for animation (Animation from ui would also work)
		setInterval(animate, 16);
	}

	// ── CheckBoxes ─────────────────────────────────────────────────────────

	private _buildCheckBoxes(): void {
		const label = new TextField();
		label.text = 'CheckBoxes';
		label.textColor = 0xb2bec3;
		label.size = 14;
		label.x = 20;
		label.y = 345;
		this.addChild(label);

		const items = ['Option A', 'Option B', 'Option C'];
		const stateLabel = new TextField();
		stateLabel.text = 'Selected: none';
		stateLabel.textColor = 0xdfe6e9;
		stateLabel.size = 12;
		stateLabel.x = 200;
		stateLabel.y = 345;
		this.addChild(stateLabel);

		items.forEach((text, i) => {
			const cb = new CheckBox();
			cb.label = text;
			cb.x = 20;
			cb.y = 375 + i * 32;

			// Transparent hit area covering the full row so touch events register.
			cb.graphics.beginFill(0x000000, 0);
			cb.graphics.drawRect(0, 0, 180, 28);
			cb.graphics.endFill();

			// Manual visual: box + label
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

			cb.addEventListener(Event.CHANGE, () => {
				const selected = items.filter((_, idx) => {
					// Can't easily read state here, just show the changed one
					return true;
				});
				stateLabel.text = `Changed: ${text}`;
			});

			this.addChild(cb);
		});
	}

	// ── RadioButtons ───────────────────────────────────────────────────────

	private _buildRadioButtons(): void {
		const label = new TextField();
		label.text = 'RadioButtons';
		label.textColor = 0xb2bec3;
		label.size = 14;
		label.x = 20;
		label.y = 475;
		this.addChild(label);

		const radioLabel = new TextField();
		radioLabel.text = 'Selected: none';
		radioLabel.textColor = 0xdfe6e9;
		radioLabel.size = 12;
		radioLabel.x = 200;
		radioLabel.y = 475;
		this.addChild(radioLabel);

		const items = ['Choice 1', 'Choice 2', 'Choice 3'];
		items.forEach((text, i) => {
			const rb = new RadioButton();
			rb.label = text;
			rb.value = text;
			rb.x = 20;
			rb.y = 505 + i * 32;

			// Transparent hit area covering the full row so touch events register.
			rb.graphics.beginFill(0x000000, 0);
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

			rb.addEventListener(Event.CHANGE, () => {
				radioLabel.text = `Selected: ${text}`;
			});

			this.addChild(rb);
		});
	}

	// ── Animation (pulse via Tween) ────────────────────────────────────────

	private _buildAnimation(): void {
		const label = new TextField();
		label.text = 'UI Animation (pulse)';
		label.textColor = 0xb2bec3;
		label.size = 14;
		label.x = 20;
		label.y = 610;
		this.addChild(label);

		const box = new Rect(60, 60, 0xe17055);
		box.x = 200;
		box.y = 610;
		this.addChild(box);

		// Use Tween for a clearly visible ping-pong pulse animation.
		// The box scales from 1× to 1.8× and back, with position compensation
		// so it stays visually centered around its original position.
		Tween.get(box, { loop: true })
			.to({ scaleX: 1.8, scaleY: 1.8, x: 170, y: 580 }, 600, Ease.sineInOut)
			.to({ scaleX: 1.0, scaleY: 1.0, x: 200, y: 610 }, 600, Ease.sineInOut);
	}
}
