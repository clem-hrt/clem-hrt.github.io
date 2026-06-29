/*
========================================
NETWORK ENGINE
Six-module PCB layout + persistent activation
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
            id: "skills",
            label: "Skills",
            position: "top-center",
            subtitle: "Technical stack",
            items: [
                {
                    title: "Programming",
                    meta: "Python · C/C++ · Java · VHDL",
                    date: "Software foundations",
                    details: [
                        "Python",
                        "C / C++",
                        "HTML / CSS",
                        "Java",
                        "VHDL"
                    ]
                },
                {
                    title: "Embedded & Electronics",
                    meta: "STM32 · ESP32 · PCB",
                    date: "Hardware-oriented engineering",
                    details: [
                        "STM32",
                        "ESP32 / ESP8266",
                        "Altium Designer",
                        "LTSpice",
                        "PCB bring-up"
                    ]
                },
                {
                    title: "Software & Tools",
                    meta: "MATLAB · ROS · Docker · Git",
                    date: "Engineering workflow",
                    details: [
                        "MATLAB / Simulink",
                        "ROS",
                        "Robot Framework",
                        "Git / GitHub",
                        "Docker",
                        "IBM Rhapsody"
                    ]
                },
                {
                    title: "Languages",
                    meta: "FR · EN · ES",
                    date: "International communication",
                    details: [
                        "French — Native",
                        "English — Professional",
                        "Spanish — Basic"
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
            id: "education",
            label: "Education",
            position: "bottom-left",
            subtitle: "Academic path",
            items: [
                {
                    title: "Heriot-Watt University",
                    meta: "Master degree in Robotics",
                    date: "Sep 2023 – Sep 2024 · Edinburgh, UK",
                    details: [
                        "Robotics engineering",
                        "Autonomous systems",
                        "Navigation and control",
                        "Robotic surface vehicle project"
                    ]
                },
                {
                    title: "ESIEE Paris",
                    meta: "Master degree in Embedded & Electrical Systems",
                    date: "Sep 2021 – Sep 2024 · Paris, FR",
                    details: [
                        "Embedded systems",
                        "Electrical systems",
                        "Software engineering",
                        "Model-based development"
                    ]
                },
                {
                    title: "CPGE",
                    meta: "Mathematics & Physics",
                    date: "Sep 2018 – Sep 2021 · Valence, FR",
                    details: [
                        "Intensive mathematics",
                        "Physics",
                        "Engineering sciences",
                        "Scientific problem solving"
                    ]
                }
            ]
        },

        {
            id: "hobbies",
            label: "Hobbies",
            position: "bottom-center",
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

            <!-- CPU connection pads -->
            <circle class="pcb-pad" data-pad="experience" cx="455" cy="315" r="5" />
            <circle class="pcb-pad" data-pad="skills" cx="500" cy="290" r="5" />
            <circle class="pcb-pad" data-pad="projects" cx="545" cy="315" r="5" />

            <circle class="pcb-pad" data-pad="education" cx="455" cy="385" r="5" />
            <circle class="pcb-pad" data-pad="hobbies" cx="500" cy="410" r="5" />
            <circle class="pcb-pad" data-pad="certifications" cx="545" cy="385" r="5" />

            <!-- PCB traces -->
            <path class="pcb-trace" data-trace="experience"
                d="M455 315 C405 285, 310 210, 175 135" />

            <path class="pcb-trace" data-trace="skills"
                d="M500 290 C500 235, 500 155, 500 80" />

            <path class="pcb-trace" data-trace="projects"
                d="M545 315 C595 285, 690 210, 825 135" />

            <path class="pcb-trace" data-trace="education"
                d="M455 385 C405 420, 310 500, 175 565" />

            <path class="pcb-trace" data-trace="hobbies"
                d="M500 410 C500 470, 500 550, 500 625" />

            <path class="pcb-trace" data-trace="certifications"
                d="M545 385 C595 420, 690 500, 825 565" />

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

            card.addEventListener("mouseenter", () => {
                activateModule(moduleId);
                openModule(moduleId);
            });

            card.addEventListener("click", () => {
                activateModule(moduleId);
                openModule(moduleId);
            });
        });

        document.querySelectorAll(".module-item").forEach(itemButton => {
            const moduleId = itemButton.dataset.moduleItem;
            const itemIndex = Number(itemButton.dataset.itemIndex);

            itemButton.addEventListener("mouseenter", event => {
                event.stopPropagation();
                showItemDetails(moduleId, itemIndex);
            });

            itemButton.addEventListener("click", event => {
                event.stopPropagation();
                showItemDetails(moduleId, itemIndex);
            });
        });
    }

    function activateModule(id) {
    if (!activatedModules.has(id)) {
        activatedModules.add(id);

        document
            .querySelector(`[data-module="${id}"]`)
            ?.classList.add("module-active", "module-locked");

        document
            .querySelector(`[data-trace="${id}"]`)
            ?.classList.add("trace-active", "trace-locked");

        CPU.activateModulePins(id);

        SystemMonitor.setModules(activatedModules.size, modules.length);
        SystemMonitor.setConnection(id);
    }

    if (activatedModules.size === modules.length) {
        CPU.setCoreActivated();

        SystemMonitor.setCoreStatus("ACTIVATED");
        SystemMonitor.setModules(activatedModules.size, modules.length);
        SystemMonitor.setConnection("STABLE", { temporary: false });

        moduleLayer.classList.add("all-modules-active");
        pcbLayer.classList.add("all-traces-active");
    }
}
    

    function openModule(id) {
        document
            .querySelectorAll(".module-card")
            .forEach(card => card.classList.remove("module-open"));

        document
            .querySelector(`[data-module="${id}"]`)
            ?.classList.add("module-open");
    }

    function showItemDetails(moduleId, itemIndex) {
        activateModule(moduleId);
        openModule(moduleId);

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

    function getTotalModules() {
    return modules.length;
    }

    return {
        create,
        show,
        getTotalModules
    };

})();
