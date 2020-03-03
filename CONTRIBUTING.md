# Contribution guidelines

1. Create a new branch with the name of your proposal:
    - If you're already a collaborator, prefer to create a `fix/*`, `feat/*` or `docs/*` branch on official repository;
    - If you're not a collaborator yet, fork the repository and create the branch;

2. Clone and setup the repository:
```bash
git clone git@github.com:{user}/client.git
cd client
npm i
```

3. Run dev server and use global `ecomClient` or edit `test/demo.js` for tests on http://localhost:9245/:
```bash
npm run serve
```

4. Commit following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/);

5. Ensure you're respecting [JavaScript Standard Style](https://standardjs.com/);

6. We're using [jsdoc](https://jsdoc.app/), when creating or updating a method, please try to make it well documented if possible;

7. Open a new [PR](https://github.com/ecomplus/client/pulls) to _master_ (latest version) or _v*-dev_ branch;

8. Congrats! Just wait a little for our review and merge.

**Thanks in advance** :smile:
