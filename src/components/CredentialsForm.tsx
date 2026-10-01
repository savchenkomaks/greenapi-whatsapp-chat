import { useState } from 'react'
import type { Credentials } from '../types'

export function CredentialsForm({ onSubmit }: { onSubmit: (c: Credentials) => void }) {
  const [idInstance, setId] = useState('')
  const [apiTokenInstance, setToken] = useState('')
  const valid = idInstance.trim() !== '' && apiTokenInstance.trim() !== ''

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    onSubmit({ idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() })
  }

  return (
    <form className="creds" onSubmit={submit}>
      <h1>Подключение к GREEN-API</h1>
      <p className="creds__hint">
        Данные из личного кабинета
        <a href="https://console.green-api.com" target="_blank" rel="noreferrer"> console.green-api.com</a>.
        Хранятся только в вашем браузере.
      </p>

      <label htmlFor="id">idInstance</label>
      <input id="id" value={idInstance} onChange={(e) => setId(e.target.value)} placeholder="1101xxxxxx" autoComplete="off" />

      <label htmlFor="token">apiTokenInstance</label>
      <input id="token" value={apiTokenInstance} onChange={(e) => setToken(e.target.value)} placeholder="xxxxxxxxxxxxxxxxxxxx" autoComplete="off" />

      <button type="submit" disabled={!valid}>Подключиться</button>
    </form>
  )
}
