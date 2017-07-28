import BigNumber from 'big-number';

export function prettifyNumber (n) {
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
		let decimalPart = '';
		const secondDigit = bigN.number.slice(-2, -1)[0];
		const thirdDigit = bigN.number.slice(-3, -2)[0];

		if(integerPart < 10) {
			if(thirdDigit === 0) {
				decimalPart = secondDigit === 0 ? '' : `.${secondDigit}`;
			} else {
				decimalPart = `.${secondDigit}${thirdDigit}`;
			}
		} else if(integerPart < 100) {
			decimalPart = thirdDigit === 0 ? '' : `.${thirdDigit}`;
		}

		return `${integerPart}${decimalPart}${word.name}`;
	}
