export class Garage {
	constructor(
		public readonly uuid: string,
		public readonly code: string,
		public readonly name: string,
		public readonly status: boolean,
	) {}
}
