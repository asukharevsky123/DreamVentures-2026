const profileName = document.querySelector("#profileName");
const likesInput = document.querySelector("#likesInput");
const dislikesInput = document.querySelector("#dislikesInput");
const cuisinesInput = document.querySelector("#cuisinesInput");
const saveProfileButton = document.querySelector("#saveProfileButton");
const clearProfileButton = document.querySelector("#clearProfileButton");
const profileSummary = document.querySelector("#profileSummary");

const emptyProfile = {
  name: "Our house",
  likes: [],
  dislikes: [],
  cuisines: []
};

let profile = loadProfile();

function loadProfile() {
  const saved = localStorage.getItem("vetochef-profile");

  try {
    return saved ? JSON.parse(saved) : emptyProfile;
  } catch {
    return emptyProfile;
  }
}

function splitList(value) {
  return value
    .split(/[\n,]+/)
    .map(function(item) {
      return item.trim().toLowerCase();
    })
    .filter(Boolean);
}

function showList(items) {
  const wrap = document.createElement("div");
  wrap.className = "chip-list";

  if (items.length === 0) {
    const empty = document.createElement("span");
    empty.className = "chip";
    empty.textContent = "Nothing saved yet";
    wrap.appendChild(empty);
    return wrap;
  }

  items.forEach(function(item) {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = item;
    wrap.appendChild(chip);
  });

  return wrap;
}

function fillForm() {
  profileName.value = profile.name || "Our house";
  likesInput.value = profile.likes.join(", ");
  dislikesInput.value = profile.dislikes.join(", ");
  cuisinesInput.value = profile.cuisines.join(", ");
}

function renderSummary() {
  profileSummary.innerHTML = "";

  [
    ["Likes", profile.likes],
    ["Does not like", profile.dislikes],
    ["Favorite cuisines", profile.cuisines]
  ].forEach(function(group) {
    const section = document.createElement("div");
    const title = document.createElement("h3");

    section.className = "summary-group";
    title.textContent = group[0];
    section.appendChild(title);
    section.appendChild(showList(group[1]));
    profileSummary.appendChild(section);
  });
}

saveProfileButton.addEventListener("click", function() {
  profile = {
    name: profileName.value.trim() || "Our house",
    likes: splitList(likesInput.value),
    dislikes: splitList(dislikesInput.value),
    cuisines: splitList(cuisinesInput.value)
  };

  localStorage.setItem("vetochef-profile", JSON.stringify(profile));
  renderSummary();
});

clearProfileButton.addEventListener("click", function() {
  profile = emptyProfile;
  localStorage.removeItem("vetochef-profile");
  fillForm();
  renderSummary();
});

fillForm();
renderSummary();
