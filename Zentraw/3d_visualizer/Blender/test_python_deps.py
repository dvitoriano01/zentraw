import sys
print("Python version:", sys.version)

try:
    import numpy as np
    print("NumPy is available, version:", np.__version__)
except ImportError:
    print("NumPy is NOT available")

try:
    import bpy
    print("Blender Python API is available")
except ImportError:
    print("Blender Python API is NOT available (normal when running outside Blender)")
