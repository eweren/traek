import type { ConversationTemplate, TemplateCategory } from './types';
import { builtinTemplates } from './builtins/index';

export class TemplateRegistry {
	private builtins: ConversationTemplate[] = [...builtinTemplates];
	private custom: ConversationTemplate[] = [];

	/** Returns a copy of all registered templates (builtins first, then custom). */
	getAll(): ConversationTemplate[] {
		return [...this.builtins, ...this.custom];
	}

	/** Returns templates filtered by category. */
	getByCategory(category: TemplateCategory): ConversationTemplate[] {
		return this.getAll().filter((t) => t.category === category);
	}

	/** Returns a single template by id, or undefined. */
	get(id: string): ConversationTemplate | undefined {
		return this.getAll().find((t) => t.id === id);
	}

	/**
	 * Register one or more custom templates.
	 * Custom templates appear after built-ins in the gallery.
	 * Duplicate IDs are warned and ignored.
	 */
	register(templates: ConversationTemplate | ConversationTemplate[]): void {
		const toAdd = Array.isArray(templates) ? templates : [templates];
		for (const t of toAdd) {
			if (this.get(t.id)) {
				console.warn(`[TemplateRegistry] Duplicate template id "${t.id}" — ignored.`);
				continue;
			}
			this.custom.push(t);
		}
	}

	/**
	 * Remove a built-in or custom template by id.
	 * Use to suppress built-in templates you don't want shown.
	 */
	remove(id: string): void {
		this.builtins = this.builtins.filter((t) => t.id !== id);
		this.custom = this.custom.filter((t) => t.id !== id);
	}

	/**
	 * Replace the entire built-in list.
	 * Use this to take full control of what appears in the gallery.
	 */
	setBuiltins(templates: ConversationTemplate[]): void {
		this.builtins = [...templates];
	}
}

/** Singleton registry — import and use directly. */
export const templateRegistry = new TemplateRegistry();
