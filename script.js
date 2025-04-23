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
  