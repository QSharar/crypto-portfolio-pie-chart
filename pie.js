

function getCoins() {
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            pieChart(createDataPoint(JSON.parse(this.responseText)));
        }
    };

    ajax.open("GET", "https://api.coinmarketcap.com/v1/ticker/?limit=10", true);
    ajax.send();
}
let addCoin = function () {

    let coinsAdded = [];

    return function () {
        let ajax = new XMLHttpRequest();
        let name = document.getElementById("name").value;
        let quantity = document.getElementById("quantity").value;
        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let singleCoin = JSON.parse(this.responseText);

                if (document.getElementById("transaction").value === "sell") {
                    quantity = parseFloat("-" + quantity.toString());
                }
                let found = false;

                for (let i = 0; i < coinsAdded.length; i++) {
                    if (coinsAdded[i].id === name) {
                        found = true;
                        let tempQty = coinsAdded[i].quantity;
                        coinsAdded[i] = singleCoin[0];
                        coinsAdded[i].quantity = parseFloat(tempQty) + parseFloat(quantity);
                        //console.log(coinsAdded);
                        break;
                    };
                };

                if (found === false) {
                    console.log("pushing agains")
                    singleCoin[0].quantity = quantity;
                    coinsAdded.push(singleCoin[0]);
                }
                console.log(coinsAdded);
                pieChart(createDataPoint(coinsAdded));

            }
        };



        ajax.open("GET", `https://api.coinmarketcap.com/v1/ticker/${name}/`, true);
        ajax.send();

    }
}()


function toggleBuy() {

    document.getElementById("buy").setAttribute("class", "selectedbuy ip il");
    document.getElementById("sell").setAttribute("class", "ip il sell");
    document.getElementById("transaction").value = "buy";

}

function toggleSell() {

    document.getElementById("sell").setAttribute("class", "selectedsell ip il");
    document.getElementById("buy").setAttribute("class", "ip il buy");
    document.getElementById("transaction").value = "sell";

}

function createDataPoint(coins) {
    let datapoints = [];

    coins.forEach(coin => {
        if (coin.quantity === undefined) {
            coin.quantity = 1;
        }
        datapoints.push({
            y: parseFloat(coin.price_usd) * coin.quantity,
            label: coin.name
        })
    });

    return datapoints;
}


function pieChart(dps) {
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Crypto Values",
            horizontalAlign: "center"
        },
        data: [{
            type: "doughnut",
            startAngle: 60,
            indexLabelFontSize: 17,
            indexLabel: "{label} - #percent%",
            toolTipContent: "<b>{label}:</b> {y} (#percent%)",
            dataPoints: dps
        }]
    });
    chart.render();
}


function createPortfolio() {

}

window.onload = function () {

    getCoins();

}




