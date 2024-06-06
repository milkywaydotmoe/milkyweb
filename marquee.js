const fetchDataAndUpdateMessage = async () => {
  const placeholderMessage = "Now fetching Nekoweb data... Please wait patiently, catgirls are resting.";
  updateMarquee(placeholderMessage); // Display placeholder message
  
  try {
    const response = await fetch("https://nekoweb.org/api/site/info/milkyway");
    
    if(response.status === 429) {
      // If status is 429, wait for a certain amount of time and retry
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds (adjust this value as needed)
      return fetchDataAndUpdateMessage(); // Retry the request
    }
    
    const data = await response.json();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const updatedAt = new Date(data.updated_at).toLocaleString("en-US", { timeZone });
    const message = `MiLKYWay Systems, powered by autism!! now at ${data.views} views and counting last updated ${updatedAt}`;
    updateMarquee(message); // Update marquee with fetched data
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Immediately display placeholder message when the page loads
fetchDataAndUpdateMessage();
