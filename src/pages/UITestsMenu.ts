import { Sprite } from '@blakron/core';
import { Label } from '@blakron/ui';
import { createTitleBar, createContentArea, createMenuCard, CONTENT_W, CARD_H, CARD_GAP } from './common.js';
import { Navigator } from '../Navigator.js';

// ── Grouped pages ────────────────────────────────────────────────────────────

import { buildDisplayWidgetsPage } from './ui-tests/DisplayWidgets.js';
import { buildControlsPage } from './ui-tests/Controls.js';
import { buildInputsPage } from './ui-tests/Inputs.js';
import { buildContainersPage } from './ui-tests/Containers.js';

// ── Menu definition ──────────────────────────────────────────────────────────

interface MenuEntry {
	title: string;
	description: string;
	accent: number;
	build: (nav: Navigator) => Sprite;
}

const MENU_ENTRIES: MenuEntry[] = [
	{
		title: 'Display Widgets',
		description: 'Label, Rect, Image, Animation — basic rendering primitives',
		accent: 0x6c5ce7,
		build: buildDisplayWidgetsPage,
	},
	{
		title: 'Controls',
		description: 'Button, CheckBox, RadioButton, ToggleSwitch — interactive controls',
		accent: 0x00b894,
		build: buildControlsPage,
	},
	{
		title: 'Inputs',
		description: 'ProgressBar, HSlider/VSlider, EditableText/TextInput — value controls',
		accent: 0xe17055,
		build: buildInputsPage,
	},
	{
		title: 'Containers & Lists',
		description: 'Panel, ViewStack, Scroller, List + VirtualLayout — layout containers',
		accent: 0xfeca57,
		build: buildContainersPage,
	},
];

// ── Main entry point ─────────────────────────────────────────────────────────

export function createUITestsMenu(nav: Navigator): Sprite {
	const page = new Sprite();

	page.addChild(createTitleBar('UI Components', () => nav.pop()));

	const content = createContentArea();
	page.addChild(content);

	const menuTitle = new Label(`${MENU_ENTRIES.length} categories`);
	menuTitle.x = 16;
	menuTitle.y = 8;
	menuTitle.width = CONTENT_W - 32;
	menuTitle.height = 20;
	menuTitle.textColor = 0x636e72;
	menuTitle.size = 14;
	content.addChild(menuTitle);

	let cy = 36;
	MENU_ENTRIES.forEach(entry => {
		const card = createMenuCard(
			{
				title: entry.title,
				description: entry.description,
				accent: entry.accent,
				onTap: () => {
					nav.push(entry.build(nav));
				},
			},
			cy,
		);
		content.addChild(card);
		cy += CARD_H + CARD_GAP;
	});

	return page;
}
