/*
========================================
NETWORK ENGINE
Persistent module activation
========================================
*/

const Network = (() => {

    const pcbLayer = document.querySelector("#pcb-layer");
    const moduleLayer = document.querySelector("#module-layer");

    const activatedModules = new Set();

    const modules = [
        { id: "experience", label: "Professional Experience", position: "top-left" },
        { id: "projects", label: "Projects", position: "top-right" },
        { id: "hobbies", label: "Hobbies", position: "bottom-left" },
        { id: "certifications", label: "Certifications", position: "bottom-right" }
    ];

    function create() {
        createTraces();
        createModules();
        bindInteractions();
    }

    function createTraces() {
        pcbLayer.innerHTML = `
            <svg class="pcb-svg" viewBox="0 0 1000 700" preserveAspectRatio="none">
                <path class="pcb-trace" data-trace="experience"
                    d="M500 350 C390 310, 300 230, 190 150" />

                <path class="pcb-trace" data-trace="projects"
                    d="M500 350 C610 310, 700 230, 810 150" />

                <path class="pcb-trace" data-trace="hobbies"
                    d="M500 350 C390 395, 300 480, 190 550" />

                <path class="pcb-trace" data-trace="certifications"
                    d="M500 350 C610 395, 700 480, 810 550" />
            </svg>
        `;
    }

    function createModules() {
        moduleLayer.innerHTML = modules.map(module => `
            <article class="module-card module-${module.position}" data-module="${module.id}">
                <span class="module-index">${module.id.toUpperCase()}</span>
                <h3>${module.label}</h3>
                <p>Hover to activate module.</p>
            </article>
        `).join("");
    }

    function bindInteractions() {
        document.querySelectorAll(".module-card").forEach(card => {
            card.addEventListener("mouseenter", () => activate(card.dataset.module));
        });
    }

    function activate(id) {
        if (activatedModules.has(id)) return;

        activatedModules.add(id);

        document.querySelector(`[data-module="${id}"]`)?.classList.add("module-active", "module-locked");
        document.querySelector(`[data-trace="${id}"]`)?.classList.add("trace-active", "trace-locked");

        CPU.activateModulePins(id);

        if (activatedModules.size === modules.length) {
            CPU.setCoreActivated();
            moduleLayer.classList.add("all-modules-active");
            pcbLayer.classList.add("all-traces-active");
        }
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
