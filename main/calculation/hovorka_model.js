function hovorka_parameters(BW) {
    /*
    PATIENT PARAMETERS
    BW - body weight in kilos
    */

    // Параметры, зависящие от пациента:
    let V_I = 0.12 * BW  // Объем инсулина [L]
    let V_G = 0.16 * BW  // Объем глюкозы [L]
    let F_01 = 0.0097 * BW  // Неинсулинозависимый поток глюкозы [mmol/min]
    let EGP_0 = 0.0161 * BW  // EGP, экстраполированный на нулевую концентрацию инсулина [mmol/min]

    // Пациент-независимые(?) параметры:
    let S_IT = 51.2e-4  // Чувствительность распределения/транспорта к инсулину [L/min*mU]
    let S_ID = 8.2e-4  // Чувствительность к инсулину при избавлении [L/min*mU]
    let S_IE = 520e-4  // Чувствительность EGP к инсулину [L/mU]

   let tau_G = 40  // Время до максимального поглощения CHO [min]
   let tau_I = 55  // Время до максимума абсорбции инсулина короткого действия, введенного внутривенно [min]

    let A_G = 0.8  // биодоступность CHO [1]
    let k_12 = 0.066  // Скорость передачи данных [min]

    let k_a1 = 0.006  // Скорость деактивации инсулина при распределении/транспортировке [1/min]
    let k_b1 = S_IT * k_a1  // Скорость активации инсулина при распределении/транспорте
    let k_a2 = 0.06  // Скорость дезактивации инсулина на дисипозале [1/min]
    let k_b2 = S_ID * k_a2  // Скорость активации инсулина при утилизации
    let k_a3 = 0.03  // Скорость деактивации инсулина на ЭГП [1/min]
    let k_b3 = S_IE * k_a3  // Скорость активации инсулина на ЭГП

    let k_e = 0.138  // Выведение инсулина из плазмы крови [1/min]

    // Краткое описание ценностей пациента:
    let P = [tau_G, tau_I, A_G, k_12, k_a1, k_b1, k_a2, k_b2, k_a3, k_b3, k_e, V_I, V_G, F_01, EGP_0]

    return P
}

function hovorka_model(t, x, u, D, P) {  // Это версия оды
    /* HOVORKA DIFFERENTIAL EQUATIONS
    t:    Time window for the simulation. Format: [t0 t1], or [t1 t2 t3 ... tn]. [min]
    x:    Initial conditions
    u:    Amount of insulin insulin injected [mU/min]
    D:    CHO eating rate [mmol/min]
    P:    Model fixed parameters

    Syntax :
    [T, X] = ode15s(@Hovorka, [t0 t1], xInitial0, odeOptions, u, D, p);
    TODO: update syntax in docstring
    */

    // u, D, P = args

    // Определение различных имен уравнений
    let D1 = x[0]  // Количество глюкозы в отсеке 1 [mmol]
    let D2 = x[1]  // Количество глюкозы в отсеке 2 [mmol]
    let S1 = x[2]  // Количество инсулина в отсеке 1 [mU]
    let S2 = x[3]  // Количество инсулина в отделении 2 [mU]
    let Q1 = x[4]  // Количество глюкозы в основном кровотоке [mmol]
    let Q2 = x[5]  // Количество глюкозы в периферических тканях [mmol]
    let I = x[6]  // Концентрация инсулина в плазме крови [mU/L]
    let x1 = x[7]  // Инсулин в мышечных тканях [1], x1*Q1 = инсулинзависимое поглощение глюкозы в мышцах
    let x2 = x[8]  // [1], x2*Q2 = инсулинозависимая утилизация глюкозы в мышечных клетках
    let x3 = x[9]  // Инсулин в печени [1], EGP_0*(1-x3) = эндогенное высвобождение глюкозы печенью
    let C = x[10]

    // Распакуйте данные
    let tau_G = P[0]  // Время всасывания глюкозы [min]
    let tau_I = P[1]  // Время всасывания инсулина [min]
    let A_G = P[2]  // Фактор, описывающий утилизацию CHO до глюкозы [1]
    let k_12 = P[3]  // [1/min] k_12*Q2 = Перенос глюкозы из периферических тканей (например, из мышц в кровь)
    let k_a1 = P[4]  // Скорость деактивации [1/min]
    let k_b1 = P[5]  // [L/(mU*min)]
    let k_a2 = P[6]  // Скорость деактивации [1/min]
    let k_b2 = P[7]  // [L/(mU*min)]
    let k_a3 = P[8]  // Скорость деактивации [1/min]
    let k_b3 = P[9]  // [L/(mU*min)]
    let k_e = P[10]  // Скорость выведения инсулина [1/min]
    let V_I = P[11]  // Объем распределения инсулина [L]
    let V_G = P[12]  // Объем распределения глюкозы [L]
    let F_01 = P[13]  // Потребление глюкозы центральной нервной системой [mmol/min]
    let EGP_0 = P[14]  // Скорость выработки глюкозы печенью [mmol/min]

    // Определенные параметры
    let U_G = D2 / tau_G  // Скорость поглощения глюкозы [mmol/min]
    let U_I = S2 / tau_I  // Скорость всасывания инсулина [mU/min]

    // Конституционные уравнения
    let G = Q1 / V_G  // Концентрация глюкозы [mmol/L]

    if (G >= 4.5) {
        F_01c = F_01  // Потребление глюкозы центральной нервной системой [mmol/min
    }
    else {
        F_01c = F_01 * G / 4.5  // Потребление глюкозы центральной нервной системой [mmol/min]
    }
    if (G >= 9) {
        F_R = 0.003 * (G - 9) * V_G  // Выведение глюкозы почками [mmol/min]
    }
    else {
        F_R = 0  // Выведение глюкозы почками [mmol/min]
    }

    // Массовые балансы/дифференциальные уравнения
    let xdot = np.zeros(11)

    xdot[0] = A_G * D - D1 / tau_G  // dD1
    xdot[1] = D1 / tau_G - U_G  // dD2
    xdot[2] = u - S1 / tau_I  // dS1
    xdot[3] = S1 / tau_I - U_I  // dS2
    xdot[4] = -(F_01c + F_R) - x1 * Q1 + k_12 * Q2 + U_G + EGP_0 * (1 - x3)  // dQ1
    xdot[5] = x1 * Q1 - (k_12 + x2) * Q2  // dQ2
    xdot[6] = U_I / V_I - k_e * I  // dI
    xdot[7] = k_b1 * I - k_a1 * x1  // dx1
    xdot[8] = k_b2 * I - k_a2 * x2  // dx2
    xdot[9] = k_b3 * I - k_a3 * x3  // dx3
    // ===============
    // CGM задержка
    // ===============
    let  ka_int = 0.073
    xdot[10] = ka_int * (G - C)

    return xdot
}

function hovorka_model_tuple(x, ...pars) {
   // HOVORKA DIFFERENTIAL EQUATIONS without time variable
    // t:    Time window for the simulation. Format: [t0 t1], or [t1 t2 t3 ... tn]. [min]
    // x:    Initial conditions
    // u:    Amount of insulin insulin injected [mU/min]
    // D:    CHO eating rate [mmol/min]
    // P:    Model fixed parameters
    //

    // TODO: update syntax in docstring


    // Параметры распаковки
    let u, D, P = pars

    // Defining the various equation names
    let D1 = x[0]  // Amount of glucose in compartment 1 [mmol]
    let D2 = x[1]  // Amount of glucose in compartment 2 [mmol]
    let S1 = x[2]  // Amount of insulin in compartment 1 [mU]
    let S2 = x[3]  // Amount of insulin in compartment 2 [mU]
    let Q1 = x[4]  // Amount of glucose in the main blood stream [mmol]
    let Q2 = x[5]  // Amount of glucose in peripheral tissues [mmol]
    let I = x[6]  // Plasma insulin concentration [mU/L]
    let x1 = x[7]  // Insluin in muscle tissues [1], x1*Q1 = Insulin dependent uptake of glucose in muscles
    let x2 = x[8]  // [1], x2*Q2 = Insulin dependent disposal of glucose in the muscle cells
    let x3 = x[9]  // Insulin in the liver [1], EGP_0*(1-x3) = Endogenous release of glucose by the liver
    let C = x[10]

    // Unpack data
    let tau_G = P[0]  // Time-to-glucose absorption [min]
    let tau_I = P[1]  // Time-to-insulin absorption [min]
    let A_G = P[2]  // Factor describing utilization of CHO to glucose [1]
    let k_12 = P[3]  // [1/min] k_12*Q2 = Transfer of glucose from peripheral tissues (ex. muscle to the blood)
    let k_a1 = P[4]  // Deactivation rate [1/min]
    let k_b1 = P[5]  // [L/(mU*min)]
    let k_a2 = P[6]  // Deactivation rate [1/min]
    let k_b2 = P[7]  // [L/(mU*min)]
    let k_a3 = P[8]  // Deactivation rate [1/min]
    let k_b3 = P[9]  // [L/(mU*min)]
    let k_e = P[10]  // Insulin elimination rate [1/min]
    let V_I = P[11]  // Insulin distribution volume [L]
    let V_G = P[12]  // Glucose distribution volume [L]
    let F_01 = P[13]  // Glucose consumption by the central nervous system [mmol/min]
    let EGP_0 = P[14]  // Liver glucose production rate [mmol/min]

    // Certain parameters are defined
    let U_G = D2 / tau_G  // Glucose absorption rate [mmol/min]
    let U_I = S2 / tau_I  // Insulin absorption rate [mU/min]

    // Constitutive equations
    let G = Q1 / V_G  // Glucose concentration [mmol/L]

    if (G >= 4.5) {
        F_01c = F_01  // Consumption of glucose by the central nervous system [mmol/min
    }
    else {
        F_01c = F_01 * G / 4.5  // Consumption of glucose by the central nervous system [mmol/min]
    }
    if (G >= 9) {
        F_R = 0.003 * (G - 9) * V_G  // Renal excretion of glucose in the kidneys [mmol/min]
    }
    else {
        F_R = 0  // Renal excretion of glucose in the kidneys [mmol/min]
    }

    // Mass balances/differential equations
    let xdot = np.zeros(11);

    xdot[0] = A_G * D - D1 / tau_G  // dD1
    xdot[1] = D1 / tau_G - U_G  // dD2
    xdot[2] = u - S1 / tau_I  // dS1
    xdot[3] = S1 / tau_I - U_I  // dS2
    xdot[4] = -(F_01c + F_R) - x1 * Q1 + k_12 * Q2 + U_G + EGP_0 * (1 - x3)  // dQ1
    xdot[5] = x1 * Q1 - (k_12 + x2) * Q2  // dQ2
    xdot[6] = U_I / V_I - k_e * I  // dI
    xdot[7] = k_b1 * I - k_a1 * x1  // dx1
    xdot[8] = k_b2 * I - k_a2 * x2  // dx2
    xdot[9] = k_b3 * I - k_a3 * x3  // dx3
    // ===============
    // CGM delay
    // ===============
    let ka_int = 0.073
    xdot[10] = ka_int * (G - C)

    return xdot
}