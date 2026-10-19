# Contributing

Send corrections and suggestions to danielle@boycedatascience.com, or open an issue after this directory is uploaded to a repository.

For each resource, provide its name, direct official URL, purpose, primary scope, categories, audience, service area, access conditions and the date checked. Include an official page supporting any claim that a program is active, accepting applications or funded.

Keep these questions separate:

- Can the website be accessed?
- Is the organization or program still operating?
- Is this particular service accepting people now?
- What evidence supports the resource's claims?

A 403 response, bot check or timeout is not proof of closure. Record the limitation and try a manual check. A 200 response may still show a parked domain, an irrelevant redirect or an old program.

Use one entry per distinct useful resource. A provider may have several entries when its tools serve different purposes. Merge duplicate URLs, and give subpages descriptive names. Describe vendor features as claims unless independently evaluated. Do not imply endorsement or promise grants, treatment, enrollment or eligibility.

Use disease-specific scope only for a named condition or condition group. Keep broad rare-disease resources in general health and research, and cross-disability support in general disability. Categories can overlap.

Edit JSON files under `data/`, then regenerate the CSV exports, counts and browser bundle:

```bash
python3 scripts/build_data.py
python3 scripts/validate.py
```

Use concise original descriptions. Link to third-party resources instead of copying documents, logos or copyrighted passages. Avoid personal contact details except an organization's public service contact or the directory maintainer's contact.
