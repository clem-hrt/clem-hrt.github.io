/*
========================================
CPU ENGINE
Creates the central microcontroller
========================================
*/

const CPU = (() => {

    const cpuLayer = document.querySelector("#cpu-layer");

    function create() {
        cpuLayer.innerHTML = `
            <div class="cpu-wrapper">

                <div class="cpu-chip">

                    <div class="cpu-pins cpu-pins-left">
                        ${createPins(8)}
                    </div>

                    <div class="cpu-core">
                        <span class="cpu-ref">CH-RX01</span>
                        <h2>Clément Héritier</h2>
                        <p>Embedded Systems<br>Robotics Engineer</p>

                        <div class="cpu-core-status">
                            <span class="cpu-led"></span>
                            CORE STANDBY
                        </div>
                    </div>

                    <div class="cpu-pins cpu-pins-right">
                        ${createPins(8)}
                    </div>

                </div>

            </div>
        `;
    }

    function createPins(count) {
        return Array.from({ length: count }, () => `<span></span>`).join("");
    }

    function show() {
        cpuLayer.classList.add("cpu-visible");
    }

    return {
        create,
        show
    };

})();
