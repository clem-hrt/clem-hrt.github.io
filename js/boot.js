/*
========================================
BOOT ENGINE
Power slider + diagnostic energy sequence
========================================
*/

const Boot = (() => {

    const bootLayer = document.querySelector("#boot-layer");

    const timing = {
        socketOnline: 900,
        systemOnline: 1900,
        coreOk: 3300,
        pcbOnline: 4800,
        modulesReady: 6300,
        fadeOut: 7900,
        launchInterface: 9200
    };

    let sliderState = {
        dragging: false,
        connected: false,
        startX: 0,
        currentX: 0,
        maxX: 0
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

                        <div id="power-slider" class="power-slider">

                            <div class="power-cable-rail">
                                <span id="power-current" class="power-current"></span>
                            </div>

                            <button id="power-plug" class="power-plug" aria-label="Slide power cable into socket">

                                <span class="plug-cable-tail"></span>
                                <span class="plug-shell">
                                    <span class="plug-grip">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </span>
                                    <span class="plug-face">
                                        <span class="plug-light"></span>
                                        <span class="plug-text">POWER</span>
                                    </span>
                                    <span class="plug-collar"></span>
                                </span>
                                <span class="plug-prongs">
                                    <span class="plug-prong plug-prong-top"></span>
                                    <span class="plug-prong plug-prong-bottom"></span>
                                </span>

                            </button>

                            <div id="power-socket" class="power-socket">
                                <span class="socket-bezel">
                                    <span class="socket-screw socket-screw-left"></span>
                                    <span class="socket-screw socket-screw-right"></span>

                                    <span class="socket-mouth">
                                        <span class="socket-slot socket-slot-top"></span>
                                        <span class="socket-slot socket-slot-bottom"></span>
                                        <span class="socket-inner-current"></span>
                                    </span>
                                </span>

                                <span class="socket-label">POWER INPUT</span>
                            </div>

                        </div>

                    </div>

                    <div class="boot-diagnostics" aria-live="polite">

                        <div class="boot-diagnostic-line" data-boot-step="power">
                            <span class="diagnostic-energy"></span>
                            <span class="diagnostic-name">POWER LINK</span>
                            <strong>WAITING</strong>
                            <span class="diagnostic-dot"></span>
                        </div>

                        <div class="boot-diagnostic-line" data-boot-step="core">
                            <span class="diagnostic-energy"></span>
                            <span class="diagnostic-name">CORE CHECK</span>
                            <strong>STANDBY</strong>
                            <span class="diagnostic-dot"></span>
                        </div>

                        <div class="boot-diagnostic-line" data-boot-step="pcb">
                            <span class="diagnostic-energy"></span>
                            <span class="diagnostic-name">PCB BUS</span>
                            <strong>STANDBY</strong>
                            <span class="diagnostic-dot"></span>
                        </div>

                        <div class="boot-diagnostic-line" data-boot-step="modules">
                            <span class="diagnostic-energy"></span>
                            <span class="diagnostic-name">PROFILE MODULES</span>
                            <strong>STANDBY</strong>
                            <span class="diagnostic-dot"></span>
                        </div>

                    </div>

                </div>

            </div>
        `;

        initPowerSlider();
    }

    function initPowerSlider() {
        const slider = document.querySelector("#power-slider");
        const plug = document.querySelector("#power-plug");
        const socket = document.querySelector("#power-socket");
        const current = document.querySelector("#power-current");

        if (!slider || !plug || !socket || !current) return;

        computeSliderBounds();

        window.addEventListener("resize", computeSliderBounds);

        plug.addEventListener("pointerdown", event => {
            if (sliderState.connected) return;

            sliderState.dragging = true;

            plug.setPointerCapture(event.pointerId);

            plug.classList.add("is-dragging");

            event.preventDefault();
        });

        plug.addEventListener("pointermove", event => {
            if (!sliderState.dragging || sliderState.connected) return;

            const sliderRect = slider.getBoundingClientRect();
            const plugWidth = plug.offsetWidth;

            let nextX = event.clientX - sliderRect.left - plugWidth / 2;

            nextX = clamp(nextX, 0, sliderState.maxX);

            updatePlugPosition(nextX);
        });

        plug.addEventListener("pointerup", event => {
            if (!sliderState.dragging || sliderState.connected) return;

            sliderState.dragging = false;

            plug.releasePointerCapture(event.pointerId);

            plug.classList.remove("is-dragging");

            const progress = sliderState.maxX === 0
                ? 0
                : sliderState.currentX / sliderState.maxX;

            if (progress >= 0.88) {
                connectPower();
            } else {
                resetPlug();
            }
        });

        function computeSliderBounds() {
            const sliderRect = slider.getBoundingClientRect();
            const socketMouth = socket.querySelector(".socket-mouth");
            const targetRect = socketMouth ? socketMouth.getBoundingClientRect() : socket.getBoundingClientRect();
            const plugWidth = plug.offsetWidth;

            sliderState.maxX = targetRect.left - sliderRect.left - plugWidth + 34;

            sliderState.maxX = Math.max(sliderState.maxX, 0);

            if (!sliderState.connected) {
                updatePlugPosition(0);
            } else {
                updatePlugPosition(sliderState.maxX);
            }
        }

        function updatePlugPosition(x) {
            sliderState.currentX = x;

            const progress = sliderState.maxX === 0
                ? 0
                : x / sliderState.maxX;

            plug.style.transform = `translateY(-50%) translateX(${x}px)`;
            current.style.width = `${progress * 100}%`;

            slider.style.setProperty("--power-progress", progress.toFixed(3));
            slider.classList.toggle("has-power-current", progress > 0.04);

            if (progress > 0.72) {
                socket.classList.add("socket-magnetic");
                plug.classList.add("plug-near-socket");
            } else {
                socket.classList.remove("socket-magnetic");
                plug.classList.remove("plug-near-socket");
            }
        }

        function resetPlug() {
            updatePlugPosition(0);
            socket.classList.remove("socket-magnetic", "socket-engaged");
            slider.classList.remove("has-power-current", "power-current-locked");
            plug.classList.remove("plug-near-socket", "plug-engaged");
        }

        function connectPower() {
            sliderState.connected = true;

            updatePlugPosition(sliderState.maxX);

            socket.classList.add("socket-magnetic", "socket-engaged");
            slider.classList.add("has-power-current", "power-current-locked");
            plug.classList.add("plug-near-socket", "plug-engaged");

            document.querySelector(".boot-screen")?.classList.add("power-connected");

            plug.disabled = true;

            powerOn();
        }
    }

    function powerOn() {
        const statusText = document.querySelector("#boot-status-text");
        const led = document.querySelector(".boot-led");
        const message = document.querySelector(".boot-message");
        const socket = document.querySelector("#power-socket");
        const panel = document.querySelector(".boot-panel");

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

        if (!success) {
            line.classList.add("diagnostic-charging");
        }

        if (success) {
            line.classList.remove("diagnostic-charging");
            line.classList.add("diagnostic-success", "diagnostic-powered");
        }
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    return {
        start
    };

})();
