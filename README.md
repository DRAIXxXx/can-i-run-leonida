# Can I Run Leonida

An unofficial, browser-based PC hardware estimator for Project Leonida. Select a CPU, GPU and RAM amount to compare against community hardware ranges.

## Run locally

Serve this folder with any static web server. For example, run `python -m http.server 8000` and open `http://localhost:8000`. No build step or API keys are required.

## Estimates and sources

The estimator uses hand-maintained benchmark bands and community predictions. Leonida gameplay compatibility and FPS remain unverified. Sources are available inside the checker.

The searchable catalog focuses on Intel Core and Ryzen CPUs, GeForce, Radeon
RX and Intel Arc graphics, plus the original laptop and integrated choices.
It excludes obsolete families, server/datacenter hardware, and obscure GPU
board revisions. The names-only extract contains 1,039 CPUs and 307 GPUs from
[TechAPI](https://github.com/GetTechAPI/TechAPI), licensed CC BY-SA 4.0; see
[the data notice](assets/data/README.md). Missing models can still be entered
manually. Catalog inclusion is separate from benchmark coverage: unranked
models show Unknown.

The 1080p Low bands use [Silliana’s proposed range from PR #3](https://github.com/assttro/can-i-run-leonida/pull/3),
including the RTX 3060 8 GB / RX 6600 / Arc A750 GPU baseline and desktop CPU
variant fixes. These are community predictions, not confirmed requirements.
The changes are adapted to the current file structure and preserve laptop and
Ryzen AI matching. Run `node --test tests/hardware.test.mjs` for regression checks.

Laptop CPUs, laptop GPUs, and integrated graphics are included in the pickers. Mobile parts are compared with the closest desktop model from Notebookcheck's mobile benchmark lists. Laptop performance depends on power limits and cooling, so those bands are approximate.

## Font

The interface uses GTA Art Deco Medium, included with permission from the site owner. The font retains its embedded terms.

## Artwork

The background illustrations and logo are supplied project assets. No license to third-party artwork or fonts is granted by this repository.
