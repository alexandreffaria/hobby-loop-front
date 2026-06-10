import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'

export function ErrorBoundary() {
  const error = useRouteError()

  let title = 'Algo deu errado'
  let message = 'Ocorreu um erro inesperado.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Página não encontrada'
      message = 'A página que você procura não existe.'
    } else {
      title = `Erro ${error.status}`
      message = error.statusText || message
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="bg-brand-bg flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-brand-gradient text-2xl font-bold">{title}</h1>
      <p className="max-w-sm text-sm text-gray-400">{message}</p>
      <Link
        to="/subscriptions"
        className="from-brand-pink to-brand-blue rounded-xl bg-linear-to-r px-6 py-3 text-sm font-bold text-white"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
