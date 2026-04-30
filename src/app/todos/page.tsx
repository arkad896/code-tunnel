import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-10 text-white bg-zinc-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Todos</h1>
      <ul className="space-y-4">
        {todos?.map((todo: any) => (
          <li key={todo.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
            {todo.name}
          </li>
        ))}
        {(!todos || todos.length === 0) && <p className="text-white/50">No todos found. Create a 'todos' table in Supabase to see them here.</p>}
      </ul>
    </div>
  )
}
