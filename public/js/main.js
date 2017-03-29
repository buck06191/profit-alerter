var socket = io();
var ticker_data = document.getElementById('ticker-data');

var priceCalculator = function(orderLimit, orderBook) {
    var currVol = 0;
    var remainingMoney = orderLimit;
    for (var i = 0; i < orderBook.length; i++) {
        var newVol = remainingMoney / Number(orderBook[i][0]);
        if (newVol > orderBook[i][1]) {
            currVol += Number(orderBook[i][1]);
            remainingMoney -= (orderBook[i][1] * orderBook[i][0]);
        } else {
            currVol += newVol;
            break;
        }
    }
    return currVol;
};

socket.on('ticker', function(priceObject) {
    ticker_data.innerHTML = '';

    for (var key in priceObject) {
        ticker_data.innerHTML += '<strong>' + key + ':</strong>  ' +
            '<em> Ask Price:</em> ' + priceObject[key].ask +
            '<em> Volume:</em> ' + priceObject[key].vol +
            '<em> Total:</em> ' + priceObject[key].tot + '<br>';
    }
});


var orderProfits = function(initMoney, profitLimit) {
    var xbteur_el = document.getElementById('XBTEUR');
    var ethxbt_el = document.getElementById('ETHXBT');
    var etheur_el = document.getElementById('ETHEUR');
    var profit_el = document.getElementById('profit');

    var orderVolumes = {
        'XBTEUR': 0,
        'ETHXBT': 0,
        'ETHEUR': 0
    };

    socket.on('XBTEUR', function(orderBook) {

        orderVolumes['XBTEUR'] = priceCalculator(initMoney, orderBook);
        xbteur_el.innerHTML = 'EUR -> XBT: ' + orderVolumes['XBTEUR'];
    });

    socket.on('ETHXBT', function(orderBook) {
        orderVolumes['ETHXBT'] = priceCalculator(orderVolumes['XBTEUR'], orderBook);
        ethxbt_el.innerHTML = 'XBT -> ETH: ' + orderVolumes['ETHXBT'];
    });

    socket.on('ETHEUR', function(orderBook) {
        orderVolumes['ETHEUR'] = 1 / (priceCalculator(1 / orderVolumes['ETHXBT'], orderBook));
        etheur_el.innerHTML = 'ETH -> EUR: ' + orderVolumes['ETHEUR'];
        var profit = (orderVolumes['ETHEUR'] - initMoney);
        profit_el.innerHTML = '<strong>PROFIT: </strong>' + profit;

        if (profit > profitLimit) {
            notifyMe();
        }
    });
};

//var initMoney = 100;
// orderProfits(initMoney);
