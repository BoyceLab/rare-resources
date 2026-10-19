# Resource Ecosystem

A searchable directory for rare disease, disability, family support and research.

**936 resource entries · 33 categories · 42 registry and data options · 36 annotated readings**

Reviewed October 19, 2026. Under construction and not peer reviewed. Suggestions: danielle@boycedatascience.com.

## Open the site

Unzip the download, then open `index.html`. Search and filters work locally without a build step. The site uses relative paths, bundled data and no external JavaScript libraries.

## Upload to GitHub Pages

1. Create a repository in your own GitHub account.
2. Upload the **extracted contents**, keeping `index.html` at the repository root and preserving the `assets`, `data`, `docs` and `scripts` folders. Do not upload the ZIP as the website.
3. In repository **Settings → Pages**, select **Deploy from a branch**, choose your default branch (usually `main`) and **/(root)**, then save.
4. Use the site URL shown in Pages settings once publication completes.

The supplied `.nojekyll` file supports static hosting. The site has already been built; there is no package installation or account connection step.

[GitHub's publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Find resources

The directory keeps three primary scopes separate:

- **Disease / condition-specific:** a named disease or condition group.
- **General health and research:** cross-condition health, rare disease, nonprofit and research resources.
- **General disability:** cross-disability access, support and everyday life.

Categories overlap where useful. Quick entry points lead to siblings, parenting and families, transition, registry options, nonprofit tools, and AAC. Search includes aliases such as RareX, RARE-X and GotTransition.

The Registry options tab distinguishes hosting programs, commercial platforms, study data capture, records connection, recruitment, standards and guidance. It includes RARE-X, Across Healthcare Matrix, IAMRARE, CoRDS, Genetic Alliance, Pulse Infoframe, IQVIA, REDCap, Castor and other options. A listed capability is a provider description, not an independent evaluation.

Use **Clear filters**, **Export filtered CSV** or **Print filtered report**. Export and print include all matching entries, not only the visible page.

## Understand the review

Website access and program activity are separate fields. 900 entries have retrieved content, 9 have indexed content evidence, 4 have restricted access and 23 remain unverified. None of these alone proves that a service is accepting participants or applications.

205 entries received focused description and status review in this expansion. 170 have reviewed descriptions; 561 retain basic descriptions and need further editorial review. The directory is a broad starting point, not an exhaustive census or systematic literature review. See [review methods](docs/REVIEW_METHOD.md) and [the reading guide](review.html).

## Files and maintenance

- `data/resources.json` and `.csv`: the directory and per-entry review evidence.
- `data/registry-comparison.json` and `.csv`: comparison of 42 options by role.
- `data/literature.json` and `.csv`: 36 annotated readings.
- `assets/data.js`: bundled browser data, generated from JSON.
- `review.html`: thematic reading and planning notes.
- `CONTRIBUTING.md`: how to suggest and check changes.

After editing the JSON data set, run the builder to refresh the CSV exports, counts and browser bundle:

```bash
python3 scripts/build_data.py
python3 scripts/validate.py
```

To collect fresh link-check observations without overwriting editorial decisions:

```bash
python3 scripts/check_links.py
```

Review the resulting `data/link-check-results.json` manually. Bot restrictions, redirects and server errors need interpretation. To try a small batch first, add `--limit 10`.

Original site code and directory annotations use the MIT license. Linked resources retain their own terms. Inclusion does not imply affiliation or endorsement.
