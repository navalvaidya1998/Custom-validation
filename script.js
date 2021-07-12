/* ----------------------------

	CustomValidation prototype

	- Keeps track of the list of invalidity messages for this input
	- Keeps track of what validity checks need to be performed for this input
	- Performs the validity checks and sends feedback to the front end

---------------------------- */

function CustomValidation(input) {
	this.invalidities = [];
	this.validityChecks = [];

	//add reference to the input node
	this.inputNode = input;

	//trigger method to attach the listener
	this.registerListener();
}

CustomValidation.prototype = {
	addInvalidity: function(message) {
		this.invalidities.push(message);
	},
	getInvalidities: function() {
		return this.invalidities.join('. \n');
	},
	checkValidity: function(input) {
		for ( var i = 0; i < this.validityChecks.length; i++ ) {

			var isInvalid = this.validityChecks[i].isInvalid(input);
			if (isInvalid) {
				this.addInvalidity(this.validityChecks[i].invalidityMessage);
			}

			var requirementElement = this.validityChecks[i].element;

			if (requirementElement) {
				if (isInvalid) {
					requirementElement.classList.add('invalid');
					requirementElement.classList.remove('valid');
				} else {
					requirementElement.classList.remove('invalid');
					requirementElement.classList.add('valid');
				}

			} // end if requirementElement
		} // end for
	},
	checkInput: function() { // checkInput now encapsulated

		this.inputNode.CustomValidation.invalidities = [];
		this.checkValidity(this.inputNode);

		if ( this.inputNode.CustomValidation.invalidities.length === 0 && this.inputNode.value !== '' ) {
			this.inputNode.setCustomValidity('');
		} else {
			var message = this.inputNode.CustomValidation.getInvalidities();
			this.inputNode.setCustomValidity(message);
		}
	},
	registerListener: function() { //register the listener here

		var CustomValidation = this;

		this.inputNode.addEventListener('keyup', function() {
			CustomValidation.checkInput();
		});


	}

};



/* ----------------------------

	Validity Checks

	The arrays of validity checks for each input
	Comprised of three things
		1. isInvalid() - the function to determine if the input fulfills a particular requirement
		2. invalidityMessage - the error message to display if the field is invalid
		3. element - The element that states the requirement

---------------------------- */

var usernameValidityChecks = [
	{
		isInvalid: function(input) {
			return input.value.length < 4;
		},
		invalidityMessage: 'This input needs to be at least 3 characters',
		element: document.querySelector('label[for="username"] .input-requirements li:nth-child(1)')
	},
	{
		isInvalid: function(input) {
			var illegalCharacters = input.value.match(/[^a-zA-Z]+\s/g);
			return illegalCharacters ? true : false;
		},
		invalidityMessage: 'Only letters are allowed',
		element: document.querySelector('label[for="username"] .input-requirements li:nth-child(2)')
	},
	{
		isInvalid: function(input) {
			return input.value.split(" ").length < 2
		},
		invalidityMessage: 'This input needs to have at least 2 words',
		element: document.querySelector('label[for="username"] .input-requirements li:nth-child(3)')
	}
];

var emailValidityChecks = [
	{
		isInvalid: function(input){
			return input.value.length < 0
		},
		invalidityMessage: 'Email is required',
		element: document.querySelector('label[for="email"] .input-requirements li:nth-child(1)')
	},
	{
		isInvalid: function(input){
			if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(input.value)) {
				return (false)
			}
			return (true)
		},
		invalidityMessage: 'Enter correct Email format',
		element: document.querySelector('label[for="email"] .input-requirements li:nth-child(2)')
	}
];

var numberValidityChecks = [
	{
		isInvalid: function(input){
			const bool = document.getElementById('state')
			if(bool.innerHTML == 'invalid number'){
				return true
			}
			return false
		},
		invalidityMessage: 'Number is invalid',
		element: document.getElementById('state')
	}
];



/* ----------------------------

	Setup CustomValidation

	Setup the CustomValidation prototype for each input
	Also sets which array of validity checks to use for that input

---------------------------- */

var usernameInput = document.getElementById('username');
var emailInput = document.getElementById('email')
var numberInput = document.getElementById('number')

usernameInput.CustomValidation = new CustomValidation(usernameInput);
usernameInput.CustomValidation.validityChecks = usernameValidityChecks;

emailInput.CustomValidation = new CustomValidation(emailInput);
emailInput.CustomValidation.validityChecks = emailValidityChecks;

numberInput.CustomValidation = new CustomValidation(numberInput);
numberInput.CustomValidation.validityChecks = numberValidityChecks;


/* ----------------------------

	Event Listeners

---------------------------- */

var inputs = document.querySelectorAll('input:not([type="submit"])');


var submit = document.querySelector('input[type="submit"');
var form = document.getElementById('registration');

function validate() {
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].CustomValidation.checkInput();
	}
}

submit.addEventListener('click', validate);
form.addEventListener('submit', validate);




/* ----------------------------

	Phone Formatter

---------------------------- */
const isNumericInput = (event) => {
	const key = event.keyCode;
	return ((key >= 48 && key <= 57) || // Allow number line
		(key >= 96 && key <= 105) // Allow number pad
	);
};

const isModifierKey = (event) => {
	const key = event.keyCode;
	return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
		(key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
		(key > 36 && key < 41) || // Allow left, up, right, down
		(
			// Allow Ctrl/Command + A,C,V,X,Z
			(event.ctrlKey === true || event.metaKey === true) &&
			(key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
		)
};

const enforceFormat = (event) => {
	// Input must be of a valid number format or a modifier key, and not longer than ten digits
	if(!isNumericInput(event) && !isModifierKey(event)){
		event.preventDefault();
	}
};

const formatToPhone = (event) => {
	if(isModifierKey(event)) {return;}

	const key = event.keyCode;

	const target = event.target;
	const input = event.target.value.replace(/\D/g,'').substring(0,15); // First ten digits of input only
	const zip = input.substring(0,3);
	const middle = input.substring(3,6);
	const last = input.substring(6,10);

	if(input.length > 6){
		target.value = `(${zip})-${middle}-${last}`;
		if(`${middle}` == 121){ document.getElementById('state').innerHTML = "Arunachal Pradesh" }
		else if(`${middle}` == 122){ document.getElementById('state').innerHTML = "Assam" }
		else if(`${middle}` == 123){ document.getElementById('state').innerHTML = "Andhra Pradesh" }
		else if(`${middle}` == 124){ document.getElementById('state').innerHTML = "Gujarat" }
		else if(`${middle}` == 125){ document.getElementById('state').innerHTML = "Goa" }
		else if(`${middle}` == 126){ document.getElementById('state').innerHTML = "Bihar" }
		else if(`${middle}` == 127){ document.getElementById('state').innerHTML = "West Bangal" }
		else if(`${middle}` == 128){ document.getElementById('state').innerHTML = "Karnataka" }
		else if(`${middle}` == 129){ document.getElementById('state').innerHTML = "Kerala" }
		else if(`${middle}` == 130){ document.getElementById('state').innerHTML = "Madhya Pradesh" }
		else if(`${middle}` == 131){ document.getElementById('state').innerHTML = "Maharashtra" }
		else if(`${middle}` == 132){ document.getElementById('state').innerHTML = "Manipur" }
		else if(`${middle}` == 133){ document.getElementById('state').innerHTML = "Meghalaya" }
		else if(`${middle}` == 134){ document.getElementById('state').innerHTML = "Mizoram" }
		else if(`${middle}` == 135){ document.getElementById('state').innerHTML = "Nagaland" }
		else if(`${middle}` == 136){ document.getElementById('state').innerHTML = "Orissa" }
		else if(`${middle}` == 137){ document.getElementById('state').innerHTML = "Punjab" }
		else if(`${middle}` == 138){ document.getElementById('state').innerHTML = "Rajasthan" }
		else if(`${middle}` == 139){ document.getElementById('state').innerHTML = "Sikkim" }
		else if(`${middle}` == 140){ document.getElementById('state').innerHTML = "Tamil Nadu" }
		else if(`${middle}` == 141){ document.getElementById('state').innerHTML = "Tripura" }
		else if(`${middle}` == 142){ document.getElementById('state').innerHTML = "Uttaranchal" }
		else if(`${middle}` == 143){ document.getElementById('state').innerHTML = "Uttar Pradesh" }
		else if(`${middle}` == 144){ document.getElementById('state').innerHTML = "Hariyana" }
		else if(`${middle}` == 145){ document.getElementById('state').innerHTML = "Himachal Pradesh" }
		else if(`${middle}` == 146){ document.getElementById('state').innerHTML = "Chhattisgadh" }
		else if(`${middle}` == 147){ document.getElementById('state').innerHTML = "Andaman and Nicobar" }
		else if(`${middle}` == 148){ document.getElementById('state').innerHTML = "Dadra div daman and Nagar haveli" }
		else if(`${middle}` == 149){ document.getElementById('state').innerHTML = "Delhi" }
		else if(`${middle}` == 150){ document.getElementById('state').innerHTML = "Pondecherry" }
		else if(`${middle}` == 151){ document.getElementById('state').innerHTML = "Chandigadh" }
		else if(`${middle}` == 152){ document.getElementById('state').innerHTML = "jammu" }
		else if(`${middle}` == 153){ document.getElementById('state').innerHTML = "Lakshadweep" }
		else if(`${middle}` == 154){ document.getElementById('state').innerHTML = "ladakh" }
		else if(`${middle}` == 155){ document.getElementById('state').innerHTML = "Jharkhand" }
		else if(`${middle}` == 156){ document.getElementById('state').innerHTML = "Telangana" }
		else { 
			document.getElementById('state').innerHTML = "invalid number" 
			document.querySelector(".logo li:nth-child(1)").style = "display: none";
			document.querySelector(".logo li:nth-child(2)").style = "display: none";
			document.querySelector(".logo li:nth-child(3)").style = "display: none";
		}
	}

	else if(input.length > 3){
		target.value = `(${zip})-${middle}`;
		if(`${zip}` >=621 && `${zip}` <= 799){
			document.querySelector(".logo li:nth-child(1)").style = "display: flex";
			document.querySelector(".logo li:nth-child(2)").style = "display: none";
			document.querySelector(".logo li:nth-child(3)").style = "display: none";
		}
		else if(`${zip}` >=801 && `${zip}` <= 920){
			document.querySelector(".logo li:nth-child(1)").style = "display: none";
			document.querySelector(".logo li:nth-child(2)").style = "display: flex";
			document.querySelector(".logo li:nth-child(3)").style = "display: none";
		}
		else if(`${zip}` >=921 && `${zip}` <= 999){
			document.querySelector(".logo li:nth-child(1)").style = "display: none";
			document.querySelector(".logo li:nth-child(2)").style = "display: none";
			document.querySelector(".logo li:nth-child(3)").style = "display: flex";
		}
		else{
			document.querySelector(".logo li:nth-child(1)").style = "display: none";
			document.querySelector(".logo li:nth-child(2)").style = "display: none";
			document.querySelector(".logo li:nth-child(3)").style = "display: none";
			document.getElementById('state').innerHTML = "Invalid Number"
		}
	}
	else if(input.length > 0){
		target.value = `(${zip}`;
	}
};

numberInput.addEventListener('keydown',enforceFormat);
numberInput.addEventListener('keyup',formatToPhone);


/* ----------------------------

	OTP Generator and Function

---------------------------- */
const success = document.getElementById('registration')
success.addEventListener('submit', otp)

function otp(){
	var firstName = usernameInput.value.replace(/ .*/,'');
	var phoneNumber = numberInput.value
	localStorage.setItem('firstName', firstName)
	localStorage.setItem('phoneNumber', phoneNumber)
}
