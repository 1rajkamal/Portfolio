window.addEventListener("DOMContentLoaded", () => {
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = scrollY / docHeight;
  const hue = 260 + scrollPercent * 120;
  document.documentElement.style.setProperty("--hue", hue);
});
  const enterBtn = document.getElementById("enterBtn");
  const intro = document.getElementById("intro");
  const hero = document.getElementById("hero");
  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      intro.style.display = "none";
      hero.classList.remove("hidden");
      hero.style.opacity = "1";
      document.querySelector(".header").classList.add("show");
      window.scrollTo(0, 0);
    });
  }
  const lines = document.querySelectorAll(".story-line");
  window.addEventListener("scroll", () => {
    const triggerPoint = window.innerHeight * 0.85;
    lines.forEach(line => {
      if (line.getBoundingClientRect().top < triggerPoint) {
        line.classList.add("show");
      }
    });
  });
  const cursor = document.querySelector(".energy-cursor");
  const trail = document.querySelector(".cursor-trail");
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  window.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";
    }
  });
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    if (trail) {
      trail.style.left = trailX + "px";
      trail.style.top = trailY + "px";
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
  const magneticItems = document.querySelectorAll(".memory-card, button, a");
  magneticItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
      if (cursor) {
        cursor.style.width = "40px";
        cursor.style.height = "40px";
      }
    });
    item.addEventListener("mouseleave", () => {
      if (cursor) {
        cursor.style.width = "18px";
        cursor.style.height = "18px";
      }
      item.style.transform = "translate(0,0)";
    });
    item.addEventListener("mousemove", e => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
  });
  const choiceButtons = document.querySelectorAll("#choice button");
  const choiceResult = document.getElementById("choice-result");
  choiceButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const choice = btn.dataset.choice;
      choiceResult.textContent =
        choice === "try"
          ? "I chose to continue. Even when it was hard."
          : "I thought about quitting. But this story didn’t end there.";
      choiceResult.style.opacity = "1";
    });
  });
  window.addEventListener("click", e => {
    for (let i = 0; i < 8; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = e.clientX + "px";
      p.style.top = e.clientY + "px";
      p.style.setProperty("--dx", (Math.random() - 0.5) * 120 + "px");
      p.style.setProperty("--dy", (Math.random() - 0.5) * 120 + "px");
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 600);
    }
  });
  const burstBtn = document.getElementById("burstBtn");
  const skills = document.querySelectorAll(".skill");
  const area = document.querySelector(".skills-area");
  let skillsUnlocked = false;
  if (burstBtn) {
    burstBtn.addEventListener("click", () => {
      if (skillsUnlocked) return;
      skillsUnlocked = true;
      const areaWidth = area.offsetWidth;
      const areaHeight = area.offsetHeight;
      skills.forEach((skill, i) => {
        skill.style.opacity = "1";
        skill.style.transform = "translate(-50%, -50%) scale(1)";
        setTimeout(() => {
          randomMove(skill, areaWidth, areaHeight);
        }, 100 + i * 20);
      });
    });
  }
  function randomMove(skill, areaWidth, areaHeight) {
    setInterval(() => {
      const x = (Math.random() - 0.5) * (areaWidth - 120);
      const y = (Math.random() - 0.5) * (areaHeight - 120);
      skill.style.transform = `translate(${x}px, ${y}px)`;
    }, 3000);
  }
  const projectCards = document.querySelectorAll(".project-card");
  window.addEventListener("scroll", () => {
    projectCards.forEach((card, i) => {
      if (card.getBoundingClientRect().top < window.innerHeight * 0.85) {
        setTimeout(() => card.classList.add("show"), i * 120);
      }
    });
  });
  const unlockBtn = document.getElementById("unlockCertBtn");
  const certCards = document.querySelectorAll(".cert-card");
  let certUnlocked = false;
  if (unlockBtn) {
    unlockBtn.addEventListener("click", () => {
      if (certUnlocked) return;
      certUnlocked = true;
      certCards.forEach((card, i) => {
        setTimeout(() => card.classList.add("show"), i * 150);
      });
    });
  }
  certCards.forEach(card => {
    card.addEventListener("click", () => {
      const pdf = card.getAttribute("data-pdf");
      window.open(pdf, "_blank");
    });
  });
});
const hackCards = document.querySelectorAll(".hack-card");
window.addEventListener("scroll", () => {
  hackCards.forEach((card, i) => {
    if (card.getBoundingClientRect().top < window.innerHeight * 0.85) {
      setTimeout(() => card.classList.add("show"), i * 150);
    }
  });
});
const revealBtn = document.getElementById("revealSocials");
const socials = document.querySelector(".social-links");
if (revealBtn) {
  revealBtn.addEventListener("click", () => {
    socials.classList.toggle("show");
    socials.classList.toggle("hidden");
    revealBtn.textContent =
      socials.classList.contains("show") ? "HIDE" : "REVEAL";
  });
}
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

toggle.addEventListener("click", ()=>{
  nav.classList.toggle("open");
});
const pill = document.querySelector(".nav-pill");
const links = document.querySelectorAll(".nav a");
const sections = document.querySelectorAll("section");

function movePill(el){
  const rect = el.getBoundingClientRect();
  const parent = el.parentElement.getBoundingClientRect();

  pill.style.left = (rect.left - parent.left) + "px";
  pill.style.width = rect.width + "px";
}

/* hover */
links.forEach(link=>{
  link.addEventListener("mouseenter", ()=> movePill(link));
});

/* scroll active */
window.addEventListener("scroll", ()=>{
  let current="";

  sections.forEach(sec=>{
    const top = window.scrollY;
    const offset = sec.offsetTop - 140;
    const height = sec.offsetHeight;

    if(top >= offset && top < offset + height){
      current = sec.id;
    }
  });

  links.forEach(link=>{
    if(link.getAttribute("href")==="#"+current){
      movePill(link);
    }
  });
});
