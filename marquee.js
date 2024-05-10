const fetchDataAndUpdateMessage = async () => {
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

const wrapLettersInSpans = (text) => {
  let result = "";
  let delay = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === " ") {
      result += "&nbsp;";
    } else {
      result += `<span style="animation-delay: ${delay}s">${char}</span>`;
      delay += 0.1;
    }
  }
  return result;
};

const updateMarquee = (message) => {
  const marqueeElement = document.getElementById("marquee");
  marqueeElement.innerHTML = wrapLettersInSpans(message);
};

fetchDataAndUpdateMessage();