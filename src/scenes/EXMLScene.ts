import { Sprite, Shape, TextField } from '@blakron/core';
import { compileEXML, parseEXML } from '../exml/index.js';

// ── EXML examples ─────────────────────────────────────────────────────────────

interface ExmlExample {
	name: string;
	exml: string;
}

const EXAMPLES: ExmlExample[] = [
	{
		name: 'Simple Button',
		exml: `<?xml version="1.0" encoding="utf-8"?>
<eui:Skin class="skins.SimpleButton" width="300" height="200"
    xmlns:eui="http://ns.egret.com/eui">
  <eui:Button id="btn" label="Click Me"
      x="10" y="20" width="120" height="40"/>
  <eui:Label id="title" text="Hello Blakron"
      x="10" y="80"/>
</eui:Skin>`,
	},
	{
		name: 'Layout Group',
		exml: `<?xml version="1.0" encoding="utf-8"?>
<eui:Skin class="skins.LayoutDemo" width="400" height="300"
    xmlns:eui="http://ns.egret.com/eui">
  <eui:Group x="10" y="10" width="380" height="280">
    <eui:Rect width="100%" height="100%"
        fillColor="0x2d3436" strokeColor="0x636e72"
        strokeWeight="1"/>
    <eui:Label text="Group Container" x="10" y="10"/>
    <eui:Button id="okBtn" label="OK"
        x="10" y="40" width="80" height="32"/>
    <eui:Button id="cancelBtn" label="Cancel"
        x="100" y="40" width="80" height="32"/>
    <eui:CheckBox id="cb" label="Enable feature"
        x="10" y="90" width="160" height="28"/>
  </eui:Group>
</eui:Skin>`,
	},
	{
		name: 'States',
		exml: `<?xml version="1.0" encoding="utf-8"?>
<eui:Skin class="skins.StateSkin"
    xmlns:eui="http://ns.egret.com/eui">
  <eui:states>
    <eui:State name="up"/>
    <eui:State name="down"/>
    <eui:State name="disabled"/>
  </eui:states>
  <eui:Rect id="bg" width="120" height="40"
      fillColor="0x6c5ce7"
      fillColor.down="0x5a4bd1"
      fillColor.disabled="0x636e72"/>
  <eui:Label id="lbl" text="Button"
      text.down="Pressed"
      text.disabled="Disabled"
      x="10" y="10"/>
</eui:Skin>`,
	},
	{
		name: 'Percent & Binding',
		exml: `<?xml version="1.0" encoding="utf-8"?>
<eui:Skin class="skins.BindDemo" width="400" height="200"
    xmlns:eui="http://ns.egret.com/eui">
  <eui:Group width="100%" height="100%">
    <eui:Label id="nameLabel" text="{data.name}"
        x="10" y="10"/>
    <eui:Label id="scoreLabel" text="{data.score}"
        x="10" y="40"/>
    <eui:ProgressBar id="bar"
        width="80%" height="20"
        x="10" y="70"/>
  </eui:Group>
</eui:Skin>`,
	},
];

// ── Layout ────────────────────────────────────────────────────────────────────

const PAD = 16;
const TAB_H = 36;
const DIVIDER_X_RATIO = 0.45; // left panel takes 45% of width

// ── EXMLScene ─────────────────────────────────────────────────────────────────

export class EXMLScene extends Sprite {
	private readonly _sw: number;
	private readonly _sh: number;
	private _activeIdx = 0;

	// Panels
	private _leftPanel!: Sprite;
	private _rightPanel!: Sprite;

	// Left: IR display
	private _irLines: TextField[] = [];

	// Right: source display
	private _sourceLines: TextField[] = [];

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
		tf.text = 'EXML Parser Demo';
		tf.textColor = 0xffffff;
		tf.size = 22;
		tf.bold = true;
		tf.x = PAD;
		tf.y = 10;
		this.addChild(tf);
	}

	// ── Example tabs ──────────────────────────────────────────────────────────

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

			tab.addEventListener('touchTap', () => {
				this._showExample(i);
				// Update tab colors
				this._rebuildTabs(i);
			});

			this.addChild(tab);
		});
	}

	private _rebuildTabs(activeIdx: number): void {
		// Remove old tabs (children 1..EXAMPLES.length, after title at 0)
		// Simpler: just rebuild from scratch by removing and re-adding
		// We track tabs by name
		const tabY = 44;
		const tabW = Math.floor((this._sw - PAD * 2) / EXAMPLES.length) - 4;

		EXAMPLES.forEach((ex, i) => {
			// Find the tab sprite at this position
			for (let c = 0; c < this.numChildren; c++) {
				const child = this.getChildAt(c);
				if (child && child.x === PAD + i * (tabW + 4) && child.y === tabY) {
					// Update background color
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

		// ── Left panel: compiled JS output ────────────────────────────────────
		this._leftPanel = new Sprite();
		this._leftPanel.x = PAD;
		this._leftPanel.y = panelY;
		this.addChild(this._leftPanel);

		// Background
		const leftBg = new Shape();
		leftBg.graphics.beginFill(0x0d1117);
		leftBg.graphics.drawRoundRect(0, 0, leftW, panelH, 6);
		leftBg.graphics.endFill();
		this._leftPanel.addChild(leftBg);

		// Panel label
		const leftLabel = new TextField();
		leftLabel.text = '◀  Compiled JS Output';
		leftLabel.textColor = 0x6c5ce7;
		leftLabel.size = 12;
		leftLabel.bold = true;
		leftLabel.x = 10;
		leftLabel.y = 8;
		leftLabel.width = leftW - 20;
		this._leftPanel.addChild(leftLabel);

		// ── Right panel: EXML source ───────────────────────────────────────────
		this._rightPanel = new Sprite();
		this._rightPanel.x = divX + 4;
		this._rightPanel.y = panelY;
		this.addChild(this._rightPanel);

		// Background
		const rightBg = new Shape();
		rightBg.graphics.beginFill(0x0d1117);
		rightBg.graphics.drawRoundRect(0, 0, rightW, panelH, 6);
		rightBg.graphics.endFill();
		this._rightPanel.addChild(rightBg);

		// Panel label
		const rightLabel = new TextField();
		rightLabel.text = '▶  EXML Source';
		rightLabel.textColor = 0x00b894;
		rightLabel.size = 12;
		rightLabel.bold = true;
		rightLabel.x = 10;
		rightLabel.y = 8;
		rightLabel.width = rightW - 20;
		this._rightPanel.addChild(rightLabel);

		// Divider line
		const divider = new Shape();
		divider.graphics.lineStyle(1, 0x2d3436);
		divider.graphics.moveTo(0, 0);
		divider.graphics.lineTo(0, panelH);
		divider.graphics.endFill();
		divider.x = divX;
		divider.y = panelY;
		this.addChild(divider);
	}

	// ── Show example ──────────────────────────────────────────────────────────

	private _showExample(idx: number): void {
		this._activeIdx = idx;
		const ex = EXAMPLES[idx];

		// Compile EXML → JS
		let jsOutput = '';
		let parseError = '';
		try {
			jsOutput = compileEXML(ex.exml, ex.name.replace(/\s/g, ''));
		} catch (e) {
			parseError = `Parse error:\n${e instanceof Error ? e.message : String(e)}`;
		}

		// Also show IR summary
		let irSummary = '';
		try {
			const ir = parseEXML(ex.exml);
			irSummary = this._formatIR(ir);
		} catch {
			// ignore
		}

		const leftContent = parseError || irSummary + '\n\n' + jsOutput;
		const rightContent = ex.exml;

		this._renderText(this._leftPanel, leftContent, this._irLines, 'left');
		this._renderText(this._rightPanel, rightContent, this._sourceLines, 'right');
	}

	private _formatIR(ir: ReturnType<typeof parseEXML>): string {
		const lines: string[] = [];
		lines.push(`// ── IR Summary ──`);
		lines.push(`// class:    ${ir.className || '(unnamed)'}`);
		lines.push(`// size:     ${ir.width ?? '?'} × ${ir.height ?? '?'}`);
		lines.push(`// parts:    [${ir.skinParts.join(', ')}]`);
		lines.push(`// children: ${ir.children.length}`);
		lines.push(`// states:   [${ir.states.map(s => s.name).join(', ')}]`);
		lines.push(`// imports:  ${[...ir.imports.keys()].join(', ')}`);
		return lines.join('\n');
	}

	private _renderText(panel: Sprite, content: string, cache: TextField[], side: 'left' | 'right'): void {
		// Remove old text lines (keep first 2 children: bg + label)
		while (panel.numChildren > 2) {
			panel.removeChildAt(panel.numChildren - 1);
		}
		cache.length = 0;

		const panelY = 44 + TAB_H + 8;
		const panelH = this._sh - panelY - PAD;
		const divX = Math.floor(this._sw * DIVIDER_X_RATIO);
		const leftW = divX - PAD - 4;
		const rightW = this._sw - divX - PAD - 4;
		const panelW = side === 'left' ? leftW : rightW;

		const lines = content.split('\n');
		const lineH = 16;
		const startY = 30;
		const maxLines = Math.floor((panelH - startY - 8) / lineH);

		// Syntax-color keywords for JS output (left panel)
		const isLeft = side === 'left';

		lines.slice(0, maxLines).forEach((line, i) => {
			const tf = new TextField();
			tf.text = line;
			tf.size = 11;
			tf.x = 10;
			tf.y = startY + i * lineH;
			tf.width = panelW - 20;
			tf.height = lineH;

			// Simple syntax coloring
			if (isLeft) {
				if (line.trimStart().startsWith('//')) {
					tf.textColor = 0x6a9955; // comment → green
				} else if (/^\s*(import|export|const|return|new|function)/.test(line)) {
					tf.textColor = 0x569cd6; // keyword → blue
				} else if (/^\s*\w+\.\w+\s*=/.test(line)) {
					tf.textColor = 0xdcdcaa; // assignment → yellow
				} else {
					tf.textColor = 0xd4d4d4; // default → light gray
				}
			} else {
				// EXML source coloring
				if (line.trimStart().startsWith('<?') || line.trimStart().startsWith('<!--')) {
					tf.textColor = 0x6a9955; // PI/comment → green
				} else if (/<\/?\w/.test(line)) {
					tf.textColor = 0x4ec9b0; // tag → teal
				} else {
					tf.textColor = 0xce9178; // attribute values → orange
				}
			}

			panel.addChild(tf);
			cache.push(tf);
		});

		// Show truncation notice if needed
		if (lines.length > maxLines) {
			const notice = new TextField();
			notice.text = `... (${lines.length - maxLines} more lines)`;
			notice.textColor = 0x636e72;
			notice.size = 10;
			notice.x = 10;
			notice.y = startY + maxLines * lineH;
			notice.width = panelW - 20;
			panel.addChild(notice);
		}
	}
}
