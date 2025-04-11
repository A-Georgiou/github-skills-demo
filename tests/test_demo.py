#!/usr/bin/env python3

"""
Test file for demo.py
"""

import unittest
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.demo import GitHubDemo

class TestGitHubDemo(unittest.TestCase):
    def setUp(self):
        self.demo = GitHubDemo("Test Demo")
    
    def test_initialization(self):
        self.assertEqual(self.demo.name, "Test Demo")
        self.assertEqual(len(self.demo.features), 0)
    
    def test_add_feature(self):
        self.demo.add_feature("Testing")
        self.assertEqual(len(self.demo.features), 1)
        self.assertEqual(self.demo.features[0], "Testing")

if __name__ == "__main__":
    unittest.main()