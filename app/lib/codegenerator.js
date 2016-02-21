'use strict';

var _ = require('lodash');


var generateDigraphs = function () {
	var consonants = "bcdfghjklmnpqrstvxzwy";
	var vowels = "aeiou";
	var naughtyList = ["co", "cu", "pu", "di", "pe"];
	var ret = [];
	for (var c in consonants) {
		for (var v in vowels) {
			var dig = consonants[c] + vowels[v];
			if (naughtyList.indexOf(dig) === -1)
				ret.push(dig);
		}
	}
	return ret;
};
var digraphs = generateDigraphs();
var base = digraphs.length;

// http://www.javascripter.net/faq/convert3.htm
var toRadix = function (N, radix, characters) {
	var returnValue = "", Q = Math.floor(Math.abs(N)), R;
	while (true) {
		R = Q % radix;
		returnValue = characters[R] + returnValue;
		Q = (Q-R) / radix; 
		if (Q==0)
			break;
	}
	return ((N<0) ? "-"+returnValue : returnValue);
}

module.exports = {

	generateCode: function (nr) {
		return toRadix(nr, base, digraphs);
	},

}