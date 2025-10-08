export class Categorie {
	constructor(
		public readonly uuid: string,
		public readonly name: string,
		public readonly code: string,
		public readonly status: boolean,
	) {}
}