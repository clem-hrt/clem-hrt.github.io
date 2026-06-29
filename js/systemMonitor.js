/*
========================================
SYSTEM MONITOR
Embedded inside the CPU core
========================================
*/

const SystemMonitor = (() => {

    const state = {
        power: "OFFLINE",
        core: "STANDBY",
        modulesActive: 0,
        modulesTotal: 6,
        connection: "IDLE"
    };

    let connectionTimeout = null;

    function create() {
        const slot = document.querySelector("#cpu-monitor-slot");

        if (!slot) {
            console.warn("SystemMonitor: #cpu-monitor-slot not found.");
            return;
        }

        slot.innerHTML = `
            <div class="core-monitor">

                <div class="core-monitor-header">
                    <span class="core-monitor-dot"></span>
                    <span>SYSTEM MONITOR</span>
                </div>

                <div class="core-monitor-grid">

                    <div class="core-monitor-row">
                        <span>POWER</span>
                        <strong id="core-monitor-power">OFFLINE</strong>
                    </div>

                    <div class="core-monitor-row">
                        <span>CORE</span>
                        <strong id="core-monitor-core">STANDBY</strong>
                    </div>

                    <div class="core-monitor-row">
                        <span>MODULES</span>
                        <strong id="core-monitor-modules">0 / 6</strong>
                    </div>

                    <div class="core-monitor-row">
                        <span>LINK</span>
                        <strong id="core-monitor-connection">IDLE</strong>
                    </div>

                </div>

                <div class="core-monitor-progress">
                    <span id="core-monitor-progress-bar"></span>
                </div>

            </div>
        `;

        render();
    }

    function setPowerOnline() {
        state.power = "ONLINE";
        render();
    }

    function setCoreStatus(status) {
        state.core = status.toUpperCase();
        render();
    }

    function setModules(active, total = 6) {
        state.modulesActive = active;
        state.modulesTotal = total;
        render();
    }

    function setConnection(label, options = { temporary: true }) {
        state.connection = label.toUpperCase();
        render();

        window.clearTimeout(connectionTimeout);

        if (options.temporary && state.connection !== "STABLE") {
            connectionTimeout = window.setTimeout(() => {
                state.connection = "IDLE";
                render();
            }, 1300);
        }
    }

    function render() {
        const power = document.querySelector("#core-monitor-power");
        const core = document.querySelector("#core-monitor-core");
        const modules = document.querySelector("#core-monitor-modules");
        const connection = document.querySelector("#core-monitor-connection");
        const progressBar = document.querySelector("#core-monitor-progress-bar");

        if (!power || !core || !modules || !connection || !progressBar) return;

        power.textContent = state.power;
        core.textContent = state.core;
        modules.textContent = `${state.modulesActive} / ${state.modulesTotal}`;
        connection.textContent = state.connection;

        const progress = state.modulesTotal === 0
            ? 0
            : (state.modulesActive / state.modulesTotal) * 100;

        progressBar.style.width = `${progress}%`;

        power.classList.toggle("is-online", state.power === "ONLINE");
        core.classList.toggle("is-online", state.core === "ACTIVATED");
        modules.classList.toggle("is-online", state.modulesActive === state.modulesTotal);
        connection.classList.toggle("is-online", state.connection !== "IDLE");
    }

    return {
        create,
        setPowerOnline,
        setCoreStatus,
        setModules,
        setConnection
    };

})();
