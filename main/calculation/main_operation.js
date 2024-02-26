var INS = 0, CAR = 4.6;

setInterval(
    function() {
        CAR += Math.random() * 0.3;
        document.getElementById('output_CAR_num').innerText = CAR.toFixed(1);
    },
    3000
);

setInterval(
    function() {
        if (INS < 0.075 && INS > 0) {
            CAR -= INS;
            INS = 0;
        }
        if (INS >= 0.1) {
            CAR -= INS / 3;
            INS -= INS /3;
        }
        document.getElementById('output_CAR_num').innerText = CAR.toFixed(1);
        document.getElementById('output_INS_num').innerText = INS.toFixed(1);
    },
    2000
);

function add_INS() {
    INS += 0.1;
    document.getElementById('output_INS_num').innerText = INS.toFixed(1);
}
