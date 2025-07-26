# Preco Web App

PrecoApp - Application that allows you to get schedule of the Ural Regional College group.

This web application is a direct evolution of [telegram-bot-parser](https://github.com/levalyukov/telegram-bot-parser).

![preview](preview.png)

## TODO

- [X] Parser through playwright
- [ ] Getting schedules for other groups

## Main modules

- Core: [React](https://github.com/facebook/react) + [TypeScript](https://github.com/microsoft/TypeScript)
- Server: [Express.js](https://github.com/expressjs/express)
- Parser: [Playwright](https://github.com/microsoft/playwright)
- Icons: [Font Awesome](https://github.com/FortAwesome/Font-Awesome)

## Install

```bash
git clone https://github.com/levalyukov/preco-app
cd preco-app
npm run dev -- --host
```

Start server:
```bash
cd src/server
node server.js
```

## License
This repo is licensed by [MIT](license).