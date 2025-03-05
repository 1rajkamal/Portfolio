var typed = new Typed(" .text", {
    strings: [" Full Stack Developer", " Web Developer", " UI/UX Designer"],
    typeSpeed: 50,
    backSpeed:  70,
    backDelay: 1000,
    loop: true
});
document.getElementById("sendBtn").addEventListener("click", function() {
    document.getElementById("sentMessage").classList.remove("hidden");
});



