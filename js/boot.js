/*
========================================
BOOT ENGINE
Power rig (cable physics + side-view socket) ? diagnostics ? board handoff
========================================
*/

const Boot = (() => {

    const bootLayer = document.querySelector("#boot-layer");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Diagnostic timeline after the plug seats (ms). ~3.6 s total, was 9.5 s. */
    const timing = reducedMotion
        ? { socketOnline: 100, systemOnline: 250, coreOk: 450, pcbOnline: 650, modulesReady: 850, launch: 1100 }
        : { socketOnline: 300, systemOnline: 800, coreOk: 1500, pcbOnline: 2200, modulesReady: 2900, launch: 3500 };

    /* Rig tuning */
    const SNAP_PROGRESS = 0.9;     // auto-seat while dragging past this
    const RELEASE_PROGRESS = 0.8;  // seat on release past this
    const FLING_PROGRESS = 0.55;   // seat on a fast flick past this
    const FLING_VELOCITY = 0.55;   // px/ms toward the socket
    const IDLE_NUDGE_MS = 3400;    // invite cadence until first interaction
    const SAG_MAX = 26;            // px, cable droop clamp

    const timers = [];
    let launched = false;

    const rig = {
        slider: null, plug: null, socket: null, cable: null, guide: null,
        x: 0, maxX: 0, origin: 0, cy: 0, srcX: 0,
        cableLength: 0,
        sag: SAG_MAX, sagVel: 0,
        dragging: false, connected: false, interacted: false,
        grabOffset: 0,
        lastMoveX: 0, lastMoveT: 0, velocity: 0,
        tween: null, frame: null, idleTimer: null
    };

    /* ======================================================
       MARKUP
    ====================================================== */

    function start() {
        bootLayer.innerHTML = `
            <div class="boot-screen">
                <div class="boot-panel">

                    <span class="boot-label">SYSTEM STATUS</span>

                    <h1 class="boot-title">
                        <span>PORTFOLIO</span>
                        <span>SYSTEM</span>
                    </h1>

                    <p class="boot-identity">Clément Héritier, Embedded Systems &amp; Robotics Engineer</p>

                    <div class="boot-state">
                        <span class="boot-led"></span>
                        <span id="boot-status-text">OFFLINE</span>
                    </div>

                    <p class="boot-message">Board unpowered. Connect the supply to boot the portfolio.</p>

                    <div class="power-rig">
                        <div id="power-slider" class="power-slider is-idle">

                            <svg class="power-cable" aria-hidden="true">
                                <path class="cable-shadow"></path>
                                <path class="cable-body"></path>
                                <path class="cable-highlight"></path>
                                <path class="cable-current"></path>
                            </svg>

                            <div class="power-source" aria-hidden="true">
                                <span class="source-led"></span>
                                <span class="source-label">12V</span>
                                <span class="source-gland"></span>
                            </div>

                            <div class="insert-guide" aria-hidden="true">
                                <span></span><span></span><span></span>
                            </div>

                            <button id="power-plug" class="power-plug" type="button"
                                aria-label="Power plug. Drag it into the socket, or press Enter to connect.">
                                <span class="plug-body">
                                    <span class="plug-boot"></span>
                                    <span class="plug-shell">
                                        <span class="plug-grip"><span></span><span></span><span></span><span></span></span>
                                        <span class="plug-face">
                                            <span class="plug-light"></span>
                                            <span class="plug-text">PWR</span>
                                        </span>
                                    </span>
                                    <span class="plug-nose"></span>
                                    <span class="plug-prongs">
                                        <span class="plug-prong"></span>
                                        <span class="plug-prong"></span>
                                    </span>
                                </span>
                            </button>

                            <div id="power-socket" class="power-socket" title="Power input">
                                <span class="socket-housing">
                                    <span class="socket-cavity"></span>
                                    <span class="socket-led"></span>
                                </span>
                                <span class="socket-flange socket-flange-top"><span class="socket-screw"></span></span>
                                <span class="socket-flange socket-flange-bottom"><span class="socket-screw"></span></span>
                                <span class="socket-contact socket-contact-top"></span>
                                <span class="socket-contact socket-contact-bottom"></span>
                                <span class="socket-leads"><span></span><span></span></span>
                                <span class="socket-pcb"></span>
                                <span class="socket-label">POWER IN</span>
                                <span class="socket-sparks">
                                    <i></i><i></i><i></i><i></i><i></i><i></i>
                                </span>
                            </div>

                        </div>
                    </div>

                    <p class="power-hint" id="power-hint">
                        <svg class="hint-hand" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V10m0-.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-1.2a5 5 0 0 1-4.1-2.2L4.3 14a1.5 1.5 0 0 1 2.4-1.8L9 14"/>
                        </svg>
                        <span class="hint-pointer">Drag the plug into the socket</span>
                        <span class="hint-touch">Slide the plug into the socket</span>
                        <span class="hint-key">or press <kbd>Enter</kbd></span>
                    </p>

                    <div class="boot-diagnostics" aria-live="polite">
                        ${diagnosticLine("power", "POWER LINK", "WAITING")}
                        ${diagnosticLine("core", "CORE CHECK", "STANDBY")}
                        ${diagnosticLine("pcb", "PCB BUS", "STANDBY")}
                        ${diagnosticLine("modules", "PORTFOLIO MODULES", "STANDBY")}
                    </div>

                    <button type="button" class="boot-skip" id="boot-skip">Skip intro</button>

                </div>
            </div>
        `;

        initRig();
    }

    function diagnosticLine(step, name, status) {
        return `
            <div class="boot-diagnostic-line" data-boot-step="${step}">
                <span class="diagnostic-name">${name}</span>
                <span class="diagnostic-energy"></span>
                <strong>${status}</strong>
                <span class="diagnostic-dot"></span>
            </div>
        `;
    }

    /* ======================================================
       RIG
    ====================================================== */

    function initRig() {
        rig.slider = document.querySelector("#power-slider");
        rig.plug = document.querySelector("#power-plug");
        rig.socket = document.querySelector("#power-socket");
        rig.cable = rig.slider?.querySelector(".power-cable");
        rig.guide = rig.slider?.querySelector(".insert-guide");

        if (!rig.slider || !rig.plug || !rig.socket || !rig.cable) return;

        measure();
        startPhysics();
        scheduleNudge();

        window.addEventListener("resize", measure);

        rig.plug.addEventListener("pointerdown", onPointerDown);
        rig.plug.addEventListener("pointermove", onPointerMove);
        rig.plug.addEventListener("pointerup", onPointerUp);
        rig.plug.addEventListener("pointercancel", onPointerUp);
        rig.plug.addEventListener("keydown", onKeyDown);

        rig.socket.addEventListener("click", () => {
            if (!rig.connected && !rig.dragging) autoInsert(650);
        });

        document.querySelector("#boot-skip")?.addEventListener("click", skip);
    }

    /* Geometry is read from the DOM, never hard-coded, so CSS can
       resize the rig per breakpoint without touching this file. */
    function measure() {
        const sliderRect = rig.slider.getBoundingClientRect();
        const flange = rig.socket.querySelector(".socket-flange-top").getBoundingClientRect();
        const source = rig.slider.querySelector(".power-source").getBoundingClientRect();
        const prongs = rig.plug.querySelector(".plug-prongs");

        rig.origin = rig.plug.offsetLeft;
        rig.cy = rig.plug.offsetTop + rig.plug.offsetHeight / 2;
        rig.srcX = source.right - sliderRect.left + 4; /* cable leaves from the gland */

        /* Docked = nose face touching the flange. */
        const noseRight = prongs.offsetLeft;
        rig.maxX = Math.max(flange.left - sliderRect.left - rig.origin - noseRight, 0);

        /* Cable is ~4% longer than the docked span: nearly taut when seated. */
        rig.cableLength = (rig.origin + rig.maxX - rig.srcX) * 1.04;

        rig.slider.style.setProperty("--guide-left", `${rig.origin + rig.plug.offsetWidth + 10}px`);
        rig.slider.style.setProperty("--guide-right", `${sliderRect.right - flange.left + 10}px`);

        rig.cable.setAttribute("viewBox", `0 0 ${sliderRect.width} ${sliderRect.height}`);

        setX(rig.connected ? rig.maxX : Math.min(rig.x, rig.maxX));
    }

    function progress() {
        return rig.maxX === 0 ? 0 : rig.x / rig.maxX;
    }

    function setX(x) {
        const prev = rig.x;
        rig.x = clamp(x, -8, rig.maxX); /* -8: lets the spring-back overshoot read */

        /* Moving the plug kicks the cable: pulling tightens (lifts) it. */
        rig.sagVel -= (rig.x - prev) * 0.35;

        rig.plug.style.transform = `translateX(${rig.x}px)`;

        const p = progress();
        rig.slider.style.setProperty("--progress", p.toFixed(3));
        rig.socket.classList.toggle("socket-magnetic", p > 0.7 && !rig.connected);
        rig.plug.classList.toggle("plug-near-socket", p > 0.7);
        rig.slider.classList.toggle("is-near", p > 0.7);
    }

    /* ---------- cable: damped spring on the sag ---------- */

    function startPhysics() {
        const step = () => {
            const tailX = rig.origin + rig.x + 3;
            const span = Math.max(tailX - rig.srcX, 1);
            const slack = Math.max(rig.cableLength - span, 0);

            /* Parabola arc-length approximation: L ˜ d + 8s²/(3d) ? s = v(3d·slack/8) */
            const target = Math.min(Math.sqrt((3 * span * slack) / 8), SAG_MAX);

            const k = 0.09, c = 0.22;
            rig.sagVel += (target - rig.sag) * k - rig.sagVel * c;
            rig.sag += rig.sagVel;

            drawCable(tailX, Math.max(rig.sag, -4));

            rig.frame = requestAnimationFrame(step);
        };

        step();
    }

    function drawCable(tailX, sag) {
        const a = { x: rig.srcX, y: rig.cy };
        const b = { x: tailX, y: rig.cy };
        const reach = Math.max((b.x - a.x) * 0.36, 20);
        const drop = sag * 1.33;

        const d = `M ${a.x} ${a.y} C ${a.x + reach} ${a.y + drop}, ${b.x - reach} ${b.y + drop}, ${b.x} ${b.y}`;

        rig.cable.querySelectorAll("path").forEach(path => path.setAttribute("d", d));
    }

    /* ---------- pointer ---------- */

    function onPointerDown(event) {
        if (rig.connected) return;

        cancelTween();
        markInteracted();

        rig.dragging = true;
        rig.grabOffset = event.clientX - rig.slider.getBoundingClientRect().left - rig.origin - rig.x;
        rig.lastMoveX = event.clientX;
        rig.lastMoveT = performance.now();
        rig.velocity = 0;

        rig.plug.setPointerCapture(event.pointerId);
        rig.plug.classList.add("is-dragging");
        rig.slider.classList.add("is-engaged");

        event.preventDefault();
    }

    function onPointerMove(event) {
        if (!rig.dragging || rig.connected) return;

        const now = performance.now();
        const dt = Math.max(now - rig.lastMoveT, 1);
        rig.velocity = rig.velocity * 0.6 + ((event.clientX - rig.lastMoveX) / dt) * 0.4;
        rig.lastMoveX = event.clientX;
        rig.lastMoveT = now;

        const sliderLeft = rig.slider.getBoundingClientRect().left;
        setX(event.clientX - sliderLeft - rig.origin - rig.grabOffset);

        if (progress() >= SNAP_PROGRESS) {
            endDrag(event);
            seat();
        }
    }

    function onPointerUp(event) {
        if (!rig.dragging || rig.connected) return;

        endDrag(event);

        const p = progress();

        if (p >= RELEASE_PROGRESS || (p >= FLING_PROGRESS && rig.velocity > FLING_VELOCITY)) {
            seat();
        } else {
            springBack();
        }
    }

    function endDrag(event) {
        rig.dragging = false;
        rig.plug.classList.remove("is-dragging");

        if (event && rig.plug.hasPointerCapture?.(event.pointerId)) {
            rig.plug.releasePointerCapture(event.pointerId);
        }
    }

    /* ---------- keyboard ---------- */

    function onKeyDown(event) {
        if (rig.connected) return;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            autoInsert(700);
        } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            markInteracted();
            cancelTween();
            const dir = event.key === "ArrowRight" ? 1 : -1;
            const next = rig.x + dir * rig.maxX * 0.12;
            tweenTo(next, 160, easeOutCubic, () => {
                if (progress() >= SNAP_PROGRESS) seat();
            });
        }
    }

    /* ---------- motions ---------- */

    function autoInsert(duration) {
        markInteracted();
        cancelTween();
        rig.slider.classList.add("is-engaged");
        tweenTo(rig.maxX * 0.94, reducedMotion ? 80 : duration, easeInOutCubic, seat);
    }

    function springBack() {
        tweenTo(0, reducedMotion ? 80 : 560, easeOutBack, () => {
            rig.slider.classList.remove("is-engaged");
        });
    }

    /* Final few px accelerate in, like a detent catching the plug. */
    function seat() {
        if (rig.connected) return;

        rig.connected = true;
        rig.plug.disabled = true;
        clearTimeout(rig.idleTimer);

        tweenTo(rig.maxX, reducedMotion ? 40 : 140, easeInQuad, () => {
            rig.plug.classList.add("plug-engaged");
            rig.socket.classList.remove("socket-magnetic");
            rig.socket.classList.add("socket-engaged");
            rig.slider.classList.add("power-current-locked");
            document.querySelector(".boot-screen")?.classList.add("power-connected");

            vibrate(18);
            powerOn();
        });
    }

    /* Invitation: a short tug toward the socket until the visitor acts. */
    function scheduleNudge() {
        if (reducedMotion) return;

        clearTimeout(rig.idleTimer);

        rig.idleTimer = setTimeout(() => {
            if (rig.interacted || rig.connected) return;

            const reach = Math.min(rig.maxX * 0.12, 22);

            tweenTo(reach, 260, easeOutCubic, () => {
                tweenTo(0, 520, easeOutBack, scheduleNudge);
            });
        }, IDLE_NUDGE_MS);
    }

    function markInteracted() {
        if (rig.interacted) return;
        rig.interacted = true;
        clearTimeout(rig.idleTimer);
        rig.slider.classList.remove("is-idle");
        document.querySelector("#power-hint")?.classList.add("hint-used");
    }

    function tweenTo(target, duration, ease, done) {
        cancelTween();

        const from = rig.x;
        const to = clamp(target, -8, rig.maxX);
        const t0 = performance.now();

        const tick = now => {
            const t = Math.min((now - t0) / duration, 1);
            setX(from + (to - from) * ease(t));

            if (t < 1) {
                rig.tween = requestAnimationFrame(tick);
            } else {
                rig.tween = null;
                done?.();
            }
        };

        rig.tween = requestAnimationFrame(tick);
    }

    function cancelTween() {
        if (rig.tween) cancelAnimationFrame(rig.tween);
        rig.tween = null;
    }

    /* ======================================================
       POWER-ON SEQUENCE
    ====================================================== */

    function powerOn() {
        const statusText = document.querySelector("#boot-status-text");
        const led = document.querySelector(".boot-led");
        const message = document.querySelector(".boot-message");
        const panel = document.querySelector(".boot-panel");

        updateDiagnostic("power", "CONNECTING");

        later(() => {
            rig.socket.classList.add("socket-online");
            updateDiagnostic("power", "ONLINE", true);
        }, timing.socketOnline);

        later(() => {
            led.classList.add("online");
            statusText.textContent = "ONLINE";
            statusText.classList.add("online-text");
            message.textContent = "Power link established.";
            panel.classList.add("boot-online");
            updateDiagnostic("core", "CHECKING");
        }, timing.systemOnline);

        later(() => {
            updateDiagnostic("core", "OK", true);
            updateDiagnostic("pcb", "LOADING");
            message.textContent = "Routing the PCB bus...";
        }, timing.coreOk);

        later(() => {
            updateDiagnostic("pcb", "ONLINE", true);
            updateDiagnostic("modules", "LOADING");
            message.textContent = "Initialising portfolio modules...";
        }, timing.pcbOnline);

        later(() => {
            updateDiagnostic("modules", "READY", true);
            message.textContent = "System ready.";
        }, timing.modulesReady);

        later(launchInterface, timing.launch);
    }

    function skip() {
        timers.forEach(clearTimeout);
        timers.length = 0;
        markInteracted();
        launchInterface();
    }

    /* ======================================================
       HANDOFF: the boot panel collapses into the CPU core,
       then the bus propagates outward and modules follow.
    ====================================================== */

    function launchInterface() {
        if (launched) return;
        launched = true;

        cancelTween();
        if (rig.frame) cancelAnimationFrame(rig.frame);
        window.removeEventListener("resize", measure);

        CPU.create();
        SystemMonitor.create();
        Ports.create();

        SystemMonitor.setPowerOnline();
        SystemMonitor.setCoreStatus("STANDBY");
        SystemMonitor.setModules(0, Network.getTotalModules());
        SystemMonitor.setConnection("IDLE", { temporary: false });

        Network.create();

        const panel = document.querySelector(".boot-panel");
        const core = document.querySelector(".cpu-core");
        const duration = reducedMotion ? 200 : 900;

        bootLayer.style.pointerEvents = "none";

        if (panel && core && !reducedMotion && panel.animate) {
            panel.classList.add("boot-collapsing");

            const from = panel.getBoundingClientRect();
            const to = core.getBoundingClientRect();
            const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
            const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
            const sx = to.width / from.width;
            const sy = to.height / from.height;

            panel.animate(
                [
                    { transform: "translate(0,0) scale(1,1)", opacity: 1, offset: 0 },
                    { opacity: 1, offset: 0.55 },
                    { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0, offset: 1 }
                ],
                { duration, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" }
            );
        } else {
            bootLayer.classList.add("boot-fade-out");
        }

        setTimeout(() => CPU.show(), reducedMotion ? 0 : 480);
        setTimeout(() => Network.showTraces(), reducedMotion ? 0 : 760);

        setTimeout(() => {
            Network.showModules();
            if (Ports.hasCompletedBefore()) {
                setTimeout(showReturningChoice, 900);
            }
        }, reducedMotion ? 0 : 980);

        setTimeout(() => {
            bootLayer.innerHTML = "";
            bootLayer.classList.add("boot-hidden");
        }, duration + 60);
    }

    /* ======================================================
       RETURNING VISITOR
    ====================================================== */

    function showReturningChoice() {
        if (document.querySelector(".resume-prompt")) return;

        const prompt = document.createElement("div");
        prompt.className = "resume-prompt";
        prompt.innerHTML = `
            <div class="resume-prompt-card" role="dialog" aria-label="Previous session found">
                <span class="resume-prompt-label">SYSTEM MEMORY DETECTED</span>
                <p class="resume-prompt-text">
                    You already explored every module. Restore the completed board or explore it again?
                </p>
                <div class="resume-prompt-actions">
                    <button type="button" class="resume-btn resume-btn-primary" data-resume="resume">Restore board</button>
                    <button type="button" class="resume-btn" data-resume="replay">Explore again</button>
                </div>
            </div>
        `;

        document.body.appendChild(prompt);
        requestAnimationFrame(() => prompt.classList.add("resume-prompt-visible"));

        const resumeBtn = prompt.querySelector('[data-resume="resume"]');
        const replayBtn = prompt.querySelector('[data-resume="replay"]');
        const resumeLabel = "Restore board";
        let remaining = 10;

        resumeBtn.textContent = `${resumeLabel} (${remaining})`;

        let countdownId = setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
                Network.completeAll();
                dismiss();
                return;
            }
            resumeBtn.textContent = `${resumeLabel} (${remaining})`;
        }, 1000);

        const stopTimer = () => {
            if (countdownId) clearInterval(countdownId);
            countdownId = null;
            resumeBtn.textContent = resumeLabel;
        };

        const dismiss = () => {
            stopTimer();
            prompt.classList.remove("resume-prompt-visible");
            setTimeout(() => prompt.remove(), 300);
        };

        resumeBtn.addEventListener("click", () => {
            Network.completeAll();
            dismiss();
        });

        replayBtn.addEventListener("click", dismiss);
    }

    /* ======================================================
       HELPERS
    ====================================================== */

    function updateDiagnostic(step, status, success = false) {
        const line = document.querySelector(`[data-boot-step="${step}"]`);
        const value = line?.querySelector("strong");
        if (!value) return;

        value.textContent = status;
        line.classList.add("diagnostic-active");

        if (success) {
            line.classList.remove("diagnostic-charging");
            line.classList.add("diagnostic-success", "diagnostic-powered");
        } else {
            line.classList.add("diagnostic-charging");
        }
    }

    function later(fn, ms) {
        timers.push(setTimeout(fn, ms));
    }

    function vibrate(ms) {
        try { navigator.vibrate?.(ms); } catch (e) { /* unsupported */ }
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const easeInQuad = t => t * t;
    const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeOutBack = t => {
        const c1 = 1.70158, c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    return { start };

})();