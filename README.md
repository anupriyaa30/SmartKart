# SmartKart

### Working Demo

<iframe width="560" height="315" src="https://www.youtube.com/embed/tmw6HBQd-kM" frameborder="0" allowfullscreen></iframe>

### For Developers

Step 1: Clone the repository
```bash
git clone https://github.com/Piyush-onGIT/smartkart
```

Step 2: Install all dependencies for frontend
```bash
cd client
npm install
```

Step 3: Install all dependencies for the backend, first make sure you are in the root folder of the project
```bash
cd server-node
npm install
cd ../server-python
pip install -r requirements.txt
```

Step 4: Create 3 different instances for your terminal and open them in the root folder of the project

  -> Terminal 1:
  ```bash
  cd client
  npm start
  ```
  Frontend running on port 3000
  

  -> Terminal 2:
  ```bash
  cd server-node
  npm start
  ```
  Express backend running on port 5000
  

  -> Terminal 3:
  ```bash
  cd server-python
  python main.py
  ```
  Python backend running on port 5001
