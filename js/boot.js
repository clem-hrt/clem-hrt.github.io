/*
========================================
BOOT ENGINE
Power cable + diagnostic boot sequence
========================================
*/

const Boot = (() => {

    const bootLayer = document.querySelector("#boot-layer");

    const timing = {
        socketOnline: 900,
        systemOnline: 1800,
        coreOk: 3000,
        pcbOnline: 4300,
        modulesReady: 5600,
        fadeOut: 7000,
        launchInterface: 8200
    };

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
                            <span class="diagnostic-name">POWER LINK</span>
                            <strong>WAITING</strong>
                            <span class="diagnostic-dot"></span>
                        </div>

                        <div class="boot-diagnostic-line" data-boot-step="core">
                            <span class="diagnostic-name">CORE CHECK</span>
                            <strong>STANDBY</strong>
                            <span class="diagnostic-dot"></span>
                        </div>

                        <div class="boot-diagnostic-line" data-boot-step="pcb">
                            <span class="diagnostic-name">PCB BUS</span>
                            <strong>STANDBY</strong>
                            <span class="diagnostic-dot"></span>
                        </div>

                        <div class="boot-diagnostic-line" data-boot-step="modules">
                            <span class="diagnostic-name">PROFILE MODULES</span>
                            <strong>STANDBY</strong>
                            <span class="diagnostic-dot"></span>
                        </div>

                    </div>

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
        const plug = document.querySelector("#power-plug");
        const socket = document.querySelector("#power-socket");
        const panel = document.querySelector(".boot-panel");

        plug.disabled = true;
        bootScreen.classList.add("power-connected");

        updateDiagnostic("power", "CONNECTING");

        setTimeout(() => {
            socket.classList.add("socket-online");
            updateDiagnostic("power", "ONLINE", true);
        }, timing.socketOnline);

        setTimeout(() => {
            led.classList.add("online");

            statusText.textContent = "ONLINE";
            statusText.classList.add("online-text");

            message.textContent = "Power link established.";

            panel.classList.add("boot-online");

            updateDiagnostic("core", "CHECKING");
        }, timing.systemOnline);

        setTimeout(() => {
            updateDiagnostic("core", "OK", true);
            updateDiagnostic("pcb", "LOADING");

            message.textContent = "Loading PCB bus and core communication paths...";
        }, timing.coreOk);

        setTimeout(() => {
            updateDiagnostic("pcb", "ONLINE", true);
            updateDiagnostic("modules", "LOADING");

            message.textContent = "Initializing profile modules...";
        }, timing.pcbOnline);

        setTimeout(() => {
            updateDiagnostic("modules", "READY", true);

            message.textContent = "System ready. Launching interface...";
        }, timing.modulesReady);

        setTimeout(() => {
            bootLayer.classList.add("boot-fade-out");
        }, timing.fadeOut);

        setTimeout(() => {
            launchInterface();
        }, timing.launchInterface);
    }

    function launchInterface() {
        bootLayer.innerHTML = "";
        bootLayer.classList.add("boot-hidden");

        CPU.create();
        SystemMonitor.create();
        Ports.create();
        
        SystemMonitor.setPowerOnline();
        SystemMonitor.setCoreStatus("STANDBY");
        SystemMonitor.setModules(0, Network.getTotalModules());
        SystemMonitor.setConnection("IDLE", { temporary: false });

        Network.create();

        setTimeout(() => {
            Network.showTraces();
        }, 350);

        setTimeout(() => {
            CPU.show();
        }, 1100);

        setTimeout(() => {
            Network.showModules();
        }, 2000);
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
