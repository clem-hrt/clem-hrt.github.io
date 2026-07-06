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



    redrawTracesSoon();

    redrawTracesSoon(850);



    window.addEventListener("resize", () => {

        redrawTracesSoon(80);

    });

}



function createTraces() {

    pcbLayer.innerHTML = `

        <svg class="pcb-svg" aria-hidden="true"></svg>

    `;

}

    const traceConfig = {

    experience: {

        cpuSide: "left",

        moduleSide: "right",

        cpuSlot: 0.28,

        busOffset: 58

    },



    education: {

        cpuSide: "left",

        moduleSide: "right",

        cpuSlot: 0.50,

        busOffset: 82

    },



    hobbies: {

        cpuSide: "bottom",

        moduleSide: "right", // important: connects to right side of Hobbies

        cpuSlot: 0.72,

        busOffset: 106

    },



    projects: {

        cpuSide: "right",

        moduleSide: "left",

        cpuSlot: 0.28,

        busOffset: 58

    },



    skills: {

        cpuSide: "bottom",

        moduleSide: "left",

        cpuSlot: 0.50,

        busOffset: 82

    },



    certifications: {

        cpuSide: "right",

        moduleSide: "left", // important: connects to left side of Certifications

        cpuSlot: 0.72,

        busOffset: 106

    }

};



let traceRedrawTimer = null;



function redrawTracesSoon(delay = 0) {

    window.clearTimeout(traceRedrawTimer);



    traceRedrawTimer = window.setTimeout(() => {

        requestAnimationFrame(drawTraces);

    }, delay);

}



function drawTraces() {

    const svg = pcbLayer.querySelector(".pcb-svg");

    const cpu = document.querySelector(".cpu-core");



    if (!svg || !cpu) return;



    const layerRect = pcbLayer.getBoundingClientRect();



    if (layerRect.width === 0 || layerRect.height === 0) return;



    svg.setAttribute("viewBox", `0 0 ${layerRect.width} ${layerRect.height}`);



    const cpuRect = toLayerRect(cpu, layerRect);



    let tracesMarkup = "";

    let padsMarkup = "";



    modules.forEach(module => {

        const card = document.querySelector(`[data-module="${module.id}"]`);

        const config = traceConfig[module.id];



        if (!card || !config) return;



        const moduleRect = toLayerRect(card, layerRect);



        const start = getCpuAnchor(cpuRect, config);

        const end = getModuleAnchor(moduleRect, config);



        tracesMarkup += `

            <path

                class="pcb-trace"

                data-trace="${module.id}"

                d="${buildPcbRoute(start, end, config)}"

            />

        `;



        padsMarkup += `

            <circle

                class="pcb-pad"

                data-pad="${module.id}"

                cx="${start.x}"

                cy="${start.y}"

                r="4"

            />



            <circle

                class="pcb-pad"

                data-pad="${module.id}"

                cx="${end.x}"

                cy="${end.y}"

                r="4"

            />

        `;

    });



    svg.innerHTML = tracesMarkup + padsMarkup;



    restoreTraceState();

}



function toLayerRect(element, layerRect) {

    const rect = element.getBoundingClientRect();



    return {

        left: rect.left - layerRect.left,

        right: rect.right - layerRect.left,

        top: rect.top - layerRect.top,

        bottom: rect.bottom - layerRect.top,

        width: rect.width,

        height: rect.height

    };

}



function getCpuAnchor(cpuRect, config) {

    return {

        x: config.cpuSide === "left" ? cpuRect.left : cpuRect.right,

        y: cpuRect.top + cpuRect.height * config.cpuSlot

    };

}



function getModuleAnchor(moduleRect, config) {

    return {

        x: config.moduleSide === "left" ? moduleRect.left : moduleRect.right,

        y: moduleRect.top + moduleRect.height * 0.5

    };

}



function buildPcbRoute(start, end, config) {

    const direction = config.cpuSide === "left" ? -1 : 1;



    const busX = start.x + direction * config.busOffset;

    const moduleStubX = end.x - direction * 38;



    return [

        `M ${round(start.x)} ${round(start.y)}`,

        `L ${round(busX)} ${round(start.y)}`,

        `L ${round(busX)} ${round(end.y)}`,

        `L ${round(moduleStubX)} ${round(end.y)}`,

        `L ${round(end.x)} ${round(end.y)}`

    ].join(" ");

}



function restoreTraceState() {

    activatedModules.forEach(id => {

        document

            .querySelector(`[data-trace="${id}"]`)

            ?.classList.add("trace-active", "trace-locked");



        document

            .querySelectorAll(`[data-pad="${id}"]`)

            .forEach(pad => pad.classList.add("pad-active"));

    });



    if (activatedModules.size === modules.length) {

        pcbLayer.classList.add("all-traces-active");

    }

}



function round(value) {

    return Math.round(value * 10) / 10;

}
    
function getLayoutRect(element, referenceElement) {

    const elementPos = getOffsetPosition(element);

    const referencePos = getOffsetPosition(referenceElement);



    const x = elementPos.x - referencePos.x;

    const y = elementPos.y - referencePos.y;

    const width = element.offsetWidth;

    const height = element.offsetHeight;



    return {

        x,

        y,

        width,

        height,

        left: x,

        right: x + width,

        top: y,

        bottom: y + height

    };

}



function getOffsetPosition(element) {

    let x = 0;

    let y = 0;

    let node = element;



    while (node && node !== document.body) {

        x += node.offsetLeft || 0;

        y += node.offsetTop || 0;

        node = node.offsetParent;

    }



    return { x, y };

}





function clamp(value, min, max) {

    return Math.max(min, Math.min(max, value));

}



function getTraceSide(position) {

    if (position.includes("left")) {

        return "left";

    }

    if (position.includes("right")) {

        return "right";

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



function getCpuTraceStart(cpuRect, side, moduleId, itemIndex, itemCount) {

    const cpuSlots = {

        experience: 0.24,

        education: 0.50,

        hobbies: 0.76,



        projects: 0.24,

        skills: 0.50,

        certifications: 0.76

    };



    const slot = cpuSlots[moduleId] ?? 0.5;

    const itemOffset = (itemIndex - (itemCount - 1) / 2) * 9;



    const y = clamp(

        cpuRect.top + cpuRect.height * slot + itemOffset,

        cpuRect.top + 22,

        cpuRect.bottom - 22

    );



    if (side === "left") {

        return {

            x: cpuRect.left,

            y

        };

    }



    return {

        x: cpuRect.right,

        y

    };

}



function buildRectilinearPath(start, end, side, itemIndex) {

    const laneOffset = 58 + itemIndex * 12;



    if (side === "left") {

        const midX = Math.max(

            end.x + 34,

            start.x - laneOffset

        );



        return `

            M ${start.x} ${start.y}

            H ${midX}

            V ${end.y}

            H ${end.x}

        `;

    }



    const midX = Math.min(

        end.x - 34,

        start.x + laneOffset

    );



    return `

        M ${start.x} ${start.y}

        H ${midX}

        V ${end.y}

        H ${end.x}

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

    document

        .querySelectorAll(".module-card")

        .forEach(card => {

            card.classList.remove("module-open");

        });



    const moduleCard = document.querySelector(`[data-module="${id}"]`);



    if (!moduleCard) return;



    moduleCard.classList.add("module-open");



    redrawTracesSoon();

    redrawTracesSoon(520);



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

    requestAnimationFrame(() => {

        createTraces();

    });

    setTimeout(() => {

        createTraces();

    }, 850);

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
