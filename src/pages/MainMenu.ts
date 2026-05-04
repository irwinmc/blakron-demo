import { Sprite, TextField, Shape, TouchEvent } from '@blakron/core';
import { Label } from '@blakron/ui';
import { createTitleBar, CONTENT_W, CARD_GAP } from './common.js';
import { Navigator } from '../Navigator.js';
import { createCoreMenu } from './CoreMenu.js';
import { createGameMenu } from './GameMenu.js';
import { createUITestsMenu } from './UITestsMenu.js';
import { createEXMLMenu } from './EXMLMenu.js';

// ── Main Menu ─────────────────────────────────────────────────────────────────

interface CategoryEntry {
	title: string;
	description: string;
	accent: number;
	icon: string;
	onTap: () => void;
}

export function createMainMenu(nav: Navigator): Sprite {
	const page = new Sprite();

	// ── Hero banner ────────────────────────────────────────────────────────
	const banner = new Sprite();
	page.addChild(banner);

	const bannerBg = new Shape();
	bannerBg.graphics.beginFill(0x0f3460);
	bannerBg.graphics.drawRect(0, 0, CONTENT_W, 120);
	bannerBg.graphics.endFill();
	banner.addChild(bannerBg);

	// Decorative circles
	const decor1 = new Shape();
	decor1.graphics.beginFill(0x6c5ce7, 0.15);
	decor1.graphics.drawCircle(CONTENT_W - 40, 30, 60);
	decor1.graphics.endFill();
	banner.addChild(decor1);

	const decor2 = new Shape();
	decor2.graphics.beginFill(0x00b894, 0.1);
	decor2.graphics.drawCircle(50, 100, 40);
	decor2.graphics.endFill();
	banner.addChild(decor2);

	// Title text
	const heroTitle = new TextField();
	heroTitle.text = 'Blakron Demo';
	heroTitle.textColor = 0xffffff;
	heroTitle.size = 28;
	heroTitle.bold = true;
	heroTitle.x = 24;
	heroTitle.y = 20;
	heroTitle.width = CONTENT_W - 48;
	banner.addChild(heroTitle);

	const heroSub = new Label('Interactive component & feature showcase');
	heroSub.x = 24;
	heroSub.y = 56;
	heroSub.width = CONTENT_W - 48;
	heroSub.textColor = 0xb2bec3;
	heroSub.size = 13;
	banner.addChild(heroSub);

	// Version info
	const versionTf = new Label('v0.5 · WebGL');
	versionTf.x = 24;
	versionTf.y = 84;
	versionTf.textColor = 0x636e72;
	versionTf.size = 11;
	banner.addChild(versionTf);

	// ── Categories ─────────────────────────────────────────────────────────
	const content = new Sprite();
	content.y = 132;
	page.addChild(content);

	const categories: CategoryEntry[] = [
		{
			title: 'Core',
			description: 'Shapes, Graphics, Bitmap, TextField, Filters, Events, Image Loading',
			accent: 0x6c5ce7,
			icon: '◆',
			onTap: () => nav.push(createCoreMenu(nav)),
		},
		{
			title: 'Game',
			description: 'Tween, Easing Functions, MovieClip, Chained Animations, Orbit',
			accent: 0xe17055,
			icon: '▶',
			onTap: () => nav.push(createGameMenu(nav)),
		},
		{
			title: 'UI Components',
			description: 'Button, CheckBox, RadioButton, Slider, ProgressBar, List, Panel…',
			accent: 0x00b894,
			icon: '☐',
			onTap: () => nav.push(createUITestsMenu(nav)),
		},
		{
			title: 'EXML',
			description: 'Runtime EXML compiler with live preview and source viewer',
			accent: 0xfeca57,
			icon: '✎',
			onTap: () => nav.push(createEXMLMenu(nav)),
		},
	];

	// Section header
	const sectionLabel = new Label('FEATURE CATEGORIES');
	sectionLabel.x = 16;
	sectionLabel.y = 0;
	sectionLabel.width = CONTENT_W - 32;
	sectionLabel.textColor = 0x636e72;
	sectionLabel.size = 11;
	sectionLabel.bold = true;
	content.addChild(sectionLabel);

	// Larger cards for the main menu (96px height)
	const BIG_CARD_H = 96;
	let cy = 22;
	categories.forEach(cat => {
		const card = new Sprite();
		card.x = 12;
		card.y = cy;
		card.touchEnabled = true;

		const w = CONTENT_W - 24;
		const h = BIG_CARD_H;

		// Background
		const bg = new Shape();
		bg.graphics.beginFill(0x16213e);
		bg.graphics.drawRoundRect(0, 0, w, h, 8);
		bg.graphics.endFill();
		card.addChild(bg);

		// Accent left stripe
		const stripe = new Shape();
		stripe.graphics.beginFill(cat.accent);
		stripe.graphics.drawRoundRect(0, 0, 5, h, 3);
		stripe.graphics.endFill();
		card.addChild(stripe);

		// Icon circle
		const iconBg = new Shape();
		iconBg.graphics.beginFill(cat.accent, 0.2);
		iconBg.graphics.drawCircle(44, h / 2, 22);
		iconBg.graphics.endFill();
		card.addChild(iconBg);

		const iconTf = new Label(cat.icon);
		iconTf.x = 24;
		iconTf.y = 0;
		iconTf.width = 40;
		iconTf.height = h;
		iconTf.textAlign = 'center';
		iconTf.verticalAlign = 'middle';
		iconTf.textColor = cat.accent;
		iconTf.size = 20;
		card.addChild(iconTf);

		// Title
		const title = new Label(cat.title);
		title.x = 76;
		title.y = 14;
		title.width = w - 110;
		title.height = 24;
		title.textColor = 0xffffff;
		title.size = 17;
		title.bold = true;
		card.addChild(title);

		// Description
		const desc = new Label(cat.description);
		desc.x = 76;
		desc.y = 42;
		desc.width = w - 110;
		desc.height = 42;
		desc.textColor = 0xb2bec3;
		desc.size = 12;
		card.addChild(desc);

		// Arrow
		const arrow = new Label('›');
		arrow.x = w - 32;
		arrow.y = 0;
		arrow.width = 30;
		arrow.height = h;
		arrow.textAlign = 'center';
		arrow.verticalAlign = 'middle';
		arrow.textColor = cat.accent;
		arrow.size = 24;
		card.addChild(arrow);

		card.addEventListener(TouchEvent.TOUCH_TAP, cat.onTap);

		content.addChild(card);
		cy += BIG_CARD_H + CARD_GAP;
	});

	return page;
}
