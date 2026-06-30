/*
========================================
BOOT ENGINE
Power cable boot sequence
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

                    <div class="power-rig">

                        <button id="power-plug" class="power-plug" aria-label="Connect power cable">

                            <span class="cable-line"></span>

                            <span class="plug-body">
                                <span class="plug-light"></span>
                                POWER
                            </span>

                            <span class="plug-prongs">
                                <span></span>
                                <span></span>
                            </span>

                        </button>

                        <div id="power-socket" class="power-socket">
                            <span class="socket-core"></span>
                            <span class="socket-label">POWER INPUT</span>
                        </div>

                    </div>

                    <p class="boot-hint">
                        Click the power cable to initialize system.
                    </p>

                </div>

            </div>
        `;

        const powerPlug = document.querySelector("#power-plug");
        powerPlug.addEventListener("click", powerOn);
    }

    function powerOn() {
        const bootScreen = document.querySelector(".boot-screen");
        const statusText = document.querySelector("#boot-status-text");
        const led = document.querySelector(".boot-led");
        const message = document.querySelector(".boot-message");
        const hint = document.querySelector(".boot-hint");
        const plug = document.querySelector("#power-plug");
        const socket = document.querySelector("#power-socket");
        const panel = document.querySelector(".boot-panel");

        plug.disabled = true;

        bootScreen.classList.add("power-connected");

        setTimeout(() => {
            socket.classList.add("socket-online");
        }, 350);

        setTimeout(() => {
            led.classList.add("online");
            statusText.textContent = "ONLINE";
            statusText.classList.add("online-text");

            message.textContent = "Power link established.";
            hint.textContent = "Initializing embedded portfolio core...";

            panel.classList.add("boot-online");
        }, 700);

        setTimeout(() => {
            message.textContent = "Loading CPU, PCB traces and profile modules...";
        }, 1300);

        setTimeout(() => {
            bootLayer.classList.add("boot-fade-out");
        }, 2100);

        setTimeout(() => {
            bootLayer.innerHTML = "";
            bootLayer.classList.add("boot-hidden");

            CPU.create();

            SystemMonitor.create();
            SystemMonitor.setPowerOnline();
            SystemMonitor.setCoreStatus("STANDBY");
            SystemMonitor.setModules(0, Network.getTotalModules());
            SystemMonitor.setConnection("IDLE", { temporary: false });

            Network.create();

            setTimeout(() => {
                CPU.show();
            }, 200);

            setTimeout(() => {
                Network.show();
            }, 900);

        }, 3000);
    }

    return {
        start
    };

})();
