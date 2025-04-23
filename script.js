function updateFilters() {
    let search = document.getElementById("searchBar").value.toLowerCase();
    let checkedTypes = Array.from(document.querySelectorAll(".filter-type:checked")).map(cb => cb.value);
    document.querySelectorAll(".plant-container").forEach(container => {
      const name = container.querySelector("img").alt.toLowerCase();
      const type = container.getAttribute("data-type");
      const matchesType = checkedTypes.includes(type);
      const matchesSearch = name.includes(search);
      container.style.display = (matchesType && matchesSearch) ? "inline-block" : "none";
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector("#overlay");
  
    document.querySelectorAll(".plant-container").forEach(c => {
      c.onclick = e => {
        e.stopPropagation();
        overlay.innerHTML = "";
        overlay.appendChild(c.querySelector("img").cloneNode());
        overlay.style.display = "flex";
      };
  
      c.oncontextmenu = e => {
        e.preventDefault();
        document.querySelectorAll(".show-tooltip").forEach(x => x.classList.remove("show-tooltip"));
        c.classList.toggle("show-tooltip");
      };
  
      let pressTimer;
      c.addEventListener("touchstart", e => {
        pressTimer = setTimeout(() => {
          document.querySelectorAll(".show-tooltip").forEach(x => x.classList.remove("show-tooltip"));
          c.classList.add("show-tooltip");
        }, 500);
      });
      c.addEventListener("touchend", () => clearTimeout(pressTimer));
    });
  
    document.onclick = () => {
      document.querySelectorAll(".show-tooltip").forEach(x => x.classList.remove("show-tooltip"));
    };
  
    overlay.onclick = e => {
      e.stopPropagation();
      overlay.style.display = "none";
    };
  
    // Initialisation des filtres
    document.getElementById("searchBar").addEventListener("input", updateFilters);
    document.querySelectorAll(".filter-type").forEach(cb => cb.addEventListener("change", updateFilters));
  });
  
  // loader
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
      document.body.style.overflow = "auto";
    }, 3000);
  });
  

  let quizImages = [];
  let correctAnswer = "";
  
  window.addEventListener("DOMContentLoaded", () => {
    quizImages = Array.from(document.querySelectorAll(".plant-container img"));
  });
  
  function launchQuiz() {
    const random = quizImages[Math.floor(Math.random() * quizImages.length)];
    document.getElementById("quizImage").src = random.src;
    document.getElementById("quizOverlay").style.display = "flex";
    correctAnswer = random.alt.split("(")[0].trim().toLowerCase();
    document.getElementById("quizInput").value = "";
    document.getElementById("quizFeedback").innerText = "";
    document.getElementById("quizSubmit").innerText = "Valider";
    document.getElementById("quizSubmit").onclick = submitQuizAnswer;
    document.getElementById("quizInput").disabled = false;
  }
  
  function submitQuizAnswer() {
    const input = document.getElementById("quizInput").value.trim().toLowerCase();
    const isCorrect = input === correctAnswer;
    const feedback = document.getElementById("quizFeedback");
    if (isCorrect) {
      feedback.innerText = "✅ Bravo ! Bonne réponse !";
    } else {
      feedback.innerText = `❌ Mauvaise réponse. C'était : ${correctAnswer}`;
    }
    document.getElementById("quizSubmit").innerText = "Rejouer";
    document.getElementById("quizSubmit").onclick = () => {
      closeQuizOverlay();
      setTimeout(() => launchQuiz(), 300);
    };
    document.getElementById("quizInput").disabled = true;
  }
  
  function closeQuizOverlay() {
    document.getElementById("quizOverlay").style.display = "none";
  }

  async function fetchWikiSummary(title) {
    const apiUrl = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Pas trouvé");
      const data = await response.json();
      return data.extract;
    } catch (e) {
      return null;
    }
  }
  
  async function fetchWikidataDescription(title) {
    const url = "https://www.wikidata.org/w/api.php";
    const params = new URLSearchParams({
      action: "wbsearchentities",
      format: "json",
      language: "fr",
      search: title,
      origin: "*"
    });
    try {
      const response = await fetch(`${url}?${params.toString()}`);
      const data = await response.json();
      if (data.search && data.search.length > 0) {
        return data.search[0].description;
      }
    } catch (e) {
      return null;
    }
  }
  
  window.addEventListener("load", async () => {
    const tooltips = document.querySelectorAll(".plant-container .tooltip");
    for (let tooltip of tooltips) {
      const name = tooltip.querySelector("strong").innerText.split("(")[0].trim();
      let summary = localStorage.getItem("wiki_" + name);
      if (summary) {
        tooltip.innerHTML = `<strong>${name}</strong><br>${summary}`;
      } else {
        const wiki = await fetchWikiSummary(name);
        if (wiki) {
          tooltip.innerHTML = `<strong>${name}</strong><br>${wiki}`;
          localStorage.setItem("wiki_" + name, wiki);
        } else {
          const wikidata = await fetchWikidataDescription(name);
          if (wikidata) {
            tooltip.innerHTML = `<strong>${name}</strong><br>${wikidata}`;
            localStorage.setItem("wiki_" + name, wikidata);
          } else {
            tooltip.innerHTML = `<strong>${name}</strong><br>Aucune information trouvée.`;
          }
        }
      }
    }
  });
  