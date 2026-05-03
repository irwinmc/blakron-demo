export { parseXML, filterElements, getTextContent } from './xml-parser.js';
export { parseEXML } from './exml-parser.js';
export { generateCode } from './codegen.js';

import { parseEXML } from './exml-parser.js';
import { generateCode } from './codegen.js';

export function compileEXML(source: string, className?: string): string {
	const ir = parseEXML(source, className);
	return generateCode(ir);
}
