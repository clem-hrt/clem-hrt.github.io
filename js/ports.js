/*
========================================
SYSTEM PORTS
Unlocked after all profile modules are activated
========================================
*/

const Ports = (() => {

    const ports = [
        {
            label: "CV",
            status: "READY",
            href: "assets/cv/CV_EN_HERITIER.pdf",
            type: "download"
        },
        {
            label: "GITHUB",
            status: "LINKED",
            href: "https://github.com/clem-hrt",
            type: "external"
        },
        {
            label: "LINKEDIN",
            status: "LINKED",
            href: "https://www.linkedin.com/in/clementheritier093404227",
            type: "external"
        },
        {
            label: "EMAIL",
            status: "READY",
            href: "mailto:clem.heritier@laposte.net",
            type: "email"
        }
    ];

    function create() {
        const slot = document.querySelector("#system-ports-slot");

        if (!slot) {
            console.warn("Ports: #system-ports-slot not found.");
            return;
        }

        slot.innerHTML = `
            <div class="system-ports">

                <div class="ports-header">
                    <span class="ports-dot"></span>
                    <span>SYSTEM PORTS</span>
                </div>

                <div class="ports-grid">
                    ${ports.map(port => `
                        <a
                            class="system-port"
                            href="${port.href}"
                            ${port.type === "download" ? "download" : ""}
                            ${port.type === "external" ? "target=\"_blank\" rel=\"noopener noreferrer\"" : ""}
                        >
                            <span>${port.label}</span>
                            <strong>${port.status}</strong>
                        </a>
                    `).join("")}
                </div>
            </div>
        `;
    }

    function unlock() {
        const portsPanel = document.querySelector(".system-ports");

        if (!portsPanel) return;

        portsPanel.classList.add("ports-unlocked");
    }

    return {
        create,
        unlock
    };

})();
