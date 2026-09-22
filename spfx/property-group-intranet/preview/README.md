# Local preview (outside SharePoint)

This folder is a small Vite harness that renders the real `IntranetShell`
component tree in an ordinary browser, without SharePoint and without
needing to trust an SPFx dev certificate (`gulp trust-dev-cert` installs
one into the OS certificate store, which this avoids entirely).

It is **not** part of the SPFx build — `gulp bundle`/`gulp serve` never
touch it, and it isn't packaged into the `.sppkg`.

## Run it

```bash
npm install
npx vite
```

Then open the printed local URL (default `http://localhost:5173`).

## Why this exists instead of `gulp serve`

`gulp serve` requires a trusted local HTTPS certificate. Generating one is
fine to do yourself (`gulp trust-dev-cert`), but it modifies your OS
certificate store, so an automated assistant working in this repo won't do
it on your behalf. This harness sidesteps that entirely by running on
plain HTTP with Vite.
