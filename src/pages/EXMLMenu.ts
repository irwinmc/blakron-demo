import { Sprite, TextField, Shape, TouchEvent, Event } from '@blakron/core';
import { Label, Button, CheckBox, Panel, type Skin } from '@blakron/ui';
import { compileEXML } from '../exml/index.js';
import * as BlakronCore from '@blakron/core';
import * as BlakronUI from '@blakron/ui';
import { createTitleBar, createContentArea, createMenuCard, CONTENT_W, CARD_H, CARD_GAP } from './common.js';
import { Navigator } from '../Navigator.js';

// ── Page builder helper ───────────────────────────────────────────────────────

function makePage(title: string, nav: Navigator, buildContent: (content: Sprite) => void): Sprite {
	const page = new Sprite();
	page.addChild(createTitleBar(title, () => nav.pop()));

	const content = createContentArea();
	buildContent(content);
	page.addChild(content);

	return page;
}

// ── EXML examples ─────────────────────────────────────────────────────────────

interface ExmlExample {
	name: string;
	exml: string;
	description: string;
}

const EXAMPLES: ExmlExample[] = [
	{
		name: 'Button Skin',
		description: 'A Button with up/down/disabled states via Skin',
		exml: `<?xml version="1.0" encoding="utf-8"?>
<eui:Skin class="skins.ButtonSkin" width="160" height="44"
    xmlns:eui="http://ns.egret.com/eui">
  <eui:states>
    <eui:State name="up"/>
    <eui:State name="down"/>
    <eui:State name="disabled"/>
  </eui:states>
  <eui:Rect id="bg" width="160" height="44"
      fillColor="0x6c5ce7"
      fillColor.down="0x5a4bd1"
      fillColor.disabled="0x636e72"/>
  <eui:Label id="labelDisplay"
      x="0" y="0" width="160" height="44"
      textAlign="center" verticalAlign="middle"
      textColor="0xffffff" size="16"/>
</eui:Skin>`,
	},
	{
		name: 'Card Panel',
		description: 'A Panel skin with title bar and content area',
		exml: `<?xml version="1.0" encoding="utf-8"?>
<eui:Skin class="skins.CardSkin" width="280" height="160"
    xmlns:eui="http://ns.egret.com/eui">
  <eui:Rect width="280" height="160"
      fillColor="0x16213e"
      strokeColor="0x0f3460" strokeWeight="1"/>
  <eui:Rect width="280" height="36"
      fillColor="0x0f3460"/>
  <eui:Label id="titleDisplay"
      x="12" y="0" width="256" height="36"
      verticalAlign="middle"
      textColor="0xffffff" size="14" bold="true"/>
  <eui:Label id="contentLabel"
      x="12" y="48"
      textColor="0xb2bec3" size="13"/>
</eui:Skin>`,
	},
	{
		name: 'CheckBox Skin',
		description: 'CheckBox with selected/unselected visual states',
		exml: `<?xml version="1.0" encoding="utf-8"?>
<eui:Skin class="skins.CheckBoxSkin" width="180" height="28"
    xmlns:eui="http://ns.egret.com/eui">
  <eui:states>
    <eui:State name="up"/>
    <eui:State name="upAndSelected"/>
    <eui:State name="down"/>
    <eui:State name="downAndSelected"/>
    <eui:State name="disabled"/>
  </eui:states>
  <eui:Rect id="box" x="0" y="4" width="20" height="20"
      fillColor="0x2d3436"
      fillColor.upAndSelected="0x6c5ce7"
      fillColor.downAndSelected="0x5a4bd1"
      strokeColor="0x636e72" strokeWeight="1"/>
  <eui:Label id="labelDisplay"
      x="28" y="0" width="152" height="28"
      verticalAlign="middle"
      textColor="0xdfe6e9" size="14"/>
</eui:Skin>`,
	},
	{
		name: 'Legacy Style',
		description: 'Egret legacy syntax: states attr shorthand + e: prefix',
		exml: `<?xml version="1.0" encoding="utf-8"?>
<e:Skin class="skins.LegacyButton" width="160" height="44"
    states="up,down,disabled"
    xmlns:e="http://ns.egret.com/eui">
  <e:Rect id="bg" width="160" height="44"
      fillColor="0x00b894"
      fillColor.down="0x00a381"
      fillColor.disabled="0x636e72"/>
  <e:Label id="labelDisplay"
      x="0" y="0" width="160" height="44"
      textAlign="center" verticalAlign="middle"
      textColor="0xffffff" size="16"
      textColor.disabled="0xb2bec3"/>
</e:Skin>`,
	},
];

// ── Runtime EXML executor ─────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SkinFactory = any;

function exmlToSkinFactory(source: string): SkinFactory | null {
	try {
		let js = compileEXML(source);

		// Strip import lines
		js = js.replace(/^import\s+\{[^}]+\}\s+from\s+"[^"]+";?\s*$/gm, '');

		// Strip 'export' keyword
		js = js.replace(/^export\s+function\s+/m, 'function ');

		// Extract the factory function name
		const match = js.match(/^function\s+(\w+)\s*\(/m);
		if (!match) return null;
		const funcName = match[1];

		// Append return statement
		js += `\nreturn ${funcName};`;

		// Build injected symbols
		const symbols: Record<string, unknown> = {
			...BlakronUI,
			...BlakronCore,
		};

		const paramNames = Object.keys(symbols);
		const paramValues = Object.values(symbols);
		const fn = new Function(...paramNames, js);
		return fn(...paramValues);
	} catch (e) {
		console.error('[EXML] Failed to compile:', e);
		return null;
	}
}

// ═══════════════════════════════════════════════════════════════════════════════
// Individual EXML test pages
// ═══════════════════════════════════════════════════════════════════════════════

function buildButtonSkinPage(nav: Navigator): Sprite {
	return makePage('EXML: Button Skin', nav, content => {
		let cy = 16;

		const desc = new Label(EXAMPLES[0].description);
		desc.x = 16;
		desc.y = cy;
		desc.width = CONTENT_W - 32;
		desc.height = 20;
		desc.textColor = 0xb2bec3;
		desc.size = 13;
		content.addChild(desc);
		cy += 28;

		// Source
		const srcHeader = new Label('Source:');
		srcHeader.x = 16;
		srcHeader.y = cy;
		srcHeader.width = 200;
		srcHeader.height = 18;
		srcHeader.textColor = 0x636e72;
		srcHeader.size = 11;
		srcHeader.bold = true;
		content.addChild(srcHeader);
		cy += 20;

		const sourceLines = EXAMPLES[0].exml.split('\n').filter(l => l.trim());
		sourceLines.slice(0, 6).forEach(line => {
			const tf = new TextField();
			tf.text = line.replace(/^\s+/, '');
			tf.textColor = 0xa29bfe;
			tf.size = 10;
			tf.x = 20;
			tf.y = cy;
			tf.width = CONTENT_W - 40;
			content.addChild(tf);
			cy += 14;
		});

		cy += 12;

		// Preview
		const previewHeader = new Label('Live Preview:');
		previewHeader.x = 16;
		previewHeader.y = cy;
		previewHeader.width = 200;
		previewHeader.height = 18;
		previewHeader.textColor = 0x636e72;
		previewHeader.size = 11;
		previewHeader.bold = true;
		content.addChild(previewHeader);
		cy += 24;

		const factory = exmlToSkinFactory(EXAMPLES[0].exml);
		if (factory) {
			const statusTf = new Label('Tap a button');
			statusTf.x = 200;
			statusTf.y = cy;
			statusTf.width = 200;
			statusTf.height = 20;
			statusTf.textColor = 0xdfe6e9;
			statusTf.size = 13;
			content.addChild(statusTf);

			['up', 'down', 'disabled'].forEach((state, i) => {
				const stateLabel = new Label(`state: ${state}`);
				stateLabel.x = 16;
				stateLabel.y = cy + i * 56;
				stateLabel.width = 60;
				stateLabel.height = 20;
				stateLabel.textColor = 0x636e72;
				stateLabel.size = 11;
				content.addChild(stateLabel);

				const btn = new Button();
				btn.label = state === 'disabled' ? 'Disabled' : 'Click Me';
				btn.skinName = factory as unknown as new () => Skin;
				btn.width = 160;
				btn.height = 44;
				btn.x = 80;
				btn.y = cy + i * 56;
				if (state === 'disabled') {
					btn.enabled = false;
				} else if (state === 'down') {
					btn.currentState = 'down';
				}

				btn.addEventListener(TouchEvent.TOUCH_TAP, () => {
					statusTf.text = `Tapped: ${state}`;
				});
				content.addChild(btn);
			});
		} else {
			const errTf = new Label('✗ Failed to compile EXML');
			errTf.x = 16;
			errTf.y = cy;
			errTf.width = CONTENT_W - 32;
			errTf.height = 20;
			errTf.textColor = 0xe17055;
			errTf.size = 12;
			content.addChild(errTf);
		}
	});
}

function buildCardPanelPage(nav: Navigator): Sprite {
	return makePage('EXML: Card Panel', nav, content => {
		let cy = 16;

		const desc = new Label(EXAMPLES[1].description);
		desc.x = 16;
		desc.y = cy;
		desc.width = CONTENT_W - 32;
		desc.height = 20;
		desc.textColor = 0xb2bec3;
		desc.size = 13;
		content.addChild(desc);
		cy += 28;

		// Source
		const srcHeader = new Label('Source:');
		srcHeader.x = 16;
		srcHeader.y = cy;
		srcHeader.width = 200;
		srcHeader.height = 18;
		srcHeader.textColor = 0x636e72;
		srcHeader.size = 11;
		srcHeader.bold = true;
		content.addChild(srcHeader);
		cy += 20;

		const sourceLines = EXAMPLES[1].exml.split('\n').filter(l => l.trim());
		sourceLines.slice(0, 6).forEach(line => {
			const tf = new TextField();
			tf.text = line.replace(/^\s+/, '');
			tf.textColor = 0xa29bfe;
			tf.size = 10;
			tf.x = 20;
			tf.y = cy;
			tf.width = CONTENT_W - 40;
			content.addChild(tf);
			cy += 14;
		});

		cy += 12;

		// Preview
		const previewHeader = new Label('Live Preview:');
		previewHeader.x = 16;
		previewHeader.y = cy;
		previewHeader.width = 200;
		previewHeader.height = 18;
		previewHeader.textColor = 0x636e72;
		previewHeader.size = 11;
		previewHeader.bold = true;
		content.addChild(previewHeader);
		cy += 24;

		const factory = exmlToSkinFactory(EXAMPLES[1].exml);
		if (factory) {
			const panel = new Panel();
			panel.title = 'My Card';
			panel.skinName = factory as unknown as new () => Skin;
			panel.width = 280;
			panel.height = 160;
			panel.x = (CONTENT_W - 280) / 2;
			panel.y = cy;

			panel.addEventListener(Event.COMPLETE, () => {
				const skin = panel.skin;
				if (!skin) return;
				const contentLabel = skin.getPart('contentLabel') as Label | undefined;
				if (contentLabel) {
					contentLabel.text = 'Generated from EXML at runtime via compileEXML()';
				}
			});
			content.addChild(panel);

			const status = new Label('✓ EXML compiled → Panel rendered');
			status.x = 16;
			status.y = cy + 170;
			status.width = CONTENT_W - 32;
			status.height = 20;
			status.textColor = 0x00b894;
			status.size = 12;
			content.addChild(status);
		} else {
			const errTf = new Label('✗ Failed to compile EXML');
			errTf.x = 16;
			errTf.y = cy;
			errTf.width = CONTENT_W - 32;
			errTf.height = 20;
			errTf.textColor = 0xe17055;
			errTf.size = 12;
			content.addChild(errTf);
		}
	});
}

function buildCheckBoxSkinPage(nav: Navigator): Sprite {
	return makePage('EXML: CheckBox Skin', nav, content => {
		let cy = 16;

		const desc = new Label(EXAMPLES[2].description);
		desc.x = 16;
		desc.y = cy;
		desc.width = CONTENT_W - 32;
		desc.height = 20;
		desc.textColor = 0xb2bec3;
		desc.size = 13;
		content.addChild(desc);
		cy += 28;

		// Source
		const srcHeader = new Label('Source:');
		srcHeader.x = 16;
		srcHeader.y = cy;
		srcHeader.width = 200;
		srcHeader.height = 18;
		srcHeader.textColor = 0x636e72;
		srcHeader.size = 11;
		srcHeader.bold = true;
		content.addChild(srcHeader);
		cy += 20;

		const sourceLines = EXAMPLES[2].exml.split('\n').filter(l => l.trim());
		sourceLines.slice(0, 6).forEach(line => {
			const tf = new TextField();
			tf.text = line.replace(/^\s+/, '');
			tf.textColor = 0xa29bfe;
			tf.size = 10;
			tf.x = 20;
			tf.y = cy;
			tf.width = CONTENT_W - 40;
			content.addChild(tf);
			cy += 14;
		});

		cy += 12;

		// Preview
		const previewHeader = new Label('Live Preview:');
		previewHeader.x = 16;
		previewHeader.y = cy;
		previewHeader.width = 200;
		previewHeader.height = 18;
		previewHeader.textColor = 0x636e72;
		previewHeader.size = 11;
		previewHeader.bold = true;
		content.addChild(previewHeader);
		cy += 24;

		const factory = exmlToSkinFactory(EXAMPLES[2].exml);
		if (factory) {
			const statusTf = new Label('Tap to toggle');
			statusTf.x = 200;
			statusTf.y = cy;
			statusTf.width = 200;
			statusTf.height = 20;
			statusTf.textColor = 0xdfe6e9;
			statusTf.size = 13;
			content.addChild(statusTf);

			['Option A', 'Option B', 'Option C'].forEach((label, i) => {
				const cb = new CheckBox();
				cb.label = label;
				cb.skinName = factory as unknown as new () => Skin;
				cb.width = 180;
				cb.height = 28;
				cb.x = 16;
				cb.y = cy + i * 36;

				// hit area
				cb.graphics.beginFill(0x000000, 0.01);
				cb.graphics.drawRect(0, 0, 180, 28);
				cb.graphics.endFill();

				cb.addEventListener(Event.CHANGE, () => {
					statusTf.text = `${label}: ${cb.selected ? 'checked ✓' : 'unchecked'}`;
				});
				content.addChild(cb);
			});
		} else {
			const errTf = new Label('✗ Failed to compile EXML');
			errTf.x = 16;
			errTf.y = cy;
			errTf.width = CONTENT_W - 32;
			errTf.height = 20;
			errTf.textColor = 0xe17055;
			errTf.size = 12;
			content.addChild(errTf);
		}
	});
}

function buildLegacyStylePage(nav: Navigator): Sprite {
	return makePage('EXML: Legacy Style', nav, content => {
		let cy = 16;

		const desc = new Label(EXAMPLES[3].description);
		desc.x = 16;
		desc.y = cy;
		desc.width = CONTENT_W - 32;
		desc.height = 20;
		desc.textColor = 0xb2bec3;
		desc.size = 13;
		content.addChild(desc);
		cy += 28;

		// Source
		const srcHeader = new Label('Source:');
		srcHeader.x = 16;
		srcHeader.y = cy;
		srcHeader.width = 200;
		srcHeader.height = 18;
		srcHeader.textColor = 0x636e72;
		srcHeader.size = 11;
		srcHeader.bold = true;
		content.addChild(srcHeader);
		cy += 20;

		const sourceLines = EXAMPLES[3].exml.split('\n').filter(l => l.trim());
		sourceLines.slice(0, 6).forEach(line => {
			const tf = new TextField();
			tf.text = line.replace(/^\s+/, '');
			tf.textColor = 0xa29bfe;
			tf.size = 10;
			tf.x = 20;
			tf.y = cy;
			tf.width = CONTENT_W - 40;
			content.addChild(tf);
			cy += 14;
		});

		cy += 12;

		// Preview
		const previewHeader = new Label('Live Preview:');
		previewHeader.x = 16;
		previewHeader.y = cy;
		previewHeader.width = 200;
		previewHeader.height = 18;
		previewHeader.textColor = 0x636e72;
		previewHeader.size = 11;
		previewHeader.bold = true;
		content.addChild(previewHeader);
		cy += 24;

		const factory = exmlToSkinFactory(EXAMPLES[3].exml);
		if (factory) {
			const statusTf = new Label('Tap the button');
			statusTf.x = 200;
			statusTf.y = cy;
			statusTf.width = 200;
			statusTf.height = 20;
			statusTf.textColor = 0xdfe6e9;
			statusTf.size = 13;
			content.addChild(statusTf);

			(['up', 'disabled'] as const).forEach((state, i) => {
				const stateLabel = new Label(`state: ${state}`);
				stateLabel.x = 16;
				stateLabel.y = cy + i * 56;
				stateLabel.width = 60;
				stateLabel.height = 20;
				stateLabel.textColor = 0x636e72;
				stateLabel.size = 11;
				content.addChild(stateLabel);

				const btn = new Button();
				btn.label = state === 'disabled' ? 'Disabled' : 'Legacy Button';
				btn.skinName = factory as unknown as new () => Skin;
				btn.width = 160;
				btn.height = 44;
				btn.x = 80;
				btn.y = cy + i * 56;
				if (state === 'disabled') btn.enabled = false;

				btn.addEventListener(TouchEvent.TOUCH_TAP, () => {
					statusTf.text = 'Tapped legacy button!';
				});
				content.addChild(btn);
			});
		} else {
			const errTf = new Label('✗ Failed to compile EXML');
			errTf.x = 16;
			errTf.y = cy;
			errTf.width = CONTENT_W - 32;
			errTf.height = 20;
			errTf.textColor = 0xe17055;
			errTf.size = 12;
			content.addChild(errTf);
		}
	});
}

function buildAllExamplesPage(nav: Navigator): Sprite {
	return makePage('EXML Playground', nav, content => {
		let cy = 16;

		const header = new Label('Runtime EXML compiler — 4 examples');
		header.x = 16;
		header.y = cy;
		header.width = CONTENT_W - 32;
		header.height = 22;
		header.textColor = 0xb2bec3;
		header.size = 14;
		header.bold = true;
		content.addChild(header);
		cy += 32;

		// Example 0: Buttons
		EXAMPLES.forEach((ex, idx) => {
			const factory = exmlToSkinFactory(ex.exml);
			const nameTf = new Label(`${ex.name}`);
			nameTf.x = 16;
			nameTf.y = cy;
			nameTf.width = 200;
			nameTf.height = 20;
			nameTf.textColor = 0xffffff;
			nameTf.size = 14;
			nameTf.bold = true;
			content.addChild(nameTf);

			const descTf = new Label(ex.description);
			descTf.x = 16;
			descTf.y = cy + 18;
			descTf.width = CONTENT_W - 32;
			descTf.height = 18;
			descTf.textColor = 0x636e72;
			descTf.size = 11;
			content.addChild(descTf);

			if (factory) {
				// Show a minimal demo depending on type
				if (idx === 0 || idx === 3) {
					// Button types
					const btn = new Button();
					btn.label = ex.name;
					btn.skinName = factory as unknown as new () => Skin;
					btn.width = 160;
					btn.height = 44;
					btn.x = 16;
					btn.y = cy + 40;
					content.addChild(btn);

					const okLabel = new Label('✓');
					okLabel.x = 190;
					okLabel.y = cy + 48;
					okLabel.textColor = 0x00b894;
					okLabel.size = 14;
					content.addChild(okLabel);
				} else if (idx === 2) {
					// CheckBox type
					const cb = new CheckBox();
					cb.label = 'Toggle';
					cb.skinName = factory as unknown as new () => Skin;
					cb.width = 180;
					cb.height = 28;
					cb.x = 16;
					cb.y = cy + 40;
					cb.graphics.beginFill(0x000000, 0.01);
					cb.graphics.drawRect(0, 0, 180, 28);
					cb.graphics.endFill();
					content.addChild(cb);

					const okLabel = new Label('✓');
					okLabel.x = 210;
					okLabel.y = cy + 40;
					okLabel.textColor = 0x00b894;
					okLabel.size = 14;
					content.addChild(okLabel);
				} else {
					// Panel type
					const panel = new Panel();
					panel.title = ex.name;
					panel.skinName = factory as unknown as new () => Skin;
					panel.width = 200;
					panel.height = 80;
					panel.x = 16;
					panel.y = cy + 40;
					content.addChild(panel);

					const okLabel = new Label('✓');
					okLabel.x = 230;
					okLabel.y = cy + 48;
					okLabel.textColor = 0x00b894;
					okLabel.size = 14;
					content.addChild(okLabel);
				}

				cy += 100;
			} else {
				const errTf = new Label('✗ Compile failed');
				errTf.x = 16;
				errTf.y = cy + 40;
				errTf.width = 200;
				errTf.height = 20;
				errTf.textColor = 0xe17055;
				errTf.size = 12;
				content.addChild(errTf);

				cy += 70;
			}

			cy += 16;
		});
	});
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXML menu entries
// ═══════════════════════════════════════════════════════════════════════════════

interface MenuEntry {
	title: string;
	description: string;
	accent: number;
	build: (nav: Navigator) => Sprite;
}

const MENU_ENTRIES: MenuEntry[] = [
	{
		title: 'Button Skin',
		description: 'Button with up/down/disabled states via EXML Skin',
		accent: 0x6c5ce7,
		build: buildButtonSkinPage,
	},
	{
		title: 'Card Panel',
		description: 'Panel skin with title bar and content area',
		accent: 0x0f3460,
		build: buildCardPanelPage,
	},
	{
		title: 'CheckBox Skin',
		description: 'CheckBox with selected/unselected visual states',
		accent: 0xfeca57,
		build: buildCheckBoxSkinPage,
	},
	{
		title: 'Legacy Style',
		description: 'Egret legacy syntax: states attr + e: prefix',
		accent: 0x00b894,
		build: buildLegacyStylePage,
	},
	{
		title: 'All Examples',
		description: 'Compile and render all 4 EXML examples together',
		accent: 0xa29bfe,
		build: buildAllExamplesPage,
	},
];

// ═══════════════════════════════════════════════════════════════════════════════
// Main entry point
// ═══════════════════════════════════════════════════════════════════════════════

export function createEXMLMenu(nav: Navigator): Sprite {
	const page = new Sprite();
	page.addChild(createTitleBar('EXML', () => nav.pop()));

	const content = createContentArea();
	page.addChild(content);

	// Subtitle
	const subtitle = new Label(`EXML Runtime Compiler — ${MENU_ENTRIES.length} demos`);
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
