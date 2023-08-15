const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");

signupBtn.onclick = (() => {
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (() => {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
});
signupLink.onclick = (() => {
  signupBtn.click();
  return false;
});

function logon() {
  let query_body = {
    "user": document.getElementById('user').value,
    "pass": document.getElementById('pwd').value
  }
  fetch('/api/login', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(query_body)
  })
    .then((response) => {
      if (response.status === 201) {
        response.json().then((data) => {
          sessionStorage.setItem('session', (btoa(data.token)))
          sessionStorage.setItem('refresh', (btoa(data.refresh)))
          sessionStorage.setItem('lkto', `${btoa(JSON.stringify(data.uri))}`)
          window.location.href = `/main.html?session=${data.token}`;
        })
          .catch((error) => {
            //handle error TODO: handle this
            alert('Connection error')
          });
      } else {
        response.json().then((error) => {
          alert(error.msg)
        })
          .catch((error) => {
            //handle error TODO: handle this
            alert(error)
          });
      }
    })
}
