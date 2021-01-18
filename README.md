# @baton/app

[![codecov](https://codecov.io/gh/Baton-donation/app/branch/master/graph/badge.svg?token=8JP12JYBTX)](https://codecov.io/gh/Baton-donation/app)

Baton is a simple app that allows AAC software users to upload data for research purposes.

Currently, Baton supports extracting data from Dasher and plain text files. We plan to add additional supported apps in the future.

## Usage

Download and install [a recent release](https://github.com/kdv123/AACDonation/releases). There's a short setup wizard upon the first open.

## Development

```bash
# install dependencies
yarn install

# start in development mode
yarn dev
```

To build new releases, increment the version (without tagging) with `npm --no-git-tag-version version [major|minor|patch]`. Then, create a **draft** release on the GitHub repository and push. The app will then be built and available under the draft release. Once the next version is ready, publish the draft. GitHub will automatically tag the correct commit.
