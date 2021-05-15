# jux-jest-reporter


# Usage

Install with

```bash
npm i --save-dev jux-jest-reporter
```

or 

```bash
yarn add -D jux-jest-reporter
```

Then edit the jest config in your `package.json` (if that's the case)

```json
{
  "jest": {
    "reporters": [
      "default",
      "jux-jest-reporter"
    ]
  },
}
```

Now you can run `yarn test` or `npm run test` and check that it generated tsnapshot files for each test file.
Make sure you have those files tracked in git.

