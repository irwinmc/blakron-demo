import { Sprite, TextField, TouchEvent, Event } from '@blakron/core';
import { Button, Rect, Label, CheckBox, RadioButton, ToggleSwitch } from '@blakron/ui';
import { makePage, sectionGroup, HEADER_H, ROW_GAP, SECTION_GAP } from './shared.js';
import type { Navigator } from '../../Navigator.js';

// ── Composite page: all interactive controls ─────────────────────────────────

export function buildControlsPage(nav: Navigator): Sprite {
	return makePage('Controls', nav, content => {
		let cy = 8;

		buildButtons(content, cy);
		cy += 80 + SECTION_GAP;

		buildCheckBoxes(content, cy);
		cy += 130 + SECTION_GAP;

		buildRadioButtons(content, cy);
		cy += 130 + SECTION_GAP;

		buildToggleSwitch(content, cy);
	});
}

// ── Buttons ──────────────────────────────────────────────────────────────────

function buildButtons(content: Sprite, baseY: number): void {
	const g = sectionGroup('Buttons — tap to test events', baseY);
	content.addChild(g);

	const statusTf = new TextField();
	statusTf.text = 'Status: idle';
	statusTf.textColor = 0xdfe6e9;
	statusTf.size = 16;
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
		lbl.size = 18;
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
}

// ── CheckBoxes ───────────────────────────────────────────────────────────────

function buildCheckBoxes(content: Sprite, baseY: number): void {
	const g = sectionGroup('CheckBoxes', baseY);
	content.addChild(g);

	const items = ['Option A', 'Option B', 'Option C'];

	const stateLabel = new TextField();
	stateLabel.text = 'Selected: none';
	stateLabel.textColor = 0xdfe6e9;
	stateLabel.size = 14;
	stateLabel.x = 180;
	stateLabel.y = 0;
	g.addChild(stateLabel);

	const checkboxes: CheckBox[] = [];

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
		lbl.size = 16;
		lbl.textColor = 0xdfe6e9;
		cb.addChild(lbl);

		checkboxes.push(cb);

		cb.addEventListener(Event.CHANGE, () => {
			box.fillColor = cb.selected ? 0x6c5ce7 : 0x2d3436;
			updateStateLabel();
		});

		g.addChild(cb);
	});
}

// ── RadioButtons ─────────────────────────────────────────────────────────────

function buildRadioButtons(content: Sprite, baseY: number): void {
	const g = sectionGroup('RadioButtons', baseY);
	content.addChild(g);

	const items = ['Choice 1', 'Choice 2', 'Choice 3'];

	const radioLabel = new TextField();
	radioLabel.text = 'Selected: none';
	radioLabel.textColor = 0xdfe6e9;
	radioLabel.size = 14;
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
		lbl.size = 16;
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
}

// ── ToggleSwitch ─────────────────────────────────────────────────────────────

function buildToggleSwitch(content: Sprite, baseY: number): void {
	const g = sectionGroup('ToggleSwitch', baseY);
	content.addChild(g);

	const stateTf = new TextField();
	stateTf.text = 'OFF';
	stateTf.textColor = 0x636e72;
	stateTf.size = 16;
	stateTf.x = 120;
	stateTf.y = HEADER_H + 4;
	g.addChild(stateTf);

	const sw = new ToggleSwitch();
	sw.width = 100;
	sw.height = 32;
	sw.y = HEADER_H;

	const track = new Rect(100, 32, 0x2d3436);
	track.strokeColor = 0x636e72;
	track.strokeWeight = 1;
	sw.addChild(track);

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
}
