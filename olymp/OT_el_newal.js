// #########

function scanChart() {
  // const states = candles(3);
  const states = candles(2);
  const pattern = states.join("");
  // const matchPattern = pattern === 'updownup' || pattern === 'downupdown';
  // const direction = states[states.length] === 'up' ? 'up' : 'down';
  const matchPattern = pattern === "downup" || pattern === "updown";
  const direction = states[states.length - 1];
  const time = new Date();
  const second = time.getSeconds();
  const milisec = time.getMilliseconds();
  const matchTime = second === 59 && milisec >= 900;
  if (matchTime) {
    console.log("check: ", states, " - & - ", states[states.length]);
    console.log(
      "Scan chart (" + second + ", " + milisec + "): ",
      states.join(" - "),
      " => ",
      direction
    );
  }
  return {
    matchPattern: matchPattern,
    matchTime: matchTime,
    direction: direction
  };
}

// #########

const $INPUT_DEAL_AMOUNT = document.querySelector(".input-with-step input");
var _keyEvent = "__reactEventHandlers";
for (var key of Object.keys($INPUT_DEAL_AMOUNT)) {
  _keyEvent = key.includes(_keyEvent) ? key : _keyEvent;
}
const _eventDealAmount = $INPUT_DEAL_AMOUNT[_keyEvent];
if (!_eventDealAmount) alert("Missing _eventDealAmount");

function changeDealAmount(value) {
  _eventDealAmount.value = String(value);
  _eventDealAmount.onChange({ target: _eventDealAmount });
}

// #########

var historyDeals = {};
function updateHistoryDeals() {
  const deals = document.querySelectorAll(".card_history");
  deals.forEach(function (deal) {
    if (deal.hasAttribute("data-id")) {
      const dealId = deal.attributes["data-id"].value;
      const $percentReturnRate = deal.querySelector(".card__subtitle-winperc");
      const $betDownDirection = deal.querySelector(".icon-trade-dir_down");
      const $betAmount = deal.querySelector(".card__amount-sum__text span");
      const $statusWin = deal.querySelector(".colored-amount_win");
      const $statusLose = deal.querySelector(".colored-amount_loose");
      const profitText = deal.querySelector(".colored-amount span").innerText;

      historyDeals[dealId] = historyDeals[dealId] || {};
      Object.assign(historyDeals[dealId], {
        id: dealId,
        percentReturnRate: parseInt($percentReturnRate.innerText, 10),
        betDuration: deal.querySelector(".card__duration").innerText,
        betDirection: $betDownDirection ? "down" : "up",
        betAmount: parseFloat($betAmount.innerText.match(/[.\d]*$/)[0]),
        status: $statusWin ? "win" : $statusLose ? "lose" : "draw",
        profit: parseFloat(profitText[0] + profitText.match(/[.\d]*$/)[0])
      });
    }
  });
}

var activeDeals = {};
function updateActiveDeals() {
  const deals = document.querySelectorAll(".deal-card");
  deals.forEach(function (deal) {
    if (deal.hasAttribute("data-id")) {
      const dealId = deal.attributes["data-id"].value;
      const $percentReturnRate = deal.querySelector(
        ".deal-card-title__subtitle span"
      );
      const $betDownDirection = deal.querySelector(
        ".deal-card-amount__pic_down"
      );
      const $betAmount = deal.querySelector(".deal-card-amount__value");
      const $statusWin = deal.querySelector(".colored-amount_win");
      const $statusLose = deal.querySelector(".colored-amount_loose");
      const profitText = deal.querySelector(".colored-amount span").innerText;

      activeDeals[dealId] = activeDeals[dealId] || {};
      Object.assign(activeDeals[dealId], {
        id: dealId,
        percentReturnRate: parseInt($percentReturnRate.innerText, 10),
        // betDuration: deal.querySelector(".card__duration").innerText,
        betDirection: $betDownDirection ? "down" : "up",
        betAmount: parseFloat($betAmount.innerText.match(/[.\d]*$/)[0]),
        status: $statusWin ? "win" : $statusLose ? "lose" : "draw",
        profit: parseFloat(profitText[0] + profitText.match(/[.\d]*$/)[0])
      });
    }
  });
}

// #########
Array.prototype.everyEqual = function (value) {
  if (this.length <= 0) return false;
  for (var i = 0; i < this.length; i++) {
    const element = this[i];
    if (element && element.constructor === Function) {
      if (element() !== value) return false;
    }
    else if (element !== value) return false;
  }
  return true;
};

function Bot(tradeConditions, tradeFunction) {
  const _this = this;
  var _intervalID = null;
  var _conditions = tradeConditions || [];
  var _tradeFunc =
    tradeFunction && tradeFunction.constructor === Function
      ? tradeFunction
      : function func() {};
  var _once = false;

  this.condition = function () {
    const meetConditions = _conditions.everyEqual(true);
    if (meetConditions && !_once) {
      return (_once = true);
    } else if (!meetConditions) {
      return (_once = false);
    }
    return false;
  };

  this.trade = function () {
    try {
      _tradeFunc();
    } catch {
      // handle unsuccessful making deal
      console.log("Making deal is unsuccessful!!!");
    }
  };

  this.run = function () {
    _intervalID = setInterval(function () {
      if (_this.condition()) _this.trade();
    }, 0);
  };

  this.stop = function () {
    clearInterval(_intervalID);
  };

  this.forceStop = function () {
    clearInterval(_intervalID);
  };
}

var abc = new Bot([
    function() { return new Date().getSeconds() % 5 === 0; }
    // condition 1: near second 0 moment
    // condition 2: match pattern 
    // condition 3: no currently active deal
    // condition 4: last trade win (profit > 0)
  ],
  function() {
    console.log("do trade");
    // if last trade not win:
    //   amount = loss * 2
    //   makeNewDeal(amount)
    // else if last trade win:
    //   do nothing, wait for the next pattern matching
  });

abc.run();

// ###############

function Account() {
  var _initBalance = this.balance();
  this.reset = function () {
    _initBalance = this.balance();
  };

  this.balance = function () {
    // TODO logic to get current balance
    return 0;
  };

  this.profit = function () {
    return this.balance() - _initBalance;
  };
}

function Trade() {
  /** Initialization */
  const $BUTTON_DEAL_UP = document.querySelector(".deal-button_up"),
    $BUTTON_DEAL_DOWN = document.querySelector(".deal-button_down"),
    $INPUT_DEAL_AMOUNT = document.querySelector(".input-with-step input");
  var _keyEvent = "__reactEventHandlers";
  for (var key of Object.keys($INPUT_DEAL_AMOUNT)) {
    _keyEvent = key.includes(_keyEvent) ? key : _keyEvent;
  }
  const _eventDealAmount = $INPUT_DEAL_AMOUNT[_keyEvent];
  if (!_eventDealAmount) alert("Missing _eventDealAmount");

  const changeDealAmount = (Trade.changeDealAmount = function (value) {
    if (!value) return false;
    _eventDealAmount.value = String(value);
    _eventDealAmount.onChange({ target: _eventDealAmount });
    return _eventDealAmount.value === String(value) ? true : false;
  });

  const dealUp = (Trade.dealUp = function (value) {
    changeDealAmount(value);
    $BUTTON_DEAL_UP.click();
  });

  const dealDown = (Trade.dealDown = function (value) {
    changeDealAmount(value);
    $BUTTON_DEAL_DOWN.click();
  });
}

// #########

function Market(initConfig) {
  const data = {};
  Market.data = function (key) {
    return key ? data[key] : data;
  };

  const config = initConfig || {};
  Market.config = function () {
    return config;
  };
  Market.config.candles = function (number) {
    config.candles = number;
    return this;
  };

  const candles = (Market.candles = function (numCandles) {
    var $candlesPath = document
        .querySelectorAll(".main-chart.main-chart_candle")[0]
        .getElementsByTagName("path")[2],
      data = $candlesPath
        .getAttribute("d")
        .split(/ZM|[ZM]/)
        .filter(Boolean),
      index = numCandles ? data.length - numCandles : 0,
      candlesChart = [];

    for (var i = index; i < data.length; i++) {
      const cords = data[i].split("L"),
        Y1 = parseFloat(cords[1].split(",")[1]),
        Y2 = parseFloat(cords[2].split(",")[1]),
        YDelta = Math.abs(Y2 - Y1);

      YDelta > 1
        ? candlesChart.push("up")
        : YDelta === 1
        ? candlesChart.push("standoff")
        : candlesChart.push("down");
    }

    return candlesChart;
  });

  const dealActive = (Market.dealActive = function () {
    const deal = document.querySelector(".deal-card");
    if (!deal || !deal.hasAttribute("data-id")) return {};

    const dealId = deal.attributes["data-id"].value,
      $returnRate = deal.querySelector(".deal-card-title__subtitle span"),
      $betDownDirection = deal.querySelector(".deal-card-amount__pic_down"),
      $betAmount = deal.querySelector(".deal-card-amount__value"),
      $statusWin = deal.querySelector(".colored-amount_win"),
      $statusLose = deal.querySelector(".colored-amount_loose"),
      profitText = deal.querySelector(".colored-amount span").innerText;

    return {
      id: dealId,
      percentReturnRate: parseInt($returnRate.innerText, 10),
      betDirection: $betDownDirection ? "down" : "up",
      betAmount: parseFloat($betAmount.innerText.match(/[.\d]*$/)[0]),
      status: $statusWin ? "win" : $statusLose ? "lose" : "draw",
      profit: parseFloat(profitText[0] + profitText.match(/[.\d]*$/)[0])
    };
  });

  const dealHistory = (Market.dealHistory = function () {
    const deal = document.querySelector(".card_history");
    if (!deal || !deal.hasAttribute("data-id")) return {};

    const dealId = deal.attributes["data-id"].value,
      $percentReturnRate = deal.querySelector(".card__subtitle-winperc"),
      $betDownDirection = deal.querySelector(".icon-trade-dir_down"),
      $betAmount = deal.querySelector(".card__amount-sum__text span"),
      $statusWin = deal.querySelector(".colored-amount_win"),
      $statusLose = deal.querySelector(".colored-amount_loose"),
      profitText = deal.querySelector(".colored-amount span").innerText;

    return {
      id: dealId,
      percentReturnRate: parseInt($percentReturnRate.innerText, 10),
      betDuration: deal.querySelector(".card__duration").innerText,
      betDirection: $betDownDirection ? "down" : "up",
      betAmount: parseFloat($betAmount.innerText.match(/[.\d]*$/)[0]),
      status: $statusWin ? "win" : $statusLose ? "lose" : "draw",
      profit: parseFloat(profitText[0] + profitText.match(/[.\d]*$/)[0])
    };
  });

  const update = (Market.update = function () {
    const activeDeal = dealActive();
    data.candles = candles(config.candles);
    data.dealActive = activeDeal;
    data.lastDealActiveId = activeDeal.id
      ? activeDeal.id
      : data.lastDealActiveId;
    data.dealHistory = dealHistory();
  });

  update();
  return data;
}

new Market({ candles: 4 });
Market.config.candles(4);
Market.update();
Market.data();

/***********************/
var _intervalID = 0;
function main() {
  _intervalID = setInterval(function () {
    updateMarket();
    if (condition()) {
      trade();
    }
  });
}

clearInterval(_intervalID);
