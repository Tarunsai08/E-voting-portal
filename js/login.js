import { database } from "./app.js";
import { collection,getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

let userdata = null;
document.addEventListener("DOMContentLoaded", async function () {
  const aadharInput = document.getElementById("aadhar");
  const phoneInput = document.getElementById("phone");
  const Error = document.getElementById("LoginError");
  const loadingSpinner = document.getElementById("loader");
  const logintext = document.getElementById("login-button");

  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {
      logintext.style.display = "none";
      loadingSpinner.style.display = "block";
      event.preventDefault();
      try {
        const querySnapshot = await getDocs(
          collection(database, "myCollection")
        );
        let userExists = false;
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (
            userData.Aadhar_number === aadharInput.value &&
            userData.Phone_number === phoneInput.value
          ) {
            console.log("User exists");
            userExists = true;
            localStorage.setItem("UserID",JSON.stringify(doc.id));
            localStorage.setItem('userData', JSON.stringify(userData));
            userdata = doc;
          }
        });

        if (userExists) {
          window.location.href = "../html/voting-page.html";
        } else {
          console.log("User not found");
          Error.innerText = "No such user exists";
          logintext.style.display = "block";
          loadingSpinner.style.display = "none";
        }
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        logintext.style.display = "none";
        loadingSpinner.style.display = "none";
      }
    });
});
