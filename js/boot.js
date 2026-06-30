/*
========================================
BOOT ENGINE
Power cable + diagnostic boot sequence
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

                    <div class="boot-diagnostics" aria-live="polite">

                        <div class="boot-diagnostic-line" data-boot-step="power">
                            <span>POWER LINK</span>
                            <strong>WAITING</strong>
                        </div>

                        <div class="boot-diagnostic-line" data-boot-step="core">
                            <span>CORE CHECK</span>
                            <strong>STANDBY</strong>
                        </div>

                        <div class="boot-diagnostic-line" data-boot-step="pcb">
                            <span>PCB BUS</span>
                            <strong>STANDBY</strong>
                        </div>

                        <div class="boot-diagnostic-line" data-boot-step="modules">
                            <span>PROFILE MODULES</span>
                            <strong>STANDBY</strong>
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

        updateDiagnostic("power", "CONNECTING");

        setTimeout(() => {
            socket.classList.add("socket-online");
            updateDiagnostic("power", "ONLINE", true);
        }, 450);

        setTimeout(() => {
            led.classList.add("online");
            statusText.textContent = "ONLINE";
            statusText.classList.add("online-text");

            message.textContent = "Power link established.";
            hint.textContent = "Running embedded portfolio diagnostics...";

            panel.classList.add("boot-online");

            updateDiagnostic("core", "CHECKING");
        }, 850);

        setTimeout(() => {
            updateDiagnostic("core", "OK", true);
            updateDiagnostic("pcb", "LOADING");
            message.textContent = "Loading PCB bus and core communication paths...";
        }, 1350);

        setTimeout(() => {
            updateDiagnostic("pcb", "ONLINE", true);
            updateDiagnostic("modules", "LOADING");
            message.textContent = "Initializing profile modules...";
        }, 1850);

        setTimeout(() => {
            updateDiagnostic("modules", "READY", true);
            hint.textContent = "System ready. Launching interface...";
        }, 2350);

        setTimeout(() => {
            bootLayer.classList.add("boot-fade-out");
        }, 3000);

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
                Network.showTraces();
            }, 200);

            setTimeout(() => {
                CPU.show();
            }, 700);

            setTimeout(() => {
                Network.showModules();
            }, 1300);

        }, 3900);
    }

    function updateDiagnostic(step, status, success = false) {
        const line = document.querySelector(`[data-boot-step="${step}"]`);

        if (!line) return;

        const value = line.querySelector("strong");

        if (!value) return;

        value.textContent = status;

        line.classList.add("diagnostic-active");

        if (success) {
            line.classList.add("diagnostic-success");
        }
    }

    return {
        start
    };

})();
