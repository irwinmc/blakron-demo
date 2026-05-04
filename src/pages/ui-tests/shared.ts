import { Sprite, TextField } from '@blakron/core';
import { Group } from '@blakron/ui';
import { createTitleBar, createContentArea, CONTENT_W } from '../common.js';
import type { Navigator } from '../../Navigator.js';

export { CONTENT_W };

export const SECTION_GAP = 28;
export const ROW_GAP = 38;
export const HEADER_H = 26;

/** Create a section group with a header label */
export function sectionGroup(title: string, y: number): Group {
	const group = new Group();
	group.x = 16;
	group.y = y;

	const label = new TextField();
	label.text = title;
	label.textColor = 0xb2bec3;
	label.size = 18;
	group.addChild(label);

	return group;
}

/** Wrap a page with title bar + back button */
export function makePage(title: string, nav: Navigator, buildContent: (content: Sprite) => void): Sprite {
	const page = new Sprite();
	page.addChild(createTitleBar(title, () => nav.pop()));

	const content = createContentArea();
	buildContent(content);
	page.addChild(content);

	return page;
}
