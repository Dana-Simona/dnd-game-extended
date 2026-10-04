const grassTileset = '/tiles/grass.png';
const wallTileset = '/tiles/walls.png';
const stoneTileset = '/tiles/stone.png';
const stairsTileset = '/tiles/stairs.png';
const propsTileset = '/tiles/props.png';
const plantsTileset = '/tiles/plants.png';

export interface ITile {
	imageSrc: string;
	size?: { horizontalTiles: number; verticalTiles: number };
	coordinates: { x: number[]; y: number[] };
}

export const tiles: ITile[] = [
	{
		//grass uses special procedural generation - index 0
		imageSrc: grassTileset,
		coordinates: { x: [0], y: [0] },
	},
	//walls
	{
		//1
		imageSrc: wallTileset,
		coordinates: { x: [1, 12], y: [1, 2] },
	},
	{
		//2
		imageSrc: wallTileset,
		coordinates: { x: [2, 12, 13, 14, 5, 6, 7], y: [1, 1, 1, 1, 4, 4, 4] },
	},
	{
		//3
		imageSrc: wallTileset,
		coordinates: { x: [3, 14], y: [1, 2] },
	},
	{
		//4
		imageSrc: wallTileset,
		coordinates: { x: [1, 8, 9, 9, 9], y: [2, 3, 3, 2, 1] },
	},
	{
		//5
		imageSrc: wallTileset,
		coordinates: { x: [3, 4, 10, 10, 10], y: [2, 3, 3, 2, 1] },
	},
	{
		//6
		imageSrc: wallTileset,
		coordinates: { x: [1, 12], y: [3, 3] },
	},
	{
		//7
		imageSrc: wallTileset,
		coordinates: {
			x: [2, 6, 1, 2, 3, 4, 1, 2, 4, 5],
			y: [3, 1, 6, 6, 6, 6, 9, 9, 9, 9],
		},
	},
	{
		//8
		imageSrc: wallTileset,
		coordinates: { x: [3, 13], y: [3, 3] },
	},
	{
		//9
		imageSrc: wallTileset,
		coordinates: { x: [1, 12], y: [4, 4] },
	},
	{
		//10
		imageSrc: wallTileset,
		coordinates: {
			x: [2, 6, 1, 2, 3, 4, 1, 2, 4, 5],
			y: [4, 2, 7, 7, 7, 7, 10, 10, 10, 10],
		},
	},
	{
		//11
		imageSrc: wallTileset,
		coordinates: { x: [3, 12], y: [4, 4] },
	},
	{
		//12
		imageSrc: wallTileset,
		coordinates: { x: [6], y: [6] },
	},
	{
		//13
		imageSrc: wallTileset,
		coordinates: { x: [6], y: [7] },
	},
	//stone ground
	{
		//14
		imageSrc: stoneTileset,
		coordinates: { x: [1], y: [1] },
	},
	//stairs
	{
		//15
		imageSrc: stairsTileset,
		size: { horizontalTiles: 2, verticalTiles: 3 },
		coordinates: { x: [1, 1], y: [1, 5] },
	},
	{
		//16
		imageSrc: stairsTileset,
		size: { horizontalTiles: 2, verticalTiles: 3 },
		coordinates: { x: [4, 4], y: [1, 5] },
	},
	{
		//17
		imageSrc: stairsTileset,
		size: { horizontalTiles: 2, verticalTiles: 3 },
		coordinates: { x: [7, 7], y: [1, 5] },
	},
	{
		//18
		imageSrc: stairsTileset,
		size: { horizontalTiles: 4, verticalTiles: 3 },
		coordinates: { x: [1, 5], y: [9, 9] },
	},
	{
		//19
		imageSrc: stairsTileset,
		size: { horizontalTiles: 4, verticalTiles: 3 },
		coordinates: { x: [1, 5], y: [12, 12] },
	},
	//props
	{
		//20
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [5], y: [0] },
	},
	{
		//21
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [5], y: [2] },
	},
	{
		//22
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [5], y: [4] },
	},
	{
		//23
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [5], y: [6] },
	},
	{
		//24
		imageSrc: propsTileset,
		coordinates: { x: [5], y: [9] },
	},
	{
		//25
		imageSrc: propsTileset,
		size: { horizontalTiles: 3, verticalTiles: 3 },
		coordinates: { x: [13], y: [0] },
	},
	{
		//26
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [7], y: [0] },
	},
	{
		//27
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [8], y: [0] },
	},
	{
		//28
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 3 },
		coordinates: { x: [7], y: [2] },
	},
	{
		//29
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 3 },
		coordinates: { x: [8], y: [2] },
	},
	{
		//30
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [7], y: [5] },
	},
	{
		//31
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [8], y: [5] },
	},
	{
		//32
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [7], y: [7] },
	},
	{
		//33
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [9], y: [7] },
	},
	{
		//34
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [7], y: [9] },
	},
	{
		//35
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [9], y: [9] },
	},
	{
		//36
		imageSrc: propsTileset,
		size: { horizontalTiles: 2, verticalTiles: 2 },
		coordinates: { x: [9], y: [0] },
	},
	{
		//37
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [12], y: [0] },
	},
	{
		//38
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [12], y: [3] },
	},
	{
		//39
		imageSrc: propsTileset,
		size: { horizontalTiles: 2, verticalTiles: 2 },
		coordinates: { x: [9], y: [2] },
	},
	{
		//40
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 3 },
		coordinates: { x: [9], y: [4] },
	},
	{
		//41
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 3 },
		coordinates: { x: [11], y: [5] },
	},
	{
		//42
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [13], y: [6] },
	},
	{
		//43
		imageSrc: propsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [14], y: [3] },
	},
	{
		//44
		imageSrc: propsTileset,
		size: { horizontalTiles: 3, verticalTiles: 3 },
		coordinates: { x: [13], y: [0] },
	},
	{
		//45
		imageSrc: propsTileset,
		size: { horizontalTiles: 3, verticalTiles: 3 },
		coordinates: { x: [11], y: [8] },
	},
	{
		//46
		imageSrc: propsTileset,
		size: { horizontalTiles: 3, verticalTiles: 3 },
		coordinates: { x: [0], y: [8] },
	},
	{
		//47
		imageSrc: propsTileset,
		size: { horizontalTiles: 2, verticalTiles: 2 },
		coordinates: { x: [13], y: [11] },
	},
	//stones
	{
		//48
		imageSrc: propsTileset,
		size: { horizontalTiles: 2, verticalTiles: 2 },
		coordinates: { x: [0], y: [13] },
	},
	{
		//49
		imageSrc: propsTileset,
		coordinates: { x: [0], y: [15] },
	},
	{
		//50
		imageSrc: propsTileset,
		coordinates: { x: [1], y: [15] },
	},
	{
		//51
		imageSrc: propsTileset,
		coordinates: { x: [2], y: [15] },
	},
	{
		//52
		imageSrc: propsTileset,
		coordinates: { x: [3], y: [15] },
	},
	{
		//53
		imageSrc: propsTileset,
		coordinates: { x: [4], y: [15] },
	},
	{
		//54
		imageSrc: propsTileset,
		coordinates: { x: [5], y: [15] },
	},
	{
		//55
		imageSrc: propsTileset,
		coordinates: { x: [6], y: [15] },
	},
	{
		//56
		imageSrc: propsTileset,
		coordinates: { x: [8], y: [15] },
	},
	{
		//57
		imageSrc: propsTileset,
		coordinates: { x: [9], y: [15] },
	},
	{
		//58
		imageSrc: propsTileset,
		coordinates: { x: [10], y: [15] },
	},
	//bushes
	{
		//59
		imageSrc: plantsTileset,
		coordinates: { x: [1], y: [6] },
	},
	{
		//60
		imageSrc: plantsTileset,
		size: { horizontalTiles: 2, verticalTiles: 1 },
		coordinates: { x: [2], y: [6] },
	},
	{
		//61
		imageSrc: plantsTileset,
		size: { horizontalTiles: 2, verticalTiles: 1 },
		coordinates: { x: [4], y: [6] },
	},
	{
		//62
		imageSrc: plantsTileset,
		size: { horizontalTiles: 2, verticalTiles: 3 },
		coordinates: { x: [6], y: [5] },
	},
	{
		//63
		imageSrc: plantsTileset,
		size: { horizontalTiles: 2, verticalTiles: 3 },
		coordinates: { x: [8], y: [5] },
	},
	{
		//64
		imageSrc: plantsTileset,
		size: { horizontalTiles: 1, verticalTiles: 2 },
		coordinates: { x: [10], y: [6] },
	},
	//grass specks
	{
		//65
		imageSrc: plantsTileset,
		coordinates: {
			x: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
			y: [12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15],
		},
	},
	//trees
	{
		//66
		imageSrc: plantsTileset,
		size: { horizontalTiles: 5, verticalTiles: 5 },
		coordinates: { x: [0], y: [0] },
	},
	{
		//67
		imageSrc: plantsTileset,
		size: { horizontalTiles: 3, verticalTiles: 5 },
		coordinates: { x: [5], y: [0] },
	},
	{
		//68
		imageSrc: plantsTileset,
		size: { horizontalTiles: 3, verticalTiles: 5 },
		coordinates: { x: [9], y: [0] },
	},
	{
		imageSrc: wallTileset,
		coordinates: { x: [4], y: [4] },
	},
	{
		imageSrc: wallTileset,
		coordinates: { x: [4], y: [1] },
	},
	{
		imageSrc: wallTileset,
		coordinates: { x: [5], y: [2] },
	},
	{
		imageSrc: wallTileset,
		coordinates: { x: [5], y: [1] },
	},
	{
		imageSrc: wallTileset,
		coordinates: { x: [8], y: [1] },
	},
	{
		imageSrc: wallTileset,
		coordinates: { x: [8], y: [4] },
	},
	{
		imageSrc: wallTileset,
		coordinates: { x: [9], y: [9] },
	},
	{
		imageSrc: wallTileset,
		coordinates: { x: [9], y: [8] },
	},
	{
		imageSrc: wallTileset,
		coordinates: { x: [9], y: [7] },
	},
	{
		imageSrc: wallTileset,
		coordinates: { x: [9], y: [6] },
	},
];
