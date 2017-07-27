import BigNumber from 'big-number';

export default (state = {
	naniteTenths: BigNumber(0),
	buildings: [
		{
			id: 1,
			name: 'Replicator',
			owned: 0,
			basePrice: BigNumber(15),
			priceOfNext: BigNumber(15),
			baseNTPS: BigNumber(1)
		},
		{
			id: 2,
			name: 'Drone',
			owned: 0,
			basePrice: BigNumber(100),
			priceOfNext: BigNumber(100),
			baseNTPS: BigNumber(10)
		},
		{
			id: 3,
			name: 'Fabrication Plant',
			owned: 0,
			basePrice: BigNumber(1100),
			priceOfNext: BigNumber(1100),
			baseNTPS: BigNumber(80)
		},
		{
			id: 4,
			name: 'Colony',
			owned: 0,
			basePrice: BigNumber(12000),
			priceOfNext: BigNumber(12000),
			baseNTPS: BigNumber(470)
		},
		{
			id: 5,
			name: 'Space Station',
			owned: 0,
			basePrice: BigNumber(130000),
			priceOfNext: BigNumber(130000),
			baseNTPS: BigNumber(2600)
		},
		{
			id: 6,
			name: 'Panet',
			owned: 0,
			basePrice: BigNumber(1400000),
			priceOfNext: BigNumber(1400000),
			baseNTPS: BigNumber(14000)
		}
	]
}, action) => {
	switch(action.type) {
		case 'ADD_NANITES':
			return {
				...state,
				naniteTenths: BigNumber(state.naniteTenths).plus(action.payload)
			};

		case 'BUY_BUILDING':
			let buildings = [];
			state.buildings.forEach(bld => buildings.push({
				...bld,
				basePrice: BigNumber(bld.basePrice),
				priceOfNext: BigNumber(bld.priceOfNext),
				baseNTPS: BigNumber(bld.baseNTPS)
			}));

			let b = buildings.find(bld => bld.id === action.payload);
			b.owned++;

			const nanitesAfterPurchase = BigNumber(state.naniteTenths).minus(BigNumber(b.priceOfNext).mult(10));

			const multiplier = Math.floor(Math.pow(1.15, b.owned) * 100);
			b.priceOfNext = BigNumber(b.basePrice).mult(multiplier).div(100);

			return {
				...state,
				naniteTenths: nanitesAfterPurchase,
				buildings
			};

		default:
			return state;
	}
};
