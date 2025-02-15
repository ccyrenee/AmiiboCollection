1. Install dependencies in the project root with `npm install`, this will also install `concurrently`
2. Go into the `backend` and `frontend` directories and run `npm install` to install the dependencies specific to each part of the project
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
3. Start the entire project by running the `npm start` command in the project root

After startup, the `backend` server will be available at the configured address, http://localhost:3000,
while the `frontend` client will be at http://localhost:5173. 
This approach simplifies development, allowing you to work on the `frontend` and `backend` at the same time
without having to start processes manually in multiple terminals.
