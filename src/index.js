document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const goodDogFilter = document.getElementById("good-dog-filter");
  
    // Step 2: Add Pups to Dog Bar
    fetch("http://localhost:3000/pups")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((dog) => {
          const span = document.createElement("span");
          span.innerText = dog.name;
          span.dataset.id = dog.id; // Add the data-id attribute
          dogBar.appendChild(span);
        });
      });
  
    // Step 3: Show More Info about Each Pup
    dogBar.addEventListener("click", (event) => {
      if (event.target.tagName === "SPAN") {
        const dogId = event.target.dataset.id;
        fetch(`http://localhost:3000/pups/${dogId}`)
          .then((response) => response.json())
          .then((dog) => {
            dogInfo.innerHTML = `
              <img src="${dog.image}" alt="Dog Image" />
              <h2>${dog.name}</h2>
              <button id="dog-goodness" data-id="${dog.id}" data-goodness="${dog.isGoodDog}">
                ${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}
              </button>
            `;
          });
      }
    });
  
    // Step 4: Toggle Good Dog
    dogInfo.addEventListener("click", (event) => {
      if (event.target.id === "dog-goodness") {
        const dogId = event.target.dataset.id;
        const newGoodness = event.target.dataset.goodness === "true" ? false : true;
        const patchData = {
          isGoodDog: newGoodness
        };
  
        fetch(`http://localhost:3000/pups/${dogId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(patchData)
        })
          .then((response) => response.json())
          .then((updatedDog) => {
            event.target.dataset.goodness = updatedDog.isGoodDog;
            event.target.innerText = updatedDog.isGoodDog ? "Good Dog!" : "Bad Dog!";
          });
      }
    });
  
    // Bonus! Step 5: Filter Good Dogs
    goodDogFilter.addEventListener("click", () => {
      const buttonText = goodDogFilter.innerText;
      const filterOn = buttonText.includes("ON");
      if (filterOn) {
        goodDogFilter.innerText = "Filter good dogs: OFF";
        dogBar.querySelectorAll("span").forEach((span) => {
          span.style.display = "inline-block";
        });
      } else {
        goodDogFilter.innerText = "Filter good dogs: ON";
        dogBar.querySelectorAll("span").forEach((span) => {
          const dogId = span.dataset.id;
          fetch(`http://localhost:3000/pups/${dogId}`)
            .then((response) => response.json())
            .then((dog) => {
              if (dog.isGoodDog) {
                span.style.display = "inline-block";
              } else {
                span.style.display = "none";
              }
            });
        });
      }
    });
  });
  