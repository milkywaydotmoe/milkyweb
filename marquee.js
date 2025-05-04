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
const message = `milkywaydotmoe, the home of idiocy! has at least 10 views and counting! last updated when it was updated!!`;
const updateMarquee = (message) => {
  const marqueeElement = document.getElementById("marquee");
  if (marqueeElement) {
    marqueeElement.innerHTML = wrapLettersInSpans(message);
  }
};

// Fetch data and update marquee when the page loads
updateMarquee(message);
