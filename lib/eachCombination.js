function nestedLoops(matrix) {
	matrix.forEach(function(array) {
		array.forEach(function(item) {
			
		});
	});
}

function loop(matrix, array) {
	array.forEach(function(item) {
		
	});
}


function combinate(matrix, args, callback) {
	if (matrix.length === 0) {
		callback(args);
		return;
	}
	
	var
	currentArray = matrix[0],
	nextArray = matrix.slice(1);
	
	currentArray.forEach(function(item) {
		var cloneArgs = args.slice(0);
		cloneArgs.push(item);
		combinate(nextArray, cloneArgs, callback);
	});
}

function eachCombination(matrix, callback) {
	function combinate(matrix, args, callback) {
		if (matrix.length === 0) {
			callback(args);
			return;
		}
		
		var
		currentArray = matrix[0],
		nextArray = matrix.slice(1);
		
		currentArray.forEach(function(item) {
			var cloneArgs = args.slice(0);
			cloneArgs.push(item);
			combinate(nextArray, cloneArgs, callback);
		});
	};
	combinate(matrix, [], callback);
}

function eachLabelMappedCombination(mapArrays, callback) {
	var labels = Object.keys(mapArrays);
	function combinate(labels, mapArgs, callback) {
		if (labels.length === 0) {
			callback(mapArgs);
			return;
		}
		
		var
		currentLabel = labels[0],
		nextLabels = labels.slice(1);
		
		mapArrays[currentLabel].forEach(function(item) {
			var cloneMapArgs = Object.assign({}, mapArgs);
			cloneMapArgs[currentLabel] = item;
			combinate(nextLabels, cloneMapArgs, callback);
		});
	};
	combinate(labels, {}, callback);
}
