/*
========================================
NETWORK ENGINE
========================================
*/
const Network = (() => {

    const pcbLayer = document.querySelector("#pcb-layer");
    const moduleLayer = document.querySelector("#module-layer");
    const activatedModules = new Set();
    const activatedItemTraces = new Set();
    let currentItemTrace = null;
    let traceRefreshTimer = null;

    const modules = [
        {
            id: "experience",
            label: "Professional Experience",
            position: "left-top",
            subtitle: "Career path",
            items: [
                {
                    title: "Alstom",
                    meta: "Lab Test Automation Engineer",
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
            position: "right-middle",
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
            position: "right-top",
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
            position: "left-middle",
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
            position: "left-bottom",
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
            position: "right-bottom",
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
        createModules();
        createTraces();
        bindInteractions();
        
        window.addEventListener("resize", () => {
            scheduleTraceRefresh();
        });
    }

    function createTraces() {
        const layerRect = pcbLayer.getBoundingClientRect();
        const cpuCore = document.querySelector(".cpu-core");
        
        if (!cpuCore || !layerRect.width || !layerRect.height) return;
        
        const cpuRect = getRelativeRect(cpuCore, layerRect);
        const traces = [];
        const pads = [];
        modules.forEach(module => 
            {const moduleCard = document.querySelector(`[data-module="${module.id}"]`);
             if (!moduleCard) return;
             const moduleRect = getRelativeRect(moduleCard, layerRect);
             const side = getTraceSide(module.position);
             
             module.items.forEach((item, itemIndex) => {
                 const traceKey = `${module.id}-${itemIndex}`;
                 const end = getItemTraceEnd(moduleRect, side, itemIndex, module.items.length);
                 const start = getCpuTraceStart(cpuRect, side, end);
                 const path = buildRectilinearPath(start, end, side, itemIndex);
                 traces.push(`
                 <path

                    class="pcb-item-trace"

                    data-module-trace="${module.id}"

                    data-item-trace="${traceKey}"

                    d="${path}"

                />

            `);

            pads.push(`

                <circle

                    class="pcb-item-pad"

                    data-module-pad="${module.id}"

                    data-item-pad="${traceKey}"

                    cx="${end.x}"

                    cy="${end.y}"

                    r="4.2"

                />

            `);

        });

    });

    pcbLayer.innerHTML = `

        <svg class="pcb-svg"

            viewBox="0 0 ${layerRect.width} ${layerRect.height}"

            preserveAspectRatio="none">

            <g class="pcb-item-trace-layer">

                ${traces.join("")}

            </g>
            <g class="pcb-item-pad-layer">

                ${pads.join("")}

            </g>
        </svg>

    `;
    refreshItemTraceClasses();
    }

    function getRelativeRect(element, referenceRect) {

    const rect = element.getBoundingClientRect();



    return {

        x: rect.left - referenceRect.left,

        y: rect.top - referenceRect.top,

        width: rect.width,

        height: rect.height,

        left: rect.left - referenceRect.left,

        right: rect.right - referenceRect.left,

        top: rect.top - referenceRect.top,

        bottom: rect.bottom - referenceRect.top

    };

}



function clamp(value, min, max) {

    return Math.max(min, Math.min(max, value));

}



function getTraceSide(position) {

    if (position.includes("left-bottom") || position.includes("right-bottom")) {

        return "bottom";

    }



    if (position.includes("left")) {

        return "left";

    }



    return "right";

}



function getItemTraceEnd(moduleRect, side, itemIndex, itemCount) {

    const ratio = (itemIndex + 1) / (itemCount + 1);



    if (side === "left") {

        return {

            x: moduleRect.right,

            y: moduleRect.top + moduleRect.height * ratio

        };

    }



    if (side === "right") {

        return {

            x: moduleRect.left,

            y: moduleRect.top + moduleRect.height * ratio

        };

    }



    return {

        x: moduleRect.left + moduleRect.width * ratio,

        y: moduleRect.top

    };

}



function getCpuTraceStart(cpuRect, side, end) {

    if (side === "left") {

        return {

            x: cpuRect.left,

            y: clamp(end.y, cpuRect.top + 26, cpuRect.bottom - 26)

        };

    }



    if (side === "right") {

        return {

            x: cpuRect.right,

            y: clamp(end.y, cpuRect.top + 26, cpuRect.bottom - 26)

        };

    }



    return {

        x: clamp(end.x, cpuRect.left + 34, cpuRect.right - 34),

        y: cpuRect.bottom

    };

}



function buildRectilinearPath(start, end, side, itemIndex) {

    const offset = 14 + itemIndex * 10;



    if (side === "left") {

        const midX = start.x - 70 - offset;



        return `

            M ${start.x} ${start.y}

            H ${midX}

            V ${end.y}

            H ${end.x}

        `;

    }



    if (side === "right") {

        const midX = start.x + 70 + offset;



        return `

            M ${start.x} ${start.y}

            H ${midX}

            V ${end.y}

            H ${end.x}

        `;

    }



    const midY = start.y + 52 + offset;



    return `

        M ${start.x} ${start.y}

        V ${midY}

        H ${end.x}

        V ${end.y}

    `;

}



function scheduleTraceRefresh() {

    requestAnimationFrame(() => {

        createTraces();

    });



    clearTimeout(traceRefreshTimer);



    traceRefreshTimer = setTimeout(() => {

        createTraces();

    }, 560);

}

    function activateItemTrace(moduleId, itemIndex) {

    const traceKey = `${moduleId}-${itemIndex}`;



    currentItemTrace = traceKey;

    activatedItemTraces.add(traceKey);



    refreshItemTraceClasses();

}



function refreshItemTraceClasses() {

    document

        .querySelectorAll(".pcb-item-trace")

        .forEach(trace => {

            const key = trace.dataset.itemTrace;



            trace.classList.toggle(

                "item-trace-locked",

                activatedItemTraces.has(key)

            );



            trace.classList.toggle(

                "item-trace-active",

                key === currentItemTrace

            );

        });



    document

        .querySelectorAll(".pcb-item-pad")

        .forEach(pad => {

            const key = pad.dataset.itemPad;



            pad.classList.toggle(

                "item-pad-locked",

                activatedItemTraces.has(key)

            );



            pad.classList.toggle(

                "item-pad-active",

                key === currentItemTrace

            );

        });

}
    
    function createModules() {
        moduleLayer.innerHTML = modules.map(module => `
        <article class="module-card module-${module.position}" data-module="${module.id}">

            <span class="module-corner module-corner-tl"></span>
            <span class="module-corner module-corner-tr"></span>
            <span class="module-corner module-corner-bl"></span>
            <span class="module-corner module-corner-br"></span>

            <div class="module-scanline"></div>

            <div class="module-header">

                <div class="module-header-top">
                    <span class="module-index">${module.id.toUpperCase()}</span>

                    <span class="module-status">
                        <span class="module-status-dot"></span>
                        <span class="module-status-label">STANDBY</span>
                    </span>
                </div>

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

            itemButton.addEventListener("focus", event => {
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

            const moduleCard = document.querySelector(`[data-module="${id}"]`);
            const statusLabel = moduleCard?.querySelector(".module-status-label");

            if (statusLabel) {
                statusLabel.textContent = "LINKED";
            }

            document
                .querySelector(`[data-trace="${id}"]`)
                ?.classList.add("trace-active", "trace-locked");

            document
                .querySelector(`[data-pad="${id}"]`)
                ?.classList.add("pad-active");

            CPU.activateModulePins(id);

            SystemMonitor.setModules(activatedModules.size, modules.length);
            SystemMonitor.setConnection(id);
        } else {
            SystemMonitor.setConnection(id);
        }

        if (activatedModules.size === modules.length) {
            CPU.setCoreActivated();

            SystemMonitor.setCoreStatus("ACTIVATED");
            SystemMonitor.setModules(activatedModules.size, modules.length);
            SystemMonitor.setConnection("STABLE", { temporary: false });

            Ports.unlock();
            
            moduleLayer.classList.add("all-modules-active");
            pcbLayer.classList.add("all-traces-active");
        }
    }


    function openModule(id, autoSelectFirst = true) {
        const moduleCard = document.querySelector(`[data-module="${id}"]`);
        if (!moduleCard) return;
        document
            .querySelectorAll(".module-card")
            .forEach(card => {card.classList.remove("module-open");});

        moduleCard.classList.add("module-open");

        scheduleTraceRefresh();

        if (autoSelectFirst) {
            renderItemDetails(id, 0);
        }

    }

    function renderItemDetails(moduleId, itemIndex) {
        const module = modules.find(entry => entry.id === moduleId);
        if (!module) return;
        
        const item = module.items[itemIndex];
        if (!item) return;

        activateItemTrace(moduleId, itemIndex);

        const detailBox = document.querySelector(`[data-detail="${moduleId}"]`);

        if (!detailBox) return;

        document
            .querySelectorAll(`[data-module-item="${moduleId}"]`)
            .forEach(button => button.classList.remove("item-active"));

        document
            .querySelector(`[data-module-item="${moduleId}"][data-item-index="${itemIndex}"]`)
            ?.classList.add("item-active");

        detailBox.classList.add("detail-active");

        detailBox.innerHTML = `
            <span class="detail-date">${item.date}</span>

            <h4>${item.title}</h4>

            <p>${item.meta}</p>

            <ul>
                ${item.details.map(detail => `<li>${detail}</li>`).join("")}
            </ul>
        `;
    }

    function showItemDetails(moduleId, itemIndex) {
        activateModule(moduleId);
        openModule(moduleId, false);
        renderItemDetails(moduleId, itemIndex);
    }
    
    function showTraces() {
        pcbLayer.classList.add("network-visible");
    }

    function showModules() {
        moduleLayer.classList.add("modules-visible");
    }
    
    function show() {
        showTraces();
        showModules();
    }

    function getTotalModules() {
        return modules.length;
    }

    return {
        create,
        show,
        showTraces,
        showModules,
        getTotalModules
    };

})();
