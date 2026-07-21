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

    // INITIAL LOAD AUTO FILL
    courseSelect.dispatchEvent(new Event("change"));

    // INPUTS
    const firstName = document.getElementsByName("first_name")[0];
    const lastName = document.getElementsByName("last_name")[0];
    const email = document.getElementsByName("email")[0];
    const phone = document.getElementsByName("phone_no")[0];
    const guardianName = document.getElementsByName("guardian_name")[0];
    const guardianPhone = document.getElementsByName("guardian_phone_no")[0];
    const dob = document.getElementById("id_dob");
    const start_date = document.getElementById("id_start_date");
    const gender = document.getElementById("id_gender");
    const address = document.getElementById("id_address");
    const course = document.getElementById("id_course");
    const batch = document.getElementById("id_batch");



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

        // APPEND INSIDE SAME FIELD CONTAINER
        input.closest("div").appendChild(error);
    }


    // REMOVE ERROR
    function removeError(input) {

        let parent = input.closest("div");

        if (!parent) return;

        let oldError =
            parent.querySelector(".custom-error");

        if (oldError) {
            oldError.remove();
        }
    }
    // VALIDATE FIELD
    function validateField(input, regex, emptyMsg, invalidMsg) {

        let value = input.value.trim();

        // EMPTY CHECK
        if (value === "") {
            showError(input, emptyMsg);
            return false;
        }

        // REGEX CHECK
        if (!regex.test(value)) {
            showError(input, invalidMsg);
            return false;
        }

        removeError(input);

        return true;
    }

    function validateSelect(input, message) {

        removeError(input);

        if (input.value.trim() === "") {

            showError(input, message);

            return false;
        }

        return true;
    }

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

    function validateStart_Date() {

        let selectedDate = new Date(start_date.value);

        let today = new Date();

        today.setHours(0, 0, 0, 0);

        removeError(start_date);

        if (start_date.value === "") {
            showError(start_date, "Start date is required");
            return false;
        }

        if (selectedDate < today) {
            showError(start_date, "Select today or future date only");
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

        let emailValue = email.value;

        if (emailValue !== "") {

            fetch(`/check-email/?email=${emailValue}`)

                .then(response => response.json())

                .then(data => {

                    const errorSpan =
                        document.getElementById("email-error");

                    if (data.exists) {

                        errorSpan.innerText =
                            "Email already exists";

                    } else {

                        errorSpan.innerText = "";

                    }

                });

        }

    });

    guardianName.addEventListener("input", function () {
        validateField(
            guardianName,
            nameRegex,
            "Guardian name is required",
            "Only alphabets allowed"
        );
    });

    phone.addEventListener("input", function () {

        validateField(
            phone,
            phoneRegex,
            "Phone number is required",
            "Enter valid 10 digit number"
        );

        let phoneValue = phone.value;

        if (phoneValue.length === 10) {

            fetch(`/check-phone/?phone=${phoneValue}`)

                .then(response => response.json())

                .then(data => {

                    const errorSpan =
                        document.getElementById("phone-error");

                    if (data.exists) {

                        errorSpan.innerText =
                            "Phone number already exists";

                    } else {

                        errorSpan.innerText = "";

                    }

                });

        }

    });

    guardianPhone.addEventListener("input", function () {

        validateField(
            guardianPhone,
            phoneRegex,
            "Guardian phone is required",
            "Enter valid 10 digit number"
        );

        let phoneValue = guardianPhone.value;

        if (phoneValue.length === 10) {

            fetch(`/check-phone/?phone=${phoneValue}`)

                .then(response => response.json())

                .then(data => {

                    const errorSpan =
                        document.getElementById("guardian-phone-error");

                    if (data.guardian_exists) {

                        errorSpan.innerText =
                            "Guardian phone already exists";

                    } else {

                        errorSpan.innerText = "";

                    }

                });

        }

    });

    dob.addEventListener("change", function () {
        validateDOB();
    });

    start_date.addEventListener("change", function () {
        validateStart_Date();
    });

    // SUBMIT VALIDATION
    form.addEventListener("submit", function (e) {

        let isValid = true;

        if (!validateField(
            firstName,
            nameRegex,
            "First name is required",
            "Only alphabets allowed"
        )) {
            isValid = false;
        }

        if (!validateField(
            lastName,
            nameRegex,
            "Last name is required",
            "Only alphabets allowed"
        )) {
            isValid = false;
        }

        if (!validateField(
            email,
            emailRegex,
            "Email is required",
            "Enter valid email"
        )) {
            isValid = false;
        }

        if (!validateField(
            phone,
            phoneRegex,
            "Phone number is required",
            "Enter valid 10 digit number"
        )) {
            isValid = false;
        }

        if (!validateField(
            guardianName,
            nameRegex,
            "Guardian name is required",
            "Only alphabets allowed"
        )) {
            isValid = false;
        }

        if (!validateField(
            guardianPhone,
            phoneRegex,
            "Guardian phone is required",
            "Enter valid 10 digit number"
        )) {
            isValid = false;
        }

        if (!validateSelect(
            gender,
            "Select gender"
        )) {
            isValid = false;
        }

        if (!validateField(
            address,
            /.+/,
            "Address is required",
            ""
        )) {
            isValid = false;
        }

        if (!validateSelect(
            course,
            "Select course"
        )) {
            isValid = false;
        }

        if (!validateSelect(
            batch,
            "Select batch"
        )) {
            isValid = false;
        }





        if (!validateDOB()) {
            isValid = false;
        }

        if (!validateStart_Date()) {
            isValid = false;
        }

        // STOP SUBMIT
        if (!isValid) {
            e.preventDefault();
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



const dobInput = document.getElementById("id_dob");
const startDateInput = document.getElementById("id_start_date");

// DOB PICKER
dobInput.addEventListener("click", function () {

    this.showPicker();

});

// START DATE PICKER
startDateInput.addEventListener("click", function () {

    this.showPicker();

});



// FILE INPUTS
const photoInput = document.getElementById("id_photo");

const idProofInput =
    document.getElementById("id_id_proof");

const certificateInput =
    document.getElementById("id_certificate");


// VALIDATE IMAGE
function validateImage(input, errorId) {

    const file = input.files[0];

    const error =
        document.getElementById(errorId);

    error.innerText = "";

    if (!file) return;

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png"
    ];

    // TYPE CHECK
    if (!allowedTypes.includes(file.type)) {

        error.innerText =
            "Only JPG, JPEG, PNG allowed";

        input.value = "";

        return;
    }

    // SIZE CHECK (2MB)
    if (file.size > 2 * 1024 * 1024) {

        error.innerText =
            "Image must be under 2MB";

        input.value = "";

        return;
    }

}


// VALIDATE DOCUMENT
function validateDocument(input, errorId) {

    const file = input.files[0];

    const error =
        document.getElementById(errorId);

    error.innerText = "";

    if (!file) return;

    const allowedExtensions = [
        ".pdf",
        ".doc",
        ".docx"
    ];

    const fileName =
        file.name.toLowerCase();

    const isValid =
        allowedExtensions.some(ext =>
            fileName.endsWith(ext)
        );

    // TYPE CHECK
    if (!isValid) {

        error.innerText =
            "Only PDF, DOC, DOCX allowed";

        input.value = "";

        return;
    }

    // SIZE CHECK (5MB)
    if (file.size > 5 * 1024 * 1024) {

        error.innerText =
            "File must be under 5MB";

        input.value = "";

        return;
    }

}


// EVENTS
photoInput.addEventListener("change", function () {

    validateImage(
        photoInput,
        "photo-error"
    );

});


idProofInput.addEventListener("change", function () {

    validateDocument(
        idProofInput,
        "idproof-error"
    );

});


certificateInput.addEventListener("change", function () {

    validateDocument(
        certificateInput,
        "certificate-error"
    );

});


document.addEventListener("DOMContentLoaded", function () {

    console.log("JS Loaded");

    const course = document.getElementById("id_course");
    const batch = document.getElementById("id_batch");

    course.addEventListener("change", function () {

        let courseId = this.value;

        console.log("Selected Course:", courseId);

        batch.innerHTML = '<option>Loading...</option>';

        fetch(`/api/get-batches/?course_id=${courseId}`)
            .then(res => res.json())
            .then(data => {

                console.log("Batch Data:", data);

                batch.innerHTML = '<option value="">Select Batch</option>';

                data.forEach(item => {
                    batch.innerHTML += `
                        <option value="${item.id}">
                            ${item.batch_name}
                        </option>
                    `;
                });

            })
            .catch(err => console.log(err));

    });

});