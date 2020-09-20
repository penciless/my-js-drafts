// Constants
var
SECOND_START_TRADE = 0,
DELAY_INTERVAL = 1,
MIN_AMOUNT_BET = 1,

INCREASE_AMOUNT = 0.01,
ZERO = 0, ONE = 1, ONE_HUNDRED = 100, HALF_SECOND = 500,
WIN = 'win', LOSE = 'loose', STANDOFF = 'standoff',
UP = 'up', DOWN = 'down', TRUE = true, FALSE = false
;

// CSS queries
var
ROW = 'tbody tr',
CELL_ID = '.user-deals-table__cell_id span',
CELL_BET = 'span.sum',
CELL_TREND = 'span.sprite',
CELL_PROFIT = '.user-deals-table__cell_profit span span',
TEXT_RATE_PROFIT = '.deal-buttons__text'
;

// Fixed Element Objects
var el = {};
el.td = $TABLE_DEALS = document.querySelector('#tbl_user_deals');
el.th = $TABLE_HISTORY = document.querySelector('#tab-user-deals-history');
el.du = $DEAL_UP = document.querySelector('.deal-buttons__button_up');
el.dd = $DEAL_DOWN = document.querySelector('.deal-buttons__button_down');
el.ib = $INPUT_BET = document.querySelector('.input-currency__input');

cell = function(query) { return this.querySelector(query); }

for (var e of Object.keys(el)) {
    el[e].cell = cell;
}

/*********************** */
/*function init() {
    _rateProfit = parseInt($BUTTON_DEAL_UP.querySelector(TEXT_RATE_PROFIT).innerText) / 100;
    _idTrade = 
}

function getValues($table) {
    var $row = $table.cell(ROW);
    return {
        a
    }
}*/

/*********************** */
var $candlesPath = document.querySelectorAll('.main-chart.main-chart_candle')[0].getElementsByTagName('path')[2];
function candles(numCandles) {
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
/*********************** */
var State = {}
function getState() {
    const
    $rowTrade = $TABLE_DEALS.querySelector(ROW),
    $rowHistory = $TABLE_HISTORY.querySelector(ROW);

    return {
        rate: parseInt($DEAL_UP.querySelector(TEXT_RATE_PROFIT).innerText) / 100,
        trade: getInfoRow($rowTrade),
        history: getInfoRow($rowHistory)
    };
}

function getInfoRow($table) {
    if (!$table) return null;
    const
    bet = parseFloat($table.querySelector(CELL_BET).innerText),
    gain = parseFloat($table.querySelector(CELL_PROFIT).innerText),
    profit = parseInt(gain * 100 - bet * 100) / 100;
    return {
        id: $table.querySelector(CELL_ID).innerText,
        bet: bet,
        gain: gain,
        profit: profit,
        direction: $table.querySelector(CELL_TREND).className.includes(UP) ? UP : DOWN
    };
}
/*********************** */
function main() {
    setInterval(function() {
        var second = new Date().getSeconds();

        if (conditionTrade()) {
            trade();
        }
        else if (conditionCheckState) {
            getState();
        }
        
    }, DELAY_INTERVAL);
}