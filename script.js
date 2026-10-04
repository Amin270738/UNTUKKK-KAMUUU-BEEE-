// @ts-nocheck
/* =====================================================
   OUR LITTLE STORY
   SCRIPT.JS
===================================================== */


/* ================= SETTINGS ================= */

const TOTAL_PHOTOS = 30;

const photoFiles = Array.from(
    { length: TOTAL_PHOTOS },
    (_, i) => `images/foto${String(i + 1).padStart(2, "0")}.jpg`
);


/* ================= ELEMENTS ================= */

const loadingScreen = document.getElementById("loadingScreen");
const readyScreen = document.getElementById("readyScreen");

const loadingProgress = document.getElementById("loadingProgress");
const loadingNumber = document.getElementById("loadingNumber");
const loadingText = document.getElementById("loadingText");

const openButton = document.getElementById("openButton");

const story = document.getElementById("story");
const backgroundPhoto = document.getElementById("backgroundPhoto");

const photoWall = document.getElementById("photoWall");

const finalButton = document.getElementById("finalButton");
const finalScene = document.getElementById("finalScene");

const replayButton = document.getElementById("replayButton");

const backgroundMusic = document.getElementById("backgroundMusic");

const photoModal = document.getElementById("photoModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

const particles = document.getElementById("particles");


/* ================= STATE ================= */

let currentBackground = 0;
let backgroundTimer;

let currentScene = null;


/* =====================================================
   PARTICLES
===================================================== */

function createParticles() {

    if (!particles) return;

    particles.innerHTML = "";

    for (let i = 0; i < 28; i++) {

        const particle = document.createElement("div");

        particle.className = "particle";

        particle.style.left = Math.random() * 100 + "%";

        particle.style.animationDuration =
            (7 + Math.random() * 10) + "s";

        particle.style.animationDelay =
            (-Math.random() * 10) + "s";

        const size = 1 + Math.random() * 3;

        particle.style.width = size + "px";
        particle.style.height = size + "px";

        particles.appendChild(particle);
    }
}

createParticles();


/* =====================================================
   CINEMATIC LOADING
===================================================== */

let progress = 0;

const loadingMessages = [
    "Preparing something special...",
    "Collecting little memories...",
    "Adding a little magic...",
    "Almost ready...",
    "Just for you..."
];

function startLoading() {

    const loadingInterval = setInterval(() => {

        progress++;

        loadingProgress.style.width = progress + "%";
        loadingNumber.textContent = progress;

        if (progress % 20 === 0) {

            const index = Math.min(
                Math.floor(progress / 20),
                loadingMessages.length - 1
            );

            loadingText.textContent =
                loadingMessages[index];
        }

        if (progress >= 100) {

            clearInterval(loadingInterval);

            loadingText.textContent =
                "Everything is ready ♡";

            setTimeout(() => {

                loadingScreen.classList.remove("active");
                readyScreen.classList.add("active");

            }, 1000);
        }

    }, 35);
}

startLoading();


/* =====================================================
   BACKGROUND PHOTO
===================================================== */

function changeBackground(index) {

    if (!backgroundPhoto) return;

    backgroundPhoto.style.opacity = "0";

    setTimeout(() => {

        backgroundPhoto.style.backgroundImage =
            `url("${photoFiles[index]}")`;

        backgroundPhoto.style.opacity = "0.48";

        currentBackground = index;

    }, 700);
}


function startBackgroundSlideshow() {

    clearInterval(backgroundTimer);

    backgroundTimer = setInterval(() => {

        currentBackground++;

        if (currentBackground >= photoFiles.length) {
            currentBackground = 0;
        }

        changeBackground(currentBackground);

    }, 5000);
}


/* =====================================================
   OPEN STORY
===================================================== */

openButton.addEventListener("click", () => {

    /* Musik mulai setelah user menekan tombol */
    backgroundMusic.volume = 0.55;

    backgroundMusic.play().catch(() => {
        console.log("Music needs another interaction.");
    });


    /* Hilangkan READY */
    readyScreen.classList.remove("active");


    /* Background mulai bergerak */
    startBackgroundSlideshow();


    /* Tampilkan scene pertama */
    setTimeout(() => {

        story.style.display = "block";

        showScene("scene1");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, 800);

});


/* =====================================================
   SCENE SYSTEM
===================================================== */

function hideAllScenes() {

    document.querySelectorAll(".story-screen").forEach(scene => {
        scene.classList.remove("active");
    });

    const memoryIntro =
        document.getElementById("memoryIntro");

    if (memoryIntro) {
        memoryIntro.classList.remove("active");
    }

    const memoryWorld =
        document.getElementById("memoryWorld");

    if (memoryWorld) {
        memoryWorld.classList.remove("active");
    }

    finalScene.classList.remove("active");
}


function showScene(sceneId) {

    hideAllScenes();

    const scene =
        document.getElementById(sceneId);

    if (!scene) return;

    scene.classList.add("active");

    currentScene = sceneId;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   NEXT BUTTONS
===================================================== */

document.querySelectorAll(".next-button").forEach(button => {

    button.addEventListener("click", () => {

        const nextScene =
            button.dataset.next;

        if (nextScene === "memoryWorld") {

            hideAllScenes();

            const memoryWorld =
                document.getElementById("memoryWorld");

            memoryWorld.classList.add("active");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            createPhotoWall();

        } else {

            showScene(nextScene);

        }

    });

});


/* =====================================================
   PHOTO WALL
===================================================== */

function createPhotoWall() {

    if (!photoWall) return;

    photoWall.innerHTML = "";

    photoFiles.forEach((photo, index) => {

        const card =
            document.createElement("div");

        card.className = "memory-card";

        const rotation =
            (Math.random() * 5 - 2.5).toFixed(2);

        card.style.setProperty(
            "--rotation",
            rotation + "deg"
        );

        card.style.transitionDelay =
            (index * 0.07) + "s";

        card.innerHTML = `
            <div class="memory-card-inner">

                <img
                    src="${photo}"
                    alt="Memory ${index + 1}"
                    loading="lazy"
                >

                <div class="memory-number">
                    MEMORY ${String(index + 1).padStart(2, "0")}
                </div>

            </div>
        `;

        card.addEventListener("click", () => {

            openPhoto(
                photo,
                index + 1
            );

        });

        photoWall.appendChild(card);

    });


    revealPhotos();
}


/* =====================================================
   REVEAL PHOTOS
===================================================== */

function revealPhotos() {

    const cards =
        document.querySelectorAll(".memory-card");

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


    cards.forEach(card => {

        observer.observe(card);

    });
}


/* =====================================================
   3D TILT EFFECT
===================================================== */

document.addEventListener("pointermove", event => {

    const card =
        event.target.closest(".memory-card");

    if (!card) return;

    const rect =
        card.getBoundingClientRect();

    const x =
        event.clientX - rect.left;

    const y =
        event.clientY - rect.top;

    const centerX =
        rect.width / 2;

    const centerY =
        rect.height / 2;

    const rotateY =
        ((x - centerX) / centerX) * 5;

    const rotateX =
        ((centerY - y) / centerY) * 5;

    const inner =
        card.querySelector(".memory-card-inner");

    if (inner) {

        inner.style.transform =
            `perspective(800px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateZ(25px)
             scale(1.02)`;

    }

});


document.addEventListener("pointerout", event => {

    const card =
        event.target.closest(".memory-card");

    if (!card) return;

    const inner =
        card.querySelector(".memory-card-inner");

    if (inner) {

        inner.style.transform = "";

    }

});


/* =====================================================
   PHOTO MODAL
===================================================== */

function openPhoto(photo, number) {

    modalImage.src = photo;

    modalTitle.textContent =
        `MEMORY ${String(number).padStart(2, "0")}`;

    modalText.textContent =
        getMemoryText(number);

    photoModal.classList.add("active");

    document.body.style.overflow = "hidden";
}


function getMemoryText(number) {

    const messages = [
        "One little moment worth remembering. ♡",
        "A small memory that still feels special.",
        "Some moments are simply beautiful.",
        "Another little piece of the story.",
        "A memory I would keep forever.",
        "One of those moments worth smiling about.",
        "A little moment, a lot of meaning.",
        "Some memories never really fade.",
        "Just another reason to smile. ♡",
        "A moment that deserves to be remembered.",
        "One more little chapter.",
        "A memory hidden inside a photograph.",
        "Another beautiful little moment.",
        "The kind of memory worth keeping.",
        "A tiny moment with a big feeling."
    ];

    return messages[
        (number - 1) % messages.length
    ];
}


function closePhoto() {

    photoModal.classList.remove("active");

    document.body.style.overflow = "";
}


closeModal.addEventListener(
    "click",
    closePhoto
);


photoModal.addEventListener(
    "click",
    event => {

        if (event.target === photoModal) {
            closePhoto();
        }

    }
);


/* =====================================================
   FINAL SURPRISE
===================================================== */

finalButton.addEventListener("click", () => {

    const memoryWorld =
        document.getElementById("memoryWorld");

    memoryWorld.classList.remove("active");

    setTimeout(() => {

        finalScene.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        createHeartExplosion();

    }, 500);

});


/* =====================================================
   HEART EXPLOSION
===================================================== */

function createHeartExplosion() {

    const hearts = [
        "♡",
        "♥",
        "✦",
        "✧",
        "⋆"
    ];

    for (let i = 0; i < 25; i++) {

        const heart =
            document.createElement("div");

        heart.textContent =
            hearts[Math.floor(
                Math.random() * hearts.length
            )];

        heart.style.position = "fixed";

        heart.style.left = "50%";
        heart.style.top = "50%";

        heart.style.zIndex = "200";

        heart.style.pointerEvents = "none";

        heart.style.color =
            i % 2 === 0
                ? "#ffd1e0"
                : "#ffffff";

        heart.style.fontSize =
            (12 + Math.random() * 20) + "px";

        document.body.appendChild(heart);

        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            120 + Math.random() * 300;

        const x =
            Math.cos(angle) * distance;

        const y =
            Math.sin(angle) * distance;

        heart.animate(
            [
                {
                    transform:
                        "translate(-50%, -50%) scale(0)",
                    opacity: 0
                },
                {
                    transform:
                        "translate(-50%, -50%) scale(1)",
                    opacity: 1,
                    offset: 0.15
                },
                {
                    transform:
                        `translate(
                            calc(-50% + ${x}px),
                            calc(-50% + ${y}px)
                        )
                        scale(0.5)`,
                    opacity: 0
                }
            ],
            {
                duration:
                    1800 + Math.random() * 1200,
                easing:
                    "cubic-bezier(.2,.8,.2,1)"
            }
        );

        setTimeout(() => {
            heart.remove();
        }, 3200);

    }

}


/* =====================================================
   REPLAY
===================================================== */

replayButton.addEventListener("click", () => {

    location.reload();

});


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closePhoto();

    }

});


/* =====================================================
   PRELOAD PHOTOS
===================================================== */

function preloadPhotos() {

    photoFiles.forEach(photo => {

        const img =
            new Image();

        img.src = photo;

    });

}

preloadPhotos();