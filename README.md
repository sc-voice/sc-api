### SuttaCentral REST API cached proxy

The Suttacentral REST API changes slowly but it does change.
It's therefore advisable to rebuild this cached proxy from time-to-time.

```
./scripts/build
git status
```

If the git status shows any changes: 

1. increment the package.json version number
2. Verify that tests pass: `npm run test`
3. `git commit -am "rebuild api"`
4. `git push`
5. `npm publish`

Update all projects that include `suttacentral-api`:

* sc-voice/scv-bilara
* sc-voice/sc-voice
* etc.

