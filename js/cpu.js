/*
========================================
CPU ENGINE
Central microcontroller state
========================================
*/

const CPU = (() => {

    const cpuLayer = document.querySelector("#cpu-layer");

    function create() {
        cpuLayer.innerHTML = `
            <div class="cpu-wrapper">
                <div class="cpu-chip">
                    <div class="cpu-row">
                        <div class="cpu-pins cpu-pins-left">
                            ${createPins("left", 12)}
                        </div>
    
                        <div class="cpu-core">
                            <span class="cpu-corner cpu-corner-tl"></span>
                            <span class="cpu-corner cpu-corner-tr"></span>
                            <span class="cpu-corner cpu-corner-bl"></span>
                            <span class="cpu-corner cpu-corner-br"></span>
    
                            <div class="cpu-core-grid"></div>
    
                            <div class="cpu-core-content">
                                <div class="cpu-identity">
                                    <span class="cpu-ref">CH-RX01</span>
                                    <span class="cpu-subref">CORE MODULE</span>
                                </div>
    
                                <h2>Clément Héritier</h2>
    
                                <p>
                                    Embedded Systems & Robotics Engineer
                                </p>
    
                                <div id="cpu-monitor-slot"></div>
    
                                <div id="system-ports-slot"></div>
                            </div>
                        </div>
    
                        <div class="cpu-pins cpu-pins-right">
                            ${createPins("right", 12)}
                        </div>
                    </div>
    
                    <div class="cpu-pins cpu-pins-bottom">
                        ${createPins("bottom", 12)}
                    </div>
                </div>
            </div>
        `;
    }

    function createPins(side, count) {
        return Array.from({ length: count }, (_, index) => {
            return `
                <span 
                    class="cpu-pin cpu-pin-${side}" 
                    data-pin="${side}-${index + 1}">
                </span>
            `;
        }).join("");
    }

    function show() {
        cpuLayer.classList.add("cpu-visible");
    }

    const itemPinPairs = {
        experience: [
            ["left-1", "left-2"],
            ["left-3", "left-4"],
            ["left-5", "left-6"]
        ],
    
        education: [
            ["left-7", "left-8"],
            ["left-9", "left-10"],
            ["left-11", "left-12"]
        ],
    
        projects: [
            ["right-1", "right-2"],
            ["right-3", "right-4"]
        ],
    
        skills: [
            ["right-5", "right-6"],
            ["right-7", "right-8"],
            ["right-9", "right-10"],
            ["right-11", "right-12"]
        ],
    
        hobbies: [
            ["bottom-1", "bottom-2"],
            ["bottom-3", "bottom-4"],
            ["bottom-5", "bottom-6"]
        ],
    
        certifications: [
            ["bottom-7", "bottom-8"],
            ["bottom-9", "bottom-10"]
        ]
    };
    
    const activatedItemPinPairs = new Set();
    
    let currentItemPinPair = null;
    
    function activateItemPins(moduleId, itemIndex) {
        const pair = itemPinPairs[moduleId]?.[itemIndex];
    
        if (!pair) return;
    
        const key = `${moduleId}-${itemIndex}`;
    
        currentItemPinPair = key;
        activatedItemPinPairs.add(key);
    
        document
            .querySelectorAll(".cpu-pin")
            .forEach(pin => {
                pin.classList.remove(
                    "pin-active",
                    "pin-item-active",
                    "pin-item-locked"
                );
            });
    
        activatedItemPinPairs.forEach(savedKey => {
            const [savedModuleId, savedItemIndex] =
                savedKey.split("-");
    
            const savedPair =
                itemPinPairs[savedModuleId]?.[
                    Number(savedItemIndex)
                ];
    
            if (!savedPair) return;
    
            savedPair.forEach(pinId => {
                document
                    .querySelector(
                        `[data-pin="${pinId}"]`
                    )
                    ?.classList.add(
                        "pin-active",
                        "pin-item-locked"
                    );
            });
        });
    
        pair.forEach(pinId => {
            document
                .querySelector(`[data-pin="${pinId}"]`)
                ?.classList.add(
                    "pin-active",
                    "pin-item-locked",
                    "pin-item-active"
                );
        });
    }

    function setCoreActivated() {
        cpuLayer.classList.add("core-activated");
    }
    return {
        create,
        show,
        activateItemPins,
        setCoreActivated
    };

})();
