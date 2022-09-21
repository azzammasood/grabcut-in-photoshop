# grabcut-in-photoshop

To get this working, a few things have to be done:
Open cmd.
Type 'wsl' and enter.
Type the command 'nano ~/.bashrc'
At the end, add the following lines:
  1. conda activate grabcut
  2. export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:path/to/anaconda3/envs/grabcut/lib
  3. cd "path/to/grabcut_python_file.py"
  4. python main.py --image input.png --scribbles scribbles.png --output output.png --resolve_type pixel
  5. Ctrl-x to save the file

In multi_grabcut.jsx, edit the paths in lines 13 (path to run reduce_color_space.py), line 69 (path to export "scribbles" layer as png), 331 (path where outputs are stored), line 382 (Path to export input image as jpg to be read by reduce_color_space.py), line 706 (path where input.exr should be exported)
In reduce_color_space.py, edit the paths in line 16 (path to read input image exported as jpg from Photoshop), line 52 (path to save dithered image), line 496 (path to save Reduced Color Image.png).
