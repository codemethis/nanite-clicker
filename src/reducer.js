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
