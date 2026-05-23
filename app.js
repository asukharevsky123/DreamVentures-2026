const defaultVetoes = [
  { item: "mushrooms", person: "Jordan" },
  { item: "spicy", person: "Maya" },
  { item: "shellfish", person: "Sam" }
];

const meals = [
  {
    name: "Lemon salmon bowls",
    note: "Rice, salmon, cucumber, carrots, and lemon yogurt sauce.",
    tags: ["salmon", "rice", "mild", "pescatarian"],
    why: "Fits the rules without asking you to recalculate dinner."
  },
  {
    name: "Turkey taco skillet",
    note: "Ground turkey, beans, peppers, cheese, and warm tortillas.",
    tags: ["turkey", "beans", "peppers", "mild"],
    why: "A safe middle-ground dinner for a tired weeknight."
  },
  {
    name: "Mushroom risotto",
    note: "Creamy rice with mushrooms, parmesan, and herbs.",
    tags: ["mushrooms", "rice", "vegetarian"],
    why: "Comfort food, but only if mushrooms are allowed."
  },
  {
    name: "Spicy shrimp noodles",
    note: "Noodles, shrimp, chili sauce, scallions, and lime.",
    tags: ["spicy", "shellfish", "noodles"],
    why: "Quick, but it depends on spice and shellfish being okay."
  },
  {
    name: "Friday pizza night",
    note: "Cheese pizza with side salad and optional toppings.",
    tags: ["pizza", "vegetarian", "mild"],
    why: "Keeps the easy fallback available when it fits."
  },
  {
    name: "Chicken pesto pasta",
    note: "Pasta, chicken, pesto, peas, and parmesan.",
    tags: ["chicken", "pasta", "mild"],
    why: "Simple, familiar, and low-decision."
  }
];

const vetoForm = document.querySelector("#vetoForm");
const vetoInput = document.querySelector("#vetoInput");
const personSelect = document.querySelector("#personSelect");
const vetoList = document.querySelector("#vetoList");
const mealGrid = document.querySelector("#mealGrid");
const mealCount = document.querySelector("#mealCount");
const resetButton = document.querySelector("#resetButton");

let vetoes = loadVetoes();

function loadVetoes() {
  const saved = localStorage.getItem("vetochef-vetoes");
  try {
    return saved ? JSON.parse(saved) : defaultVetoes;
  } catch {
    return defaultVetoes;
  }
}

function saveVetoes() {
  localStorage.setItem("vetochef-vetoes", JSON.stringify(vetoes));
}

function mealIsAllowed(meal) {
  return !vetoes.some(function(veto) {
    return meal.tags.includes(veto.item.toLowerCase());
  });
}

function renderVetoes() {
  vetoList.innerHTML = "";

  vetoes.forEach(function(veto, index) {
    const item = document.createElement("div");
    const textWrap = document.createElement("div");
    const vetoName = document.createElement("strong");
    const vetoPerson = document.createElement("span");
    const removeButton = document.createElement("button");

    item.className = "veto-item";
    vetoName.textContent = veto.item;
    vetoPerson.textContent = "Remembered for " + veto.person;
    removeButton.type = "button";
    removeButton.textContent = "x";
    removeButton.setAttribute("aria-label", "Remove " + veto.item);

    textWrap.appendChild(vetoName);
    textWrap.appendChild(vetoPerson);
    item.appendChild(textWrap);
    item.appendChild(removeButton);

    removeButton.addEventListener("click", function() {
      vetoes.splice(index, 1);
      saveVetoes();
      render();
    });

    vetoList.appendChild(item);
  });
}

function renderMeals() {
  const allowedMeals = meals.filter(mealIsAllowed);
  mealGrid.innerHTML = "";
  mealCount.textContent = allowedMeals.length + " fit";

  if (allowedMeals.length === 0) {
    mealGrid.innerHTML = `
      <div class="empty-state">
        No meals fit the rules yet. Remove a rule or add more recipes to the demo.
      </div>
    `;
    return;
  }

  allowedMeals.forEach(function(meal) {
    const card = document.createElement("article");
    card.className = "meal-card";
    card.innerHTML = `
      <div class="meal-top">
        <h3>${meal.name}</h3>
        <p>${meal.note}</p>
      </div>
      <div class="meal-body">
        <div class="tag-row"></div>
        <p class="why-text">${meal.why}</p>
      </div>
    `;

    const tagRow = card.querySelector(".tag-row");
    meal.tags.forEach(function(tag) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Veto " + tag;
      button.addEventListener("click", function() {
        addVeto(tag, "Demo user");
      });
      tagRow.appendChild(button);
    });

    mealGrid.appendChild(card);
  });
}

function addVeto(item, person) {
  const cleanItem = item.trim().toLowerCase();
  if (!cleanItem) {
    return;
  }

  const alreadyExists = vetoes.some(function(veto) {
    return veto.item.toLowerCase() === cleanItem;
  });

  if (!alreadyExists) {
    vetoes.push({ item: cleanItem, person: person });
    saveVetoes();
  }

  vetoInput.value = "";
  render();
}

function render() {
  renderVetoes();
  renderMeals();
}

vetoForm.addEventListener("submit", function(event) {
  event.preventDefault();
  addVeto(vetoInput.value, personSelect.value);
});

resetButton.addEventListener("click", function() {
  vetoes = defaultVetoes.slice();
  saveVetoes();
  render();
});

render();
