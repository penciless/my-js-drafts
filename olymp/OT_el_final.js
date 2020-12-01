function Account() {
  var _initBalance = 0;
  const $CURRENT_BALANCE = document.querySelector(
    ".lay-balance-amount__digits"
  );

  const balance = (Account.balance = function () {
    const floatNumberString = $CURRENT_BALANCE.innerHTML.split(" ").join(""),
      balance = parseFloat(floatNumberString);
    return balance || 0;
  });

  const profit = (Account.profit = function () {
    return parseFloat((balance() - _initBalance).toFixed(3));
  });

  const reset = (Account.reset = function () {
    _initBalance = balance();
  });

  _initBalance = balance();
}

// #########

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
      $returnRate = deal.querySelector(".deal-card-subtitle span"),
      $betDownDirection = deal.querySelector(".deal-card-amount__pic_down"),
      $betAmount = deal.querySelector(".deal-card-amount__value"),
      $statusWin = deal.querySelector(".colored-amount_win"),
      $statusLose = deal.querySelector(".colored-amount_loose"),
      profitText = deal.querySelector(".colored-amount span").innerText;

    if (!$returnRate) return {};

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

  const $RIGHT_CHART_BUTTON = document.querySelector("button.btn-to-right");
  const update = (Market.update = function () {
    if ($RIGHT_CHART_BUTTON.style.visibility !== "hidden") {
      $RIGHT_CHART_BUTTON.click();
    }
    const activeDeal = dealActive();
    data.candles = candles(config.candles);
    data.dealActive = activeDeal;
    data.lastActiveDealId = activeDeal.id
      ? activeDeal.id
      : data.lastActiveDealId;
    data.dealHistory = dealHistory();
  });

  update();
  return data;
}

// ###############

Array.prototype.everyEqual = function (value, context) {
  for (var i = 0; i < this.length; i++) {
    const element = this[i];
    if (element && element.constructor === Function) {
      if (element(context) !== value) return false;
    } else if (element !== value) return false;
  }
  return this.length ? true : false;
};

function Bot(initialization) {
  const _this = this;
  var _once = false,
    _context = {},
    _intervalID = null,
    _conditions = [],
    _tradeFunc = function () {};

  _context.bot = this;

  if (initialization && initialization.constructor === Function)
    try {
      initialization(_context);
    } catch (error) {
      console.log("Failed to initialize the bot! Error:", error);
      return;
    }

  const _conditionFunc = function () {
    const meetConditions = _conditions.everyEqual(true, _context);
    if (meetConditions && !_once) {
      return (_once = true);
    } else if (!meetConditions) {
      return (_once = false);
    }
    return false;
  };

  this.run = function (tradeConditions, tradeFunction) {
    _conditions = tradeConditions || [];
    _tradeFunc =
      tradeFunction && tradeFunction.constructor === Function
        ? tradeFunction
        : function func() {};
    _this.resume();
  };

  this.resume = function () {
    if (_intervalID) return;
    _intervalID = setInterval(function () {
      try {
        if (_conditionFunc()) _tradeFunc(_context);
      } catch (error) {
        console.log("Bot runs into error! Force stop!");
        _this.forceStop();
        throw error;
      }
    }, 0);
  };

  this.stop = function () {
    clearInterval(_intervalID);
    _intervalID = null;
  };

  this.forceStop = function () {
    clearInterval(_intervalID);
    _intervalID = null;
  };
}

/// ####

var myBot = new Bot(function (context) {
  new Trade();
  new Account();
  new Market({ candles: 7 });
});

myBot.run(
  [
    // condition 0: repeat continuously
    function (context) {
      Market.update();
      // context.profit = Account.profit();
      // context.isProfitPositive = Account.profit() >= 0;
      // console.log('context.profit', context.profit);
      // console.log('context.isProfitPositive', context.isProfitPositive);
      return true;
    },
    // condition 1: nearly second 0 moment
    function (context) {
      const time = new Date(),
        second = time.getSeconds(),
        ms = time.getMilliseconds(),
        isLeftZero = second === 59 && ms > 900,
        isRightZero = second === 0 && ms < 100,
        matchTime = isLeftZero || isRightZero;

      context.matchTime = matchTime;

      return matchTime;
    },
    // condition 2: no active deal or negative profit
    function (context) {
      // TODO stack profit
      context.totalLoss = context.totalLoss || 0;
      const dealActive = Market.data("dealActive");
      const isNoActiveDeal = dealActive.id ? false : true;
      const profit = dealActive.profit || 0;
      context.profit = profit;
      context.isProfitPositive = profit >= 0;
      context.isNoActiveDeal = isNoActiveDeal;
      if (!context.isProfitPositive) context.totalLoss += profit;
      if (isNoActiveDeal && context.totalLoss >= 0) context.totalLoss = 0;
      return isNoActiveDeal || !context.isProfitPositive;
    },
    // condition 3: match pattern
    function (context) {
      const candles = Market.data("candles");

      for (var i = candles.length - 1; i >= 0; i--) {
        const direction = candles[i];
        if (direction !== "standoff") {
          context.direction = direction;
          break;
        }
      }

      if (!context.isProfitPositive) return true;

      const pattern = candles.join("");
      const matchPattern =
        /.*updown$/.test(pattern) || /.*downup$/.test(pattern);
      context.matchPattern = matchPattern;
      return matchPattern;
    },
    // condition 4: check & adjust deal settings
    // (return rate, duration bet, timeframe)
    function (context) {
      const percentReturnRateString = document.querySelector(
        "span.asset-item-badge span"
      ).innerText;
      context.percentReturnRate = parseInt(percentReturnRateString, 10);
      if (context.percentReturnRate < 80) return false;
      if (context.matchTime) {
        console.log(
          "Time:",
          context.matchTime,
          " | Pattern:",
          context.matchPattern,
          " | No deal:",
          context.isNoActiveDeal,
          " | Profit+:",
          context.isProfitPositive
        );
      }
      return true;
    }
  ],
  function (context) {
    if (context.isProfitPositive) {
      context.dealAmount = 1;
      // Account.reset();
      console.log("WIN - Profit:", context.profit);
    } else {
      context.dealAmount =
        (context.totalLoss / context.percentReturnRate) * 100 + 1;
      context.dealAmount = context.dealAmount || 1;
      console.log("LOSE - Profit:", context.profit);
    }

    console.log("##############################");
    if (context.direction === "up") {
      Trade.dealUp(context.dealAmount);
      console.log("Trade UP!");
    } else if (context.direction === "down") {
      Trade.dealDown(context.dealAmount);
      console.log("Trade DOWN!");
    } else console.log("Cannot decide direction!");

    console.log("Time:", Date.now());
    console.log("Market:", Market.data());
    console.log("Context:", context);
  }
);

// #########

var dataBinh = [];
var lastReturnRate = 0;
const $RIGHT_CHART_BUTTON = document.querySelector("button.btn-to-right");

function checkReturnRate() {
  const percentReturnRateString = document.querySelector(
    "span.asset-item-badge span"
  ).innerText;
  const assetPairName = document.querySelector(".asset-button__title")
    .innerText;
  const percentReturnRate = parseInt(percentReturnRateString, 10);

  if (lastReturnRate !== percentReturnRate) {
    dataBinh.push(
      assetPairName +
        ": " +
        percentReturnRate +
        " @ " +
        new Date().toLocaleString()
    );
    lastReturnRate = percentReturnRate;
    localStorage.setItem("binhData", dataBinh);
  }

  if ($RIGHT_CHART_BUTTON.style.visibility !== "hidden") {
    $RIGHT_CHART_BUTTON.click();
  }
}

setInterval(function () {
  checkReturnRate();
}, 1000);
