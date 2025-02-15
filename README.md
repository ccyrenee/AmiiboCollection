1. Installa le dipendenze nella root del progetto con `npm install`, questo installerà anche `concurrently`.
2. Vai nelle directory `backend` e `frontend` ed esegui `npm install` per installare le dipendenze specifiche per ogni parte del progetto:
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
3. Start the entire project by running the `npm start` command in the project root

After startup, the backend server will be available at the configured address, http://localhost:3000,
while the frontend client will be at http://localhost:5173. 
This approach simplifies development, allowing you to work on the frontend and backend at the same time
without having to start processes manually in multiple terminals.
