/*
========================================
SYSTEM MONITOR
Displays global portfolio system state
========================================
*/

const SystemMonitor = (() => {

    const systemLayer = document.querySelector("#system-layer");

    const state = {
        power: "OFFLINE",
        core: "STANDBY",
        modulesActive: 0,
        modulesTotal: 4,
        connection: "IDLE"
    };

    function create() {
        systemLayer.innerHTML = `
            <aside class="system-monitor">

                <div class="monitor-header">
                    <span class="monitor-dot"></span>
                    <span>SYSTEM MONITOR</span>
                </div>

                <div class="monitor-row">
                    <span>POWER</span>
                    <strong id="monitor-power">OFFLINE</strong>
                </div>

                <div class="monitor-row">
                    <span>CORE</span>
                    <strong id="monitor-core">STANDBY</strong>
                </div>

                <div class="monitor-row">
                    <span>MODULES</span>
                    <strong id="monitor-modules">0 / 4</strong>
                </div>

                <div class="monitor-row">
                    <span>CONNECTION</span>
                    <strong id="monitor-connection">IDLE</strong>
                </div>

                <div class="monitor-progress">
                    <span id="monitor-progress-bar"></span>
                </div>

            </aside>
        `;

        render();
    }

    function show() {
        systemLayer.classList.add("system-monitor-visible");
    }

    function setPowerOnline() {
        state.power = "ONLINE";
        render();
    }

    function setCoreStatus(status) {
        state.core = status;
        render();
    }

    function setModules(active, total = 4) {
        state.modulesActive = active;
        state.modulesTotal = total;
        render();
    }

    function setConnection(label) {
        state.connection = label.toUpperCase();
        render();

        window.clearTimeout(setConnection.timeout);

        setConnection.timeout = window.setTimeout(() => {
            if (state.core !== "ACTIVATED") {
                state.connection = "IDLE";
                render();
            }
        }, 1400);
    }

    function render() {
        const power = document.querySelector("#monitor-power");
        const core = document.querySelector("#monitor-core");
        const modules = document.querySelector("#monitor-modules");
        const connection = document.querySelector("#monitor-connection");
        const progressBar = document.querySelector("#monitor-progress-bar");

        if (!power || !core || !modules || !connection || !progressBar) return;

        power.textContent = state.power;
        core.textContent = state.core;
        modules.textContent = `${state.modulesActive} / ${state.modulesTotal}`;
        connection.textContent = state.connection;

        const progress = state.modulesTotal === 0
            ? 0
            : (state.modulesActive / state.modulesTotal) * 100;

        progressBar.style.width = `${progress}%`;

        power.classList.toggle("monitor-online", state.power === "ONLINE");
        core.classList.toggle("monitor-online", state.core === "ACTIVATED");
        modules.classList.toggle("monitor-online", state.modulesActive === state.modulesTotal);
        connection.classList.toggle("monitor-online", state.connection !== "IDLE");
    }

    return {
        create,
        show,
        setPowerOnline,
        setCoreStatus,
        setModules,
        setConnection
    };

})();
