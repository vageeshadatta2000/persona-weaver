# Persona Weaver (Work in Progress!!)

This is a web application that lets you create a custom AI persona and chat with it. It uses Python/FastAPI for the backend and Google's Gemini Pro API as the language model.

## 🚀 Setup and Execution

Follow these steps to get the project running on your local machine.

### 1. Get Your API Key

- Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
- Create a new API key.
- **Important:** Keep this key secret!

### 2. Set Up the Project

- **Clone or Download:** Get all these project files onto your computer.
- **Open a Terminal:** Navigate into the `persona-weaver-gemini` directory.
- **Create a Virtual Environment:**
  ```bash
  python -m venv venv
  ```
- **Activate the Environment:**
  - On macOS/Linux: `source venv/bin/activate`
  - On Windows: `venv\Scripts\activate`

### 3. Install Dependencies

- With your virtual environment active, run:
  ```bash
  pip install -r requirements.txt
  ```

### 4. Configure Your API Key

- **Rename the example file:**
  ```bash
  # On macOS/Linux
  mv .env.example .env

  # On Windows
  ren .env.example .env
  ```
- **Edit the `.env` file:** Open the new `.env` file and paste your Google API key that you got in Step 1.

### 5. Run the Application

- You're all set! Run the server with this command:
  ```bash
  uvicorn app:app --reload
  ```
- The `--reload` flag means the server will automatically restart if you change any of the Python code.

### 6. Open in Browser

- Open your web browser and go to:
  [http://127.0.0.1:8000](http://127.0.0.1:8000)

## 🚀 Live Demo

Check out the working demo of the project here:  
👉 [Persona Weaver - Live Demo](https://persona-weaver-git-main-vageesha-datta-gs-projects.vercel.app)
