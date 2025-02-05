Technologies Used
Frontend: Vite,  Chadcn
Backend: None
Database: None


#### Live
the live version is not supported right now (still tryna figure out how to call `localhost` from a certain origin aka the deployed app), but we will get to it soon.
#### Cloning (dev)
you have got to download and install [ollama](https://ollama.ai/) first, then download the [deepseek r1:1.5](https://ollama.com/library/deepseek-r1:1.5b) (the only model version supported now, later `7b` and `14b`, and stronger models like v2, v3 will be added)

after downloading the deepseek model, you just run
 `ollama run deepseek-r1:1.5b`,
  then 
 `ollama pull deepseek-r1:1.5b`, then clone this repo, thats it no `.env` files needed.

then run 
`bun install`
 and 
`bun run dev`
vist http://localhost:5173 to see the app and here you go

