// Function to wrap each letter of the text in span tags with animation delay
const wrapLettersInSpans = (text) => {
  let result = "";
  let delay = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === " ") {
      result += "&nbsp;";
    } else {
      result += `<span style="animation-delay: ${delay}s">${char}</span>`;
      delay += -0.1;
    }
  }
  return result;
};

// Function to update the marquee element with the provided message
const updateMarquee = (message) => {
  const marqueeElement = document.getElementById("marquee");
  if (marqueeElement) {
    marqueeElement.innerHTML = wrapLettersInSpans(message);
  }
};

// Function to fetch data and update the marquee
const fetchDataAndUpdateMessage = async () => {
  // Display placeholder message
  const placeholderMessage = "Now fetching Nekoweb data... Please wait patiently, catgirls are resting.";
  updateMarquee(placeholderMessage);

  try {
    const response = await fetch("https://nekoweb.org/api/site/info/milkyway");
    const data = await response.json();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const updatedAt = new Date(data.updated_at).toLocaleString("en-US", { timeZone });
    const message = `MiLKYWay Systems, powered by autism!! now at ${data.views} views and counting last updated ${updatedAt}`;
    updateMarquee(message);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Fetch data and update marquee when the page loads
fetchDataAndUpdateMessage();
