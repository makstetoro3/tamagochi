function check_authorization() {
    document.getElementById('login_warning_2').style.display = "none";
    document.getElementById('password_warning_2').style.display = "none";

    let inputs_empty = empty_input('password', 'password_warning')
    inputs_empty |= empty_input('login', 'login_warning')
    if (inputs_empty) { return; }

    var users = JSON.parse(localStorage.users);
    let auto_user = document.getElementById('login').value;
    let auto_user_password = document.getElementById('password').value;
    if (found_login(users, auto_user)) { return; }
    if (check_password(users, auto_user, auto_user_password)) { return; }

    window.location.href = "/main/main.html";
}

function check_password(users, auto_user, auto_user_password) {
    if (auto_user_password !== users[auto_user]) {
        document.getElementById('password_warning_2').style.display = "block";
        return true;
    }
    document.getElementById('password_warning_2').style.display = "none";
}

function found_login(users, auto_user) {
    if (!users.hasOwnProperty(auto_user)) {
        document.getElementById('login_warning_2').style.display = "block";
        return true;
    }
    document.getElementById('login_warning_2').style.display = "none";
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
