import { GithubIcon, Star } from "lucide-react"


const LittleFounder = () => {
  return (
    <a className="flex group items-center py-4 px-2 space-x-2 cursor-pointer bg-neutral-900" href="https://github.com/Ebrahim-Ramadan/vite-pwa-chatjj" target="_blank">
    <img src='/me.jpg' alt='me' className="w-10 h-10 rounded-full" />
      <div className="flex-grow">
        <h3 className="text-sm font-semibold">Ebrahim Ramadan</h3>
        <p className="text-[11px] text-neutral-300">creator of chatjj</p>
      </div>
      <div className="flex flex-col items-end bg-neutral-800 rounded-full p-2 text-neutral-200 group-hover:bg-neutral-700">
        <GithubIcon className="w-3 h-3 text-neutral-200" strokeWidth={2} />
      </div>
    </a>
  )
}

export default LittleFounder