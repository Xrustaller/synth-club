const asciiArt =
	` ::::::::  :::   ::: ::::    ::: ::::::::::: :::    :::       ::::::::  :::       :::    ::: :::::::::
:+:    :+: :+:   :+: :+:+:   :+:     :+:     :+:    :+:      :+:    :+: :+:       :+:    :+: :+:    :+:
+:+         +:+ +:+  :+:+:+  +:+     +:+     +:+    +:+      +:+        +:+       +:+    +:+ +:+    +:+
+#++:++#++   +#++:   +#+ +:+ +#+     +#+     +#++:++#++      +#+        +#+       +#+    +:+ +#++:++#+
       +#+    +#+    +#+  +#+#+#     +#+     +#+    +#+      +#+        +#+       +#+    +#+ +#+    +#+
#+#    #+#    #+#    #+#   #+#+#     #+#     #+#    #+#      #+#    #+# #+#       #+#    #+# #+#    #+#
 ########     ###    ###    ####     ###     ###    ###       ########  ########## ########  #########
`;

const version = "v0.1.10-beta";

const terminalLines = [
	"> [INIT] SYNTH OS " + version,
	"> [INIT] Initializing uplink...",
	{ delay: 400 },
	"> [OK] Link established.",
	{ delay: 20 },
	"> Welcome, operator.",
	"> Connected to " + generateNodeId() + "...",
	{ delay: 400 },
	"> Access granted.",
	"",
	{ text: "> VrChat  : ", link: "https://vrc.group/SYNTH.2339" },
	{ text: "> Discord  : ", link: "https://discord.com/invite/GSH33jZhVQ" },
	{ text: "> Telegram : ", link: "https://t.me/synthvrc" },
	"",
	"> [INIT] Initializing color system...",
	{ delay: 100 },
];

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
				currentEl.textContent = "> ";
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
			const content = currentLine.slice(2);
			currentEl.textContent += content[charIndex++] || "";
		} else if (typeof currentLine === "object" && currentLine.link) {
			currentEl._a.textContent += currentLine.link[charIndex++] || "";
		}

		const lineLength = typeof currentLine === "string"
			? currentLine.length - 2
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

function createGlitchLine() {
	const line = document.createElement("div");
	line.className = "glitch-line";
	line.style.top = Math.floor(Math.random() * 100) + "%";
	line.style.backgroundColor = Math.random() > 0.5 ? "#ff5edc" : "#00fff7";
	document.getElementById("glitch-overlay").appendChild(line);
	setTimeout(() => line.remove(), 200);
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
	input.style.minWidth = "10px";

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
			executeCommand(command);
		}
	});
}

function executeCommand(cmd) {
	const lines = [];
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
		case "su n0sha":
			lines.push(
				"> [INIT] Loading n0shatblpkun profile...",
				{ delay: 800 },
				"> [INFO] Bootstrapping underwear subsystem for user: n0sha...",
				{ delay: 400 },
				"> [OK] Underwear initialized successfully."
			);
			break;
		case "su niki":
			lines.push(
				"> [INIT] Loading besniktlp profile...",
				{ delay: 800 },
				"> [INFO] Dongles in other room in progress... 99% complete.",
				{ delay: 400 },
				"> [ERROR] Your attempt was lost in IZOPLIT"
			);
			break;
		case "su xrustaller":
			lines.push(
				"> [INIT] Loading raspberry_yogurt profile...",
				{ delay: 800 },
				"> Sweetness: ✅",
				{ delay: 400 },
				"> Health benefits: ✅",
				{ delay: 400 },
				"> [OK] Successfully loaded"
			);
			break;
		case "clear":
			terminal.innerHTML = "";
			setTimeout(initPrompt, 0);
			return;
		case "about":
			lines.push("> SYNTH CLUB: A place for those who speak through movement. We are online.");
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
	printAnimatedLines(lines, initPrompt);
}

window.onload = () => {
	setTimeout(() => {
		printAscii(() => {
			printAnimatedLines(terminalLines, () => {
				finalizeVisuals();
				setTimeout(initPrompt, 800);
			});
		});
	}, 300);
};