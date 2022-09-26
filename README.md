# grabcut-in-photoshop

To get this working, a few things have to be done:
Open cmd.
Type 'wsl' and enter.
Type the command 'nano ~/.bashrc'
At the end, add the following lines:
  1. conda activate grabcut
  2. export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:path/to/anaconda3/envs/grabcut/lib
  3. cd "path/to/main.py"
  4. python main.py --image input.png --scribbles scribbles.png --output output.png --resolve_type pixel
  5. Ctrl-x to save the file

grabcut_and_gaussian_segmentation.jsx is the updated file. In it, change the paths. I've added the comment "// path" whereever there is a path, so you can use Ctrl+F to find them quickly. Also replace the paths in reduce_color_space.py 
