import { TIME_GETTERS, COMPARATORS } from './Constants.js';


class Tensor {
    /**
     * @param {[]} data json array where each element represents a row of csv.
     * @param {[]} dimensions array expressing the size of each dimension of tensor
     * @param {String[]} headers fields of csv file. Except time.
     * @param {[]} filters names of numeric fields in csv file...
     */
    constructor(data, dimensions, headers, filters) {
        this.dimensions = dimensions.map(dim => dim.size);
        this.size = this.dimensions.reduce((a, b) => a * b);
        this.channelToAggrt = this.initializeTensors(headers);
        this.channelToCount = this.initializeTensors(headers);
        this.headers = headers;

        if (!filters)
            filters = [];
        this.filters = filters;

        // set time getters.
        let dimensionLabels = dimensions.map(dim => dim.label);
        let timeGetters = [];
        for (var i = 0, dimensionLabelsSize = dimensionLabels.length; i < dimensionLabelsSize; ++i) {
            timeGetters.push(TIME_GETTERS[dimensionLabels[i]]);
        }
        this.timeGetters = timeGetters;

        this.init(data);
    }

    /**
     * @param {String[]} headers fields of csv file. Except time.
     * @returns an object whose keys are channel names(headers) and values are single dimensional arrays
     * representing tensor.
     */
    initializeTensors(headers) {
        var channelTensors = {}
        var size = this.size;
console.log('Tensor::initializeTensors headers', headers);
        headers.forEach(header => channelTensors[header] = Array(size).fill(0));
        return channelTensors;
    }


    getStatus() {
        console.log('size:', this.size);
        console.log('dimensions:', this.dimensions);
        console.log('channelToAggrt:', this.channelToAggrt);
        console.log('channelToCount:', this.channelToCount);
        console.log('timeGetters:', this.timeGetters);
    }

    tupleIndexToLiner() {
        let coeff = 1, res = 0;
        let dimensions = this.dimensions;

        for (var i = arguments.length - 1; i > -1; --i) {
            res += coeff * arguments[i];
            coeff *= dimensions[i];
        }

        return res;
    }

    linearIndexToTuple(linear) {
        let dimensions = this.dimensions;
        let res = Array(dimensions.length);
        
        let mod = 1, div;
        for (var i = dimensions.length - 1; i > -1; --i) {
            div = mod;
            mod *= dimensions[i];
            res[i] = Math.floor((linear % mod) / div);
        }

        return res;
    }

    /**
     * @param {[]} data json array where each element represents a row of csv.
     */
    init(data) {
        const isRowFiltered = (row) => {
            const filters = this.filters;
            var shouldInsert = true;
            for (var i = 0, size = filters.length; i < size; ++i) {
                var filter = filters[i];
                var comparator = COMPARATORS[filter.operator];
                var value = row[filter.column]
                shouldInsert = shouldInsert && comparator(value, filter.value);
            }

            return shouldInsert == false;
        }

        /**
         * @param {*} row: object representing a csv row.
         * @param {Date} date: date field
         */
        const updateTensors = (row, date) => {
            if (isRowFiltered(row)) return;

            let tupleIndex = [];
            for (var i = 0, size = this.dimensions.length; i < size; ++i) {
                var currentGetter = this.timeGetters[i];
                var currentIndex = currentGetter(date);
                if (currentIndex === 365)
                    --currentIndex;
                tupleIndex.push(currentIndex);
            }

            let entries = Object.entries(row);
            for (var [field, value] of entries) {
                if (typeof value === 'number') {
                        var linearIndex = this.tupleIndexToLiner(...tupleIndex);
                        this.channelToCount[field][linearIndex]++;
                        this.channelToAggrt[field][linearIndex] += value;
                }
            }
        }

        for (var ind = 0, len = data.length, row = null, date = null; ind < len; ++ind) {
            row = data[ind];
            date = new Date(row['Time']);
            delete row['Time']; // we wont be needing this anymore.
            updateTensors(row, date);
        }
    }

    /**
     * Returns projections of the tensor along the axes [axes]
     * @param {Number[]} axes Indices of axes along which the projection will
     * be performed.
     * 
     * @returns {Number[]} n dimensional array with aggregate values in each cell.
     */
    project(axes, channel) {
        if (typeof axes === 'number')
            axes = [axes];

        const shouldCountOnly = channel == '__occurrence';
        if (shouldCountOnly)
            channel = this.headers[0];

        const dataAggrt = this.channelToAggrt[channel];
        const dataCount = this.channelToCount[channel];
        
        if (axes.length === 1)
            return this._projectTo1Dim(axes[0], dataAggrt, dataCount, shouldCountOnly);
        else if (axes.length === 2)
            return this._projectTo2Dim(axes, dataAggrt, dataCount, shouldCountOnly);

        throw new Error('Tensor::project axes.length should be 1 or 2');
    }

    _projectTo1Dim(axis, dataAggrt, dataCount, shouldCountOnly) {
        let I = this.dimensions[axis];
        // Build the resulting vectors.
        let resAggrt = Array(I).fill(0);
        let resCount = Array(I).fill(0);
console.log('Tensor::_projectTo1Dim');
console.log('\tdataAggrt', dataAggrt);
console.log('\tresAggrt', resAggrt);
console.log('\tresCount', resCount);

        // Project every linear index to corresponding res index. Then keep track of sums and counts.
        for (var linearIndex = 0, size = this.size; linearIndex < size; ++linearIndex) {
            var resIndex = this.linearIndexToTuple(linearIndex)[axis];
            resAggrt[resIndex] += dataAggrt[linearIndex];
            resCount[resIndex] += dataCount[linearIndex];
        }

        if (shouldCountOnly)
            return resCount;

        // Take averages.
        for (var i = 0; i < I; ++i) {
            if (resCount[i])
                resAggrt[i] /= resCount[i]; 
        }
console.log('Tensor::_projectTo1Dim -- resAggrt', resAggrt);
        return resAggrt;
    }

    _projectTo2Dim(axes, dataAggrt, dataCount, shouldCountOnly) {
        let I = this.dimensions[axes[0]], J = this.dimensions[axes[1]];

        // Build the resulting matrices.
        let resAggrt = Array(I), resCount = Array(I);
        for (var i = 0; i < I; ++i) {
            resAggrt[i] = Array(J).fill(0);
            resCount[i] = Array(J).fill(0);
        }

        for (var linearIndex = 0, size = this.size; linearIndex < size; ++linearIndex) {
            var tupleIndex = this.linearIndexToTuple(linearIndex);
            var i = tupleIndex[axes[0]], j = tupleIndex[axes[1]];

            resAggrt[i][j] += dataAggrt[linearIndex];
            resCount[i][j] += dataCount[linearIndex];
        }

        if (shouldCountOnly)
            return resCount;

        // Take averages.
        for (var i = 0; i < I; ++i) {
            for (var j = 0; j < J; ++j) {
                if (resCount[i][j])
                    resAggrt[i][j] /= resCount[i][j];
            }
        }
console.log('Tensor::_projectTo2Dim -- resAggrt', resAggrt);
        return resAggrt;
    }

}


export default Tensor;
