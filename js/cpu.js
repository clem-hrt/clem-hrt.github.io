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
                            ${createPins("left", 8)}
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
                            ${createPins("right", 8)}
                        </div>
                    </div>
    
                    <div class="cpu-pins cpu-pins-bottom">
                        ${createPins("bottom", 8)}
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

    function activateModulePins(moduleId) {
        const pinMap = {
            experience: [
                "left-1", "left-2", "left-3", "left-4"
            ],

            education: [
                "left-5", "left-6", "left-7", "left-8"
            ],

            skills: [
                "top-1", "top-2", "top-3", "top-4",
                "top-5", "top-6", "top-7", "top-8"
            ],

            hobbies: [
                "bottom-1", "bottom-2", "bottom-3", "bottom-4",
                "bottom-5", "bottom-6", "bottom-7", "bottom-8"
            ],

            projects: [
                "right-1", "right-2", "right-3", "right-4"
            ],

            certifications: [
                "right-5", "right-6", "right-7", "right-8"
            ]
        };

        pinMap[moduleId]?.forEach(pinId => {
            document
                .querySelector(`[data-pin="${pinId}"]`)
                ?.classList.add("pin-active");
        });
    }

    function setCoreActivated() {
        cpuLayer.classList.add("core-activated");
    }
    return {
        create,
        show,
        activateModulePins,
        setCoreActivated
    };

})();
