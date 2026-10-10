# Independent redesigned-UI acceptance audit

Codex delegated audit, 2026-10-10. Initial ownership was limited to this report and `e2e/codex-ui-acceptance.spec.ts`. The parent then explicitly authorized two focused production fixes in the dialog wrapper and responsive CSS. The audit uses repository code and actual browser behavior, not mocked worker/storage results or pixel-perfect styling assertions.

## Scope and inspected code

Read `src/App.tsx`, `src/ui/{LessonReader,PatternLibrary,Practice,Playground,BackupView,LessonWorkspace,PatternWorkspace,CodeEditor,ExercisePanel,RecognitionPanel,VariablesPanel,useEngine,python-file}.tsx` or their `.ts` equivalents, the relevant storage/progress/schema definitions, the Radix tabs/dialog wrappers, the responsive/reduced-motion/focus styles, the browser configuration and existing backup/learning-path/runner-origin smoke tests. The Playwright skill's test-file exception applies because the delegated task explicitly requests a new browser spec; the project already uses `@playwright/test`. Windows Node/npm/npx are installed.

## Findings and parent fixes

The initial code review identified these issues and sent them to the parent before execution:

- Translating the mobile navigation offscreen left its controls in the keyboard order. Parent added narrow-mode inert/aria-hidden, initial open-menu focus and Escape return to the menu toggle. The real mobile keyboard test passes.
- The controlled search dialog had no opener restoration. Parent added explicit opener tracking and close-focus restoration. The final native browser runs confirm both the clicked opener and the previous shortcut-focused element are restored.
- The narrow search button hid its text and keyboard badge without retaining an accessible name. Parent added `aria-label`; the real narrow accessible-name assertion passes.
- Backup restore had an unlabeled file input and no main-content skip target. Parent added the label/id. Actual file restore and skip-link keyboard continuation pass.
- Pattern tabs put `reader-tabs` on the list itself, while the old responsive selector expected a descendant list. Parent added direct wrapping rules. Pattern tabs now pass both the 640 and320 CSS-pixel layout checks.

The first real isolated Chromium run completed **8/10** tests in 24.1 seconds. Actual failures:

1. The search had a named `role=dialog` with described-by/labeled-by but no `aria-modal=true`. With the parent's explicit authorization, added `aria-modal={true}` to `src/components/ui/dialog.tsx`. Modal semantics, actual focus wrapping, Escape restoration and keyboard result navigation now pass.
2. At320 CSS pixels, Home had document scrollWidth327 versus viewport320. Installed Windows Chrome reproduced it after fonts.ready. Actual bounds identify both home cards extending to right327: mobile grid track1fr retains the array preview's intrinsic minimum (five47-pixel cells, four7-pixel gaps,44-pixel padding and two borders total309px, versus284px available). Changed only the mobile `.home-feature` track to `minmax(0,1fr)` in `src/App.css`; existing flex cells then shrink within the card. No overflow clipping was added. Home, all lesson tabs and all pattern tabs pass320px bounds assertions in both native channels. `src/index.css` was not edited.

The production build (`tsc -b && vite build`) passed, exit0. The existing asset server reads the newdist files on each request, so the focused browser checks loaded the new build without a server restart. Launch/build identity and full package lifecycle checks remain with the parent.

The new previous-snapshot assertion initially assumed that an untouched fresh profile had a stored record to snapshot. Repository storage correctly returns an in-memory default without persisting a record. The test was corrected to save a real prior draft before import; recovery now compares the complete downloaded data with that actual prior baseline. This was a test setup correction, not a production storage defect.

## New tests

The new spec covers ten meaningful flows:

1. Lesson keyboard arrows/Home/End, selected tabs, vocabulary/concepts, all nine factorial line explanations, actual factorial execution/replayed120, recorded six-frame recursion, experiments/practice, review costs/sources, and explicit completion remaining separate from reading.
2. Search input autofocus, Shift+Tab/Tab focus wrapping, Escape restoration to both clicked and shortcut openers, no-results feedback and keyboard opening of a real lesson.
3. Closed mobile rail not receiving offscreen keyboard focus, named search, open navigation and Escape return.
4. 320-pixel Home/lesson/pattern document overflow and each tab's actual bounding box, including Watch/Practice/Review/Sources.
5. 200% zoom-equivalent reflow: a 1280x900 physical layout represented by 640x450 CSS pixels at DPR2. This exercises the reflow dimensions; it does not claim actual browser-toolbar zoom automation.
6. Actual reduced-motion media emulation and computed zero transition/no-animation styles on rail, pattern catalog and dialog.
7. Pattern clues/conditions/counterexamples, every line, actual Python execution/replayed `True`, local practice, source links and navigation to a related lesson.
8. Mixed practice rendering one challenge at a time, retaining a radio choice across collapse, hiding the source topic and paginating20/21 correctly.
9. Actual `.py` import with UTF-8 BOM and Windows CRLF normalization, preservation of the original draft, rejection of invalid UTF-8, byte-exact source export, no worker until Run, actual input/output execution on runner port4174, and draft/stdin persistence across reload.
10. Actual JSON download of completion/draft/stdin data; rejection of a foreign file with preserved progress; restore into a separate fresh browser profile; and exact recovery of its previously saved draft without executing stored source.

Tests attach browser engine/version/project/platform/viewport metadata. The narrow and zoom-equivalent checks attach actual page screenshots, and failures attach their observed state. Chrome/Edge project selection comes from the parent's existing `PLAYWRIGHT_CHANNEL` configuration, so the same spec can run against installed Windows channels.

## Execution and limits

The first ordinary sandbox run could not reach loopback sockets. Playwright therefore attempted its configured server startup and found an already-bound4173. Direct requests confirmed a sandbox socket-permission failure; this was not evidence of a missing health endpoint. The authorized escalated run reached the existing dual-origin server and completed actual browser assertions. No automatic approval rejection occurred.

Final isolated native results, using the existing production dual-origin server:

- Installed Windows Chrome (`PLAYWRIGHT_CHANNEL=chrome`, projectchrome): **10/10 passed**, exit0,12.2s.
- Installed Windows Edge (`PLAYWRIGHT_CHANNEL=msedge`, projectmsedge): **10/10 passed**, exit0,12.4s.
- A final Chrome refresh of the two desktop screenshot tests passed2/2 after adjusting capture scroll position and recording the first factorial body line after call entry. The complete Edge run uses that final capture behavior.

The checks do not automate native200% browser-toolbar zoom, claim full-suite acceptance, certify pixel-perfect styling or establish general WCAG conformance. The parent owns those integration checks. The agent changed only the two explicitly authorized production rules plus the new spec/report. No shared registry, curriculum, ledger or source-review evidence was edited.

Actual screenshot files are in **singular `output`**, not `outputs`. The Edge Watch screenshot, Chrome Playground screenshot and Chrome320px Home screenshot were opened and visually inspected; they show recorded recursion, actual `hello café` output and fitting home cards. This inspection is not a broad visual certification.

```text
C:\Users\risha\Documents\Codex\2026-09-19\https-neetcode-io-roadmap-https-neetcode\work\dsa-completion\output\playwright\codex-ui-chrome\desktop-lesson-watch.png
C:\Users\risha\Documents\Codex\2026-09-19\https-neetcode-io-roadmap-https-neetcode\work\dsa-completion\output\playwright\codex-ui-chrome\desktop-playground.png
C:\Users\risha\Documents\Codex\2026-09-19\https-neetcode-io-roadmap-https-neetcode\work\dsa-completion\output\playwright\codex-ui-chrome\320px-home.png
C:\Users\risha\Documents\Codex\2026-09-19\https-neetcode-io-roadmap-https-neetcode\work\dsa-completion\output\playwright\codex-ui-chrome\320px-pattern-sources.png
C:\Users\risha\Documents\Codex\2026-09-19\https-neetcode-io-roadmap-https-neetcode\work\dsa-completion\output\playwright\codex-ui-chrome\200-percent-equivalent-pattern-sources.png
C:\Users\risha\Documents\Codex\2026-09-19\https-neetcode-io-roadmap-https-neetcode\work\dsa-completion\output\playwright\codex-ui-msedge\desktop-lesson-watch.png
C:\Users\risha\Documents\Codex\2026-09-19\https-neetcode-io-roadmap-https-neetcode\work\dsa-completion\output\playwright\codex-ui-msedge\desktop-playground.png
C:\Users\risha\Documents\Codex\2026-09-19\https-neetcode-io-roadmap-https-neetcode\work\dsa-completion\output\playwright\codex-ui-msedge\320px-home.png
C:\Users\risha\Documents\Codex\2026-09-19\https-neetcode-io-roadmap-https-neetcode\work\dsa-completion\output\playwright\codex-ui-msedge\320px-pattern-sources.png
C:\Users\risha\Documents\Codex\2026-09-19\https-neetcode-io-roadmap-https-neetcode\work\dsa-completion\output\playwright\codex-ui-msedge\200-percent-equivalent-pattern-sources.png
```

One additional observed prose issue was sent to the parent: the Playground complexity refusal says “a loop body calls input()” for straight-line `value=input(); print(...)` source. Declining an automatic complexity bound is appropriate, but inventing loop context is not. This reason is outside the two authorized production fixes; the parent owns its correction. The screenshot records the actual current wording, not a claimed fix.

Repeat only after the parent confirms the build/server are ready, with no concurrent browser suite:

```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
$env:PLAYWRIGHT_CHANNEL = 'chrome' # or msedge, with the matching project below
& 'C:\Program Files\nodejs\node.exe' node_modules/@playwright/test/cli.js test e2e/codex-ui-acceptance.spec.ts --workers=1 --project=chrome --reporter=list
```

Current result: all ten focused acceptance flows pass in both installed native channels. Browser ownership was released to the parent and runner-origin reviewer; this agent is no longer using the browser or changing production files.
