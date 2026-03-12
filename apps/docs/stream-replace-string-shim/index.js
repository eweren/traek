/**
 * Minimal shim for stream-replace-string when the pnpm-installed package is incomplete.
 * Matches the API used by @astrojs/sitemap: replace(searchStr, replaceStr) -> Transform stream.
 */
import { Transform } from 'node:stream';

export default function replace(searchStr, replaceWith) {
	let buffer = '';
	const searchLen = searchStr.length;
	return new Transform({
		objectMode: false,
		transform(chunk, encoding, callback) {
			buffer += chunk.toString();
			let idx;
			while ((idx = buffer.indexOf(searchStr)) !== -1) {
				this.push(buffer.slice(0, idx) + replaceWith);
				buffer = buffer.slice(idx + searchLen);
			}
			callback();
		},
		flush(callback) {
			if (buffer.length) this.push(buffer);
			callback();
		}
	});
}
