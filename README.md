<p align="center">
<img src="./src/assets/shuffler-logo.svg" alt="shuffler-logo" />
</p>

# Shuffler
[![Build Status](https://travis-ci.com/andytan0727/shuffler.svg?branch=master)](https://travis-ci.com/andytan0727/shuffler)
[![Maintainability](https://api.codeclimate.com/v1/badges/15ee7e777754799fc83d/maintainability)](https://codeclimate.com/github/andytan0727/shuffler/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/15ee7e777754799fc83d/test_coverage)](https://codeclimate.com/github/andytan0727/shuffler/test_coverage)

A shuffler that randomize your YouTube playlist.

> About this project on 2021:
> 
> This project is created by me on my early day of learning React, and you can see it comes with many unnecessary packages and spaghetti code written. Honestly, it becomes much harder to maintain since the normalized data structure comes in, which is one of my painful mistakes done in this project without proper planning.
>
> This project is still under inactive development. It's not ceased because some users (my friends) are still using it. Nevertheless, I wouldn't recommend one who encountered this project to use it as learning material, but feel free to use it if you want.

--------------------------------

Demo: <https://shuffler.surge.sh>

## Local Development

If you wish to develop this application yourself locally, there are several scripts you could run:

### Prerequisite

- [Node.js](https://nodejs.org/en/) >= v10.12.0
- [Yarn](https://yarnpkg.com/en/) >= 1.14 or `npm` >= 6.4.1

### Scripts:

```sh
> yarn start  # or npm run start for npm
```

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

```sh
> yarn start-https:win  # or npm run start-https:win for npm
```

`yarn start` alternative for HTTPS connection in MS Windows.

```sh
> yarn start-https:bash  # or npm run start-https:bash for npm
```

`yarn start` alternative for HTTPS connection in Linux/macOS.

```sh
> yarn test  # or npm run test for npm
```

Launches the test runner in the interactive watch mode.<br>

```sh
> yarn build  # or npm run build for npm
```

Builds the app for production to the `build` folder.<br>

```sh
> yarn eject  # or npm run eject
```

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

## License

MIT © 2019 [Andy Tan](https://github.com/andytan0727)