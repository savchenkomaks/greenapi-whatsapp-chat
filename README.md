# WhatsApp Chat · GREEN-API

Минимальный веб-интерфейс для отправки и получения **текстовых** сообщений в WhatsApp
через сервис [GREEN-API](https://green-api.com). Тестовое задание на позицию Frontend React.

Прототип интерфейса — по виду чата (поле ввода получателя, лента сообщений, строка ввода).

## Возможности

- Ввод учётных данных GREEN-API (`idInstance`, `apiTokenInstance`) — хранятся только в браузере.
- Создание чата по номеру телефона получателя.
- Отправка текстовых сообщений (метод `sendMessage`).
- Получение входящих в реальном времени — поллинг HTTP API
  (`receiveNotification` → обработка → `deleteNotification`).
- Лента сообщений с разделением «входящие / исходящие», автоскролл, время.

## Стек

React 18 · TypeScript · Vite · Vitest. Без лишних зависимостей — только `fetch` к GREEN-API.

## Как запустить локально

```bash
npm install
npm run dev        # http://localhost:5173
```

Далее:

1. Зарегистрируйтесь и создайте инстанс в [console.green-api.com](https://console.green-api.com),
   авторизуйте WhatsApp по QR-коду.
2. Скопируйте `idInstance` и `apiTokenInstance`, введите их на экране входа.
3. Укажите номер получателя (например, `79991234567`) и отправьте сообщение.
4. Ответьте с телефона получателя — ответ появится в ленте.

## Скрипты

```bash
npm run dev         # дев-сервер
npm run build       # проверка типов + прод-сборка
npm run typecheck   # tsc --noEmit
npm run test        # unit-тесты (Vitest)
```

## Архитектура

```
src/
  api/greenApi.ts            # обёртки над методами GREEN-API + типы
  hooks/
    useIncomingMessages.ts   # поллинг входящих (receive → delete)
    useLocalStorage.ts       # хранение credentials
  store/messagesReducer.ts   # лента сообщений + дедупликация по id
  utils/phone.ts             # phone -> chatId (@c.us), валидация
  components/                # CredentialsForm, MessageList, MessageInput
  App.tsx                    # оркестрация
```

**Решения:**

- Логику вынес из компонентов в `api` / `hooks` / чистые функции — легко читать и тестировать
  (reducer и утилиты покрыты unit-тестами).
- Получение сообщений — через **поллинг HTTP API** (`receiveNotification` + `deleteNotification`),
  как и требует задание. Пустая очередь → реже опрос, есть сообщения → чаще.
- Дедупликация входящих по `id` — защита от повторной вставки при поллинге.
- Credentials живут только в `localStorage` пользователя, ничего не хардкодится.

## Деплой

Автодеплой на **GitHub Pages** через GitHub Actions (`.github/workflows/deploy.yml`).
Для включения: **Settings → Pages → Source: GitHub Actions**.
Секреты не нужны — учётные данные вводит сам пользователь в интерфейсе.
