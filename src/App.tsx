import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

type Report = {
  date: string
  client: string
  content: string
  nextAction: string
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']
const BLANK = '（未入力）'

/** ローカルタイムの今日を input[type=date] 用の YYYY-MM-DD で返す */
function today() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function formatDate(value: string) {
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return BLANK
  return `${y}年${m}月${d}日(${WEEKDAYS[new Date(y, m - 1, d).getDay()]})`
}

function buildReport(report: Report) {
  return [
    `【日報】${formatDate(report.date)}`,
    '',
    '■ 訪問先',
    report.client.trim() || BLANK,
    '',
    '■ 商談内容',
    report.content.trim() || BLANK,
    '',
    '■ 次回アクション',
    report.nextAction.trim() || BLANK,
  ].join('\n')
}

/** clipboard API が使えない環境（http 配信など）向けのフォールバック */
function legacyCopy(text: string) {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(area)
  return ok
}

function App() {
  const [report, setReport] = useState<Report>({
    date: today(),
    client: '',
    content: '',
    nextAction: '',
  })
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)

  const text = useMemo(() => buildReport(report), [report])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const update =
    (key: keyof Report) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setReport((prev) => ({ ...prev, [key]: event.target.value }))
    }

  const handleCopy = async () => {
    setCopyFailed(false)
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else if (!legacyCopy(text)) {
        throw new Error('copy command rejected')
      }
      setCopied(true)
    } catch {
      setCopyFailed(true)
    }
  }

  const handleReset = () => {
    setReport({ date: today(), client: '', content: '', nextAction: '' })
    setCopyFailed(false)
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>日報テンプレート</h1>
        <p>入力すると右側に貼り付け用の日報ができます。</p>
      </header>

      <div className="layout">
        <section className="panel" aria-labelledby="form-heading">
          <h2 id="form-heading">入力</h2>

          <div className="field">
            <label htmlFor="date">日付</label>
            <input
              id="date"
              type="date"
              value={report.date}
              onChange={update('date')}
            />
          </div>

          <div className="field">
            <label htmlFor="client">訪問先</label>
            <input
              id="client"
              type="text"
              value={report.client}
              onChange={update('client')}
              placeholder="株式会社◯◯ 営業部 田中様"
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label htmlFor="content">商談内容</label>
            <textarea
              id="content"
              rows={6}
              value={report.content}
              onChange={update('content')}
              placeholder={'・現行システムの課題をヒアリング\n・見積もりを提示'}
            />
          </div>

          <div className="field">
            <label htmlFor="nextAction">次回アクション</label>
            <textarea
              id="nextAction"
              rows={4}
              value={report.nextAction}
              onChange={update('nextAction')}
              placeholder={'・9/30までに改訂版の見積もりを送付\n・来週再訪の日程調整'}
            />
          </div>

          <button type="button" className="ghost" onClick={handleReset}>
            入力をクリア
          </button>
        </section>

        <section className="panel preview" aria-labelledby="preview-heading">
          <div className="preview-bar">
            <h2 id="preview-heading">プレビュー</h2>
            <button type="button" className="primary" onClick={handleCopy}>
              {copied ? 'コピーしました' : 'コピー'}
            </button>
          </div>
          <pre className="preview-body">{text}</pre>
          <p role="status" aria-live="polite" className="status">
            {copied ? 'クリップボードにコピーしました。' : ''}
            {copyFailed
              ? 'コピーできませんでした。本文を選択して手動でコピーしてください。'
              : ''}
          </p>
        </section>
      </div>
    </main>
  )
}

export default App
