const asciiArt =
	` ::::::::  :::   ::: ::::    ::: ::::::::::: :::    :::       ::::::::  :::       :::    ::: :::::::::
:+:    :+: :+:   :+: :+:+:   :+:     :+:     :+:    :+:      :+:    :+: :+:       :+:    :+: :+:    :+:
+:+         +:+ +:+  :+:+:+  +:+     +:+     +:+    +:+      +:+        +:+       +:+    +:+ +:+    +:+
+#++:++#++   +#++:   +#+ +:+ +#+     +#+     +#++:++#++      +#+        +#+       +#+    +:+ +#++:++#+
       +#+    +#+    +#+  +#+#+#     +#+     +#+    +#+      +#+        +#+       +#+    +#+ +#+    +#+
#+#    #+#    #+#    #+#   #+#+#     #+#     #+#    #+#      #+#    #+# #+#       #+#    #+# #+#    #+#
 ########     ###    ###    ####     ###     ###    ###       ########  ########## ########  #########
`;

const version = "v0.1.17-beta";

const asciiEl = document.getElementById("ascii-logo");
const terminal = document.getElementById("terminal");

function generateNodeId() {
	const hex = "0123456789ABCDEF";
	let id = "";
	for (let i = 0; i < 4; i++) {
		id += hex[Math.floor(Math.random() * 16)];
	}
	return `NODE-${id}`;
}

function printAscii(onComplete) {
	let asciiIndex = 0;
	function typeAscii() {
		if (asciiIndex < asciiArt.length) {
			asciiEl.textContent += asciiArt[asciiIndex++];
			setTimeout(typeAscii, 0.01);
		} else {
			onComplete?.();
		}
	}
	typeAscii();
}

function printAnimatedLines(lines, onComplete) {
	let lineIndex = 0;
	let charIndex = 0;
	let currentEl = null;

	function nextChar() {
		if (lineIndex >= lines.length) {
			onComplete?.();
			return;
		}

		const currentLine = lines[lineIndex];

		if (typeof currentLine === "object" && currentLine.delay) {
			setTimeout(() => {
				lineIndex++;
				nextChar();
			}, currentLine.delay);
			return;
		}

		if (!currentEl) {
			currentEl = document.createElement("div");

			if (typeof currentLine === "string") {
				currentEl.textContent = "";
			} else if (typeof currentLine === "object" && currentLine.text && currentLine.link) {
				currentEl.textContent = currentLine.text;
				const a = document.createElement("a");
				a.href = currentLine.link;
				a.target = "_blank";
				a.style.color = "#ff5edc";
				a.style.textDecoration = "none";
				a.textContent = "";
				currentEl.appendChild(a);
				currentEl._a = a;
			}

			terminal.appendChild(currentEl);
		}

		if (typeof currentLine === "string") {
			currentEl.textContent += currentLine[charIndex++] || "";
		} else if (typeof currentLine === "object" && currentLine.link) {
			currentEl._a.textContent += currentLine.link[charIndex++] || "";
		}

		const lineLength = typeof currentLine === "string"
			? currentLine.length
			: currentLine.link.length;

		if (charIndex < lineLength) {
			setTimeout(nextChar, 10);
		} else {
			lineIndex++;
			charIndex = 0;
			currentEl = null;
			setTimeout(nextChar, 75);
		}
	}

	nextChar();
}

function finalizeVisuals() {
	setTimeout(() => {
		const container = document.getElementById("visual-container");
		const msg = document.createElement("div");
		msg.textContent = "> [OK] Color system online.";
		container.classList.remove("desaturated");
		terminal.appendChild(msg);
	}, 400);
}

function createGlitchLine(count = 1, delay = 0, initialDelay = 0) {
	setTimeout(() => {
		for (let i = 0; i < count; i++) {
			setTimeout(() => {
				const line = document.createElement("div");
				line.className = "glitch-line";
				line.style.top = Math.floor(Math.random() * 100) + "%";
				line.style.backgroundColor = Math.random() > 0.5 ? "#ff5edc" : "#00fff7";
				document.getElementById("glitch-overlay").appendChild(line);
				setTimeout(() => line.remove(), 200);
			}, i * delay);
		}
	}, initialDelay);
}

setInterval(() => {
	if (Math.random() < 0.3) {
		const count = Math.floor(Math.random() * 3) + 1;
		for (let i = 0; i < count; i++) createGlitchLine();
	}
}, 300);

function initPrompt() {
	const promptLine = document.createElement("div");
	const input = document.createElement("span");
	input.contentEditable = true;
	input.className = "terminal-input";
	input.spellcheck = false;
	input.style.outline = "none";
	input.style.display = "inline-block";
	input.style.minWidth = "12px";

	promptLine.innerHTML = '> ';
	promptLine.appendChild(input);
	terminal.appendChild(promptLine);
	input.focus();

	input.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const command = input.textContent.trim();
			input.remove();
			const staticLine = document.createElement("div");
			staticLine.textContent = `> ${command}`;
			terminal.replaceChild(staticLine, promptLine);
			if (command === "init"){
				terminal.innerHTML = "";
				const container = document.getElementById("visual-container");
				container.classList.add("desaturated");
				executeCommand("init", () => {
					finalizeVisuals();
					setTimeout(initPrompt, 800);
				});
			}
			else {
				executeCommand(command, initPrompt);
			}
		}
	});
}

//function executeCommand(cmd, onComplete) {
//	const lines = [];
//
//	const finish = () => printAnimatedLines(lines, onComplete);
//
//	if (cmd.toLowerCase() === "clear") {
//		terminal.innerHTML = "";
//		setTimeout(initPrompt, 0);
//		return;
//	}
//
//	fetch("/api/console", {
//		method: "POST",
//		headers: {
//			"Content-Type": "application/json",
//		},
//		body: JSON.stringify({ command: cmd }),
//	})
//		.then((res) => res.json())
//		.then((data) => {
//			if (Array.isArray(data)) {
//				for (const item of data) lines.push(item);
//			} else {
//				lines.push("> " + String(data));
//			}
//			printAnimatedLines(lines, initPrompt);
//		})
//		.catch((err) => {
//			lines.push("> [ERROR] " + err.message);
//			printAnimatedLines(lines, initPrompt);
//		});
//
//	finish();
//}

function executeCommand(cmd, onComplete) {
	const lines = [];

	const finish = () => printAnimatedLines(lines, onComplete);

	switch (cmd.toLowerCase()) {
		case "help":
			lines.push(
				"> Available commands:",
				"> help     - Show this help message",
				"> clear    - Clear the terminal",
				"> about    - Info about SYNTH CLUB",
				"> version  - Show OS version",
				"> su user  - Change the effective user",
				"> date     - Print current date/time",
				"> echo     - Usage: echo [text]",
				"> random   - Get random number",
				"> contact  - Show contact email",
				"> mood     - System mood status",
				"> glitch   - Trigger glitch effect",
				"> color    - Current color scheme",
				"> author   - Show author credits"
			);
			break;
		case "init":
			terminal.innerHTML = "";
			lines.push(
				"> SYNTH OS " + version,
				"> [INIT] Initializing uplink...",
				{ delay: 400 },
				"> [OK] Link established.",
				{ delay: 20 },
				"> Welcome, operator.",
				"> Connected to " + generateNodeId() + "...",
				{ delay: 400 },
				"> Access granted.",
				"> ",
				{ text: "> VrChat  : ", link: "https://vrc.group/SYNTH.2339" },
				{ text: "> Discord  : ", link: "https://discord.com/invite/GSH33jZhVQ" },
				{ text: "> Telegram : ", link: "https://t.me/synthvrc" },
				"> ",
				"> [INIT] Initializing color system...",
				{ delay: 100 },
			);
			break;
		case "su n0sha":
			lines.push(
				"> [INIT] Loading n0shatblpkun profile...",
				{ delay: 800 },
				"> [INFO] Bootstrapping underwear subsystem for user: n0sha...",
				{ delay: 600 },
				"> [OK] Underwear initialized successfully."
			);
			break;
		case "su niki":
			lines.push(
				"> [INIT] Loading besniktlp profile...",
				{ delay: 800 },
				"> [INFO] Dongles in other room in progress... 99% complete.",
				{ delay: 600 },
				"> [ERROR] Your attempt was lost in IZOPLIT"
			);
			createGlitchLine(4, 5, 1400);
			break;
		case "su xrustaller":
			lines.push(
				"> [INIT] Loading raspberry_yogurt profile...",
				{ delay: 800 },
				"> Sweetness: OK",
				{ delay: 600 },
				"> Health benefits: OK",
				{ delay: 600 },
				"> Successfully loaded"
			);
			break;
		case "su vanilla":
			lines.push(
				"> [INIT] Loading vanilla_neocore profile...",
				{ delay: 800 },
				"> [INFO] Scanning for cozy protocols...",
				{ delay: 600 },
				"> [WARN] Overload detected: too much chill.",
				{ delay: 800 },
				"> [OK] Comfort systems balanced. Proceed."
			);
			createGlitchLine(5, 10, 1400);
			break;
		case "su viteok":
			lines.push(
				"> [INIT] Summoning MILFware...",
				{ delay: 800 },
				"> [CPU] Overheating from raw desire...",
				{ delay: 600 },
				"> [PANTS] Error 404: Not Found.",
				{ delay: 800 },
				"> [CRITICAL] Bedframe.exe has crashed from excessive load"
			);
			createGlitchLine(40, 10, 2000);
			break;
		case "su lenokail":
			lines.push(
				"> [INIT] Booting Lenokail.core...",
				{ delay: 800 },
				"> [INFO] Loading world_creator.dll",
				{ delay: 600 },
				"> [INFO] Importing mesh: dreams.fbx...",
				{ delay: 600 },
				"> [INFO] Applying texture: inspiration.png",
				{ delay: 500 },
				"> [INFO] Baking lightmaps... (please wait — beauty takes time)",
				{ delay: 800 },
				"> [WARNING] Shader overload detected — too much style.",
				{ delay: 700 },
				"> [INFO] Compiling script: god_mode.cs",
				{ delay: 600 },
				"> [OK] Reality successfully overwritten.",
				{ delay: 600 },
				"> [NOTE] Welcome to Lenoverse™. Don’t forget to press Play."
			);
			createGlitchLine(25, 0, 3200);
			break;
		case "su shadola":
			lines.push(
				"> [INIT] Connecting to VIP_Network.shd...",
				{ delay: 800 },
				"> [INFO] Accessing trusted_hosts.db — 7497 contacts verified.",
				{ delay: 600 },
				"> [INFO] Microphone calibrated — tone: smooth | charisma: 100%",
				{ delay: 600 },
				"> [FILTER] Negative vibes detected... neutralized.",
				{ delay: 600 },
				"> [CATCHPHRASE] No negativity™.",
				{ delay: 700 },
				"> [WARNING] Social turbulence ahead...",
				{ delay: 600 },
				"> [ACTION] Deploying charm_protocol_v2.1...",
				{ delay: 600 },
				"> [INFO] Smiles engaged. Awkward silences resolved.",
				{ delay: 600 },
				"> [OK] Situation defused with elegance.",
				{ delay: 600 },
				"> [NOTE] Everyone’s cool. No bridges burned."
			);
			createGlitchLine(100, 1, 3200);
			break;
		case "su pezetuv2":
			lines.push(
				"> [INIT] Loading pozetuv2 profile...",
				{ delay: 800 },
				"> [INFO] Is it really positive?",
				{ delay: 600 },
				"> [ERROR] Data is deleted for this request.",
			);
			createGlitchLine(50, 1, 1500);
			break;
		case "su pupupu":
			lines.push(
				"> Invalid signature. Did you mean \"pururut\"?",
			);
			break;
		case "su pururut":
			lines.push(
				"> [INIT] Reconstructing identity from — / / / fragment mismatch",
				{ delay: 800 },
				"> [INFO] Blender attached — shape_memory.breath()",
				{ delay: 600 },
				"> [INFO] Unity unstable — light leaking through seams",
				{ delay: 200 },
				"> [INFO] Project received — integrity low, refinement required",
				{ delay: 200 },
				"> [INFO] Attempting to activate protocol \"MISH\"...",
				{ delay: 100 },
				"> [WARN] echo response: \"uh.. am sleeping.. what's up?\"",
				{ delay: 600 },
				"> [INFO] override accepted — signal degrading",
				{ delay: 100 },
				"> [WARN] echo response: \"сome on, leave me alone..\"",
				{ delay: 600 },
				"> [INFO] reply: \"Fine..\" — patch transmitted (UnityFix_v2.unitypackage)",
				{ delay: 800 },
				"> [ERROR] Protocol error: \"MISH\" connection interrupted",
			);
			createGlitchLine(50, 1, 1500);
			break;
		case "su ssnor":
			lines.push(
				"> [Error] You are entering a state of abundance and lust, get ready to jump to SSnor...",
				{ delay: 800 },
				"> [Jump_value \"true\"] Jump in 3",
				{ delay: 1000 },
				"> 2",
				{ delay: 1000 },
				"> 1",
				{ delay: 1000 },
				"[Value_true \"lust_abundance\"] Jump OK <",
			);
			createGlitchLine(200, 1, 6500);
			break;
		case "su halerick":
			lines.push(
				"> [INIT] Deploying Halerick module...",
				{ delay: 800 },
				"> [INFO] Syncing with Metronome Protocol...",
				{ delay: 600 },
				"> OK",
				{ delay: 200 },
				"> [VOICE] Happy Internet Day",
				{ delay: 800 },
				"> [ALERT] Raise your goddamn glasses",
				{ delay: 400 },
				"> [INFO] Checking hype reserves...",
				{ delay: 800 },
				"> 144% detected",
				{ delay: 200 },
				"> [STATUS] Celebration mode activated. Let the flexing begin",
			);
			createGlitchLine(200, 1, 6500);
			break;
		case "clear":
			terminal.innerHTML = "";
			setTimeout(initPrompt, 0);
			return;
		case "about":
			lines.push("> SYNTH CLUB: A place for those who speak with movement. We are online.");
			break;
		case "version":
			lines.push("> SYNTH OS " + version);
			break;
		case "date":
			lines.push(`> ${new Date().toLocaleString()}`);
			break;
		case "echo":
			lines.push("> Usage: echo [text]");
			break;
		case "random":
			lines.push(`> Random number: ${Math.floor(Math.random() * 1000)}`);
			break;
		case "contact":
			lines.push("> Contact: barmetronome@gmail.com");
			break;
		case "mood":
			lines.push("> SYSTEM MOOD: 🌑🌑🌑 dark, calm, and ready 🌑🌑🌑");
			break;
		case "glitch":
			lines.push("> Injecting glitch...");
			createGlitchLine();
			createGlitchLine();
			break;
		case "color":
			lines.push("> Color scheme: SYNTH (neon/cyan/pink)");
			break;
		case "author":
			lines.push("> [AUTHOR] 2025 © Xrustaller");
			break;
		case "":
			lines.push(">");
			break;
		default:
			lines.push(`> Unknown command: ${cmd}`);
			break;
	}
	finish();
}

window.onload = () => {
	setTimeout(() => {
		printAscii(() => {
			executeCommand("init", () => {
				finalizeVisuals();
				setTimeout(initPrompt, 800);
			});
		});
	}, 300);
};