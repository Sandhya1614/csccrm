document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("studentForm");

    // COURSE AUTO FILL
    const courseSelect = document.getElementById("id_course");

    courseSelect.addEventListener("change", function () {

        const selected = this.options[this.selectedIndex];

        document.getElementById("duration").value =
            selected.dataset.duration || "";

        document.getElementById("fee").value =
            selected.dataset.fee || "";

    });

    // INITIAL LOAD
    courseSelect.dispatchEvent(new Event("change"));

    // INPUTS
    const firstName = document.getElementsByName("first_name")[0];
    const lastName = document.getElementsByName("last_name")[0];
    const email = document.getElementsByName("email")[0];
    const phone = document.getElementsByName("phone_no")[0];
    const guardianName = document.getElementsByName("guardian_name")[0];
    const guardianPhone = document.getElementsByName("guardian_phone_no")[0];

    const dob = document.getElementsByName("dob")[0];
    const gender = document.getElementsByName("gender")[0];

    const batch = document.getElementsByName("batch")[0];
    const startDate = document.getElementsByName("start_date")[0];

    // REGEX
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phoneRegex = /^\d{10}$/;

    // SHOW ERROR
    function showError(input, message) {

        removeError(input);

        let error = document.createElement("span");

        error.className = "custom-error";
        error.style.color = "red";
        error.style.fontSize = "13px";
        error.style.display = "block";
        error.style.marginTop = "4px";

        error.innerText = message;

        input.parentElement.appendChild(error);
    }

    // REMOVE ERROR
    function removeError(input) {

        let oldError =
            input.parentElement.querySelector(".custom-error");

        if (oldError) {
            oldError.remove();
        }
    }

    // TEXT VALIDATION
    function validateField(input, regex, emptyMsg, invalidMsg) {

        let value = input.value.trim();

        removeError(input);

        if (value === "") {

            showError(input, emptyMsg);
            return false;
        }

        if (!regex.test(value)) {

            showError(input, invalidMsg);
            return false;
        }

        return true;
    }

    // DOB VALIDATION
    function validateDOB() {

        let selectedDate = new Date(dob.value);

        let today = new Date();

        today.setHours(0, 0, 0, 0);

        removeError(dob);

        if (dob.value === "") {

            showError(dob, "DOB is required");
            return false;
        }

        if (selectedDate >= today) {

            showError(dob, "Select past date only");
            return false;
        }

        return true;
    }

    // START DATE VALIDATION
    function validateStartDate() {

        let selectedDate = new Date(startDate.value);

        let today = new Date();

        today.setHours(0, 0, 0, 0);

        removeError(startDate);

        if (startDate.value === "") {

            showError(startDate, "Start date is required");
            return false;
        }

        if (selectedDate < today) {

            showError(startDate, "Select today or future date only");
            return false;
        }

        return true;
    }

    // GENDER VALIDATION
    function validateGender() {

        removeError(gender);

        if (gender.value === "") {

            showError(gender, "Please select a gender");
            return false;
        }

        return true;
    }

    // BATCH VALIDATION
    function validateBatch() {

        removeError(batch);

        if (batch.value === "") {

            showError(batch, "Please select a batch");
            return false;
        }

        return true;
    }

    // LIVE VALIDATION
    firstName.addEventListener("input", function () {

        validateField(
            firstName,
            nameRegex,
            "First name is required",
            "Only alphabets allowed"
        );
    });

    lastName.addEventListener("input", function () {

        validateField(
            lastName,
            nameRegex,
            "Last name is required",
            "Only alphabets allowed"
        );
    });

    email.addEventListener("input", function () {

        validateField(
            email,
            emailRegex,
            "Email is required",
            "Enter valid email"
        );
    });

    phone.addEventListener("input", function () {

        validateField(
            phone,
            phoneRegex,
            "Phone number is required",
            "Enter valid 10 digit number"
        );
    });

    guardianName.addEventListener("input", function () {

        validateField(
            guardianName,
            nameRegex,
            "Guardian name is required",
            "Only alphabets allowed"
        );
    });

    guardianPhone.addEventListener("input", function () {

        validateField(
            guardianPhone,
            phoneRegex,
            "Guardian phone is required",
            "Enter valid 10 digit number"
        );
    });

    dob.addEventListener("change", function () {
        validateDOB();
    });

    startDate.addEventListener("change", function () {
        validateStartDate();
    });

    gender.addEventListener("change", function () {
        validateGender();
    });

    batch.addEventListener("change", function () {
        validateBatch();
    });

    // SUBMIT
    form.addEventListener("submit", function (e) {

        let isValid = true;
        let firstInvalidField = null;

        function check(validationFn, input) {

            if (!validationFn()) {

                isValid = false;

                if (!firstInvalidField) {
                    firstInvalidField = input;
                }
            }
        }

        check(() => validateField(
            firstName,
            nameRegex,
            "First name is required",
            "Only alphabets allowed"
        ), firstName);

        check(() => validateField(
            lastName,
            nameRegex,
            "Last name is required",
            "Only alphabets allowed"
        ), lastName);

        check(() => validateField(
            email,
            emailRegex,
            "Email is required",
            "Enter valid email"
        ), email);

        check(() => validateField(
            phone,
            phoneRegex,
            "Phone number is required",
            "Enter valid 10 digit number"
        ), phone);

        check(() => validateField(
            guardianName,
            nameRegex,
            "Guardian name is required",
            "Only alphabets allowed"
        ), guardianName);

        check(() => validateField(
            guardianPhone,
            phoneRegex,
            "Guardian phone is required",
            "Enter valid 10 digit number"
        ), guardianPhone);

        check(validateDOB, dob);

        check(validateStartDate, startDate);

        check(validateGender, gender);

        check(validateBatch, batch);

        if (!isValid) {

            e.preventDefault();

            firstInvalidField.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            firstInvalidField.focus();
        }

    });

});


// NAME FIELDS
const nameFields = [
    document.getElementsByName("first_name")[0],
    document.getElementsByName("last_name")[0],
    document.getElementsByName("guardian_name")[0]
];

// TEXT ONLY
nameFields.forEach(function (input) {

    input.addEventListener("input", function () {

        this.value =
            this.value.replace(/[^A-Za-z ]/g, '');

    });

});

// PHONE FIELDS
const phoneFields = [
    document.getElementsByName("phone_no")[0],
    document.getElementsByName("guardian_phone_no")[0]
];

// NUMBER ONLY
phoneFields.forEach(function (input) {

    input.addEventListener("input", function () {

        this.value =
            this.value.replace(/[^0-9]/g, '');

    });

});