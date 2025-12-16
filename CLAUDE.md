# sc-api CLAUDE.md

## Objective

Make sc-api compatible with Node 24.x to support OIDC npm publishing in dependent projects.

## Context

- Current: mocha 10.2.0, no explicit Node version constraints
- Goal: Ensure sc-api works with Node 24.x (npm 11.6.2+)
- Reason: Dependent projects need Node 24 for OIDC token generation with npmjs.org
- sc-api is a dependency of scv-bilara and other modules

## Backlog

1. ✓ Test sc-api against Node 24.x locally (DONE - all 26 tests pass)
2. ✓ Update devDependencies if needed (DONE - found not needed)
3. ✓ Add Node version constraint to package.json (DONE - found not needed)
4. ✓ Run full test suite on Node 24.x (DONE)
5. [ ] Publish updated sc-api to npm
