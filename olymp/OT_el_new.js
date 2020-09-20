function candles(numCandles) {
    var $candlesPath = document.querySelectorAll('.main-chart.main-chart_candle')[0].getElementsByTagName('path')[2];
    var data = $candlesPath.getAttribute('d').split(/ZM|[ZM]/).filter(Boolean);
    var candlesChart = [];
    var index = numCandles ? data.length - numCandles : 0;

    for (var i = index; i < data.length; i++) {
        const
        cords = data[i].split('L'),
        Y1 = parseFloat(cords[1].split(',')[1]),
        Y2 = parseFloat(cords[2].split(',')[1]),
        YDelta = Math.abs(Y2 - Y1);

        YDelta > 1 ? candlesChart.push('up') :
        YDelta == 1 ? candlesChart.push('standoff') : candlesChart.push('down');
    }
    return candlesChart;
}

// #########

function scanChart() {
    // const states = candles(3);
    const states = candles(2);
    const pattern = states.join('');
    // const matchPattern = pattern === 'updownup' || pattern === 'downupdown';
    // const direction = states[states.length] === 'up' ? 'up' : 'down';
    const matchPattern = pattern === 'downup' || pattern === 'updown';
    const direction = states[states.length - 1];
    const time = new Date();
    const second = time.getSeconds();
    const milisec = time.getMilliseconds();
    const matchTime = second == 59 && milisec >= 900;
    if (matchTime) {
        console.log('check: ', states, ' - & - ', states[states.length]);
        console.log('Scan chart (' + second + ', ' + milisec + '): ', states.join(' - '), ' => ', direction);
    }
    return {
        matchPattern: matchPattern,
        matchTime: matchTime,
        direction: direction
    }
}

function trade(direction, isWin) {
    if (isWin)
        console.log('RESET bet amount!!!');
    else 
        console.log('INCREASE bet amount!!!');

    if (direction == 'up') {
        console.log('Make an UP trade');
        document.querySelector('.deal-button_up').click();
    }
    else {
        console.log('Make an down trade');
        document.querySelector('.deal-button_down').click();
    }

    console.log('Make a trade order!!!');
}

/***********************/
var _intervalID = 0;
function main() {
    var isTrading = false;
    var winDirection = null;
    var stopMatchTime = false;
    _intervalID = setInterval(function() {
        var chartInfo = scanChart();

        if (stopMatchTime && chartInfo.matchTime) {
            console.log('return');
            return;
        }
        else {
            console.log('continue');
            stopMatchTime = false;
        }

        // Init trade
        if (!isTrading && chartInfo.matchTime && chartInfo.matchPattern) {
            console.log('######### Init Trade @ ', Date.now());
            trade(chartInfo.direction, true);
            winDirection = chartInfo.direction;
            isTrading = true;
            stopMatchTime = true;
        }
        else if (isTrading && chartInfo.matchTime && !stopMatchTime) {
            console.log('trading exam');
            if (winDirection == chartInfo.direction) {
                console.log('Win @ ');
                isTrading = false;
            }
            else {
                console.log('Lose @ ');
                trade(chartInfo.direction, false);
                winDirection = chartInfo.direction;
            }
        }
        
    }, 100);
}

clearInterval(_intervalID);