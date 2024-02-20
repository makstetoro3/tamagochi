function check_registration() {
    let inputs_is_not_empty = !empty_input('password', 'password_warning')
    inputs_is_not_empty &= !empty_input('login', 'login_warning')
    if (inputs_is_not_empty) {
        window.location.href = "/main/main.html";
    }
}

function empty_input(id_input, id_warning) {
    let resul = document.getElementById(id_input).value == "";
    if (resul) {
        document.getElementById(id_warning).style.display = "block";
    }
    else {
        document.getElementById(id_warning).style.display = "none";
    }
    return resul;
}
