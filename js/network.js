/*
========================================
NETWORK ENGINE
Creates the four inactive PCB branches
========================================
*/

const Network = (() => {

    const pcbLayer = document.querySelector("#pcb-layer");
    const moduleLayer = document.querySelector("#module-layer");

    const modules = [
        {
            id: "experience",
            label: "Professional Experience",
            position: "top-left"
        },
        {
            id: "projects",
            label: "Projects",
            position: "top-right"
        },
        {
            id: "hobbies",
            label: "Hobbies",
            position: "bottom-left"
        },
        {
            id: "certifications",
            label: "Certifications",
            position: "bottom-right"
        }
    ];

    function create() {
        createTraces();
        createModules();
    }

    function createTraces() {
        pcbLayer.innerHTML = `
            <svg class="pcb-svg" viewBox="0 0 1000 700" preserveAspectRatio="none">

                <path class="pcb-trace trace-experience"
                    d="M500 350 C390 310, 300 230, 190 150" />

                <path class="pcb-trace trace-projects"
                    d="M500 350 C610 310, 700 230, 810 150" />

                <path class="pcb-trace trace-hobbies"
                    d="M500 350 C390 395, 300 480, 190 550" />

                <path class="pcb-trace trace-certifications"
                    d="M500 350 C610 395, 700 480, 810 550" />

            </svg>
        `;
    }

    function createModules() {
        moduleLayer.innerHTML = modules.map(module => `
            <article class="module-card module-${module.position}" data-module="${module.id}">

                <span class="module-index">
                    ${module.id.toUpperCase()}
                </span>

                <h3>${module.label}</h3>

                <p>Module locked. Awaiting interaction.</p>

            </article>
        `).join("");
    }

    function show() {
        pcbLayer.classList.add("network-visible");
        moduleLayer.classList.add("modules-visible");
    }

    return {
        create,
        show
    };

})();
