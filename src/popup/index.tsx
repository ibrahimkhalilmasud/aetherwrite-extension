import "~styles/globals.css"

import { SettingsForm } from "~components/SettingsForm"

const Popup = (): JSX.Element => {
  return (
    <main className="w-[420px] bg-slate-50 p-4">
      <h1 className="text-lg font-semibold text-slate-900">AetherWrite</h1>
      <p className="mb-4 text-sm text-slate-500">Real-time writing guidance for every editable field.</p>
      <SettingsForm />
    </main>
  )
}

export default Popup
