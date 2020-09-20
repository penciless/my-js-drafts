var
SECOND_START_TRADE = 0,
DELAY_INTERVAL = 1,
MIN_AMOUNT_BET = 1,

INCREASE_AMOUNT = 0.01,
ZERO = 0, ONE = 1, ONE_HUNDRED = 100, HALF_SECOND = 500,
WIN = 'win', LOSE = 'loose', STANDOFF = 'standoff',
UP = 'up', DOWN = 'down', TRUE = true, FALSE = false,
KEY_LOG = 'OlymLog', KEY_ERR = 'OlymErr', KEY_MIS_DIRECTION = 'OlymMisDirection',
KEY_STREAKS_LOSE = 'OlymStreakLOSE', KEY_STREAK = 'streak',
ROW_FIRST = 'tr',
TABLE = 'tbody.user-deals-table__body',
TABLE_WRAPPER = 'div.js_tu_active_deals',
TABLE_ROW_FIRST = 'tbody.user-deals-table__body tr',
TABLE_CELL_ID = 'td.user-deals-table__cell_id span',
TABLE_CELL_BET = 'td.user-deals-table__cell_trade span.user-deals-table__cell-content span.sum',
TABLE_CELL_DIRECTION = 'td.user-deals-table__cell_trade span.user-deals-table__cell-content span.sprite',
TABLE_CELL_PROFIT = 'td.user-deals-table__cell_profit span.user-deals-table__cell-content span',
BUTTON_DEAL_PREFIX = 'button.deal-buttons__button_',
BUTTON_DEAL_TEXT = '.deal-buttons__text',
INPUT_AMOUNT_BET = 'input.input-currency__input'
;

var
tables = document.querySelectorAll(TABLE),
$TABLE_HISTORY = tables.length > ONE ? tables[ONE] : tables[ZERO],
$TABLE_WRAPPER = document.querySelector(TABLE_WRAPPER),
$BUTTON_DEAL_UP = document.querySelector(BUTTON_DEAL_PREFIX + UP),
$BUTTON_DEAL_DOWN = document.querySelector(BUTTON_DEAL_PREFIX + DOWN),
$INPUT_AMOUNT_BET = document.querySelector(INPUT_AMOUNT_BET)
;

var
_keyEvent = '__reactEventHandlers';
for (var key of Object.keys($INPUT_AMOUNT_BET)) {
    _keyEvent = key.includes(_keyEvent) ? key : _keyEvent;
}

function init(profitExpect, direction) {
    _isDoneTurn = FALSE, _pause = FALSE, _rateProfit = ZERO, _currentBet = MIN_AMOUNT_BET,
    _profits = ZERO, _profitExpect = profitExpect, _direction = direction,
    _idTrade = $TABLE_HISTORY.querySelector(TABLE_CELL_ID).innerText,
    _logs = [], _errors = [], _misDirections = [], _bets = [],
    _streakLoses = ZERO, _streakLosesMAX = ZERO, _stop = FALSE
    ;
    changeAmountBet(MIN_AMOUNT_BET);
}

function start(profitExpect, direction) {
    init(profitExpect || ONE, direction || UP);
    _idAuto = setInterval(function() {
        var second = new Date().getSeconds();

        if ((second == SECOND_START_TRADE && !_isDoneTurn) || (!_isDoneTurn && $TABLE_WRAPPER.querySelectorAll(TABLE).length == ONE && _logs.length)) {
            if (_pause) return;
            _isDoneTurn = TRUE;
            trade();
            statistics();
        }
        else if (second != SECOND_START_TRADE) {
            _isDoneTurn = FALSE;
            _pause = shouldPause();
        }
        
    }, DELAY_INTERVAL);
}

function shouldPause() {
    if ($TABLE_WRAPPER.querySelectorAll(TABLE).length <= ONE) return;
    var $row = $TABLE_WRAPPER.querySelector(TABLE_ROW_FIRST);
    var amountBet = parseFloat($row.querySelector(TABLE_CELL_BET).innerText);
    var profit = parseFloat($row.querySelector(TABLE_CELL_PROFIT).innerText);
    _rateProfit = parseInt($BUTTON_DEAL_UP.querySelector(BUTTON_DEAL_TEXT).innerText) / ONE_HUNDRED;
    return _profits + profit - amountBet >= _profitExpect;
}

function stop() {
    clearInterval(_idAuto);
    _stop = TRUE;
    //console.log(_idTrade != $TABLE_WRAPPER.querySelector(TABLE_CELL_ID).innerText ? 'Stopping...' : 'Stopped!');
    // fun setup
    if (_idTrade != $TABLE_WRAPPER.querySelector(TABLE_CELL_ID).innerText) console.log('Stopping...');
    else {
        setTimeout(function() {
            console.log('Stopped!');
        }, ONE + ONE_HUNDRED);
    }
}

function trade() {
    try {
        // Enhance 
        var status = $TABLE_WRAPPER.querySelector(TABLE_CELL_PROFIT).className;
        if (!_logs.length) {
            (_direction == UP ? $BUTTON_DEAL_UP : $BUTTON_DEAL_DOWN).click();
            return;
        }
        if (status.includes(LOSE)) {
            _direction = (_direction == UP) ? DOWN : UP;
            _bets.push(_currentBet);
            console.log(_bets);
            console.log(_currentBet);
            var sum = _bets.reduce(function(total, each) { return total + each; });
            console.log(sum);
            console.log(_rateProfit);
            _currentBet = round(sum / _rateProfit) + INCREASE_AMOUNT;
            console.log(_currentBet);
            changeAmountBet(_currentBet);
        }
        else if (status.includes(WIN)) {
            _bets = [];
            _currentBet = MIN_AMOUNT_BET;
            changeAmountBet(_currentBet);
        }
        (_direction == UP ? $BUTTON_DEAL_UP : $BUTTON_DEAL_DOWN).click();
    }
    catch (e) {
        _errors.push( { msg: e.message, stack: e.stack } );
        console.log('Error: ', e.message);
        console.log(e.stack);
        trade();
    }
}

function changeAmountBet(value) {
    $INPUT_AMOUNT_BET.value = value;
    $INPUT_AMOUNT_BET[_keyEvent].onChange({ target: $INPUT_AMOUNT_BET });
}

function statistics() {
    var stat_id = setInterval(function() {
        var $row = $TABLE_HISTORY.querySelector(ROW_FIRST);
        var idTrade = $row.querySelector(TABLE_CELL_ID).innerText;
        if (_idTrade != idTrade) {
            clearInterval(stat_id);
            var log = {}, time = new Date();
            var $profit = $row.querySelector(TABLE_CELL_PROFIT);
            log.idTrade = _idTrade = idTrade;
            log.amountBet = parseFloat($row.querySelector(TABLE_CELL_BET).innerText);
            log.profit = round(parseFloat($profit.innerText) - log.amountBet);
            _profits += log.profit;
            
            if (_profits >= _profitExpect || _stop) {
                stop();
                setTimeout(saveStatistics, HALF_SECOND);
            }
            else _pause = FALSE;
            
            setTimeout(function() {
                var status = $profit.className;
                log.isLose = status.includes(LOSE);
                log.status = status.includes(WIN) ? WIN : status.includes(LOSE) ? LOSE : STANDOFF;
                log.direction = $row.querySelector(TABLE_CELL_DIRECTION).className.includes(UP) ? UP : DOWN;
                log.rateProfit = log.profit > ZERO ? round(log.profit / log.amountBet) : ZERO;
                log.date = time.toLocaleDateString(), log.time = time.toLocaleTimeString(), log.timestamp = time.getTime();
                _logs.push(log);

                checkLoseStreak(log.isLose);
                checkMisDirection(log);
    
                console.log('Trade: ', log.idTrade, ' - ', log.direction, ' - ', log.profit, ' - ', log.rateProfit);
                console.log('Profit: ', _profits);
            }, ONE_HUNDRED);
        }
    }, DELAY_INTERVAL);
}

function round(float_number) {
    return parseInt(float_number * ONE_HUNDRED) / ONE_HUNDRED;
}

function saveStatistics() {
    console.log('####[ STATISTICS ]####');
    console.log('Profit: ', _profits);
    console.log('Losing streak: ', _streakLosesMAX);
    console.log('Total trading times: ', _logs.length);
    console.log('Total errors occur: ', _errors.length);
    console.log('Total direction mismatches: ', _misDirections.length);
    storeArray(KEY_LOG, _logs);
    storeArray(KEY_ERR, _errors);
    storeArray(KEY_MIS_DIRECTION, _misDirections);
}

function storeArray(key, arr) {
    key = key + new Date().toLocaleDateString();
    localStorage[key] = localStorage[key] ? JSON.stringify(JSON.parse(localStorage[key]).concat(arr)) : JSON.stringify(arr);
}

function checkLoseStreak(isLose) {
    if (isLose) {
        _streakLoses++;
        var parent = KEY_STREAKS_LOSE;
        var child = KEY_STREAK + _streakLoses;
        var streaks = JSON.parse(localStorage[parent] || JSON.stringify({}));
        streaks[child] = ++streaks[child] || ONE;
        localStorage[parent] = JSON.stringify(streaks);
        if (_streakLosesMAX < _streakLoses) _streakLosesMAX = _streakLoses;
    }
    else _streakLoses = ZERO;
}

function checkMisDirection(log) {
    var direction;
    if (log.isLose) direction = log.direction == UP ? DOWN : UP;
    else direction = log.direction;

    if (_direction != direction) {
        _misDirections.push(log.date + ', ' + log.time + ', ' + log.direction + _direction + ', ' + log.status);
    }
}