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

                    <div class="cpu-pins cpu-pins-left">
                        ${createPins("left", 8)}
                    </div>

                    <div class="cpu-core">
                        <span class="cpu-ref">CH-RX01</span>
                        <h2>Clément Héritier</h2>
                        <p>Embedded Systems<br>Robotics Engineer</p>

                        <div class="cpu-core-status">
                            <span class="cpu-led"></span>
                            <span id="cpu-status-text">CORE STANDBY</span>
                        </div>
                    </div>

                    <div class="cpu-pins cpu-pins-right">
                        ${createPins("right", 8)}
                    </div>

                </div>

            </div>
        `;
    }

    function createPins(side, count) {
        return Array.from({ length: count }, (_, index) => {
            return `<span class="cpu-pin cpu-pin-${side}" data-pin="${side}-${index + 1}"></span>`;
        }).join("");
    }

    function show() {
        cpuLayer.classList.add("cpu-visible");
    }

    function activateModulePins(moduleId) {
        const pinMap = {
            experience: ["left-1", "left-2"],
            hobbies: ["left-7", "left-8"],
            projects: ["right-1", "right-2"],
            certifications: ["right-7", "right-8"]
        };

        pinMap[moduleId]?.forEach(pinId => {
            document.querySelector(`[data-pin="${pinId}"]`)?.classList.add("pin-active");
        });
    }

    function setCoreActivated() {
        document.querySelector("#cpu-status-text").textContent = "CORE ACTIVATED";
        cpuLayer.classList.add("core-activated");
    }

    return {
        create,
        show,
        activateModulePins,
        setCoreActivated
    };

})();
