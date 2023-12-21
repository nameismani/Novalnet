let idealTimeLimit = 30 * 60 * 1000;
//~ let idealTimeLimit = 3000;
let timer, isRedirect = 0;

let genRnd = function() {
    var min=25;
    var max=99;
    return Math.floor(Math.random() * (+max - +min)) + +min;
};


function get_random_value(min, max) {
    return Math.floor(Math.random() * (+max - +min)) + +min;
}


(function () {

setInterval(
    function() {
        let count = genRnd(); 
        if(document.getElementById("nn_real_time_transaction_data") != undefined)
        { 
			document.getElementById("nn_real_time_transaction_data").innerHTML = count;
			trans_statistics_increase = parseInt($('#nn_trans_statistics_increase').text());
			trans_statistics_increase += count;
			// document.getElementById("nn_trans_statistics_increase").innerHTML = trans_statistics_increase;
            $('#nn_trans_statistics_increase').html(trans_statistics_increase)
		}

        let genSucPerc = get_random_value(80, 95);
        let genHoldPerc = get_random_value(0, 5);
        let genFailedPerc = (100 - genSucPerc - genHoldPerc);
        $("#nn_genSucPerc").html(genSucPerc + "%");
        $("#nn_genHoldPerc").html(genHoldPerc + "%");
        $("#nn_genFailedPerc").html(genFailedPerc + "%");

        let genSucPerc1 = get_random_value(80, 90);
        let genHoldPerc1 = get_random_value(0, 10);
        let genFailedPerc1 = (100 - genSucPerc1 - genHoldPerc1);
        $("#nn_genSucPerc_day").html(genSucPerc1 + "%");
        $("#nn_genHoldPerc_day").html(genHoldPerc1 + "%");
        $("#nn_genFailedPerc_day").html(genFailedPerc1 + "%");
    },
    500
);


})();

    
function resetIdealTimer() {          
    clearInterval(timer);                     
    if(isRedirect == 0) {
        timer =  setInterval(doAccountLock, idealTimeLimit);
    } 
}

function AttachEvent(element, eventName, eventHandler) {
    if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
        return true;
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler);
        return true;
    } else {
        return false;
    }
}

function doAccountLock () {
    isRedirect = 1;
    location.href = "/inactivity";
}

function setupIdealTimerEvent() {
    AttachEvent(document, 'mousemove', resetIdealTimer);
    AttachEvent(document, 'mousedown', resetIdealTimer);
    AttachEvent(document, 'touchmove', resetIdealTimer);
    AttachEvent(document, 'keypress', resetIdealTimer);
    AttachEvent(document, 'click', resetIdealTimer);
    AttachEvent(document, 'scroll', resetIdealTimer);
    AttachEvent(window, 'load', resetIdealTimer);
}
setupIdealTimerEvent();
/*document.addEventListener("DOMContentLoaded", function () {
      	window.ApexCharts && (new ApexCharts(document.getElementById('chart-new-clients'), {
      		chart: {
      			type: "bar",
      			fontFamily: 'inherit',
      			height: 40.0,
      			sparkline: {
      				enabled: true
      			},
      			animations: {
      				enabled: false
      			},
      		},
      		plotOptions: {
      			bar: {
      				columnWidth: '50%',
      			}
      		},
      		dataLabels: {
      			enabled: false,
      		},
      		fill: {
      			opacity: 1,
      		},
      		series: [{
      			name: "Profits",
      			data: [37, 35, 44, 28, 36, 24, 65,44, 28, 36, 24, 65]
      		}],
      		tooltip: {
      			theme: 'dark'
      		},
      		grid: {
      			strokeDashArray: 4,
      		},
      		xaxis: {inactivity
      			labels: {
      				padding: 0,
      			},
      			tooltip: {
      				enabled: false
      			},
      			axisBorder: {
      				show: false,
      			},
      			type: 'datetime',
      		},
      		yaxis: {
      			labels: {
      				padding: 4
      			},
      		},
      		labels: [
      			'2023-04-30', '2023-05-01', '2023-05-02', '2023-05-03', '2023-05-04', '2023-05-05','2023-05-06', '2023-05-07', '2023-05-08', '2023-05-09', '2023-05-10','2023-05-11'
      		],
      		colors: [tabler.getColor("primary")],
      		legend: {
      			show: false,
      		},
      	})).render();
});
$(".tr-select").on('click', function() {
	location.href = $(this).attr('data-location');
});*/


window.onload = function(){
    currency_status();
}

function currency_status(){

    let currency_order = [
        {
            "currency" : "EUR",
            "success" :   "265",
            "sucess_per"  :   "86%",
            "failed" :   "11",
            "failed_per"  :   "0.43%",
            "on_hold": "269",
            "on_hold_per" : "10.73%",
            "total"  :   "293",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "USD",
            "success" :   "12564",
            "sucess_per"  :   "86%",
            "failed" :   "23",
            "failed_per"  :   "0.43%",
            "on_hold": "545",
            "on_hold_per" : "10.73%",
            "total"  :   "87956",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "GBP",
            "success" :   "26265",
            "sucess_per"  :   "86%",
            "failed" :   "151",
            "failed_per"  :   "0.43%",
            "on_hold": "26975",
            "on_hold_per" : "10.73%",
            "total"  :   "295753",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "CHF",
            "success" :   "65656",
            "sucess_per"  :   "86%",
            "failed" :   "111",
            "failed_per"  :   "0.43%",
            "on_hold": "2679",
            "on_hold_per" : "10.73%",
            "total"  :   "297543",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "PLN",
            "success" :   "268755",
            "sucess_per"  :   "86%",
            "failed" :   "121",
            "failed_per"  :   "0.43%",
            "on_hold": "28569",
            "on_hold_per" : "10.73%",
            "total"  :   "29253",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "SEK",
            "success" :   "2565",
            "sucess_per"  :   "86%",
            "failed" :   "121",
            "failed_per"  :   "0.43%",
            "on_hold": "26529",
            "on_hold_per" : "10.73%",
            "total"  :   "29223",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "DKK",
            "success" :   "26265",
            "sucess_per"  :   "86%",
            "failed" :   "117",
            "failed_per"  :   "0.43%",
            "on_hold": "2625359",
            "on_hold_per" : "10.73%",
            "total"  :   "29253",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "AUD",
            "success" :   "2625",
            "sucess_per"  :   "86%",
            "failed" :   "11",
            "failed_per"  :   "0.43%",
            "on_hold": "2639",
            "on_hold_per" : "10.73%",
            "total"  :   "2933",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "RUB",
            "success" :   "26225",
            "sucess_per"  :   "86%",
            "failed" :   "11",
            "failed_per"  :   "0.43%",
            "on_hold": "26529",
            "on_hold_per" : "10.73%",
            "total"  :   "2983",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "NOK",
            "success" :   "27465",
            "sucess_per"  :   "86%",
            "failed" :   "121",
            "failed_per"  :   "0.43%",
            "on_hold": "275269",
            "on_hold_per" : "10.73%",
            "total"  :   "27293",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "CAD",
            "success" :   "42424",
            "sucess_per"  :   "86%",
            "failed" :   "1141",
            "failed_per"  :   "0.43%",
            "on_hold": "261149",
            "on_hold_per" : "10.73%",
            "total"  :   "2917117",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "CZK",
            "success" :   "2165",
            "sucess_per"  :   "86%",
            "failed" :   "511",
            "failed_per"  :   "0.43%",
            "on_hold": "265259",
            "on_hold_per" : "10.73%",
            "total"  :   "293500",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "ZAR",
            "success" :   "26425",
            "sucess_per"  :   "86%",
            "failed" :   "141",
            "failed_per"  :   "0.43%",
            "on_hold": "269111",
            "on_hold_per" : "10.73%",
            "total"  :   "2941413",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "NZD",
            "success" :   "2465",
            "sucess_per"  :   "86%",
            "failed" :   "111",
            "failed_per"  :   "0.43%",
            "on_hold": "24169",
            "on_hold_per" : "10.73%",
            "total"  :   "24193",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "INR",
            "success" :   "26715",
            "sucess_per"  :   "86%",
            "failed" :   "11",
            "failed_per"  :   "0.43%",
            "on_hold": "26119",
            "on_hold_per" : "10.73%",
            "total"  :   "217193",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "THB",
            "success" :   "267415",
            "sucess_per"  :   "86%",
            "failed" :   "171",
            "failed_per"  :   "0.43%",
            "on_hold": "267179",
            "on_hold_per" : "10.73%",
            "total"  :   "271193",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "FID",
            "success" :   "261715",
            "sucess_per"  :   "86%",
            "failed" :   "111",
            "failed_per"  :   "0.43%",
            "on_hold": "21769",
            "on_hold_per" : "10.73%",
            "total"  :   "29113",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "BGN",
            "success" :   "2265",
            "sucess_per"  :   "86%",
            "failed" :   "11",
            "failed_per"  :   "0.43%",
            "on_hold": "26259",
            "on_hold_per" : "10.73%",
            "total"  :   "29283",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "JPY",
            "success" :   "265",
            "sucess_per"  :   "86%",
            "failed" :   "11",
            "failed_per"  :   "0.43%",
            "on_hold": "269",
            "on_hold_per" : "10.73%",
            "total"  :   "293",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "VND",
            "success" :   "2465",
            "sucess_per"  :   "86%",
            "failed" :   "111",
            "failed_per"  :   "0.43%",
            "on_hold": "26419",
            "on_hold_per" : "10.73%",
            "total"  :   "2934",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "HRK",
            "success" :   "26285",
            "sucess_per"  :   "86%",
            "failed" :   "121",
            "failed_per"  :   "0.43%",
            "on_hold": "269828",
            "on_hold_per" : "10.73%",
            "total"  :   "28293",
            "total_per"   :   "97%"
        },
        {
    
            "currency" : "US",
            "success" :   "26175",
            "sucess_per"  :   "86%",
            "failed" :   "117",
            "failed_per"  :   "0.43%",
            "on_hold": "26779",
            "on_hold_per" : "10.73%",
            "total"  :   "2917173",
            "total_per"   :   "97%"
        },
    ];
    if(document.getElementById('currency-transaction-status') != null) {
        var len = currency_order.length;
        for(i=0; i<len; i++){
            document.getElementById("currency-transaction-status").innerHTML += ' <div class="box col-span-6 lg:col-span-3 xl:col-span-2 gap-6 mt-2"><div class="col-span-2 table1"><table class="container"><tr><th class="t-pad">Currency:'+currency_order[i].currency+'</th></tr><tr><td class="t-pad">Success<td><td class="t-pad">'+currency_order[i].success+'</td><td class="t-pad">'+currency_order[i].sucess_per+'</td></tr><tr><td class="t-pad">Onhold<td><td class="t-pad">'+currency_order[i].on_hold+'</td><td class="t-pad">'+currency_order[i].on_hold_per+'</td></tr><tr><td class="t-pad">Failed<td><td class="t-pad">'+currency_order[i].failed+'</td><td class="t-pad">'+currency_order[i].failed_per+'</td></tr><tr><td class="t-pad">Total<td><td class="t-pad">'+currency_order[i].total+'</td><td class="t-pad">'+currency_order[i].total_per+'</td></tr></table></div></div>';
        }
    }
}

