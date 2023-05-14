const numbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

exports.unMaskPrice = (price) => {
	if (!price) return 0;
	return price.toString().split(',').join('');
};

exports.convertNumberToText = (number) => {
	if (number == 0) return ' ' + numbers[0];

	var result = '',
		suffix = '';
	do {
		let million = number % 1000000000;
		number = Math.floor(number / 1000000000);
		if (number > 0) {
			result = _readMillion(million, true) + suffix + result;
		} else {
			result = _readMillion(million, false) + suffix + result;
		}
		suffix = ' tỷ';
	} while (number > 0);
	return result;
};

exports.formatPrice = (value) => {
  if (!value) return '0';
  const price = `${value}`;
	return new Intl.NumberFormat('vi-VN').format(price);
}

const _readMillion = (number, check) => {
	var result = '';
	let million = Math.floor(number / 1000000);
	number = number % 1000000;
	if (million > 0) {
		result = _readBlock(million, check) + ' triệu';
		check = true;
	}
	let thousand = Math.floor(number / 1000);
	number = number % 1000;
	if (thousand > 0) {
		result += _readBlock(thousand, check) + ' nghìn';
		check = true;
	}
	if (number > 0) {
		result += _readBlock(number, check);
	}
	return result;
};

const _readBlock = (number, check) => {
	var result = '';
	let hundred = Math.floor(number / 100);
	number = number % 100;
	if (check || hundred > 0) {
		result = ' ' + numbers[hundred] + ' trăm';
		result += _readDozens(number, true);
	} else {
		result = _readDozens(number, false);
	}
	return result;
};

const _readDozens = (number, check) => {
	var result = '';
	let dozen = Math.floor(number / 10);
	let unit = number % 10;
	if (dozen > 1) {
		result = ' ' + numbers[dozen] + ' mươi';
		if (unit == 1) {
			result += ' mốt';
		}
	} else if (dozen == 1) {
		result = ' mười';
		if (unit == 1) {
			result += ' một';
		}
	} else if (check && unit > 0) {
		result = ' lẻ';
	}
	if (unit == 5 && dozen > 1) {
		result += ' lăm';
	} else if (unit > 1 || (unit == 1 && dozen == 0)) {
		result += ' ' + numbers[unit];
	}
	return result;
};
