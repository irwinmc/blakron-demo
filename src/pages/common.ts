import { Sprite, TextField, TouchEvent, Shape } from '@blakron/core';
import { Label, Rect } from '@blakron/ui';

// ── Layout constants ─────────────────────────────────────────────────────────

export const CONTENT_W = 640;
export const TITLE_BAR_H = 44;
export const CARD_H = 72;
export const CARD_GAP = 8;

// ── Menu card config ─────────────────────────────────────────────────────────

export interface MenuCardConfig {
	title: string;
	description: string;
	accent: number;
	onTap: () => void;
}

// ── Title bar ────────────────────────────────────────────────────────────────

export function createTitleBar(title: string, onBack?: () => void): Sprite {
	const bar = new Sprite();

	// Background
	const bg = new Shape();
	bg.graphics.beginFill(0x16213e);
	bg.graphics.drawRect(0, 0, CONTENT_W, TITLE_BAR_H);
	bg.graphics.endFill();
	bar.addChild(bg);

	// Back button (if callback provided)
	if (onBack) {
		const backBtn = new Sprite();
		backBtn.x = 4;
		backBtn.y = 4;
		backBtn.touchEnabled = true;

		const backBg = new Shape();
		backBg.graphics.beginFill(0x0f3460);
		backBg.graphics.drawRoundRect(0, 0, 60, TITLE_BAR_H - 8, 6);
		backBg.graphics.endFill();
		backBtn.addChild(backBg);

		const backLbl = new Label('← Back');
		backLbl.width = 60;
		backLbl.height = TITLE_BAR_H - 8;
		backLbl.textAlign = 'center';
		backLbl.verticalAlign = 'middle';
		backLbl.textColor = 0xdfe6e9;
		backLbl.size = 13;
		backBtn.addChild(backLbl);

		backBtn.addEventListener(TouchEvent.TOUCH_TAP, onBack);
		bar.addChild(backBtn);
	}

	// Title
	const titleLbl = new Label(title);
	titleLbl.x = onBack ? 72 : 16;
	titleLbl.y = 0;
	titleLbl.width = CONTENT_W - (onBack ? 88 : 32);
	titleLbl.height = TITLE_BAR_H;
	titleLbl.verticalAlign = 'middle';
	titleLbl.textColor = 0xffffff;
	titleLbl.size = 16;
	titleLbl.bold = true;
	bar.addChild(titleLbl);

	return bar;
}

// ── Content area ─────────────────────────────────────────────────────────────

export function createContentArea(): Sprite {
	const area = new Sprite();
	area.y = TITLE_BAR_H;
	area.width = CONTENT_W;
	return area;
}

// ── Menu card ────────────────────────────────────────────────────────────────

export function createMenuCard(config: MenuCardConfig, y: number): Sprite {
	const card = new Sprite();
	card.x = 12;
	card.y = y;
	card.touchEnabled = true;

	const w = CONTENT_W - 24;
	const h = CARD_H;

	// Background
	const bg = new Rect(w, h, 0x16213e);
	bg.strokeColor = 0x2d3436;
	bg.strokeWeight = 1;
	card.addChild(bg);

	// Accent stripe
	const stripe = new Rect(4, h, config.accent);
	card.addChild(stripe);

	// Title
	const title = new Label(config.title);
	title.x = 16;
	title.y = 10;
	title.width = w - 24;
	title.height = 24;
	title.textColor = 0xffffff;
	title.size = 15;
	title.bold = true;
	card.addChild(title);

	// Description
	const desc = new Label(config.description);
	desc.x = 16;
	desc.y = 34;
	desc.width = w - 24;
	desc.height = 28;
	desc.textColor = 0xb2bec3;
	desc.size = 12;
	card.addChild(desc);

	// Arrow indicator
	const arrow = new Label('›');
	arrow.x = w - 30;
	arrow.y = 0;
	arrow.width = 30;
	arrow.height = h;
	arrow.textAlign = 'center';
	arrow.verticalAlign = 'middle';
	arrow.textColor = config.accent;
	arrow.size = 22;
	card.addChild(arrow);

	card.addEventListener(TouchEvent.TOUCH_TAP, config.onTap);

	return card;
}
