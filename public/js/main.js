var socket = io();
console.log(socket);
// var server_time = document.getElementById('server-time');
// var pair_data = document.getElementById('pair-data');
var ticker_data = document.getElementById('ticker-data');

/*socket.on('time', function(object) {
    var timeString = JSON.parse(object);
    server_time.innerHTML = 'Server time: ' + timeString.result.rfc1123;
});*/

/*socket.on('pair', function(object) {
  var pairString = JSON.parse(object);
  console.log(pairString);
  pair_data.innerHTML = 'Pair Data: ' + JSON.stringify(pairString);
});*/

var priceCalculator = function(orderLimit, orderBook) {
    var currVol = 0;
    var remainingMoney = orderLimit;
    console.log("Remaining: " + remainingMoney);
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


var orderProfits = function(initMoney) {
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
        console.log('XBTEUR');
        orderVolumes['XBTEUR'] = priceCalculator(initMoney, orderBook);
        xbteur_el.innerHTML = 'EUR -> XBT: ' + orderVolumes['XBTEUR'];
    });

    socket.on('ETHXBT', function(orderBook) {
        console.log('ETHXBT');
        orderVolumes['ETHXBT'] = priceCalculator(orderVolumes['XBTEUR'], orderBook);
        ethxbt_el.innerHTML = 'XBT -> ETH: ' + orderVolumes['ETHXBT'];
    });

    socket.on('ETHEUR', function(orderBook) {
        console.log('ETHEUR');
        orderVolumes['ETHEUR'] = 1 / (priceCalculator(1 / orderVolumes['ETHXBT'], orderBook));
        console.log(JSON.stringify(orderVolumes));
        etheur_el.innerHTML = 'ETH -> EUR: ' + orderVolumes['ETHEUR'];
        var profit = (orderVolumes['ETHEUR'] - initMoney);
        profit_el.innerHTML = '<strong>PROFIT: </strong>' + profit;

        if (profit > 20) {
            notifyMe();
        }
    });
};

//var initMoney = 100;
// orderProfits(initMoney);
