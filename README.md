# How To Use chatjj

chatjj is available as a stand-alone web application at [chat-jj.vercel.app](https://chat-jj.vercel.app), It allows to talk to your already installed model on your machine, offline and fast. You don't need to clone any repo - simply visit the website to start using the application. This guide explains how to set up properly.

## Prerequisites

- **Ollama**: Download and install from the
  [official website](https://ollama.ai/).
- **Supported Model**: It supports many models including Deepseek, llama, qwen, mistral, phi, and more.

## Setup Instructions

### 1. Install Ollama and the Model

1. **Download and install Ollama**  
   Follow the instructions on the [Ollama website](https://ollama.ai/) to install the client on your machine.

2. **Download any model**  
   Use Ollama to download the model, for example:
   ```bash
   ollama pull deepseek-r1:1.5b
   ```

### 2. Configure Cross-Origin Requests

To allow calls from the `chatjj` application to your local Ollama chatting endpoint, you need to configure your environment to allow cross-origin requests.

#### Windows

1. **Set the Environment Variable**  
   Open a Command Prompt and run:
   ```batch
   set OLLAMA_ORIGINS=https://chat-jj.vercel.app
   ```
   - Or allow all origins (use cautiously):
     ```batch
     set OLLAMA_ORIGINS=*
     ```

2. **Persistent Environment Variable (Optional)**  
   Set this variable through the Windows Environment Variables settings:
   - Open **System Properties** > **Advanced system settings** > **Environment Variables…**
   - Under **User variables** or **System variables**, add a new variable:
     - **Variable name:** `OLLAMA_ORIGINS`
     - **Variable value:** e.g., `https://chat-jj.vercel.app`

#### macOS and Linux

1. **Open your Terminal.**

2. **Set the Environment Variable**  
   For a **single session**, run:
   ```bash
   export OLLAMA_ORIGINS=https://chat-jj.vercel.app
   ```

   Or allow all origins (carefully):
   ```bash
   export OLLAMA_ORIGINS=*
   ```

3. **Persisting the Variable:**  
   Add the export command to your shell's configuration file (e.g., `~/.bashrc`, `~/.bash_profile`, or `~/.zshrc`), so it is available in every session:
   ```bash
   echo 'export OLLAMA_ORIGINS=https://chat-jj.vercel.app' >> ~/.bashrc
   source ~/.bashrc
   ```

### 3. Start the Ollama Chat Service

After you have set the appropriate environment variable:

- Launch the Ollama chatting endpoint using your terminal or command prompt. The service will read the `OLLAMA_ORIGINS` variable and configure cross-origin requests accordingly.
- Ensure that you have properly started the service as per the Ollama documentation.
- Once Ollama is running locally, return to [https://chat-jj.vercel.app](https://chat-jj.vercel.app) to start chatting!
- You **HAVE TO** set the `OLLAMA_ORIGINS` variable when the ollama service is not running. If it is running, stop the service, set the env var, then start the service again.
- If any issues arise, open a new one [here](https://github.com/Ebrahim-Ramadan/vite-pwa-chatjj), It is open sourced btw, or reach me at `ramadanebrahim791@gmail.com`.


## Troubleshooting(dev)

- **CORS Errors**: Double-check that the origin in the `OLLAMA_ORIGINS` value matches the origin from which `chatjj` is making requests.
- **Environment Variable Not Set**: Ensure that the variable is exported in the same session where the Ollama service is started.
- **Contact Me**: If any issues arise, open a new one [here](https://github.com/Ebrahim-Ramadan/vite-pwa-chatjj), It is open sourced btw, or reach me at `ramadanebrahim791@gmail.com`.
## Conclusion

chatjj is readily available at [chat-jj.vercel.app](https://chat-jj.vercel.app), It is also PWA, meaning you can install the app once and use it afterwards as like any other desktop app. The setup steps above are only needed to configure your local Ollama instance to work with the web interface. As new models and versions are released, be sure to check for updates in the official documentation.

Happy chatting!