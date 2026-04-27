# Один день в будущем — MVP

Статическая интерактивная страница-презентация: 6 сцен, по 3 технологических hotspot в каждой, финальный тезис про голубой океан.

## Команды

```bash
PATH="$HOME/.bun/bin:$PATH" bun test test/future-day.test.ts
PATH="$HOME/.bun/bin:$PATH" bun run src/build.ts
```

После build готовый сайт лежит в `dist/index.html`.

## Scope

MVP намеренно без backend, аккаунтов, базы данных, canvas/3D и генератора. Принцип: **магия сначала, объяснение потом**.
