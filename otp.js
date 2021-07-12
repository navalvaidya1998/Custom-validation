
var OTP = Math.floor(1000 + Math.random() * 9000);
const otpValue = document.getElementById('otp')

const init = (e) => {
    const otp = document.querySelector('.container h1')
    const firstName = localStorage.getItem('firstName')
    const phoneNumber = localStorage.getItem('phoneNumber')

    const str = "Dear "+firstName+", Thank you for your inquiry. A 4 digit random number has been sent to your phone number: "+phoneNumber+", please enter in the following box and submit for confirmation."

    otp.innerHTML = str

    console.log(OTP)
}
document.addEventListener('DOMContentLoaded', function(){
    init();
})

let count = 0
let btn = document.querySelector('#count')
btn.addEventListener('click', (e) => {
    count++
})

const form = document.getElementById('registration')
form.addEventListener('submit', pixel)

function pixel(){
    event.preventDefault()

    if(otpValue.value == OTP){
        console.log("Valid")
        window.location.replace("http://pixel6.co"); 
    }

    if(otpValue.value !== OTP)
    {
        if (count <= 3) {
            OTP = Math.floor(1000 + Math.random() * 9000);
            console.log(OTP)
        } else {
            console.log("Invalid")
            window.location.replace("http://pixel6.co/page-not-found");
        }
    }
}