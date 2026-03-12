/**
 * Minimal framework-agnostic reactive store primitives.
 *
 * The `Store<T>` follows the Svelte store contract:
 *   { subscribe(fn: (value: T) => void): () => void }
 *
 * This makes it natively compatible with:
 * - Svelte 5: `$store` / `engine.nodes$.subscribe()`
 * - React 18+: `useSyncExternalStore(store.subscribe, store.get)`
 * - Vue 3: manual subscription or `useTraekStore()` composable
 * - Solid.js: `from(store)` or manual subscription
 * - Any other observer-pattern consumer
 */

export type Unsubscribe = () => void;
export type Subscriber<T> = (value: T) => void;

/**
 * A reactive value container that notifies subscribers on every mutation.
 * Follows the Svelte store contract for maximum framework compatibility.
 */
export class Store<T> {
	#value: T;
	#subscribers = new Set<Subscriber<T>>();

	constructor(initial: T) {
		this.#value = initial;
	}

	/** Current value (non-reactive getter; use subscribe() for reactive access). */
	get value(): T {
		return this.#value;
	}

	/** Replace the stored value and notify all subscribers. */
	set(newValue: T): void {
		this.#value = newValue;
		for (const sub of this.#subscribers) sub(newValue);
	}

	/** Update the stored value with a transform function and notify subscribers. */
	update(fn: (current: T) => T): void {
		this.set(fn(this.#value));
	}

	/**
	 * Subscribe to value changes.
	 * Immediately calls the subscriber with the current value (Svelte store contract).
	 * Returns an unsubscribe function.
	 */
	subscribe(subscriber: Subscriber<T>): Unsubscribe {
		this.#subscribers.add(subscriber);
		subscriber(this.#value);
		return () => this.#subscribers.delete(subscriber);
	}

	/** Returns current subscriber count (useful for debugging / testing). */
	get subscriberCount(): number {
		return this.#subscribers.size;
	}
}

/**
 * A reactive Set that notifies subscribers on add/delete/clear.
 * Exposes a read-only Set snapshot via `subscribe`.
 */
export class ObservableSet<T> {
	#set: Set<T>;
	#subscribers = new Set<Subscriber<ReadonlySet<T>>>();

	constructor(initial?: Iterable<T>) {
		this.#set = new Set(initial);
	}

	get size(): number {
		return this.#set.size;
	}

	has(value: T): boolean {
		return this.#set.has(value);
	}

	add(value: T): void {
		if (this.#set.has(value)) return;
		this.#set.add(value);
		this.#notify();
	}

	delete(value: T): boolean {
		const deleted = this.#set.delete(value);
		if (deleted) this.#notify();
		return deleted;
	}

	clear(): void {
		if (this.#set.size === 0) return;
		this.#set.clear();
		this.#notify();
	}

	[Symbol.iterator](): IterableIterator<T> {
		return this.#set[Symbol.iterator]();
	}

	/** Returns a frozen snapshot (not the live internal Set). */
	snapshot(): ReadonlySet<T> {
		return new Set(this.#set);
	}

	/**
	 * Subscribe to Set changes.
	 * Immediately calls the subscriber with a snapshot of the current Set.
	 * Returns an unsubscribe function.
	 */
	subscribe(subscriber: Subscriber<ReadonlySet<T>>): Unsubscribe {
		this.#subscribers.add(subscriber);
		subscriber(this.snapshot());
		return () => this.#subscribers.delete(subscriber);
	}

	#notify(): void {
		const snap = this.snapshot();
		for (const sub of this.#subscribers) sub(snap);
	}
}
