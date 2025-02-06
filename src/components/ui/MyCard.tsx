import { GithubIcon } from "lucide-react"


const LittleFounder = () => {
  return (
    <a className="flex group items-center justify-center py-4 cursor-pointer bg-neutral-900" href="https://github.com/Ebrahim-Ramadan/vite-pwa-chatjj" target="_blank">
    <div className="flex flex-col items-end bg-neutral-800 rounded-full p-2 text-neutral-200 group-hover:bg-neutral-700">
        <GithubIcon className="w-3 h-3 text-neutral-200" strokeWidth={2} />
      </div>
     
    </a>
  )
}

export default LittleFounder