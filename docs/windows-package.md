# Offline Windows package

The package contains the built app, its local Python runtime, portable Node,
the Start/Stop launchers, the app source and third-party license notices.
The browser itself is not included. Extract the whole ZIP to a normal folder,
then double-click `Start.cmd`; a current Chrome or Edge opens the app at
`http://127.0.0.1:8765`. The isolated Python runner uses port 8766. `Stop.cmd`
stops the matching build through its local authenticated endpoint. No npm,
system Python, installation or internet connection is needed to use the app.

This is a Windows x64 package. Portable Node 24.21.0 is pinned, rather than
silently updating during a build. Node's official archive page identifies its
[Windows x64 ZIP](https://nodejs.org/en/download/archive/v24.21.0); the exact
[release checksum manifest](https://nodejs.org/dist/v24.21.0/SHASUMS256.txt)
contains SHA256
`158f7685b44de51f6c0df1d153526cbcd3e1bc739a8dfc607721cef75de9e541`
for `node-v24.21.0-win-x64.zip`. Download and SHA256 comparison were performed
on 2026-10-10; a GPG signature check was not performed. The official
[Node release page](https://nodejs.org/en/about/previous-releases) identifies
24.x as LTS. The prepared portable executable reports v24.21.0.

## Prepare the cached runtime and notices

From the repository, using an installed Node for development:

```powershell
node scripts/package-windows.mjs --fetch-runtime
```

This is the only packaging command that downloads anything. It retrieves the
official pinned archive and its exact release manifest over HTTPS, refuses a
checksum mismatch, and extracts the verified ZIP into ignored `vendor/`.
The executable and license are hashed into `vendor/node-runtime-provenance.json`.
They are re-extracted from the verified archive before establishing provenance;
an existing executable is not trusted simply because it reports a version.
The archive itself is checked again by every inventory/staging run.

The same command fetches missing runtime license documents from exact upstream
versions. It does not modify app source, desktop launch/server code, curriculum
records or global evidence. Current development dependency installation and
the final built `dist/` must already exist. `scripts/third-party-notices.mjs`
also supports `--fetch` by itself, or a read-only inventory with no arguments.

## Inventory, freeze and stage

Finish the application build, validation and all source/document changes before
the release owner freezes packaging. The default command only reads files:

```powershell
node scripts/package-windows.mjs --dry-run --inventory-file "outputs/windows inventory.json"
```

The inventory lists each source/destination, byte count and SHA256. Its
`inputHash` covers all selected content paths/bytes plus notice metadata;
absolute folder names and timestamps do not enter that fingerprint. The
`buildId` covers the built distribution. An edit to included source, desktop
code, the distribution or notices invalidates the previous input hash.

After the release owner approves that frozen input, use its exact `inputHash`:

```powershell
node scripts/package-windows.mjs --stage "releases/DSA Visual Lab Windows x64" --expect-input-hash "THE_FULL_INVENTORY_INPUT_HASH"
```

The output must be new. Existing folders are never deleted or overwritten;
repository-local output is restricted to `outputs/` or `releases/`. Input and
output paths cannot overlap. Every copied file is checked against the frozen
hash, and all input hashes are read again at completion to catch a concurrent
build or source edit. A failed partial stage must not be published. Start/Stop
commands are copied verbatim from the tested desktop sources, with quoted
`%~dp0` paths, so spaces in extraction folders work. This script does not edit
those launchers or start a server during inventory/staging.

The package contains:

- `dist/`: the app, isolated runner bridge, workers, local fonts and complete
  bundled Pyodide files.
- `runtime/node.exe`, `runtime/LICENSE`, provenance and the official checksum
  manifest; npm and its package tree are omitted.
- `desktop/`, `Start.cmd` and `Stop.cmd`: the existing local dual-origin server
  and launchers, copied without modification.
- `source/`: app, public assets, scripts, docs, browser tests, syllabus/manifests and development
  configuration, including package lock metadata. Rebuilding source needs its
  locked development dependencies; using the package does not.
- `THIRD-PARTY-NOTICES.md`, `licenses/` and an inventory of actual notice files.
- `build-id.txt`, `package-manifest.json`, `SHA256SUMS.txt` and user instructions.

No `.git`, `node_modules`, vendor archives, delivery output, local logs or
Playwright reports are copied as application source. Python bytecode caches
are excluded. Symlinks in selected input trees are refused.

## Test the stage before publishing a ZIP

Run the existing browser/integration checks against the staged desktop server,
then launch `Start.cmd` from an extraction-style path containing spaces. Verify
app and runner health, a Python lesson/exercise run, stepping/backward state,
local fonts/assets, offline operation, matching-build Stop, a second Start,
port conflict and progress persistence. The release owner handles that real
application validation after build freeze. Packaging preparation has not
claimed it already happened.

The dedicated package-builder test uses a clearly marked temporary fixture
with spaces in its path. It checks read-only deterministic inventory, stale
freeze rejection before output creation, refusal to overwrite, source inclusion,
launch-path quoting, retained notices and every staged file checksum:

```powershell
node --test scripts/package-windows.test.mjs
```

That fixture check is not a real-browser test and creates no delivery ZIP.
The final ZIP is created only after the release owner freezes and tests the
real stage. The command below verifies that existing stage against both the
freeze hash and every checksum, refuses extra files or changed content, and
compresses it without rebuilding or restaging:

```powershell
node scripts/package-windows.mjs --zip-existing "releases/DSA Visual Lab Windows x64" --expect-input-hash "THE_FULL_INVENTORY_INPUT_HASH" --zip "releases/DSA Visual Lab Windows x64.zip"
```

The ZIP includes one top-level package directory, and gets a separate `.sha256`
file. Its actual archive entries are decompressed and SHA256-checked against
every staged file before success is reported; a missing hidden file, duplicate
entry or changed bytes refuses publication. The stage is checked again after
compression. Windows `Compress-Archive`/`Expand-Archive` use literal paths supplied
through environment variables; filenames are not interpolated into shell code.
The builder does not rebuild, silently accept changed inputs, or run global
curriculum verification. Do not reuse a pre-freeze inventory as final evidence.

## Notices and source availability

Notice generation conservatively inventories installed nondevelopment packages
from the actual lock file. It retains their original LICENSE/COPYING/NOTICE
texts rather than substituting a generic license template. Optional uninstalled
platform binaries and the native build-only bundler are not redistributed.
An installed/locked version mismatch, missing notice text or changed external
notice cache fails packaging until resolved. Build tools may appear in the
conservative notice table without being present as executables in the package.

The prepared documents use primary upstream sources:

- [Node 24.21.0 LICENSE](https://raw.githubusercontent.com/nodejs/node/v24.21.0/LICENSE),
  retained directly from the verified official archive. It includes Node's
  incorporated third-party notices.
- [Pyodide 314.0.7 MPL-2.0](https://raw.githubusercontent.com/pyodide/pyodide/314.0.7/LICENSE),
  plus explicit [source availability](https://github.com/pyodide/pyodide/tree/314.0.7)
  and its versioned source archive URL. The copied runtime is unmodified.
- [CPython 3.14.2 LICENSE](https://raw.githubusercontent.com/python/cpython/v3.14.2/LICENSE)
  and [incorporated-software acknowledgements](https://raw.githubusercontent.com/python/cpython/v3.14.2/Doc/license.rst),
  matching the Python version in the bundled lock file.
- [Emscripten 5.0.3 LICENSE](https://raw.githubusercontent.com/emscripten-core/emscripten/5.0.3/LICENSE),
  matching the platform version declared in that Pyodide lock file.
- DM Sans, Fraunces and JetBrains Mono's actual installed Fontsource packages
  each include their distinct copyright notice and SIL OFL 1.1 text. All three
  are copied unchanged; font names and data are not modified.

`react-remove-scroll-bar` 2.3.8 declares MIT but omits a LICENSE file from its
npm tarball. Its [official npm metadata](https://registry.npmjs.org/react-remove-scroll-bar/2.3.8)
supplies a published gitHead whose upstream LICENSE URL returned 404. The
declared [upstream repository LICENSE](https://github.com/theKashey/react-remove-scroll-bar/blob/master/LICENSE)
was read instead, retained in full, and pinned by its Git blob and SHA256 in
the vendor notice provenance. This fallback is recorded explicitly; it is not
represented as successful retrieval from the missing release commit.

Exact URLs, retrieved hashes and access dates are retained under
`vendor/licenses/provenance.json` and mirrored in the staged inventory. The
package does not assign a new license to the author's application source.

The app saves progress in browser storage at the fixed loopback address.
Export a backup inside the app before clearing that storage. Extraction folders
must stay intact; moving only Start.cmd or node.exe separates them from the app.
