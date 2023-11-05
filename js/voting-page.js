import { database } from "./app.js";
import {
  collection,getDocs,updateDoc,doc,increment,getDoc
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
  const votePopup = document.getElementById("vote-popup");
  const voteNowButton = document.getElementById("vote-now-button");
  const closePopupButton = document.getElementById("close-popup");

  voteNowButton.addEventListener("click", function () {
    disableradiobuttons();
    votePopup.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  closePopupButton.addEventListener("click", function () {
    votePopup.style.display = "none";
    document.body.style.overflow = "auto";
  });

  const voteButton = document.getElementById("vote-button");
  const selectError = document.getElementById("select-Error");

  voteButton.addEventListener("click", async function () {
    let hasSelected = false;
    const radioButtons = document.querySelectorAll(`input[name="party"]:checked`);
    if (radioButtons.length === 0) {
      selectError.innerText = "Please vote for someone";
    } else {
      try {
        votePopup.style.display = "none";
        const docRef1 = doc(database,"myCollection",userID);
        try{
          await updateDoc(docRef1, {
            hasVoted: true
          })
          disableradiobuttons(docRef1)
        }
        catch(error){
          console.error("Error updating document: ", error);
        }
        const querySnapshot = await getDocs(collection(database, "partyMLA"));
        querySnapshot.forEach(async (docu) => {
          const data = docu.data();
          if (data.Region === user.Region) {
            console.log(docu.id);
            const docRef = doc(database, "partyMLA", docu.id);
            const JanaSena = document.getElementById("vote-janasena");
            const TDP = document.getElementById("vote-tdp");
            const YSRCP = document.getElementById("vote-ysrcp");
            let selectedParty = null;
            if(JanaSena.checked){
              selectedParty = "JanaSena_Votes";
            }
            else if(TDP.checked){
              selectedParty = "TDP_Votes";
            }
            else if(YSRCP.checked){
              selectedParty = "YSRCP_Votes";
            }
            try {
              await updateDoc(docRef, {
                [selectedParty]: increment(1)
              });
              votePopup.style.display = "none";
              document.body.style.overflow = "auto";
              console.log("Voting successfully updated!");
            } catch (error) {
              console.error("Error updating document: ", error);
            }
          }
        });
        votePopup.style.display = "none";
        document.body.style.overflow = "auto";
        selectError.innerText = "";
      } catch (error) {
        console.error("Error querying documents: ", error);
      }
    }
  });
});

var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 2000);
}

const userDataJson = localStorage.getItem("userData");
const user = JSON.parse(userDataJson);
const userID = JSON.parse(localStorage.getItem("UserID"));

if (user) {
  document.getElementById("user-name").innerText = user.Name;
} else {
  console.log("User data not found in localStorage");
}
async function loadPartyMLA(){
  try {
    const querySnapshot = await getDocs(collection(database, "partyMLA"));
    let regionExists = false;
    await querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.Region === user.Region) {
        const JanaSena = document.getElementById("JanaSena");
        const TDP = document.getElementById("TDP");
        const YSRCP = document.getElementById("YSRCP");
        JanaSena.innerText = userData.JanaSena;
        TDP.innerText = userData.TDP;
        YSRCP.innerText = userData.YSRCP;
        regionExists = true;
        if (user.hasVoted) {
          const radioButtons = document.querySelectorAll(`input[type="radio"][name="party"]`);
          radioButtons.forEach((radioButton) => {
            radioButton.disabled = true;
          });
        }
      }
    });

    if (regionExists) {
      console.log("region exists");
    } else {
      console.log("region not found");
      Error.innerText = "No such region exists";
    }
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
  }
}

function disableradiobuttons(){
  const docRef1 = doc(database,"myCollection",userID);
  const voteButton = document.getElementById("vote-button");
  const selectError = document.getElementById("select-Error");
  getDoc(docRef1)
  .then((doc) => {
    if (doc.exists()) {
      const userData = doc.data();
      if (userData.hasVoted){
        const radioButtons = document.querySelectorAll(`input[type="radio"][name="party"]`);
        radioButtons.forEach((radioButton) => {
          radioButton.disabled = true;
        });
        voteButton.style.display = "none";
        selectError.innerText = "You have already voted";
      }
    } else {
      console.log("Document does not exist for userID:", userID);
    }
  })
  .catch((error) => {
    console.error("Error fetching document:", error);
  });
}

loadPartyMLA();
disableradiobuttons();
