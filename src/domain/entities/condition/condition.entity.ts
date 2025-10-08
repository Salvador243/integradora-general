export class Condition {
	constructor(
		public readonly uuid: string,
		public readonly code: string,
		public readonly description: string,
		public readonly status: boolean,
	) {}
}
