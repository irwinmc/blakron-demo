import { Sprite, TextField, TouchEvent, Event, Rectangle } from '@blakron/core';
import {
	Rect,
	Label,
	Button,
	ViewStack,
	Panel,
	Scroller,
	List,
	ArrayCollection,
	ItemRenderer,
	Group,
	ItemTapEvent,
} from '@blakron/ui';
import { makePage, sectionGroup, HEADER_H, SECTION_GAP } from './shared.js';
import type { Navigator } from '../../Navigator.js';

// ── Shared: TextItemRenderer ─────────────────────────────────────────────────

class TextItemRenderer extends ItemRenderer {
	private _bg: Rect;
	private _lbl: Label;

	constructor() {
		super();
		this.width = 200;
		this.height = 36;

		this.graphics.beginFill(0x000000, 0.01);
		this.graphics.drawRect(0, 0, 200, 36);
		this.graphics.endFill();

		this._bg = new Rect(200, 36, 0x16213e);
		this._bg.strokeColor = 0x2d3436;
		this._bg.strokeWeight = 1;
		this.addChild(this._bg);

		this._lbl = new Label('');
		this._lbl.x = 12;
		this._lbl.y = 0;
		this._lbl.width = 176;
		this._lbl.height = 36;
		this._lbl.verticalAlign = 'middle';
		this._lbl.textColor = 0xdfe6e9;
		this._lbl.size = 16;
		this.addChild(this._lbl);
	}

	protected override dataChanged(): void {
		this._lbl.text = String(this.data ?? '');
		this._bg.fillColor = this.itemIndex % 2 === 0 ? 0x16213e : 0x0f3460;
	}

	setSelected(sel: boolean): void {
		this._bg.fillColor = sel ? 0x6c5ce7 : this.itemIndex % 2 === 0 ? 0x16213e : 0x0f3460;
	}
}

// ── Composite page: all container/layout components ──────────────────────────

export function buildContainersPage(nav: Navigator): Sprite {
	return makePage('Containers & Lists', nav, content => {
		let cy = 8;

		buildPanel(content, cy);
		cy += 130 + SECTION_GAP;

		buildViewStack(content, cy);
		cy += 150 + SECTION_GAP;

		buildScroller(content, cy);
		cy += 240 + SECTION_GAP;

		buildList(content, cy);
	});
}

// ── Panel ────────────────────────────────────────────────────────────────────

function buildPanel(content: Sprite, baseY: number): void {
	const g = sectionGroup('Panel', baseY);
	content.addChild(g);

	const panel = new Panel();
	panel.title = 'My Panel';
	panel.width = 280;
	panel.height = 100;
	panel.y = HEADER_H;

	const titleBar = new Rect(280, 28, 0x0f3460);
	panel.addChild(titleBar);

	const titleLbl = new Label('My Panel');
	titleLbl.x = 10;
	titleLbl.y = 0;
	titleLbl.width = 260;
	titleLbl.height = 28;
	titleLbl.verticalAlign = 'middle';
	titleLbl.textColor = 0xffffff;
	titleLbl.size = 15;
	panel.titleDisplay = titleLbl;
	panel.addChild(titleLbl);

	const panelContent = new Rect(280, 72, 0x16213e);
	panelContent.y = 28;
	panelContent.strokeColor = 0x0f3460;
	panelContent.strokeWeight = 1;
	panel.addChild(panelContent);

	const contentLbl = new Label('Panel content area');
	contentLbl.x = 10;
	contentLbl.y = 38;
	contentLbl.textColor = 0xb2bec3;
	contentLbl.size = 15;
	panel.addChild(contentLbl);

	g.addChild(panel);
}

// ── ViewStack ────────────────────────────────────────────────────────────────

function buildViewStack(content: Sprite, baseY: number): void {
	const g = sectionGroup('ViewStack', baseY);
	content.addChild(g);

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
		lbl.size = 18;
		page.addChild(lbl);
		vs.addChild(page);
	});

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
		lbl.size = 14;
		btn.addChild(lbl);
		btn.addEventListener(TouchEvent.TOUCH_TAP, () => {
			vs.selectedIndex = i;
		});
		g.addChild(btn);
	});
}

// ── Scroller ─────────────────────────────────────────────────────────────────

function buildScroller(content: Sprite, baseY: number): void {
	const g = sectionGroup('Scroller', baseY);
	content.addChild(g);

	const scrollerW = 200;
	const scrollerH = 200;
	const rowH = 36;
	const rowGap = 4;
	const colors = [
		0x6c5ce7, 0x00b894, 0xe17055, 0xfeca57, 0x74b9ff, 0xa29bfe, 0xff7675, 0xfd79a8, 0x55efc4, 0xfdcb6e, 0xe84393,
		0x0984e3, 0x6ab04c, 0xeb4d4b,
	];
	const totalContentH = colors.length * (rowH + rowGap) - rowGap;

	const viewport = new Group();
	viewport.width = scrollerW;
	viewport.height = scrollerH;
	viewport.scrollEnabled = true;

	colors.forEach((color, i) => {
		const row = new Rect(scrollerW, rowH, color);
		row.y = i * (rowH + rowGap);
		const lbl = new Label(`Item ${i + 1}`);
		lbl.x = 10;
		lbl.y = 0;
		lbl.width = 180;
		lbl.height = rowH;
		lbl.verticalAlign = 'middle';
		lbl.textColor = 0xffffff;
		lbl.size = 15;
		row.addChild(lbl);
		viewport.addChild(row);
	});

	viewport.setContentSize(scrollerW, totalContentH);

	const scroller = new Scroller();
	scroller.bounces = true;
	scroller.width = scrollerW;
	scroller.height = scrollerH;
	scroller.y = HEADER_H;
	scroller.scrollRect = new Rectangle(0, 0, scrollerW, scrollerH);
	scroller.addChild(viewport);
	scroller.viewport = viewport;

	const border = new Rect(scrollerW, scrollerH, 0x0d1117);
	border.strokeColor = 0x636e72;
	border.strokeWeight = 1;
	border.y = HEADER_H;
	g.addChild(border);
	g.addChild(scroller);

	const hint = new TextField();
	hint.text = 'drag to scroll ↕';
	hint.textColor = 0x636e72;
	hint.size = 13;
	hint.x = scrollerW + 8;
	hint.y = HEADER_H + 4;
	g.addChild(hint);
}

// ── List + VirtualLayout ─────────────────────────────────────────────────────

function buildList(content: Sprite, baseY: number): void {
	const g = sectionGroup('List + VirtualLayout (15 items, ~5 visible)', baseY);
	content.addChild(g);

	const items = [
		'Apple',
		'Banana',
		'Cherry',
		'Durian',
		'Elderberry',
		'Fig',
		'Grape',
		'Honeydew',
		'Kiwi',
		'Lemon',
		'Mango',
		'Nectarine',
		'Orange',
		'Papaya',
		'Quince',
	];
	const data = new ArrayCollection(items);

	const selTf = new TextField();
	selTf.text = 'Selected: none';
	selTf.textColor = 0xdfe6e9;
	selTf.size = 14;
	selTf.x = 0;
	selTf.y = 220;
	g.addChild(selTf);

	const rendererCountTf = new TextField();
	rendererCountTf.text = 'Renderers: ?';
	rendererCountTf.textColor = 0x636e72;
	rendererCountTf.size = 13;
	rendererCountTf.x = 220;
	rendererCountTf.y = 18;
	g.addChild(rendererCountTf);

	const VISIBLE_H = 180;

	const list = new List();
	list.dataProvider = data;
	list.itemRenderer = TextItemRenderer;
	list.useVirtualLayout = true;
	list.width = 200;
	list.height = VISIBLE_H;
	list.scrollEnabled = true;

	const scroller = new Scroller();
	scroller.bounces = false;
	scroller.width = 200;
	scroller.height = VISIBLE_H;
	scroller.y = HEADER_H;
	scroller.scrollRect = new Rectangle(0, 0, 200, VISIBLE_H);
	scroller.addChild(list);
	scroller.viewport = list;
	g.addChild(scroller);

	let countTimer = 0;
	const updateCount = () => {
		let count = 0;
		for (let i = 0; i < items.length; i++) {
			if (list.getElementAt(i)) count++;
		}
		rendererCountTf.text = `Renderers: ${count} / ${items.length}`;
	};
	setInterval(() => {
		if (countTimer++ % 10 === 0) updateCount();
	}, 100);

	list.addEventListener(ItemTapEvent.ITEM_TAP, (e: Event) => {
		const ite = e as ItemTapEvent;
		selTf.text = `Selected: ${ite.item}`;
		for (let i = 0; i < items.length; i++) {
			const r = list.getElementAt(i) as TextItemRenderer | undefined;
			if (r) r.setSelected(i === ite.itemIndex);
		}
	});
}
