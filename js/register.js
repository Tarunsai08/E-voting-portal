import { database } from "./app.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import {getStorage} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("name");
  const aadharInput = document.getElementById("aadhar_no");
  const phoneInput = document.getElementById("phone_number");
  const dobInput = document.getElementById("dob");
  const form = document.querySelector("form");
  const loadingSpinner = document.getElementById("loader");
  const logintext = document.getElementById("register-button");

  logintext.style.display = "block";
  loadingSpinner.style.display = "none";

  const nameError = document.getElementById("nameError");
  const aadharError = document.getElementById("aadharError");
  const phoneError = document.getElementById("phoneError");

  nameInput.addEventListener("blur", validateName);
  aadharInput.addEventListener("blur", validateAadhar);
  phoneInput.addEventListener("blur", validatePhoneNumber);

  form.addEventListener("submit", function (event) {
    logintext.style.display = "none";
    loadingSpinner.style.display = "block";
    event.preventDefault();
    let isValid = true;
    let isValid1 = validateName();
    let isValid2 = validateAadhar();
    let isValid3 = validatePhoneNumber();
    let isValid4 = validateAge();
    isValid = isValid1 & isValid2 & isValid3 & isValid4;
    if (!isValid) {
      if (!isValid1) {
        nameError.textContent =
          "Enter a valid name. i.e name should contain only alphabets";
        nameInput.focus();
      } else if (!isValid3) {
        phoneError.textContent = "Enter a valid 10-digit phone number.";
        phoneInput.focus();
      } else if (!isValid2) {
        aadharError.textContent = "Enter a valid 12-digit Aadhar number.";
        aadharInput.focus();
      } else {
        alert("You are not eligible to vote. You must be 18 years or older.");
        dobInput.focus();
      }
      logintext.style.display = "block";
      loadingSpinner.style.display = "none";
    } else {
      console.log("hello");
      registerUser();
    }
  });
});

function validateName() {
  const nameInput = document.getElementById("name");
  const nameError = document.getElementById("nameError");

  if (!nameInput.value.match(/^[a-zA-Z\s]+$/)) {
    return false;
  } else {
    nameError.textContent = "";
    return true;
  }
}

function validateAadhar() {
  const aadharInput = document.getElementById("aadhar_no");
  const aadharError = document.getElementById("aadharError");

  if (!aadharInput.value.match(/^\d{12}$/)) {
    return false;
  } else {
    aadharError.textContent = "";
    return true;
  }
}

function validatePhoneNumber() {
  const phoneInput = document.getElementById("phone_number");
  const phoneError = document.getElementById("phoneError");

  if (!phoneInput.value.match(/^\d{10}$/)) {
    return false;
  } else {
    phoneError.textContent = "";
    return true;
  }
}

function validateAge() {
  const dobInput = document.getElementById("dob");
  const dob = new Date(dobInput.value);
  const age = new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970;

  if (age < 18) {
    return false;
  }

  return true;
}

const registerUser = async () => {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone_number").value;
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("gender").value;
  const aadhar = document.getElementById("aadhar_no").value;
  const region = document.getElementById("current_region").value;
  const photoFile = document.getElementById("photo").files[0];
  const signatureFile = document.getElementById("signature").files[0];
  const registerError = document.getElementById("registerError");
  const loadingSpinner = document.getElementById("loader");
  const logintext = document.getElementById("register-button");
  console.log("1");
  const myCollection = collection(database, "myCollection");
  const dataToAdd = {
    Name: name,
    Phone_number: phone,
    Date_of_birth: dob,
    Gender: gender,
    Aadhar_number: aadhar,
    Region: region,
    hasVoted: false
  };
  try {
    let docRef1;
    if(await userAlreadyExists(phone,aadhar))
    {
      logintext.style.display = "block";
      loadingSpinner.style.display = "none";
      registerError.innerText = "The user already exists, please try to login";
    }
    else{
    await addDoc(myCollection, dataToAdd)
      .then((docRef) => {
        docRef1 = docRef
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        logintext.style.display = "block";
        loadingSpinner.style.display = "none";
        console.error("Error adding document: ", error);
      });
    // console.log("2");
    // const photoUrl = await uploadFileToStorage(
    //   photoFile,
    //   `users/${docRef1}/photo.jpg`
    // );
    // console.log("3");
    // const signatureUrl = await uploadFileToStorage(
    //   signatureFile,
    //   `users/${docRef1}/signature.jpg`
    // );
    // console.log("4");
    // await docRef.update({
    //   photoUrl,
    //   signatureUrl,
    // });
      console.log("Registration successful!");
      window.location.href = "../html/login.html";
    }
  } catch (error) {
    logintext.style.display = "block";
    loadingSpinner.style.display = "none";
    console.error("Error registering user:", error);
    alert("Registration failed. Please try again later.");
  }
};


const uploadFileToStorage = (file, storagePath) => {
  return new Promise(async (resolve, reject) => {
    const storage = firebase.Storage();
    const storageRef = storage.ref(storagePath);
    try {
      console.log("hello1");
      const snapshot = await storageRef.put(file);
      console.log("hello2");
      const downloadURL = await snapshot.ref.getDownloadURL();
      console.log("hello4");
      resolve(downloadURL);
      console.log("hello5");
    } catch (error) {
      reject(error);
    }
  });
};

const userAlreadyExists = async (phone,aadhar) => {
      try {
        const querySnapshot = await getDocs(
          collection(database, "myCollection")
        );
        let userExists = false;
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (
            userData.Aadhar_number === aadhar &&
            userData.Phone_number === phone 
          ) {
            userExists = true;
          }
        });

        return userExists;
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        return false;
      }
}
