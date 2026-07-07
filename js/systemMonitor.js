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
        itemsActive: 0,
        itemsTotal: 17,
        currentBus: "IDLE",
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
                        <strong id="core-monitor-modules">
                            <span class="monitor-module-led-row">
                                <span class="monitor-module-dot is-alert"></span>
                                <span class="monitor-module-dot is-alert"></span>
                                <span class="monitor-module-dot is-alert"></span>
                                <span class="monitor-module-dot is-alert"></span>
                                <span class="monitor-module-dot is-alert"></span>
                                <span class="monitor-module-dot is-alert"></span>
                            </span>
                        </strong>
                    </div>

                    <div class="core-monitor-row">
                        <span>SCAN BUS</span>
                        <strong id="core-monitor-connection">
                            <span class="scan-count">00 / 17</span>
                        </strong>
                    </div>
                </div>

                <div class="core-monitor-progress">
                    <span id="core-monitor-progress-bar"></span>
                </div>

            </div>
        `;

        render();
    }
    function setItems(active, total = 17, bus = "IDLE") {
        state.itemsActive = active;
        state.itemsTotal = total;
        state.currentBus = bus.toUpperCase();
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

        const modulesComplete = state.modulesActive === state.modulesTotal;
        const itemsComplete = state.itemsActive === state.itemsTotal;
        power.textContent = state.power;
        core.textContent = state.core;
        modules.innerHTML = `
            <span class="monitor-module-led-row">
                ${Array.from({ length: state.modulesTotal }, (_, index) => `
                    <span class="monitor-module-dot ${index < state.modulesActive ? "is-clear" : "is-alert"}"></span>
                `).join("")}
            </span>
        `;
        connection.innerHTML = `
            <span class="scan-count">
                ${String(state.itemsActive).padStart(2, "0")} / ${String(state.itemsTotal).padStart(2, "0")}
            </span>
            <span class="scan-bus-label">
                ${itemsComplete ? "LOCKED" : state.currentBus}
            </span>
        `;
        const progress = state.itemsTotal === 0
            ? 0
            : (state.itemsActive / state.itemsTotal) * 100;

        progressBar.style.width = `${progress}%`;

        power.classList.toggle("is-online", state.power === "ONLINE");
        core.classList.toggle("is-online", state.core === "ACTIVATED");
        modules.classList.toggle("modules-alert", !modulesComplete);
        modules.classList.toggle("modules-clear", modulesComplete);
        modules.classList.toggle("is-online", modulesComplete);
        connection.classList.toggle("scan-active", state.itemsActive > 0 && !itemsComplete);
        connection.classList.toggle("scan-complete", itemsComplete);
        connection.classList.toggle("is-online", state.itemsActive > 0);
    }

    return {
        create,
        setPowerOnline,
        setCoreStatus,
        setModules,
        setItems,
        setConnection
    };

})();
