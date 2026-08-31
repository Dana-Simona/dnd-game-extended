import grassSpriteSheet from '../../assets/tiles/Texture/TX Tileset Grass.png';
import wallSpriteSheet from '../../assets/tiles/Texture/TX Tileset Wall.png';

export interface ITile {
	imageSrc: string;
	coordinates: { x: number[]; y: number[] };
}

export const tiles: ITile[] = [
	{
		//grass uses special procedural generation - index 0
		imageSrc: grassSpriteSheet,
		coordinates: { x: [0], y: [0] },
	},
	//walls
	{
		//1
		imageSrc: wallSpriteSheet,
		coordinates: { x: [1, 12], y: [1, 2] },
	},
	{
		//2
		imageSrc: wallSpriteSheet,
		coordinates: { x: [2, 12, 13, 14, 5, 6, 7], y: [1, 1, 1, 1, 4, 4, 4] },
	},
	{
		//3
		imageSrc: wallSpriteSheet,
		coordinates: { x: [3, 14], y: [1, 2] },
	},
	{
		//4
		imageSrc: wallSpriteSheet,
		coordinates: { x: [1, 8, 9, 9, 9], y: [2, 3, 3, 2, 1] },
	},
	{
		//5
		imageSrc: wallSpriteSheet,
		coordinates: { x: [3, 4, 10, 10, 10], y: [2, 3, 3, 2, 1] },
	},
	{
		//6
		imageSrc: wallSpriteSheet,
		coordinates: { x: [1, 12], y: [3, 3] },
	},
	{
		//7
		imageSrc: wallSpriteSheet,
		coordinates: {
			x: [2, 6, 1, 2, 3, 4, 1, 2, 4, 5],
			y: [3, 1, 6, 6, 6, 6, 9, 9, 9, 9],
		},
	},
	{
		//8
		imageSrc: wallSpriteSheet,
		coordinates: { x: [3, 13], y: [3, 3] },
	},
	{
		//9
		imageSrc: wallSpriteSheet,
		coordinates: { x: [1, 12], y: [4, 4] },
	},
	{
		//10
		imageSrc: wallSpriteSheet,
		coordinates: { x: [1], y: [4] },
	},
	{
		//11
		imageSrc: wallSpriteSheet,
		coordinates: { x: [3, 12], y: [4, 4] },
	},
];
