import BigNumber from 'big-number';

export function prettifyNumber (n, trailingZeroes = false) {
		let bigN = BigNumber(n);
		if(bigN.lt(1000)) {
			return bigN.val();
		}
		if(bigN.lt(1000000)) {
			return `${BigNumber(bigN).div(1000).val()},${bigN.number.slice(0,3).reverse().join('')}`;
		}
		const numbers = [
			{name: ' million', value: BigNumber('1000000')},
			{name: ' billion', value: BigNumber('1000000000')},
			{name: ' trillion', value: BigNumber('1000000000000')},
			{name: ' quadrillion', value: BigNumber('1000000000000000')},
			{name: ' quintillion', value: BigNumber('1000000000000000000')},
			{name: ' sextillion', value: BigNumber('1000000000000000000000')},
			{name: ' septillion', value: BigNumber('1000000000000000000000000')},
			{name: ' octillion', value: BigNumber('1000000000000000000000000000')},
			{name: ' nonillion', value: BigNumber('1000000000000000000000000000000')},
			{name: ' decillion', value: BigNumber('1000000000000000000000000000000000')},
			{name: ' undecillion', value: BigNumber('1000000000000000000000000000000000000')},
			{name: ' duodecillion', value: BigNumber('1000000000000000000000000000000000000000')},
			{name: ' tredecillion', value: BigNumber('1000000000000000000000000000000000000000000')},
			{name: ' quattuordecillion', value: BigNumber('1000000000000000000000000000000000000000000000')},
			{name: ' quindecillion', value: BigNumber('1000000000000000000000000000000000000000000000000')},
		];

		const word = numbers.find(x => bigN.lt(BigNumber(x.value).mult(1000)));
		if(!word) {
			return 'far too many';
		}

		const integerPart = parseInt(BigNumber(bigN).div(word.value), 10);
		const integerDigits = integerPart.toString().length;

		let decimalPart = BigNumber(bigN).number.slice((integerDigits + 3) * -1, integerDigits * -1);
		if(decimalPart[0] === 0 && !trailingZeroes) {
			if(decimalPart[1] === 0) {
				if(decimalPart[2] === 0) {
					decimalPart = '';
				} else {
					decimalPart = '.' + decimalPart[2];
				}
			} else {
				decimalPart = '.' + decimalPart[2] + decimalPart[1];
			}
		} else {
			decimalPart = '.' + decimalPart.reverse().join('');
		}

		return `${integerPart}${decimalPart}${word.name}`;
	}
