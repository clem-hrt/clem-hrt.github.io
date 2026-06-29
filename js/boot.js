/*
========================================
BOOT ENGINE
Handles initial power sequence
========================================
*/

const Boot = (() => {

    const bootLayer = document.querySelector("#boot-layer");

    function start() {
        bootLayer.innerHTML = `
            <div class="boot-screen">
                <div class="boot-panel">

                    <span class="boot-label">SYSTEM STATUS</span>

                    <h1>CV SYSTEM</h1>

                    <div class="boot-state">
                        <span class="boot-led"></span>
                        <span id="boot-status-text">OFFLINE</span>
                    </div>

                    <p class="boot-message">
                        Waiting for external power...
                    </p>

                    <button id="power-button" class="power-button">
                        CONNECT POWER
                    </button>

                </div>
            </div>
        `;

        const powerButton = document.querySelector("#power-button");
        powerButton.addEventListener("click", powerOn);
    }

    function powerOn() {
        const statusText = document.querySelector("#boot-status-text");
        const led = document.querySelector(".boot-led");
        const message = document.querySelector(".boot-message");
        const button = document.querySelector("#power-button");
        const panel = document.querySelector(".boot-panel");

        button.disabled = true;
        button.textContent = "POWER CONNECTED";

        led.classList.add("online");
        statusText.textContent = "ONLINE";
        statusText.classList.add("online-text");

        message.textContent = "Power link established. Initializing core modules...";

        panel.classList.add("boot-online");

        setTimeout(() => {
            bootLayer.classList.add("boot-fade-out");
        }, 1300);

        setTimeout(() => {
            bootLayer.innerHTML = "";
            bootLayer.classList.add("boot-hidden");

            CPU.create();
            
            SystemMonitor.create();
            SystemMonitor.setPowerOnline();
            SystemMonitor.setCoreStatus("STANDBY");
            SystemMonitor.setModules(0, Network.getTotalModules());
            SystemMonitor.setConnection("IDLE", { temporary: false});
            
            
            Network.create();

            setTimeout(() => {
                CPU.show();
            }, 200);

            setTimeout(() => {
                Network.show();
            }, 900);
            
        }, 2200);
    }

    return {
        start
    };

})();
