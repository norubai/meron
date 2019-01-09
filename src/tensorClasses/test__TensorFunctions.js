let dimensions = [3, 4, 5, 6]

function tupleIndexToLiner() {// i, j, k => k + 24*j + 7*24*k;
    let coeff = 1, res = 0;

    for (var i = arguments.length - 1; i > -1; --i) {
        res += coeff * arguments[i];
        coeff *= dimensions[i];
    }

    return res;
}

function linearIndexToTuple(linear) {
    let res = Array(dimensions.length);
    
    let mod = 1, div;
    for (var i = dimensions.length - 1; i > -1; --i) {
        div = mod;
        mod *= dimensions[i];
        res[i] = Math.floor((linear % mod) / div);
    }

    return res;
}

module.exports.tupleIndexToLiner = tupleIndexToLiner;
module.exports.linearIndexToTuple = linearIndexToTuple;


console.log('linearIndexToTuple(47):', linearIndexToTuple(47));
console.log('tupleIndexToLiner(0, 1, 2, 5):', tupleIndexToLiner(0, 1, 2, 5));
console.log();

console.log('linearIndexToTuple(144):', linearIndexToTuple(144));
console.log('tupleIndexToLiner(1, 0, 4, 0):', tupleIndexToLiner(1, 0, 4, 0));
console.log();

console.log('linearIndexToTuple(203):', linearIndexToTuple(203));
console.log('tupleIndexToLiner(1, 2, 3, 5):', tupleIndexToLiner(1, 2, 3, 5));
console.log();

console.log('linearIndexToTuple(281):', linearIndexToTuple(281));
console.log('tupleIndexToLiner(2, 1, 1, 5):', tupleIndexToLiner(2, 1, 1, 5));
console.log();

process.exit();
