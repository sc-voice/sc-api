# WORK.md

**Build**: 2.23.0
**Status**: Planning
**Started**: 2025-12-16

## Objective

Test sc-api local compatibility with Node.js v24

## Plan

1. [ ] Check current Node version locally
2. [ ] Switch to Node 24.x (using nvm)
3. [ ] Run `npm install`
4. [ ] Run `npm test` to verify all tests pass on Node 24
5. [ ] Document any failures or compatibility issues
6. [ ] Claude proposes next action

## Current Step

Waiting for approval to proceed with testing

## Blockers

None

## Notes

- Target: Ensure sc-api works with Node 24.x (npm 11.6.2+)
- Dependency chain: sc-api → scv-bilara → (OIDC publishing)
