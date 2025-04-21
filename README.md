# HMChefApp

## Project for the course "Mobile Applications"

---

## Starting the Backend & Environment Variables (.env)

### Installation

1. **Requirements:**

   - [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) installed

2. **Start the backend:**

   ```sh
   docker compose up -d
   ```

   The backend will then be available at `http://localhost:8001`.

3. **API Endpoints:**
   - Root: `GET /` → Start message
   - Authentication: `POST /api/auth/login`, `POST /api/auth/register`
   - Recipes: `GET|POST|DELETE /api/recipes`
   - Image upload: `POST /api/upload`

---

### .env File in the Project

There is a `.env` file in the project that allows you to control the app's behavior. The variables are:

| Variable                 | Description                                                                    | Example value              |
| ------------------------ | ------------------------------------------------------------------------------ | -------------------------- |
| EXPO_PUBLIC_API_URL      | URL to the backend server.                                                     | https://hmchef.yarissi.com |
|                          | For Android emulator: `http://10.0.2.2:8001`                                   |                            |
|                          | For iOS simulator: `http://localhost:8001`                                     |                            |
| EXPO_PUBLIC_WITHOUT_SYNC | (Optional, commented out) App runs without backend, for testing purposes only. | false                      |

**Important!** If you change anything in this file, close and reopen the terminal so the changes take effect.

**Note:**

- If you want to test locally, adjust the `EXPO_PUBLIC_API_URL` accordingly (see above).
- You can enable the variable `EXPO_PUBLIC_WITHOUT_SYNC` if the backend does not work for some reason and you want to test the rest of the app.

---

## TODO - will leave this here as a small protocol (not complete)

- [x] Implement New Recipe
- [x] Display description correctly
- [x] Make description scrollable
- [x] Add category to new recipe
- [x] Also display the category in search
- [x] Modal for recipes: when clicking the recipe, it should open a popup for more info
- [x] Make image clickable
- [x] Make the context not delete everything on close
- [x] Bug: Category doesn't get displayed right in the My Recipes Tab
