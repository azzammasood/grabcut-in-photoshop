# grabcut-in-photoshop

To get this working, a few things have to be done:
Open cmd.
Type 'wsl' and enter.
Type the command 'nano ~/.bashrc'
At the end, add the following lines:
  1. conda activate grabcut
  2. export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/quixel/anaconda3/envs/grabcut/lib
  3. cd "path/to/grabcut_python_file.py"
  4. python main.py --image data/input.png --scribbles data/scribbles.png --output data/output.png --resolve_type pixel
  5. Ctrl-x to save the file

In multi_grabcut.jsx, edit the paths in lines 13, 69, 331, 382.
