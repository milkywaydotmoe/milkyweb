const warningElement = document.querySelector(".content-warning")
const hasAccepted = localStorage.getItem("accepted")
if(hasAccepted) {
	warningElement.classList.add("hidden")	
}
else {
	const acceptButton = warningElement.querySelector("button.accept")
	const declineButton = warningElement.querySelector("button.decline")
	acceptButton.addEventListener('click', () => {
		localStorage.setItem("accepted", true)
		warningElement.classList.add("hidden")	
	})
	declineButton.addEventListener('click', () => {
		history.back();
	})
}
console.log("Initiated flashing lights consent")