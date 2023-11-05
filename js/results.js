import { database } from "./app.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const overallWinnerContainer = document.getElementById("overall-winner-container");
  overallWinnerContainer.classList.add("flex", "justify-center", "items-center","m-6","mb-12");

  const resultsContainer = document.getElementById("results");

  const regions = {};

  const querySnapshot = await getDocs(collection(database, "partyMLA"));

  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    const region = userData.Region;

    if (!regions[region]) {
      regions[region] = { party: "", mla: "", votes: 0 };
    }

    const parties = ["JanaSena", "TDP", "YSRCP"];

    for (const party of parties) {
      const partyName = userData[party];
      const partyVotes = userData[`${party}_Votes`];

      if (partyVotes >= regions[region].votes) {
        regions[region].party = party;
        regions[region].mla = partyName;
        regions[region].votes = partyVotes;
      }
    }
  });

  const overallWinner = calculateOverallWinner(regions);
  const overallWinnerElement = createOverallWinnerElement(
    overallWinner.party,
    overallWinner.totalVotes,
    overallWinner.votes
  );

  // Append the overall winner element to the center-aligned container
  overallWinnerContainer.appendChild(overallWinnerElement);

  // Now, loop through the regions and add them below the overall winner.
  for (const region in regions) {
    const regionElement = createRegionElement(region, regions[region]);
    resultsContainer.appendChild(regionElement);
  }
});

function calculateOverallWinner(regions) {
  const partyVotesSum = {};
  let totalVotes = 0;
  let overallWinner = { party: "", votes: 0 };

  for (const region in regions) {
    const party = regions[region].party;
    const votes = regions[region].votes;
    totalVotes += votes;

    if (!partyVotesSum[party]) {
      partyVotesSum[party] = 0;
    }

    partyVotesSum[party] += votes;

    if (partyVotesSum[party] >= overallWinner.votes) {
      overallWinner.party = party;
      overallWinner.votes = partyVotesSum[party];
    }
  }

  overallWinner.totalVotes = totalVotes;

  return overallWinner;
}

function createRegionElement(regionName, regionData) {
  const element = document.createElement("div");
  element.classList.add(
    "bg-gradient-to-r",
    "from-green-100",
    "to-green-50",
    "p-8",
    "rounded-xl",
    "shadow-lg",
    "hover:shadow-2xl",
    "transition-shadow",
    "duration-300"
  );

  const regionHeader = document.createElement("h2");
  regionHeader.classList.add(
    "text-2xl",
    "font-extrabold",
    "text-gray-800",
    "mb-6",
    "underline",
    "decoration-blue-500",
    "decoration-4"
  );
  regionHeader.textContent = regionName;

  const winnerParty = document.createElement("div");
  winnerParty.classList.add("text-green-700", "font-bold", "text-lg");
  winnerParty.textContent = `Winning Party: ${regionData.party}`;

  const winnerName = document.createElement("div");
  winnerName.classList.add("text-blue-700", "font-bold", "font-semibold");
  winnerName.textContent = `Winner: ${regionData.mla}`;

  const votesInfo = document.createElement("div");
  votesInfo.classList.add("text-gray-800", "mt-2");
  votesInfo.textContent = `Total Votes: ${regionData.votes}`;

  element.appendChild(regionHeader);
  element.appendChild(winnerParty);
  element.appendChild(winnerName);
  element.appendChild(votesInfo);

  return element;
}

function createOverallWinnerElement(winnerParty, totalVotes, partyVotes) {
  const element = document.createElement("div");
  element.classList.add(
    "bg-gradient-to-r",
    "from-yellow-100",
    "via-yellow-300",
    "to-yellow-200",
    "p-10",
    "rounded-2xl",
    "shadow-xl",
    "hover:shadow-2xl",
    "transition-shadow",
    "duration-300",
    "border",
    "border-yellow-500",
    "border-4"
  );

  const trophyIcon = document.createElement("span");
  trophyIcon.classList.add(
    "inline-block",
    "bg-yellow-400",
    "text-yellow-700",
    "p-2",
    "rounded-full",
    "text-3xl",
    "mr-4",
    "shadow-lg"
  );
  trophyIcon.textContent = "🏆"; 

  const winnerHeader = document.createElement("h2");
  winnerHeader.classList.add(
    "text-3xl",
    "font-extrabold",
    "text-yellow-800",
    "mb-4",
    "inline-block"
  );
  winnerHeader.textContent = "Overall Winner";

  const winnerDiv = document.createElement("div");
  winnerDiv.classList.add("text-yellow-700", "font-bold", "text-xl");
  winnerDiv.textContent = `${winnerParty}`;

  const totalVotesInfo = document.createElement("div");
  totalVotesInfo.classList.add("text-yellow-800", "mt-2", "font-semibold");
  totalVotesInfo.textContent = `Total Votes: ${totalVotes.toLocaleString()}`;

  const partyVotesInfo = document.createElement("div");
  partyVotesInfo.classList.add("text-yellow-900", "mt-2", "font-semibold");
  partyVotesInfo.textContent = `Winner's Votes: ${partyVotes.toLocaleString()}`;

  element.appendChild(trophyIcon);
  element.appendChild(winnerHeader);
  element.appendChild(winnerDiv);
  element.appendChild(totalVotesInfo);
  element.appendChild(partyVotesInfo);

  return element;
}
