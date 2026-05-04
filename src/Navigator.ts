import { Sprite } from '@blakron/core';

/**
 * Simple stack-based page navigator.
 * Only the top page is added to the display list at any time.
 */
export class Navigator extends Sprite {
	private _stack: Sprite[] = [];

	public push(page: Sprite): void {
		if (this._stack.length > 0) {
			this.removeChild(this._stack[this._stack.length - 1]);
		}
		this._stack.push(page);
		this.addChild(page);
	}

	public pop(): void {
		if (this._stack.length <= 1) return;
		const top = this._stack.pop()!;
		this.removeChild(top);
		this.addChild(this._stack[this._stack.length - 1]);
	}

	public get canPop(): boolean {
		return this._stack.length > 1;
	}
}
