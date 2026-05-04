import { Sprite, TextField, Event } from '@blakron/core';
import { ProgressBar, Rect, Label, HSlider, VSlider, EditableText } from '@blakron/ui';
import { makePage, sectionGroup, HEADER_H, SECTION_GAP } from './shared.js';
import type { Navigator } from '../../Navigator.js';

// ── Composite page: all input/value controls ─────────────────────────────────

export function buildInputsPage(nav: Navigator): Sprite {
	return makePage('Inputs', nav, content => {
		let cy = 8;

		buildProgressBar(content, cy);
		cy += 170 + SECTION_GAP;

		buildSliders(content, cy);
		cy += 180 + SECTION_GAP;

		buildTextInput(content, cy);
	});
}

// ── ProgressBar ──────────────────────────────────────────────────────────────

function buildProgressBar(content: Sprite, baseY: number): void {
	const g = sectionGroup('ProgressBar', baseY);
	content.addChild(g);

	const pb1 = new ProgressBar();
	pb1.minimum = 0;
	pb1.maximum = 100;
	pb1.value = 0;
	pb1.width = 260;
	pb1.height = 20;
	pb1.y = HEADER_H;

	const pb1Bg = new Rect(260, 20, 0x2d3436);
	pb1Bg.strokeColor = 0x636e72;
	pb1Bg.strokeWeight = 1;
	pb1.addChild(pb1Bg);

	const pb1Fill = new Rect(0, 20, 0x6c5ce7);
	pb1.thumb = pb1Fill;
	pb1.addChild(pb1Fill);

	const pb1Lbl = new Label('0 / 100');
	pb1Lbl.x = 270;
	pb1Lbl.y = 0;
	pb1Lbl.width = 80;
	pb1Lbl.height = 20;
	pb1Lbl.verticalAlign = 'middle';
	pb1Lbl.textColor = 0xdfe6e9;
	pb1Lbl.size = 14;
	pb1.labelDisplay = pb1Lbl;
	pb1.addChild(pb1Lbl);
	g.addChild(pb1);

	// Vertical BTT bar
	const pb2 = new ProgressBar();
	pb2.minimum = 0;
	pb2.maximum = 100;
	pb2.value = 65;
	pb2.direction = 'btt';
	pb2.width = 20;
	pb2.height = 80;
	pb2.x = 0;
	pb2.y = HEADER_H + 30;

	const pb2Bg = new Rect(20, 80, 0x2d3436);
	pb2Bg.strokeColor = 0x636e72;
	pb2Bg.strokeWeight = 1;
	pb2.addChild(pb2Bg);

	const pb2Fill = new Rect(20, 0, 0x00b894);
	pb2.thumb = pb2Fill;
	pb2.addChild(pb2Fill);
	g.addChild(pb2);

	const pb2Lbl = new TextField();
	pb2Lbl.text = '65%';
	pb2Lbl.textColor = 0xdfe6e9;
	pb2Lbl.size = 13;
	pb2Lbl.x = 26;
	pb2Lbl.y = HEADER_H + 30 + 32;
	g.addChild(pb2Lbl);

	let progress = 0;
	let dir = 1;
	setInterval(() => {
		progress += dir * 0.8;
		if (progress >= 100) {
			progress = 100;
			dir = -1;
		}
		if (progress <= 0) {
			progress = 0;
			dir = 1;
		}
		pb1.value = progress;
	}, 16);
}

// ── Sliders (HSlider + VSlider) ──────────────────────────────────────────────

function buildSliders(content: Sprite, baseY: number): void {
	const g = sectionGroup('HSlider / VSlider', baseY);
	content.addChild(g);

	const trackW = 200;
	const trackH = 8;
	const thumbSize = 20;

	const valTf = new TextField();
	valTf.text = 'H: 50   V: 0';
	valTf.textColor = 0xdfe6e9;
	valTf.size = 14;
	valTf.x = 0;
	valTf.y = HEADER_H;
	g.addChild(valTf);

	// HSlider
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

	hs.graphics.beginFill(0x000000, 0.01);
	hs.graphics.drawRect(0, 0, trackW, thumbSize);
	hs.graphics.endFill();
	hs.thumb = hThumb;
	hs.track = hTrack;
	g.addChild(hs);

	// VSlider
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

	hs.addEventListener('propertyChange', () => {
		const pct = hs.value / 100;
		hFill.width = trackW * pct;
		hThumb.x = trackW * pct - thumbSize / 2;
		valTf.text = `H: ${Math.round(hs.value)}   V: ${Math.round(vs.value)}`;
	});

	vs.addEventListener('propertyChange', () => {
		const pct = vs.value / 100;
		vThumb.y = vTrackH * (1 - pct) - thumbSize / 2;
		valTf.text = `H: ${Math.round(hs.value)}   V: ${Math.round(vs.value)}`;
	});
}

// ── TextInput / EditableText ─────────────────────────────────────────────────

function buildTextInput(content: Sprite, baseY: number): void {
	const g = sectionGroup('EditableText / TextInput', baseY);
	content.addChild(g);

	// EditableText with prompt
	const etLabel = new TextField();
	etLabel.text = 'EditableText (with prompt):';
	etLabel.textColor = 0x636e72;
	etLabel.size = 13;
	etLabel.y = HEADER_H;
	g.addChild(etLabel);

	const et = new EditableText();
	et.width = 240;
	et.height = 36;
	et.y = HEADER_H + 18;
	et.size = 16;
	et.textColor = 0xdfe6e9;
	et.prompt = 'Type something…';
	et.promptColor = 0x636e72;

	const etBg = new Rect(240, 36, 0x16213e);
	etBg.strokeColor = 0x636e72;
	etBg.strokeWeight = 1;
	etBg.y = HEADER_H + 18;
	g.addChild(etBg);
	g.addChild(et);

	const etValue = new TextField();
	etValue.text = 'value: (empty)';
	etValue.textColor = 0x636e72;
	etValue.size = 13;
	etValue.y = HEADER_H + 60;
	g.addChild(etValue);

	et.addEventListener(Event.CHANGE, () => {
		etValue.text = `value: "${et.text}"`;
	});

	// Password mode
	const pwLabel = new TextField();
	pwLabel.text = 'Password mode:';
	pwLabel.textColor = 0x636e72;
	pwLabel.size = 13;
	pwLabel.y = HEADER_H + 80;
	g.addChild(pwLabel);

	const pw = new EditableText();
	pw.width = 240;
	pw.height = 36;
	pw.y = HEADER_H + 98;
	pw.size = 16;
	pw.textColor = 0xdfe6e9;
	pw.displayAsPassword = true;
	pw.prompt = 'Enter password…';
	pw.promptColor = 0x636e72;

	const pwBg = new Rect(240, 36, 0x16213e);
	pwBg.strokeColor = 0x636e72;
	pwBg.strokeWeight = 1;
	pwBg.y = HEADER_H + 98;
	g.addChild(pwBg);
	g.addChild(pw);
}
