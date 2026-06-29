/*
========================================
NETWORK ENGINE
Persistent module activation + item details
========================================
*/

const Network = (() => {

    const pcbLayer = document.querySelector("#pcb-layer");
    const moduleLayer = document.querySelector("#module-layer");

    const activatedModules = new Set();

    const modules = [
        {
            id: "experience",
            label: "Professional Experience",
            position: "top-left",
            subtitle: "Career path",
            items: [
                {
                    title: "Alstom",
                    meta: "VIE · Lab Test Automation Engineer",
                    date: "Jun 2025 – Nov 2026 · Pittsburgh, US",
                    details: [
                        "Full-stack network analysis platform",
                        "Real-time packet capture and diagnostics",
                        "Robot Framework automation",
                        "Embedded communication systems"
                    ]
                },
                {
                    title: "Bosch",
                    meta: "Model Based & Function Development",
                    date: "Sep 2024 – Mar 2025 · Paris, FR",
                    details: [
                        "MATLAB / Simulink workflows",
                        "MCDC model coverage improvement",
                        "Simulink Design Verifier",
                        "Processor-in-the-Loop testing"
                    ]
                },
                {
                    title: "Andrice",
                    meta: "Embedded Systems Engineer Intern",
                    date: "May 2023 – Aug 2023 · Lyon, FR",
                    details: [
                        "500W power converter design",
                        "PCB development with Altium",
                        "Prototype bring-up and validation",
                        "Electrical and thermal testing"
                    ]
                }
            ]
        },
        {
            id: "projects",
            label: "Projects",
            position: "top-right",
            subtitle: "Engineering missions",
            items: [
                {
                    title: "Autonomous Waste Collection",
                    meta: "Robotic Surface Vehicle",
                    date: "May 2024 – Aug 2024 · Heriot-Watt",
                    details: [
                        "Navigation and control algorithms",
                        "Autonomous surface vehicle",
                        "Path planning strategy evaluation",
                        "Sensor and actuator integration"
                    ]
                },
                {
                    title: "Voix de l’Univers",
                    meta: "Embedded signal detection system",
                    date: "Apr 2022 – Jun 2022 · ESIEE Paris",
                    details: [
                        "Electromagnetic signal detection",
                        "Circuit and PCB design",
                        "Simulation and measurement",
                        "Real-world signal acquisition"
                    ]
                }
            ]
        },
        {
            id: "hobbies",
            label: "Hobbies",
            position: "bottom-left",
            subtitle: "Beyond engineering",
            items: [
                {
                    title: "Competitive Rugby",
                    meta: "15 years of practice",
                    date: "Teamwork · Discipline · Resilience",
                    details: [
                        "Long-term competitive sport background",
                        "Strong team mindset",
                        "Pressure management",
                        "Physical and mental discipline"
                    ]
                },
                {
                    title: "Robotics & Aerospace",
                    meta: "Technical curiosity",
                    date: "Autonomy · Systems · Innovation",
                    details: [
                        "Interest in autonomous systems",
                        "Embedded software and robotics",
                        "Aerospace engineering culture",
                        "Continuous technical learning"
                    ]
                },
                {
                    title: "International Travel",
                    meta: "Global mindset",
                    date: "France · UK · US",
                    details: [
                        "International academic path",
                        "Adaptability to new environments",
                        "Cross-cultural communication",
                        "Professional mobility"
                    ]
                }
            ]
        },
        {
            id: "certifications",
            label: "Certifications",
            position: "bottom-right",
            subtitle: "Validated skills",
            items: [
                {
                    title: "TOEIC",
                    meta: "English certification",
                    date: "2023 · Score: 905",
                    details: [
                        "Professional English proficiency",
                        "International work environment",
                        "Technical communication",
                        "Cross-functional collaboration"
                    ]
                },
                {
                    title: "Voltaire",
                    meta: "French certification",
                    date: "Written communication",
                    details: [
                        "Strong written French level",
                        "Professional documentation",
                        "Clear technical reporting",
                        "Structured communication"
                    ]
                }
            ]
        }
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

                <div class="module-header">
                    <span class="module-index">${module.id.toUpperCase()}</span>
                    <h3>${module.label}</h3>
                    <p>${module.subtitle}</p>
                </div>

                <div class="module-content">
                    <div class="module-items">
                        ${module.items.map((item, index) => `
                            <button class="module-item"
                                data-module-item="${module.id}"
                                data-item-index="${index}">
                                <span>${item.title}</span>
                                <small>${item.meta}</small>
                            </button>
                        `).join("")}
                    </div>

                    <div class="module-detail" data-detail="${module.id}">
                        <span class="detail-placeholder">
                            Select an item to inspect details.
                        </span>
                    </div>
                </div>

            </article>
        `).join("");
    }

    function bindInteractions() {
        document.querySelectorAll(".module-card").forEach(card => {
            const moduleId = card.dataset.module;

            card.addEventListener("mouseenter", () => activateModule(moduleId));
        });

        document.querySelectorAll(".module-item").forEach(itemButton => {
            const moduleId = itemButton.dataset.moduleItem;
            const itemIndex = Number(itemButton.dataset.itemIndex);

            itemButton.addEventListener("mouseenter", () => showItemDetails(moduleId, itemIndex));
            itemButton.addEventListener("click", () => showItemDetails(moduleId, itemIndex));
        });
    }

    function activateModule(id) {
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

    function showItemDetails(moduleId, itemIndex) {
        activateModule(moduleId);

        const module = modules.find(entry => entry.id === moduleId);
        const item = module.items[itemIndex];

        document
            .querySelectorAll(`[data-module-item="${moduleId}"]`)
            .forEach(button => button.classList.remove("item-active"));

        document
            .querySelector(`[data-module-item="${moduleId}"][data-item-index="${itemIndex}"]`)
            ?.classList.add("item-active");

        const detailBox = document.querySelector(`[data-detail="${moduleId}"]`);

        detailBox.innerHTML = `
            <span class="detail-date">${item.date}</span>

            <h4>${item.title}</h4>

            <p>${item.meta}</p>

            <ul>
                ${item.details.map(detail => `<li>${detail}</li>`).join("")}
            </ul>
        `;

        detailBox.classList.add("detail-active");
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
