var Binh = function(fn) {

	const _this = this;
	
    const promises = [];
    
    var value, reason;
	
	var state = 'pending';
	
	this.then = function(onFulfillment, onRejection) {
		const promise = new this.constructor(function(resolve, reject) {});
        promises.push({
            onFulfillment: onFulfillment,
            onRejection: onRejection,
            promise: promise
        });
        if (value) this.resolve(value);
        if (reason) this.reject(reason);
		return promise;
	};
	
	this.resolve = function(val) {
        value = val;
        state = 'fulfilled';

        while (promises.length) {
            const
            next = promises.shift(),
            promise = next.promise,
            onFulfillment = next.onFulfillment;
            setTimeout(function() {
                promise.resolve(onFulfillment && onFulfillment.constructor === Function ? onFulfillment(value) : onFulfillment);
            });
        }

		return this;
	};
	
	this.reject = function(error) {
        reason = error;
		state = 'rejected';
		
		try {
			if (reason) throw reason.toString();
			else throw reason;
		}
		catch (e) {
			console.error(e);
        }
        
        while (promises.length) {
            const
            next = promises.shift(),
            promise = next.promise,
            onRejection = next.onRejection;
            setTimeout(function() {
                promise.reject(onRejection && onRejection.constructor === Function ? onRejection(val) : onRejection);
            });
        }

		return this;
	};

    setTimeout(function() {
        fn(_this.resolve, _this.reject);
    });
};

var binh = new Binh(function(resolve, reject) {
    console.log('f--f');
    setTimeout(function() {
        resolve(44);
    }, 1500);
});

binh.then(function(value) {
    console.log('test1: ', value);
    return value - 1;
})
.then(function(value) {
    console.log('test1: ', value);
    return value - 1;
});

binh.then(function(value) {
    console.log('test2: ', value + 1);
    return value + 1;
}).then(function(value) {
    console.log('test2: ', value + 1);
    return value - 1;
});

setTimeout(function() {
    binh.then(function(value) {
        console.log('test3: ', value, 'haiz');
        return value - 1;
    }).then(function(value) {
        console.log('test3: ', value, 'haiz');
        return value - 1;
    });
    binh.then(function(value) {
        console.log('test4: ', value, 'haiz');
        return value + 1;
    }).then(function(value) {
        console.log('test4: ', value, 'haiz');
        return value + 1;
    });
}, 5000);