import { useQuery } from '@tanstack/react-query'
import { useAppStore } from './stores/appStore'

const fetchGreeting = async () => 'React Query is ready'

export default function App() {
  const { data: greeting } = useQuery({ queryKey: ['greeting'], queryFn: fetchGreeting })
  const { isDark, toggleTheme } = useAppStore()

  return (
    <main className={isDark ? 'dark min-h-screen bg-slate-950 text-white' : 'min-h-screen bg-slate-50 text-slate-900'}>
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
        <p className="text-sm font-semibold tracking-widest text-indigo-600">DEOKGIL</p>
        <h1 className="text-4xl font-bold">개발 환경 설정 완료</h1>
        <p className="text-lg text-slate-500 dark:text-slate-300">{greeting}</p>
        <button className="w-fit rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white" onClick={toggleTheme}>
          테마 전환
        </button>
      </section>
    </main>
  )
}
