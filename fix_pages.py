import os

routes = [
    'briefings', 'projects', 'clients', 'sales', 'finance', 
    'subscriptions', 'bi', 'productivity', 'brand-book', 
    'settings', 'help'
]

content_template = """export default function Page() {{
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-audazz-blue capitalize">
          {route_name}
        </h1>
        <p className="text-muted-foreground text-lg">
          Este módulo está sendo preparado para sua operação de alta performance.
        </p>
      </div>
      
      <div className="grid gap-6">
        <div className="h-64 rounded-3xl border-2 border-dashed flex items-center justify-center text-muted-foreground bg-secondary/5">
          Interface em construção para o módulo {route_name}...
        </div>
      </div>
    </div>
  )
}}
"""

for r in routes:
    dir_path = os.path.join('src', 'app', '(dashboard)', r)
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, 'page.tsx')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content_template.format(route_name=r.replace('-', ' ')))

print("Páginas corrigidas com sucesso.")
