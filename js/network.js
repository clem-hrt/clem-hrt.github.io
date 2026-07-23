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
    const CPU_PIN_CLEARANCE = 9;

    let currentItemTrace = null;
    let portsUnlocked = false;
    let traceRedrawTimer = null;
    let traceSyncUntil = 0;
    let traceSyncFrame = null;
    let resizeObserver = null;
    let mutationObserver = null;

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
    const totalItems = modules.reduce((total, module) => {
        return total + module.items.length;
    }, 0);

    const traceConfig = {
        experience: {
            cpuSide: "left",
            moduleSide: "right",
            cpuPins: [
                "left-1",
                "left-2",
                "left-3",
                "left-4",
                "left-5",
                "left-6"
            ],
            cpuSlot: 0.30
        },

        education: {
            cpuSide: "left",
            moduleSide: "right",
            cpuPins: [
                "left-7",
                "left-8",
                "left-9",
                "left-10",
                "left-11",
                "left-12"
            ],
            cpuSlot: 0.70
        },

        hobbies: {
            cpuSide: "bottom",
            moduleSide: "right",
            cpuPins: [
                "bottom-1",
                "bottom-2",
                "bottom-3",
                "bottom-4",
                "bottom-5",
                "bottom-6"
            ],
            cpuSlot: 0.45
        },

        projects: {
            cpuSide: "right",
            moduleSide: "left",
            cpuPins: [
                "right-1",
                "right-2",
                "right-3",
                "right-4"
            ],
            cpuSlot: 0.30
        },

        skills: {
            cpuSide: "right",
            moduleSide: "left",
            cpuPins: [
                "right-5",
                "right-6",
                "right-7",
                "right-8",
                "right-9",
                "right-10",
                "right-11",
                "right-12"
            ],
            cpuSlot: 0.65
        },

        certifications: {
            cpuSide: "bottom",
            moduleSide: "left",
            cpuPins: [
                "bottom-7",
                "bottom-8",
                "bottom-9",
                "bottom-10"
            ],
            cpuSlot: 0.55
        }
    };

    function create() {
        createModules();
        createTraces();
        bindInteractions();
        startTraceSync();
        SystemMonitor.setItems(0, totalItems, "IDLE");
        redrawTracesSoon();
        forceTraceSync(1800);

        window.addEventListener("resize", () => {
            redrawTracesSoon();
            forceTraceSync(900);
        });

        window.addEventListener("load", () => {
            redrawTracesSoon();
            forceTraceSync(1800);
        });
    }

    function createTraces() {
        if (!pcbLayer) return;

        pcbLayer.innerHTML = `
            <svg class="pcb-svg" aria-hidden="true"></svg>
        `;

        redrawTracesSoon();
    }

    function redrawTracesSoon(delay = 0) {
        window.clearTimeout(traceRedrawTimer);

        traceRedrawTimer = window.setTimeout(() => {
            requestAnimationFrame(drawTraces);
        }, delay);
    }

    function startTraceSync() {

        if (resizeObserver) {
            resizeObserver.disconnect();
        }
        resizeObserver = new ResizeObserver(() => {
            redrawTracesSoon();
            forceTraceSync(700);
        });

        document
            .querySelectorAll(".module-card, .cpu-core, #module-layer, #pcb-layer")
            .forEach(element => resizeObserver.observe(element));

        if (mutationObserver) {
            mutationObserver.disconnect();
        }

        mutationObserver = new MutationObserver(() => {
            redrawTracesSoon();
            forceTraceSync(500);
        });

        mutationObserver.observe(moduleLayer, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ["class", "style"]
        });

    }

    function forceTraceSync(duration = 700) {
        traceSyncUntil = Math.max(traceSyncUntil, performance.now() + duration);
        if (!traceSyncFrame) {
            traceSyncLoop();
        }
    }

    function traceSyncLoop() {
        drawTraces();
        if (performance.now() < traceSyncUntil) {
            traceSyncFrame = requestAnimationFrame(traceSyncLoop);
        } else {
            traceSyncFrame = null;
        }
    }

    function drawTraces() {
        if (!pcbLayer) return;

        const svg = pcbLayer.querySelector(".pcb-svg");
        const cpu = document.querySelector(".cpu-core");

        if (!svg || !cpu) return;

        const layerRect = pcbLayer.getBoundingClientRect();

        if (layerRect.width === 0 || layerRect.height === 0) return;

        svg.setAttribute("viewBox", `0 0 ${layerRect.width} ${layerRect.height}`);
        svg.setAttribute("width", layerRect.width);
        svg.setAttribute("height", layerRect.height);

        const cpuRect = toLayerRect(cpu, layerRect);

        let tracesMarkup = "";
        let padsMarkup = "";
        let itemTracesMarkup = "";
        let itemPadsMarkup = "";
        const openObstacles = [];

        modules.forEach(m => {
            const el = document.querySelector(`[data-module="${m.id}"]`);

            if (el && el.classList.contains("module-open")) {
                openObstacles.push({
                    id: m.id,
                    rect: toLayerRect(el, layerRect)
                });
            }
        });

        modules.forEach(module => {
            const card = document.querySelector(`[data-module="${module.id}"]`);
            const config = traceConfig[module.id];

            if (!card || !config) return;

            const moduleRect = toLayerRect(card, layerRect);
            const bus = getCpuPinBus(config, layerRect, cpuRect);
            const start = bus.center;
            const end = getModuleAnchor(moduleRect, config);
            const merge = getMergePoint(end, config);
            const linkTarget = getLinkTarget(merge);
            const isOpen = card.classList.contains("module-open");
            const obstacles = openObstacles.map(o => o.rect);
            const routeD = [
                buildPcbRoute(start, linkTarget, config, moduleRect, isOpen, obstacles),
                bus.railPath,
                bus.tapPath
            ].filter(Boolean).join(" ");

            tracesMarkup += `
                <path
                    class="pcb-trace"
                    data-trace="${module.id}"
                    d="${routeD}"
                />
            `;

            padsMarkup += `
                <circle
                    class="pcb-pad"
                    data-pad="${module.id}"
                    cx="${round(start.x)}"
                    cy="${round(start.y)}"
                    r="4"
                />

                <circle
                    class="pcb-pad"
                    data-pad="${module.id}"
                    cx="${round(merge.x)}"
                    cy="${round(merge.y)}"
                    r="4"
                />
            `;
            const itemMarkup = drawItemTraces(module, card, moduleRect, merge, config, layerRect, isOpen);
            itemTracesMarkup += itemMarkup.traces;
            itemPadsMarkup += itemMarkup.pads;
        });

        svg.innerHTML = tracesMarkup + itemTracesMarkup + padsMarkup + itemPadsMarkup;
        restoreTraceState();
        refreshItemTraceClasses();
    }

    function drawItemTraces(module, card, moduleRect, moduleEntryPoint, config, layerRect, isOpen) {
        let traces = "";
        let pads = "";

        const itemCount = module.items.length;

        // Open: anchor each item to its ACTUAL text row (read from the DOM) so the
        // taps line up with what the user sees. Closed: fall back to even spacing.
        const rowY = [];

        if (isOpen && layerRect) {
            module.items.forEach((item, index) => {
                const btn = card.querySelector(
                    `[data-module-item="${module.id}"][data-item-index="${index}"]`
                );

                if (btn) {
                    const r = toLayerRect(btn, layerRect);
                    rowY[index] = (r.top + r.bottom) / 2;
                }
            });
        }

        const anchors = module.items.map((item, index) => {
            const base = getItemAnchor(moduleRect, config, index, itemCount);

            if (
                rowY[index] != null &&
                (
                    config.moduleSide === "left" ||
                    config.moduleSide === "right"
                )
            ) {
                return {
                    x: base.x,
                    y: rowY[index]
                };
            }

            return base;
        });

        traces += `
            <path
                class="pcb-item-backbone"
                data-item-backbone="${module.id}"
                d="${buildItemBackboneRoute(moduleEntryPoint, anchors, config)}"
            />
        `;

        module.items.forEach((item, index) => {
            const itemAnchor = anchors[index];
            const traceKey = `${module.id}-${index}`;

            traces += `
                <path
                    class="pcb-item-trace"
                    data-item-trace="${traceKey}"
                    d="${buildItemStubRoute(moduleEntryPoint, itemAnchor, config)}"
                />
            `;

            pads += `
                <circle
                    class="pcb-item-pad"
                    data-item-pad="${traceKey}"
                    cx="${round(itemAnchor.x)}"
                    cy="${round(itemAnchor.y)}"
                    r="3.2"
                />
            `;
        });

        return {
            traces,
            pads
        };
    }

    const ITEM_ANCHOR_MIN_SPACING = 22;

    function getItemAnchor(moduleRect, config, index, itemCount) {
        const naturalPadding = Math.min(24, moduleRect.height * 0.2);

        const naturalSpacing =
            (moduleRect.height - naturalPadding * 2) /
            (itemCount + 1);

        const spacing = Math.max(
            naturalSpacing,
            ITEM_ANCHOR_MIN_SPACING
        );

        const span = spacing * (itemCount + 1);

        const centerY =
            moduleRect.top + moduleRect.height / 2;

        const startY = centerY - span / 2;

        const y = startY + spacing * (index + 1);

        if (config.moduleSide === "left") {
            return {
                x: moduleRect.left,
                y
            };
        }

        if (config.moduleSide === "right") {
            return {
                x: moduleRect.right,
                y
            };
        }

        const naturalPaddingX = Math.min(24, moduleRect.width * 0.2);

        const naturalSpacingX =
            (moduleRect.width - naturalPaddingX * 2) /
            (itemCount + 1);

        const spacingX = Math.max(
            naturalSpacingX,
            ITEM_ANCHOR_MIN_SPACING
        );

        const spanX = spacingX * (itemCount + 1);

        const centerX =
            moduleRect.left + moduleRect.width / 2;

        const startX = centerX - spanX / 2;

        const x = startX + spacingX * (index + 1);

        if (config.moduleSide === "top") {
            return {
                x,
                y: moduleRect.top
            };
        }

        return {
            x,
            y: moduleRect.bottom
        };
    }

    const ITEM_SPINE_OFFSET = 34;

    /* Gap left between the CPU link's end and the merge point, so the link
       touches the junction without overlapping the backbone. */
    const ITEM_MERGE_GAP = 6;

    /*
        The common point where all item traces converge and where the CPU link
        terminates. It sits on the item spine, just outside the card's
        CPU-facing edge — never on the card itself, so the link can also avoid
        its own open panel.
    */
    function getMergePoint(moduleEntryPoint, config) {
        const vertical =
            config.moduleSide === "left" ||
            config.moduleSide === "right";

        const outward =
            config.moduleSide === "left" ||
            config.moduleSide === "top"
                ? -1
                : 1;

        if (vertical) {
            return {
                x: moduleEntryPoint.x + outward * ITEM_SPINE_OFFSET,
                y: moduleEntryPoint.y,
                outward,
                vertical
            };
        }

        return {
            x: moduleEntryPoint.x,
            y: moduleEntryPoint.y + outward * ITEM_SPINE_OFFSET,
            outward,
            vertical
        };
    }

    /* Where the CPU link stops: merge point pushed a few px further out. */
    function getLinkTarget(merge) {
        return merge.vertical
            ? { x: merge.x + merge.outward * ITEM_MERGE_GAP, y: merge.y }
            : { x: merge.x, y: merge.y + merge.outward * ITEM_MERGE_GAP };
    }

    function buildItemBackboneRoute(merge, anchors, config) {
        if (merge.vertical) {
            // Spine runs along the merge point's x, spanning all item rows and
            // the merge point itself.
            const ys = anchors.map(a => a.y).concat(merge.y);
            const yTop = Math.min(...ys);
            const yBottom = Math.max(...ys);

            return [
                `M ${round(merge.x)} ${round(yTop)}`,
                `L ${round(merge.x)} ${round(yBottom)}`
            ].join(" ");
        }

        const xs = anchors.map(a => a.x).concat(merge.x);
        const xLeft = Math.min(...xs);
        const xRight = Math.max(...xs);

        return [
            `M ${round(xLeft)} ${round(merge.y)}`,
            `L ${round(xRight)} ${round(merge.y)}`
        ].join(" ");
    }

    function buildItemStubRoute(merge, itemAnchor, config) {
        if (merge.vertical) {
            // From the merge point, down/up the spine to this item's row, then
            // straight into the item. The spine run lights with the item.
            return [
                `M ${round(merge.x)} ${round(merge.y)}`,
                `L ${round(merge.x)} ${round(itemAnchor.y)}`,
                `L ${round(itemAnchor.x)} ${round(itemAnchor.y)}`
            ].join(" ");
        }

        return [
            `M ${round(merge.x)} ${round(merge.y)}`,
            `L ${round(itemAnchor.x)} ${round(merge.y)}`,
            `L ${round(itemAnchor.x)} ${round(itemAnchor.y)}`
        ].join(" ");
    }

    function activateItemTrace(moduleId, itemIndex) {
        const traceKey = `${moduleId}-${itemIndex}`;

        currentItemTrace = traceKey;
        activatedItemTraces.add(traceKey);
        CPU.activateItemPins(moduleId, itemIndex);
        SystemMonitor.setItems(
            activatedItemTraces.size,
            totalItems,
            moduleId
        );
        if (!portsUnlocked && activatedItemTraces.size == totalItems) {
            portsUnlocked = true;
            Ports.unlock();
        }
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

    function averageOf(values) {
        return (
            values.reduce(
                (sum, value) => sum + value,
                0
            ) / values.length
        );
    }

    function getModulePinRects(config, layerRect) {
        return (config.cpuPins || [])
            .map(id =>
                document.querySelector(
                    `[data-pin="${id}"]`
                )
            )
            .filter(Boolean)
            .map(pin => toLayerRect(pin, layerRect));
    }

    function getCpuPinBus(config, layerRect, cpuRect) {
        const rects = getModulePinRects(
            config,
            layerRect
        );

        if (!rects.length) {
            return {
                center: getCpuSlotAnchor(cpuRect, config),
                railPath: "",
                tapPath: ""
            };
        }

        if (
            config.cpuSide === "left" ||
            config.cpuSide === "right"
        ) {
            const isLeft =
                config.cpuSide === "left";

            const railX = isLeft
                ? Math.min(
                      ...rects.map(r => r.left)
                  ) - CPU_PIN_CLEARANCE
                : Math.max(
                      ...rects.map(r => r.right)
                  ) + CPU_PIN_CLEARANCE;

            const centersY = rects.map(
                r => (r.top + r.bottom) / 2
            );

            const yTop = Math.min(...centersY);
            const yBottom = Math.max(...centersY);

            const railPath =
                `M ${round(railX)} ${round(yTop)} ` +
                `L ${round(railX)} ${round(yBottom)}`;

            const tapPath = rects
                .map(r => {
                    const cy =
                        (r.top + r.bottom) / 2;

                    const pinTipX = isLeft
                        ? r.left
                        : r.right;

                    return (
                        `M ${round(pinTipX)} ${round(cy)} ` +
                        `L ${round(railX)} ${round(cy)}`
                    );
                })
                .join(" ");

            return {
                center: {
                    x: railX,
                    y: averageOf([yTop, yBottom])
                },
                railPath,
                tapPath
            };
        }

        const railY =
            Math.max(
                ...rects.map(r => r.bottom)
            ) + CPU_PIN_CLEARANCE;

        const centersX = rects.map(
            r => (r.left + r.right) / 2
        );

        const xLeft = Math.min(...centersX);
        const xRight = Math.max(...centersX);

        const railPath =
            `M ${round(xLeft)} ${round(railY)} ` +
            `L ${round(xRight)} ${round(railY)}`;

        const tapPath = rects
            .map(r => {
                const cx =
                    (r.left + r.right) / 2;

                return (
                    `M ${round(cx)} ${round(r.bottom)} ` +
                    `L ${round(cx)} ${round(railY)}`
                );
            })
            .join(" ");

        return {
            center: {
                x: averageOf([xLeft, xRight]),
                y: railY
            },
            railPath,
            tapPath
        };
    }

    function getCpuSlotAnchor(cpuRect, config) {
        if (config.cpuSide === "left") {
            return {
                x: cpuRect.left,
                y:
                    cpuRect.top +
                    cpuRect.height * config.cpuSlot
            };
        }

        if (config.cpuSide === "right") {
            return {
                x: cpuRect.right,
                y:
                    cpuRect.top +
                    cpuRect.height * config.cpuSlot
            };
        }

        if (config.cpuSide === "bottom") {
            return {
                x:
                    cpuRect.left +
                    cpuRect.width * config.cpuSlot,
                y: cpuRect.bottom
            };
        }

        if (config.cpuSide === "top") {
            return {
                x:
                    cpuRect.left +
                    cpuRect.width * config.cpuSlot,
                y: cpuRect.top
            };
        }

        return {
            x: cpuRect.right,
            y:
                cpuRect.top +
                cpuRect.height * 0.5
        };
    }

    function getModuleAnchor(moduleRect, config) {
        if (config.moduleSide === "left") {
            return {
                x: moduleRect.left,
                y: moduleRect.top + moduleRect.height * 0.5
            };
        }

        if (config.moduleSide === "right") {
            return {
                x: moduleRect.right,
                y: moduleRect.top + moduleRect.height * 0.5
            };
        }

        if (config.moduleSide === "top") {
            return {
                x: moduleRect.left + moduleRect.width * 0.5,
                y: moduleRect.top
            };
        }

        if (config.moduleSide === "bottom") {
            return {
                x: moduleRect.left + moduleRect.width * 0.5,
                y: moduleRect.bottom
            };
        }

        return {
            x: moduleRect.left,
            y: moduleRect.top + moduleRect.height * 0.5
        };
    }

    const CHANNEL_GAP = 30; // channel distance from the CPU edge (closed)

    function nearestEdgeX(end, rect) {
        return Math.abs(end.x - rect.left) <= Math.abs(end.x - rect.right)
            ? rect.left
            : rect.right;
    }

    function nearestEdgeY(end, rect) {
        return Math.abs(end.y - rect.top) <= Math.abs(end.y - rect.bottom)
            ? rect.top
            : rect.bottom;
    }

    function buildPcbRoute(
        start,
        end,
        config,
        moduleRect,
        isOpen,
        obstacles
    ) {
        const open = isOpen && moduleRect ? moduleRect : null;

        const points =
            config.cpuSide === "left" || config.cpuSide === "right"
                ? buildHorizontalPoints(start, end, config, open)
                : buildVerticalPoints(start, end, config, open);

        const routed = avoidObstacles(
            points,
            obstacles || [],
            end
        );

        return pointsToPath(routed);
    }

    function pointsToPath(points) {
        return points
            .map(
                (p, i) =>
                    `${i === 0 ? "M" : "L"} ${round(p.x)} ${round(p.y)}`
            )
            .join(" ");
    }

    /*
        Orthogonal A* router. Routes the connector link from the CPU pin bus to
        the module connector while avoiding open cards. Uses a "Hanan grid":
        candidate lines from the start, the end, and each obstacle's inflated
        edges. Manhattan heuristic + turn penalty keeps paths clean.
    */
    const OBSTACLE_PAD = 18;
    const TURN_PENALTY = 40;
    const ENDPOINT_REACH = 60;

    function avoidObstacles(points, obstacles, end) {
        if (!obstacles.length || points.length < 2) {
            return points;
        }

        const start = points[0];
        const goal = points[points.length - 1];

        const contains = (r, p) =>
            p.x > r.left - OBSTACLE_PAD &&
            p.x < r.right + OBSTACLE_PAD &&
            p.y > r.top - OBSTACLE_PAD &&
            p.y < r.bottom + OBSTACLE_PAD;

        // A panel that encloses the pin START can't be avoided (the pins sit
        // physically under it). The goal now sits outside every card, so the
        // trace's own open panel IS avoided like any other obstacle.
        const boxes = obstacles
            .filter(r => !contains(r, start))
            .map(r => ({
                left: r.left - OBSTACLE_PAD,
                right: r.right + OBSTACLE_PAD,
                top: r.top - OBSTACLE_PAD,
                bottom: r.bottom + OBSTACLE_PAD
            }));

        if (!boxes.length) {
            return points;
        }

        if (!pathHitsAny(points, boxes)) {
            return points;
        }

        const routed = astarRoute(start, goal, boxes);

        return routed || points;
    }

    function pathHitsAny(points, boxes) {
        for (let i = 0; i < points.length - 1; i++) {
            for (const box of boxes) {
                if (
                    segmentHitsBox(
                        points[i],
                        points[i + 1],
                        box
                    )
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    function astarRoute(start, goal, boxes) {
        const xsSet = new Set([start.x, goal.x]);
        const ysSet = new Set([start.y, goal.y]);

        for (const b of boxes) {
            xsSet.add(b.left);
            xsSet.add(b.right);
            ysSet.add(b.top);
            ysSet.add(b.bottom);
        }

        const xs = [...xsSet].sort((a, c) => a - c);
        const ys = [...ysSet].sort((a, c) => a - c);

        const xi = new Map(
            xs.map((v, i) => [v, i])
        );
        const yi = new Map(
            ys.map((v, i) => [v, i])
        );

        const key = (ix, iy) => ix * 10000 + iy;

        const isEndpoint = (x, y) =>
            (
                Math.abs(x - start.x) < 0.5 &&
                Math.abs(y - start.y) < 0.5
            ) ||
            (
                Math.abs(x - goal.x) < 0.5 &&
                Math.abs(y - goal.y) < 0.5
            );

        const nodeBlocked = (x, y) => {
            if (isEndpoint(x, y)) {
                return false;
            }

            for (const b of boxes) {
                if (
                    x > b.left + 0.5 &&
                    x < b.right - 0.5 &&
                    y > b.top + 0.5 &&
                    y < b.bottom - 0.5
                ) {
                    return true;
                }
            }

            return false;
        };

        const edgeBlocked = (x1, y1, x2, y2) => {
            if (
                isEndpoint(x1, y1) ||
                isEndpoint(x2, y2)
            ) {
                const len =
                    Math.abs(x2 - x1) +
                    Math.abs(y2 - y1);

                if (len <= ENDPOINT_REACH) {
                    return false;
                }
            }

            for (const b of boxes) {
                if (
                    segmentHitsBox(
                        { x: x1, y: y1 },
                        { x: x2, y: y2 },
                        b
                    )
                ) {
                    return true;
                }
            }

            return false;
        };

        const sIx = xi.get(start.x);
        const sIy = yi.get(start.y);
        const gIx = xi.get(goal.x);
        const gIy = yi.get(goal.y);

        const h = (ix, iy) =>
            Math.abs(xs[ix] - goal.x) +
            Math.abs(ys[iy] - goal.y);

        const open = new Map();
        const came = new Map();
        const gScore = new Map();

        const startKey = key(sIx, sIy);

        gScore.set(startKey, 0);

        open.set(startKey, {
            ix: sIx,
            iy: sIy,
            f: h(sIx, sIy),
            dir: null
        });

        const popLowest = () => {
            let best = null;
            let bestKey = null;

            for (const [k, n] of open) {
                if (!best || n.f < best.f) {
                    best = n;
                    bestKey = k;
                }
            }

            open.delete(bestKey);

            return best;
        };

        let guard = 0;

        while (open.size && guard++ < 20000) {
            const cur = popLowest();
            const cKey = key(cur.ix, cur.iy);

            if (
                cur.ix === gIx &&
                cur.iy === gIy
            ) {
                return reconstruct(
                    came,
                    cKey,
                    xs,
                    ys,
                    key
                );
            }

            const neighbours = [
                [cur.ix + 1, cur.iy, "h"],
                [cur.ix - 1, cur.iy, "h"],
                [cur.ix, cur.iy + 1, "v"],
                [cur.ix, cur.iy - 1, "v"]
            ];

            for (const [nx, ny, dir] of neighbours) {
                if (
                    nx < 0 ||
                    ny < 0 ||
                    nx >= xs.length ||
                    ny >= ys.length
                ) {
                    continue;
                }

                if (
                    nodeBlocked(
                        xs[nx],
                        ys[ny]
                    )
                ) {
                    continue;
                }

                if (
                    edgeBlocked(
                        xs[cur.ix],
                        ys[cur.iy],
                        xs[nx],
                        ys[ny]
                    )
                ) {
                    continue;
                }

                const stepLen =
                    Math.abs(
                        xs[nx] - xs[cur.ix]
                    ) +
                    Math.abs(
                        ys[ny] - ys[cur.iy]
                    );

                const turn =
                    cur.dir && cur.dir !== dir
                        ? TURN_PENALTY
                        : 0;

                const tentative =
                    gScore.get(cKey) +
                    stepLen +
                    turn;

                const nKey = key(nx, ny);

                if (
                    !gScore.has(nKey) ||
                    tentative < gScore.get(nKey)
                ) {
                    gScore.set(
                        nKey,
                        tentative
                    );

                    came.set(nKey, {
                        pkey: cKey,
                        dir
                    });

                    open.set(nKey, {
                        ix: nx,
                        iy: ny,
                        dir,
                        f:
                            tentative +
                            h(nx, ny)
                    });
                }
            }
        }

        return null;
    }

    function reconstruct(
        came,
        endKey,
        xs,
        ys,
        key
    ) {
        const pts = [];
        let k = endKey;

        while (k != null) {
            const ix = Math.floor(k / 10000);
            const iy = k % 10000;

            pts.push({
                x: xs[ix],
                y: ys[iy]
            });

            const c = came.get(k);
            k = c ? c.pkey : null;
        }

        pts.reverse();

        return collinearSimplify(pts);
    }

    function collinearSimplify(points) {
        if (points.length < 3) {
            return points;
        }

        const out = [points[0]];

        for (let i = 1; i < points.length - 1; i++) {
            const p = points[i - 1];
            const c = points[i];
            const n = points[i + 1];

            const colX =
                Math.abs(p.x - c.x) < 0.5 &&
                Math.abs(c.x - n.x) < 0.5;

            const colY =
                Math.abs(p.y - c.y) < 0.5 &&
                Math.abs(c.y - n.y) < 0.5;

            if (!(colX || colY)) {
                out.push(c);
            }
        }

        out.push(points[points.length - 1]);

        return out;
    }

    function segmentHitsBox(a, b, box) {
        const minX = Math.min(a.x, b.x);
        const maxX = Math.max(a.x, b.x);
        const minY = Math.min(a.y, b.y);
        const maxY = Math.max(a.y, b.y);

        return (
            maxX > box.left + 0.5 &&
            minX < box.right - 0.5 &&
            maxY > box.top + 0.5 &&
            minY < box.bottom - 0.5
        );
    }



    function buildHorizontalPoints(start, end, config, open) {
        const dir = config.cpuSide === "left" ? -1 : 1; // outward from CPU

        // Open: approach along the card's CPU-facing edge, then out to the
        // merge point. Hugging the edge keeps the run off the panel body.
        if (open) {
            const entryX = nearestEdgeX(end, open);

            return [
                { x: start.x, y: start.y },
                { x: entryX, y: start.y },
                { x: entryX, y: end.y },
                { x: end.x, y: end.y }
            ];
        }

        // Closed: derived L/Z through the channel just outside the CPU edge.
        const channelX = start.x + dir * CHANNEL_GAP;

        return [
            { x: start.x, y: start.y },
            { x: channelX, y: start.y },
            { x: channelX, y: end.y },
            { x: end.x, y: end.y }
        ];
    }

    /*
        CPU pins on the bottom/top edge. Runs vertically out of the pins to a
        horizontal channel, along it to the module column, then into the module.
    */
    function buildVerticalPoints(start, end, config, open) {
        const dir = config.cpuSide === "top" ? -1 : 1; // outward from CPU
        const sideEntry =
            config.moduleSide === "left" || config.moduleSide === "right";

        // Open: approach the merge point from outside the card.
        if (open) {
            if (sideEntry) {
                const laneX = config.moduleSide === "left"
                    ? open.left - CHANNEL_GAP
                    : open.right + CHANNEL_GAP;

                return [
                    { x: start.x, y: start.y },
                    { x: start.x, y: end.y },
                    { x: laneX, y: end.y },
                    { x: end.x, y: end.y }
                ];
            }

            const entryY = nearestEdgeY(end, open);

            return [
                { x: start.x, y: start.y },
                { x: start.x, y: entryY },
                { x: end.x, y: entryY },
                { x: end.x, y: end.y }
            ];
        }

        // Closed: channel sits roughly halfway to the module so the run reads
        // as a bus, but never closer than CHANNEL_GAP to the CPU edge.
        let channelY = start.y + dir * CHANNEL_GAP;
        const midY = start.y + (end.y - start.y) * 0.5;

        channelY =
            dir === 1
                ? Math.max(channelY, midY)
                : Math.min(channelY, midY);

        return [
            { x: start.x, y: start.y },
            { x: start.x, y: channelY },
            { x: end.x, y: channelY },
            { x: end.x, y: end.y }
        ];
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

    function createModules() {
        if (!moduleLayer) return;

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
                redrawTracesSoon();
                forceTraceSync(900);
                activateModule(moduleId);
                openModule(moduleId);
            });
            card.addEventListener("mousemove", () => {
                redrawTracesSoon();
            });
            card.addEventListener("click", () => {
                redrawTracesSoon();
                forceTraceSync(900);
                activateModule(moduleId);
                openModule(moduleId);
            });
        });

        document.querySelectorAll(".module-item").forEach(itemButton => {
            const moduleId = itemButton.dataset.moduleItem;
            const itemIndex = Number(itemButton.dataset.itemIndex);

            itemButton.addEventListener("mouseenter", event => {
                event.stopPropagation();
                redrawTracesSoon();
                forceTraceSync(500);
                showItemDetails(moduleId, itemIndex);
            });

            itemButton.addEventListener("focus", event => {
                event.stopPropagation();
                redrawTracesSoon();
                forceTraceSync(500);
                showItemDetails(moduleId, itemIndex);
            });

            itemButton.addEventListener("click", event => {
                event.stopPropagation();
                redrawTracesSoon();
                forceTraceSync(500);
                showItemDetails(moduleId, itemIndex);
            });
        });
    }

    function activateModule(id) {
        if (!activatedModules.has(id)) {
            activatedModules.add(id);

            const moduleCard = document.querySelector(`[data-module="${id}"]`);
            const statusLabel = moduleCard?.querySelector(".module-status-label");

            moduleCard?.classList.add("module-active", "module-locked");

            if (statusLabel) {
                statusLabel.textContent = "LINKED";
            }

            document
                .querySelector(`[data-trace="${id}"]`)
                ?.classList.add("trace-active", "trace-locked");

            document
                .querySelectorAll(`[data-pad="${id}"]`)
                .forEach(pad => pad.classList.add("pad-active"));

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
        forceTraceSync(1000);

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

        redrawTracesSoon();
        forceTraceSync(700);
    }

    function showItemDetails(moduleId, itemIndex) {
        activateModule(moduleId);
        openModule(moduleId, false);
        renderItemDetails(moduleId, itemIndex);
    }

    function showTraces() {
        if (!pcbLayer) return;

        pcbLayer.classList.add("network-visible");

        redrawTracesSoon();
        forceTraceSync(1600);
    }

    function showModules() {
        if (!moduleLayer) return;

        moduleLayer.classList.add("modules-visible");

        redrawTracesSoon();
        forceTraceSync(1600);
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
