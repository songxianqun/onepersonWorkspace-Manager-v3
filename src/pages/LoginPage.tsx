import { Briefcase, Headphones } from "lucide-react"
import type { V3Tab } from "@/components/V3Header"

interface LoginPageProps {
  onLogin: (tab: V3Tab) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <section className="w-full rounded-2xl border border-border bg-white p-8 shadow-elevated">
          <div className="mb-8 space-y-2">
            <p className="text-sm font-semibold text-primary">OnePerson Workspace</p>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950">选择工作入口</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              进入业务团队工作台或业务支持中心，继续处理智能体协同任务。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => onLogin("employee")}
              className="group flex min-h-40 flex-col items-start justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-left transition hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                <Briefcase className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-lg font-semibold text-zinc-950">业务团队</span>
                <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                  查看团队智能体、今日任务和业务协同进展。
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => onLogin("support")}
              className="group flex min-h-40 flex-col items-start justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-left transition hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                <Headphones className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-lg font-semibold text-zinc-950">业务支持中心</span>
                <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                  进入组织者、投资经理、账户服务和产品创设支持视图。
                </span>
              </span>
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
