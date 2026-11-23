# Can I Run Leonida

An unofficial, browser-based PC hardware estimator for Project Leonida. Select a CPU, GPU and RAM amount to compare against community hardware ranges.

## Run locally

Serve this folder with any static web server. For example, run `python -m http.server 8000` and open `http://localhost:8000`. No build step or API keys are required.

## Estimates and sources

The estimator uses hand-maintained benchmark bands and community predictions. Leonida gameplay compatibility and FPS remain unverified. Sources are available inside the checker.

The searchable catalog includes 4,641 CPU names and 2,076 GPU names from
[TechAPI](https://github.com/GetTechAPI/TechAPI), plus the original curated
choices. The names-only dataset is CC BY-SA 4.0; see
[the data notice](assets/data/README.md). Search accepts model numbers with or
without spaces and hyphens. On phones, search narrows the native picker,
including embedded browsers. Manual entry remains available for missing models.
Catalog inclusion is separate from benchmark coverage: models without a
reliable comparison show Unknown. This is not a claim to cover every chip ever
made, and we do not infer gaming performance from core counts or model numbers.

Laptop CPUs, laptop GPUs, and integrated graphics are included in the pickers. Mobile parts are compared with the closest desktop model from Notebookcheck's mobile benchmark lists. Laptop performance depends on power limits and cooling, so those bands are approximate.

## Font

The interface uses GTA Art Deco Medium, included with permission from the site owner. The font retains its embedded terms.

## Artwork

The background illustrations and logo are supplied project assets. No license to third-party artwork or fonts is granted by this repository.
