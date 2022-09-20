# grabcut-in-photoshop

To get this working, a few things have to be done:
1. Open cmd.
2. Type wsl and enter.
3. Type the command 'nano ~/.bashrc
4. At the end, add the following lines:
  conda activate grabcut
  export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/quixel/anaconda3/envs/grabcut/lib
  cd "path/to/grabcut_python_file.py"
  python main.py --image data/input.png --scribbles data/scribbles.png --output data/output.png --resolve_type pixel
5. In multi_grabcut.jsx, edit the paths in lines 13 and 69
