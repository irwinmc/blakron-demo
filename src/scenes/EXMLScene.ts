import { Sprite, Shape, TextField, TouchEvent, Event } from '@blakron/core';
import { Button, Label, Panel, CheckBox, type Skin } from '@blakron/ui';
import { compileEXML } from '../exml/index.js';
import * as BlakronCore from '@blakron/core';
import * as BlakronUI from '@blakron/ui';

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

/**
 * Compile EXML source to a Skin factory function and execute it.
 * Replaces ES module imports with values from already-loaded packages.
 */
function exmlToSkinFactory(source: string): (() => Skin) | null {
	try {
		let js = compileEXML(source);

		// Strip import lines — we'll inject the symbols manually
		js = js.replace(/^import\s+\{[^}]+\}\s+from\s+"[^"]+";?\s*$/gm, '');

		// Strip 'export' keyword from function declaration
		js = js.replace(/^export\s+function\s+/m, 'function ');

		// Extract the factory function name
		const match = js.match(/^function\s+(\w+)\s*\(/m);
		if (!match) return null;
		const funcName = match[1];

		// Append a return statement so new Function can return the factory
		js += `\nreturn ${funcName};`;

		// Build the injected symbols from loaded packages
		const symbols: Record<string, unknown> = {
			...BlakronUI,
			...BlakronCore,
		};

		// Create and execute the function with injected symbols
		const paramNames = Object.keys(symbols);
		const paramValues = Object.values(symbols);
		const fn = new Function(...paramNames, js);
		return fn(...paramValues) as () => Skin;
	} catch (e) {
		console.error('[EXMLScene] Failed to compile EXML:', e);
		return null;
	}
}

// ── Layout ────────────────────────────────────────────────────────────────────

const PAD = 16;
const TAB_H = 36;
const DIVIDER_X_RATIO = 0.5;

// ── EXMLScene ─────────────────────────────────────────────────────────────────

export class EXMLScene extends Sprite {
	private readonly _sw: number;
	private readonly _sh: number;

	private _leftPanel!: Sprite;
	private _rightPanel!: Sprite;
	private _sourceLines: TextField[] = [];
	private _renderContainer!: Sprite;

	public constructor(screenWidth = 800, screenHeight = 600) {
		super();
		this._sw = screenWidth;
		this._sh = screenHeight;
	}

	public create(): void {
		this._buildTitle();
		this._buildExampleTabs();
		this._buildPanels();
		this._showExample(0);
	}

	// ── Title ─────────────────────────────────────────────────────────────────

	private _buildTitle(): void {
		const tf = new TextField();
		tf.text = 'EXML → Skin Runtime Demo';
		tf.textColor = 0xffffff;
		tf.size = 22;
		tf.bold = true;
		tf.x = PAD;
		tf.y = 10;
		this.addChild(tf);
	}

	// ── Tabs ──────────────────────────────────────────────────────────────────

	private _buildExampleTabs(): void {
		const tabY = 44;
		const tabW = Math.floor((this._sw - PAD * 2) / EXAMPLES.length) - 4;

		EXAMPLES.forEach((ex, i) => {
			const tab = new Sprite();
			tab.x = PAD + i * (tabW + 4);
			tab.y = tabY;
			tab.touchEnabled = true;

			const bg = new Shape();
			bg.graphics.beginFill(i === 0 ? 0x6c5ce7 : 0x0f3460);
			bg.graphics.drawRoundRect(0, 0, tabW, TAB_H, 6);
			bg.graphics.endFill();
			tab.addChild(bg);

			const lbl = new TextField();
			lbl.text = ex.name;
			lbl.textColor = 0xffffff;
			lbl.size = 13;
			lbl.x = 0;
			lbl.y = 0;
			lbl.width = tabW;
			lbl.height = TAB_H;
			lbl.textAlign = 'center';
			lbl.verticalAlign = 'middle';
			tab.addChild(lbl);

			tab.addEventListener(TouchEvent.TOUCH_TAP, () => {
				this._showExample(i);
				this._updateTabColors(i);
			});

			this.addChild(tab);
		});
	}

	private _updateTabColors(activeIdx: number): void {
		const tabY = 44;
		const tabW = Math.floor((this._sw - PAD * 2) / EXAMPLES.length) - 4;
		EXAMPLES.forEach((_, i) => {
			for (let c = 0; c < this.numChildren; c++) {
				const child = this.getChildAt(c);
				if (child && child.x === PAD + i * (tabW + 4) && child.y === tabY) {
					const bg = (child as Sprite).getChildAt(0) as Shape;
					if (bg) {
						bg.graphics.clear();
						bg.graphics.beginFill(i === activeIdx ? 0x6c5ce7 : 0x0f3460);
						bg.graphics.drawRoundRect(0, 0, tabW, TAB_H, 6);
						bg.graphics.endFill();
					}
					break;
				}
			}
		});
	}

	// ── Panels ────────────────────────────────────────────────────────────────

	private _buildPanels(): void {
		const panelY = 44 + TAB_H + 8;
		const panelH = this._sh - panelY - PAD;
		const divX = Math.floor(this._sw * DIVIDER_X_RATIO);
		const leftW = divX - PAD - 4;
		const rightW = this._sw - divX - PAD - 4;

		// ── Left: live render ─────────────────────────────────────────────────
		this._leftPanel = new Sprite();
		this._leftPanel.x = PAD;
		this._leftPanel.y = panelY;
		this.addChild(this._leftPanel);

		const leftBg = new Shape();
		leftBg.graphics.beginFill(0x0d1117);
		leftBg.graphics.drawRoundRect(0, 0, leftW, panelH, 6);
		leftBg.graphics.endFill();
		this._leftPanel.addChild(leftBg);

		const leftLabel = new TextField();
		leftLabel.text = '▶  Live Render';
		leftLabel.textColor = 0x00b894;
		leftLabel.size = 12;
		leftLabel.bold = true;
		leftLabel.x = 10;
		leftLabel.y = 8;
		this._leftPanel.addChild(leftLabel);

		// Container for rendered components
		this._renderContainer = new Sprite();
		this._renderContainer.x = 20;
		this._renderContainer.y = 36;
		this._leftPanel.addChild(this._renderContainer);

		// ── Right: EXML source ────────────────────────────────────────────────
		this._rightPanel = new Sprite();
		this._rightPanel.x = divX + 4;
		this._rightPanel.y = panelY;
		this.addChild(this._rightPanel);

		const rightBg = new Shape();
		rightBg.graphics.beginFill(0x0d1117);
		rightBg.graphics.drawRoundRect(0, 0, rightW, panelH, 6);
		rightBg.graphics.endFill();
		this._rightPanel.addChild(rightBg);

		const rightLabel = new TextField();
		rightLabel.text = '◀  EXML Source';
		rightLabel.textColor = 0x6c5ce7;
		rightLabel.size = 12;
		rightLabel.bold = true;
		rightLabel.x = 10;
		rightLabel.y = 8;
		this._rightPanel.addChild(rightLabel);

		// Divider
		const divider = new Shape();
		divider.graphics.lineStyle(1, 0x2d3436);
		divider.graphics.moveTo(0, 0);
		divider.graphics.lineTo(0, panelH);
		divider.x = divX;
		divider.y = panelY;
		this.addChild(divider);
	}

	// ── Show example ──────────────────────────────────────────────────────────

	private _showExample(idx: number): void {
		const ex = EXAMPLES[idx];

		// Clear render container
		while (this._renderContainer.numChildren > 0) {
			this._renderContainer.removeChildAt(0);
		}

		// Compile and render
		const factory = exmlToSkinFactory(ex.exml);
		if (factory) {
			this._renderExample(idx, factory);
		} else {
			const errTf = new TextField();
			errTf.text = 'Compile error — see console';
			errTf.textColor = 0xe17055;
			errTf.size = 14;
			this._renderContainer.addChild(errTf);
		}

		// Show EXML source on right
		this._renderSource(ex.exml);
	}

	// ── Render each example ───────────────────────────────────────────────────

	private _renderExample(idx: number, factory: () => Skin): void {
		const rc = this._renderContainer;
		const ex = EXAMPLES[idx];

		// Description
		const desc = new TextField();
		desc.text = ex.description;
		desc.textColor = 0x636e72;
		desc.size = 12;
		desc.y = 0;
		rc.addChild(desc);

		if (idx === 0) {
			// Button Skin — show 3 states + interactive button
			const statusTf = new TextField();
			statusTf.text = 'Tap the button';
			statusTf.textColor = 0xdfe6e9;
			statusTf.size = 13;
			statusTf.y = 24;
			rc.addChild(statusTf);

			['up', 'down', 'disabled'].forEach((state, i) => {
				const lbl = new TextField();
				lbl.text = `state: ${state}`;
				lbl.textColor = 0x636e72;
				lbl.size = 11;
				lbl.x = 0;
				lbl.y = 50 + i * 60;
				rc.addChild(lbl);

				const btn = new Button();
				btn.label = state === 'disabled' ? 'Disabled' : 'Click Me';
				btn.skinName = factory as unknown as new () => Skin;
				btn.width = 160;
				btn.height = 44;
				btn.x = 0;
				btn.y = 64 + i * 60;
				if (state === 'disabled') {
					btn.enabled = false;
				} else if (state === 'down') {
					btn.currentState = 'down';
				}
				btn.addEventListener(TouchEvent.TOUCH_TAP, () => {
					statusTf.text = `Tapped! (state was: ${state})`;
				});
				rc.addChild(btn);
			});
		} else if (idx === 1) {
			// Card Panel skin — Panel has titleDisplay as a built-in skin part
			const panel = new Panel();
			panel.title = 'Card Title';
			panel.skinName = factory as unknown as new () => Skin;
			panel.width = 280;
			panel.height = 160;
			panel.y = 24;

			// contentLabel is not a Panel skin part, set it after skin attaches
			panel.addEventListener(Event.COMPLETE, () => {
				const skin = panel.skin;
				if (!skin) return;
				const contentLabel = skin.getPart('contentLabel') as Label | undefined;
				if (contentLabel) contentLabel.text = 'Skin generated from EXML\nat runtime via compileEXML()';
			});
			rc.addChild(panel);
		} else if (idx === 2) {
			// CheckBox skin — show selected/unselected
			const statusTf = new TextField();
			statusTf.text = 'Tap to toggle';
			statusTf.textColor = 0xdfe6e9;
			statusTf.size = 13;
			statusTf.y = 24;
			rc.addChild(statusTf);

			['Option A', 'Option B', 'Option C'].forEach((label, i) => {
				const cb = new CheckBox();
				cb.label = label;
				cb.skinName = factory as unknown as new () => Skin;
				cb.width = 180;
				cb.height = 28;
				cb.y = 50 + i * 36;

				// hit area
				cb.graphics.beginFill(0x000000, 0.01);
				cb.graphics.drawRect(0, 0, 180, 28);
				cb.graphics.endFill();

				cb.addEventListener(Event.CHANGE, () => {
					statusTf.text = `${label}: ${cb.selected ? 'checked ✓' : 'unchecked'}`;
				});
				rc.addChild(cb);
			});
		} else if (idx === 3) {
			// Legacy style — states attr shorthand + e: prefix
			const statusTf2 = new TextField();
			statusTf2.text = 'Tap the button';
			statusTf2.textColor = 0xdfe6e9;
			statusTf2.size = 13;
			statusTf2.y = 24;
			rc.addChild(statusTf2);

			(['up', 'disabled'] as const).forEach((state, i) => {
				const lbl = new TextField();
				lbl.text = `state: ${state}`;
				lbl.textColor = 0x636e72;
				lbl.size = 11;
				lbl.x = 0;
				lbl.y = 50 + i * 60;
				rc.addChild(lbl);

				const btn = new Button();
				btn.label = state === 'disabled' ? 'Disabled' : 'Legacy Button';
				btn.skinName = factory as unknown as new () => Skin;
				btn.width = 160;
				btn.height = 44;
				btn.x = 0;
				btn.y = 64 + i * 60;
				if (state === 'disabled') btn.enabled = false;
				btn.addEventListener(TouchEvent.TOUCH_TAP, () => {
					statusTf2.text = 'Tapped legacy button!';
				});
				rc.addChild(btn);
			});
		}
	}

	// ── Render EXML source ────────────────────────────────────────────────────

	private _renderSource(exml: string): void {
		const panel = this._rightPanel;
		while (panel.numChildren > 2) panel.removeChildAt(panel.numChildren - 1);
		this._sourceLines.length = 0;

		const panelY = 44 + TAB_H + 8;
		const panelH = this._sh - panelY - PAD;
		const divX = Math.floor(this._sw * DIVIDER_X_RATIO);
		const panelW = this._sw - divX - PAD - 4;

		const lines = exml.split('\n');
		const lineH = 16;
		const startY = 30;
		const maxLines = Math.floor((panelH - startY - 8) / lineH);

		lines.slice(0, maxLines).forEach((line, i) => {
			const tf = new TextField();
			tf.text = line;
			tf.size = 11;
			tf.x = 10;
			tf.y = startY + i * lineH;
			tf.width = panelW - 20;
			tf.height = lineH;

			if (line.trimStart().startsWith('<?') || line.trimStart().startsWith('<!--')) {
				tf.textColor = 0x6a9955;
			} else if (/<\/?\w/.test(line)) {
				tf.textColor = 0x4ec9b0;
			} else {
				tf.textColor = 0xce9178;
			}

			panel.addChild(tf);
			this._sourceLines.push(tf);
		});

		if (lines.length > maxLines) {
			const notice = new TextField();
			notice.text = `... (${lines.length - maxLines} more lines)`;
			notice.textColor = 0x636e72;
			notice.size = 10;
			notice.x = 10;
			notice.y = startY + maxLines * lineH;
			panel.addChild(notice);
		}
	}
}
